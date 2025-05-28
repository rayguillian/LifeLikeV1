import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/',
  publicDir: 'public',
  server: {
    port: 5174,
    host: true,
    strictPort: true,
    hmr: {
      overlay: false,
      reconnect: 5,
      timeout: 3000
    },
    watch: {
      usePolling: true,
      interval: 1000
    },
    middlewareMode: false
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  json: {
    namedExports: true,
    stringify: false
  }
});
