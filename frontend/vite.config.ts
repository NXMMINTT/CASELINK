import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: import.meta.dirname,
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      // Output stays at the repo root so the GitHub Pages workflow keeps using dist/.
      outDir: path.resolve(import.meta.dirname, '../dist'),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      strictPort: true,
      // Forward API calls to the backend (backend/src/index.ts).
      proxy: {
        '/api': `http://localhost:${process.env.BACKEND_PORT || 8787}`,
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
