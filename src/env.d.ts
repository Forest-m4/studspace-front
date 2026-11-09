/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEV_LAUNCH_PARAMS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
