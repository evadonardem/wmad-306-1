import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        https: false,
        host: true,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    watch: {
        ignored: ['*/storage/framework/views/*'],
    },
},
    plugins: [
        react(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],

});
