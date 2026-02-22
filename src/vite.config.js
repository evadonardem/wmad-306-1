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
        host: true,
        port: 5173,
        strictPort: true,
        origin: 'http://localhost:5173',
        cors: {
            origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
            credentials: true,
        },
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
});
