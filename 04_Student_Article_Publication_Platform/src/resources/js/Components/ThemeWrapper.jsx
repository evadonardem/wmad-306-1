import React, { useEffect } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeWrapper({ children }) {
    const { colors, theme, isDarkMode } = useTheme();

    // Apply theme colors as CSS variables and set theme classes
    useEffect(() => {
        const root = document.documentElement;

        // Set CSS variables for each color
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Set meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', colors.primary);
        }

        // Remove all theme and dark mode classes first
        root.classList.remove(
            'theme-classic', 'theme-modern', 'theme-broadsheet', 'theme-guardian',
            'theme-berliner', 'theme-heritage', 'theme-dawn', 'theme-rustic', 'dark-mode'
        );
        // Add current theme class
        root.classList.add(`theme-${theme}`);
        // Add dark mode class if enabled
        if (isDarkMode) {
            root.classList.add('dark-mode');
        }
    }, [colors, theme, isDarkMode]);

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            {children}
        </div>
    );
}
