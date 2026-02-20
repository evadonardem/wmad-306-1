import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
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
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        https:false,
        host:true,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
});
