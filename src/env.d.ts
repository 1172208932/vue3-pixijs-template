/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare const EVA: any;

interface Window {
  EVA: any;
  playAnim: any;
  game: any;
  throwBall: any;
  resetBall: any;
}

interface HTMLElement {
  value: any;
}

declare module '*.frag' {
  const value: string;

  export default value;
}

declare module '*.vert' {
  const value: string;

  export default value;
}