/// <reference lib="deno.ns" />
import * as esbuild from '@esbuild';
import { denoPlugin as esbuildPluginDeno } from "@deno/esbuild-plugin";
import { bold, green, magenta } from '@std/fmt/colors';
import { parseArgs } from '@std/cli/parse-args';
import { copy as esbuildPluginCopy } from './plugins/copy.ts';

const args = parseArgs<{
  watch: boolean | undefined,
  develop: boolean | undefined,
  logLevel: esbuild.LogLevel
}>(Deno.args);

const copyConfig : esbuild.BuildOptions = {
  allowOverwrite: true,
  logLevel: args.logLevel ?? 'info',
  color: true,
  outdir: './dist',
  outbase: './src/client',
  entryPoints: [
    './src/client/**/index.html',
    './src/client/**/assets/*',
    './src/client/static/**/*'
  ],
  plugins: [
    esbuildPluginCopy()
  ]
}

const filesConfig : esbuild.BuildOptions = {
  allowOverwrite: true,
  logLevel: args.logLevel ?? 'info',
  legalComments: args.develop ? 'inline' : 'none',
  color: true,
  minify: args.develop ? false : true,
  bundle: true,
  format: 'esm',
  target: 'esnext',
  platform: 'browser',
  jsx: 'automatic',
  jsxImportSource: '@solid-js/h',
  sourcemap: args.develop ? 'linked' : false,
  sourcesContent: true,
  outdir: './dist',
  outbase: './src/client',
  entryPoints: [
    './src/client/index.tsx',
    './src/client/index.css'
  ],
  supported: {
    'import-attributes': true,
    'nesting': true
  },
  plugins: [
    esbuildPluginDeno({
      preserveJsx: true,
      debug: args.develop ?? false
    }),
  ]
}

console.log(bold(`Build process started. Building and bundling for ${magenta(args.develop ? '[Development]' : '[Production]')}.`));

const timestampNow = Date.now();

if (args.watch) {
  esbuild.context(copyConfig).then((context) => context.watch());
  esbuild.context(filesConfig).then((context) => context.watch());
} else {
  Promise.all([
    esbuild.build(copyConfig),
    esbuild.build(filesConfig)
  ]).then(() => {
    esbuild.stop();
    console.log(green(`esbuild ${esbuild.version} finished build in ${(Date.now() - timestampNow).toString()}ms.`));
  })
}
