/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend (es. https://...vercel.app). Se assente: http://localhost:3001 */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
