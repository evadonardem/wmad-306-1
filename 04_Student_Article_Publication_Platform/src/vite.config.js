import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        https: false,
        host: true,
        port: 5173,
        hmr: {
            host: 'localhost',
            port: 5173,
            protocol: 'ws',
        },
    },
});
