// src/vite.config.js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx', // or app.tsx
      refresh: true,
      hotFile: 'public/hot',      // write hot file where Laravel expects it
      publicDirectory: 'public',
      buildDirectory: 'build',
    }),
    react(),
  ],
  appType: 'custom',
  resolve: { alias: { '@': path.resolve(__dirname, 'resources/js') } },

  // Optional but helpful if Docker networking needs explicit host/port:
  server: {
    host: true,
    port: 5173,         // pin the Vite dev server to 5173
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173,
    },
  },
})
