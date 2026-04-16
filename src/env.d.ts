/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: 'live' | 'mock';
  readonly VITE_ENABLE_SIDE_PANEL_PREVIEW?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
