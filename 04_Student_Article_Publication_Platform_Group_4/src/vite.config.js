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
        https:false,
        host: true,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Create vendor chunks only for modules that are actually imported.
                manualChunks(id) {
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'vendor-react';
                    }

                    if (id.includes('node_modules/@inertiajs/')) {
                        return 'vendor-inertia';
                    }

                    if (
                        id.includes('node_modules/@mui/') ||
                        id.includes('node_modules/@emotion/')
                    ) {
                        return 'vendor-ui';
                    }

                    if (id.includes('node_modules/jodit-react/')) {
                        return 'vendor-editor';
                    }

                    if (id.includes('node_modules/axios/')) {
                        return 'vendor-utils';
                    }

                    return undefined;
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kb
    },
});
