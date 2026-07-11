/// <reference types="vite/client" />

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
