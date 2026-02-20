import './bootstrap';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true })
        return pages[`./pages/${name}.jsx`].default
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
}) 