import type * as esbuild from '@esbuild';


const defaultExtensionReplacements = {
  '.tsx': '.js',
  '.ts': '.js'
}

export function htmlScriptTags(options?: {
  pattern?: RegExp,
  extension?: {[extension: string] : string}
}) : esbuild.Plugin {
  return ({
    name: 'html-script-tags',
    setup(build) : void {
      build.onLoad({filter: /\.html$/}, (args) => {
        return {
          contents: Deno.readTextFileSync(args.path).replace(
            options?.pattern ?? /(?<=<script.*src=")(.*)(?=".*>)/gm,
            (_, scriptSrcPath : string) => {
              let path = scriptSrcPath;
              let replaced = false;
              Object.entries(options?.extension ?? defaultExtensionReplacements).forEach(([extension, replacement]) => {
                if (scriptSrcPath.match(extension) && !replaced) {
                  path = scriptSrcPath.replace(extension, replacement)
                  replaced = true
                }
              })

              return path;
            }
          ),
          loader: 'copy',
        }
      })
    }
  })
}
