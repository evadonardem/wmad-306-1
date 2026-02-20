import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
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
            colors: {
                // Light Mode - Midnight Slate Pro
                'midnight': {
                    50: '#F5F7FA',   // Background
                    100: '#E5E7EB',  // Border
                    200: '#D1D5DB',
                    300: '#9CA3AF',
                    400: '#6B7280',  // Text Secondary
                    500: '#4B5563',
                    600: '#111827',  // Text Primary
                    700: '#111827',
                    800: '#1E293B',  // Surface (Dark)
                    900: '#0F172A',  // Background (Dark)
                },
                // Brand colors - Midnight Slate Pro
                'indigo-pro': {
                    light: '#4F46E5',  // Light mode primary
                    dark: '#6366F1',   // Dark mode primary
                    glow: 'rgba(99, 102, 241, 0.1)',
                },
                'cyan-pro': {
                    light: '#0EA5E9',  // Light mode secondary
                    dark: '#38BDF8',   // Dark mode secondary
                },
            },
            spacing: {
                '4.5': '1.125rem',
            },
            borderRadius: {
                'xs': '6px',
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'soft': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                'soft-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-sm': '0 4px 15px 0 rgba(31, 38, 135, 0.25)',
                'glass-lg': '0 20px 50px -15px rgba(0, 0, 0, 0.3)',
            },
            transitionDuration: {
                '200': '200ms',
                '400': '400ms',
            },
            animation: {
                'bounce-slow': 'bounce 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s ease-in-out infinite',
                'slide-in-right': 'slide-in-right 0.4s ease-out',
                'slide-in-up': 'slide-in-up 0.4s ease-out',
                'slide-in-down': 'slide-in-down 0.4s ease-out',
                'fade-in-scale': 'fade-in-scale 0.4s ease-out',
                'pop': 'pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'morph': 'morph 3s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'slide-in-right': {
                    'from': { opacity: '0', transform: 'translateX(20px)' },
                    'to': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-up': {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-scale': {
                    'from': { opacity: '0', transform: 'scale(0.95)' },
                    'to': { opacity: '1', transform: 'scale(1)' },
                },
                'pop': {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'morph': {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                },
            },
            backdropFilter: {
                'none': 'none',
                'blur': 'blur(10px)',
                'blur-md': 'blur(12px)',
                'blur-lg': 'blur(16px)',
                'blur-xl': 'blur(20px)',
            },
            backgroundImage: {
                'gradient-pro': 'linear-gradient(90deg, #4F46E5 0%, #0EA5E9 100%)',
                'gradient-pro-dark': 'linear-gradient(90deg, #6366F1 0%, #38BDF8 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'gradient-glass-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            },
        },
    },

    darkMode: 'class',
    plugins: [forms],
};
