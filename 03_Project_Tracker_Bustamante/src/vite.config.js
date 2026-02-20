// Vite configuration: Laravel plugin + React and dev server settings
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        // Load main app entry and enable automatic reload on changes
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        // React plugin for JSX transform and fast refresh
        react(),
    ],
    // Dev server settings: expose to Docker network and configure HMR
    server: {
        https:false,
        host: true,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
});
