/// <reference types="@rsbuild/core/types" />
interface ImportMetaEnv {
  // import.meta.env.PUBLIC_API_UPLOAD
  readonly PUBLIC_API_UPLOAD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
