/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZENDESK_WIDGET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    zE?: (
      namespace: string,
      action: string,
      ...args: unknown[]
    ) => void
  }
}

export {}
