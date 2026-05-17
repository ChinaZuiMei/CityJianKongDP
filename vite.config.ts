import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const appHost = env.APP_HOST || '0.0.0.0';
  const proxyHost = appHost === '0.0.0.0' ? '127.0.0.1' : appHost;
  const appPort = env.APP_PORT || '3000';
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'global': 'window',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'buffer': 'buffer',
        'process': 'process',
        'util': 'util',
        'events': 'events',
        'stream': 'stream-browserify',
      },
    },
    server: {
      host: appHost,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // 开发环境代理配置
      proxy: {
        '/api': {
          target: `http://${proxyHost}:${appPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
