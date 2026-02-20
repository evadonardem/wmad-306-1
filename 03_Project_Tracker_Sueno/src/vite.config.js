import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/app.jsx"], // path relative to project root
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: true,
    port: 5173,
    https: false,
    hmr: {
      host: "127.0.0.1", // ✅ safer for Docker/WSL setups
      protocol: "ws",
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/sanctum": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      // 🚫 /logout handled directly by Laravel
    },
  },
});
