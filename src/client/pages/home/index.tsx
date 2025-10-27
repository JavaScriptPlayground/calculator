import type {JSXElement} from '@solid-js'

export function Home() : JSXElement {
  return (
    <div class='home'>
      <h1 class='title'>Home</h1>
      <img class='logo' src='/static/solidjs_logo.svg' alt='SolidJS Logo'/>
    </div>
  )
}
