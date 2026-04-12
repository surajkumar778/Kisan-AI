import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ============================================================
//  vite.config.js
//  - Dev server runs on port 5173
//  - All /api/* calls are proxied to Express backend on :3000
//  - No CORS issues in development
// ============================================================
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
