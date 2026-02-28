import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                grid: 'linear-gradient(to right, rgb(229 231 235 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgb(229 231 235 / 0.25) 1px, transparent 1px)',
                'grid-dark': 'linear-gradient(to right, rgb(55 65 81 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgb(55 65 81 / 0.25) 1px, transparent 1px)',
            },
        },
    },

    plugins: [forms],
};
