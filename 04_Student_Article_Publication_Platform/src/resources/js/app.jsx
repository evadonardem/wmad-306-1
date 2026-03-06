import '../css/app.css';
import '../css/dark-mode-readability.css';
import '../css/typography.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob('./Pages/**/*.jsx');

function unwrapModuleDefault(mod) {
    let current = mod;

    while (
        current &&
        typeof current === 'object' &&
        'default' in current &&
        current.default !== undefined
    ) {
        current = current.default;
    }

    return current;
}

function isValidReactComponentType(component) {
    return (
        typeof component === 'function' ||
        typeof component === 'string' ||
        (typeof component === 'object' && component !== null && '$$typeof' in component)
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const path = `./Pages/${name}.jsx`;
        const importer = pages[path];

        if (!importer) {
            throw new Error(`Inertia page not found: ${path}`);
        }

        const module = await importer();
        let component = unwrapModuleDefault(module);

        if (!isValidReactComponentType(component)) {
            const pageKey = name.split('/').pop();
            if (pageKey && isValidReactComponentType(module?.[pageKey])) {
                component = module[pageKey];
            }
        }

        if (!isValidReactComponentType(component)) {
            const keys = module && typeof module === 'object' ? Object.keys(module).join(', ') : String(module);
            throw new Error(`Invalid Inertia page module for ${name}. Export keys: ${keys}`);
        }

        return component;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        const initialUser = props?.initialPage?.props?.auth?.user ?? null;
        const shouldSyncToServer = Boolean(initialUser?.id);
        const initialTheme =
            initialUser?.preferences?.theme ??
            initialUser?.theme_preference ??
            null;

        root.render(
            <ThemeProvider
                initialTheme={initialTheme}
                shouldSyncToServer={shouldSyncToServer}
            >
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
