import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions with light and dark variants
const themeDefinitions = {
    classic: {
        name: 'Classic Times',
        icon: '📰',
        light: {
            primary: '#1a1a1a',      // Deep black
            secondary: '#4a4a4a',     // Dark gray
            background: '#f8f8f8',    // Off-white paper
            surface: '#ffffff',        // White
            accent: '#2c2c2c',        // Charcoal
            border: '#d4d4d4',        // Light gray
            text: '#1a1a1a',          // Black
            textSecondary: '#666666',  // Medium gray
            hover: '#e8e8e8',         // Light hover
            success: '#2e7d32',        // Green
            warning: '#ed6c02',        // Orange
            error: '#d32f2f',          // Red
            info: '#0288d1',           // Blue
        },
        dark: {
            primary: '#e0e0e0',        // Light gray
            secondary: '#b0b0b0',       // Medium gray
            background: '#121212',       // Dark background
            surface: '#1e1e1e',         // Dark surface
            accent: '#9e9e9e',          // Gray
            border: '#333333',           // Dark border
            text: '#ffffff',             // White
            textSecondary: '#b0b0b0',    // Light gray
            hover: '#2d2d2d',            // Dark hover
            success: '#81c784',           // Light green
            warning: '#ffb74d',           // Light orange
            error: '#e57373',              // Light red
            info: '#4fc3f7',               // Light blue
        }
    },

    modern: {
        name: 'Modern Minimal',
        icon: '✨',
        light: {
            primary: '#0a0a0a',
            secondary: '#2d2d2d',
            background: '#ffffff',
            surface: '#fafafa',
            accent: '#636363',
            border: '#eaeaea',
            text: '#0a0a0a',
            textSecondary: '#757575',
            hover: '#f0f0f0',
            success: '#00a86b',
            warning: '#f5a623',
            error: '#e54b4b',
            info: '#3b7cbf',
        },
        dark: {
            primary: '#f5f5f5',
            secondary: '#d4d4d4',
            background: '#0d0d0d',
            surface: '#1a1a1a',
            accent: '#a0a0a0',
            border: '#2d2d2d',
            text: '#ffffff',
            textSecondary: '#b3b3b3',
            hover: '#2a2a2a',
            success: '#4caf7f',
            warning: '#ffb347',
            error: '#ff6b6b',
            info: '#5c9bd5',
        }
    },

    broadsheet: {
        name: 'Broadsheet Blue',
        icon: '🌊',
        light: {
            primary: '#1e3a5f',
            secondary: '#2b4c7c',
            background: '#f0f7ff',
            surface: '#ffffff',
            accent: '#517ea6',
            border: '#c5d9f0',
            text: '#1e3a5f',
            textSecondary: '#4a6f8f',
            hover: '#e6f0fa',
            success: '#2e7d32',
            warning: '#ed6c02',
            error: '#d32f2f',
            info: '#0288d1',
        },
        dark: {
            primary: '#8bb9ff',
            secondary: '#6a9ae0',
            background: '#0b1a2b',
            surface: '#14273e',
            accent: '#3a6ea5',
            border: '#2a4059',
            text: '#e3f0ff',
            textSecondary: '#a9c9f0',
            hover: '#1f3449',
            success: '#81c784',
            warning: '#ffb74d',
            error: '#e57373',
            info: '#4fc3f7',
        }
    },

    guardian: {
        name: 'Guardian Green',
        icon: '🌿',
        light: {
            primary: '#1a4d3e',
            secondary: '#236b54',
            background: '#f2f9f2',
            surface: '#ffffff',
            accent: '#3c8d6e',
            border: '#c1e0d1',
            text: '#1a4d3e',
            textSecondary: '#3d6b5a',
            hover: '#e3f3e9',
            success: '#2e7d32',
            warning: '#ed6c02',
            error: '#d32f2f',
            info: '#0288d1',
        },
        dark: {
            // Primary text - high contrast for readability
            primary: '#E8F3E9',        // Off-white with green tint - AAA compliant on dark backgrounds
            secondary: '#B8D9C0',       // Soft sage - AA compliant
            background: '#0F2A21',       // Deep forest - base background
            surface: '#1A3D31',          // Rich pine - elevated surfaces
            accent: '#6FCF97',           // Muted mint - AA compliant accent
            border: '#2A5543',           // Forest border - subtle definition
            text: '#F0F7F0',             // Almost white - maximum readability
            textSecondary: '#B8D9C0',     // Light sage - for secondary text
            hover: '#244B3C',             // Slightly lighter surface for hover
            success: '#A5D6A7',            // Soft green
            warning: '#FFB74D',             // Warm orange
            error: '#EF9A9A',               // Soft red
            info: '#81D4FA',                 // Light blue
            // Additional semantic colors for better UX
            link: '#8BBF9F',                 // Accessible link color
            linkHover: '#B8E0C5',             // Lighter on hover
            code: '#2A4035',                  // Code block background
            codeText: '#E0F0E0',               // Code text
            selection: '#3C8D6E40',            // Text selection color
        }
    },

    berliner: {
        name: 'Berliner Burgundy',
        icon: '🇩🇪',
        light: {
            primary: '#4a2c3a',
            secondary: '#6d3f54',
            background: '#fdf5f5',
            surface: '#ffffff',
            accent: '#9b5b75',
            border: '#ecd9e0',
            text: '#4a2c3a',
            textSecondary: '#7b5568',
            hover: '#f9e9ee',
            success: '#2e7d32',
            warning: '#ed6c02',
            error: '#d32f2f',
            info: '#0288d1',
        },
        dark: {
            primary: '#e6b8cc',
            secondary: '#c99ab1',
            background: '#24161d',
            surface: '#35242e',
            accent: '#a86f89',
            border: '#4f3647',
            text: '#f8e2ed',
            textSecondary: '#ddb8cc',
            hover: '#402f3a',
            success: '#81c784',
            warning: '#ffb74d',
            error: '#e57373',
            info: '#4fc3f7',
        }
    },

    heritage: {
        name: 'Heritage Vintage',
        icon: '📜',
        light: {
            primary: '#5c4b3c',
            secondary: '#7a6452',
            background: '#faf3e8',
            surface: '#fff9f0',
            accent: '#a48d76',
            border: '#e2d5c5',
            text: '#4a3c2f',
            textSecondary: '#7f6e5a',
            hover: '#f0e6d9',
            success: '#5f7b5f',
            warning: '#b78f5b',
            error: '#b55a5a',
            info: '#6a8ca0',
        },
        dark: {
            // Primary text - warm off-white for readability
            primary: '#F0E6D9',         // Warm parchment - high contrast
            secondary: '#D4C0A9',        // Aged paper - AA compliant
            background: '#2C241D',        // Deep walnut - base
            surface: '#3E332B',           // Rich mahogany - elevated surfaces
            accent: '#C4A484',            // Warm oak - AA compliant accent
            border: '#5F4F40',            // Leather brown - subtle definition
            text: '#F5EDE0',               // Cream white - maximum readability
            textSecondary: '#D4C0A9',       // Warm taupe - for secondary text
            hover: '#4F4238',               // Lighter surface for hover
            success: '#A8C6A8',              // Muted sage
            warning: '#E6C3A0',               // Warm sand
            error: '#E6B3B3',                  // Soft coral
            info: '#B3C9E0',                    // Dusty blue
            // Additional semantic colors
            link: '#D9B382',                    // Warm gold link
            linkHover: '#F0D0A0',                // Lighter on hover
            code: '#3A2F27',                      // Code block background
            codeText: '#E8DDD0',                   // Code text
            selection: '#A48D7640',                 // Text selection color
            // Vintage paper texture simulation
            paper: '#3A2F27',                      // Base for paper texture
            ink: '#E8DDD0',                         // Ink color for text
        }
    },

    dawn: {
        name: 'Dawn Edition',
        icon: '🌅',
        light: {
            primary: '#8b5e4c',
            secondary: '#b27a64',
            background: '#fff4e6',
            surface: '#fffaf2',
            accent: '#d99976',
            border: '#f0d9cc',
            text: '#5c4033',
            textSecondary: '#a07460',
            hover: '#faede3',
            success: '#6f8f6f',
            warning: '#cc8f5a',
            error: '#c26767',
            info: '#6797b3',
        },
        dark: {
            primary: '#ffccb3',
            secondary: '#e6af96',
            background: '#2f241f',
            surface: '#42342d',
            accent: '#cf8f70',
            border: '#6b5245',
            text: '#ffe6d9',
            textSecondary: '#e6c4b3',
            hover: '#55433b',
            success: '#b3d1b3',
            warning: '#f2c9a6',
            error: '#f2b8b8',
            info: '#b3d1e6',
        }
    },

    rustic: {
        name: 'Rustic Charm',
        icon: '🏛️',
        light: {
            primary: '#6b4f3f',
            secondary: '#8e6b56',
            background: '#f7efe7',
            surface: '#fef7f0',
            accent: '#bf8f7a',
            border: '#ead7cc',
            text: '#4f3b2f',
            textSecondary: '#9c7a67',
            hover: '#f5e8df',
            success: '#6d8f6d',
            warning: '#c6925a',
            error: '#b96161',
            info: '#5f89a3',
        },
        dark: {
            primary: '#ebc9b8',
            secondary: '#cfaa96',
            background: '#2e241f',
            surface: '#42362f',
            accent: '#bc8872',
            border: '#6b5247',
            text: '#faeade',
            textSecondary: '#e0c5b8',
            hover: '#55453d',
            success: '#a8c6a8',
            warning: '#edc9a6',
            error: '#edb3b3',
            info: '#b3cce0',
        }
    }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export function ThemeProvider({ children }) {
    // Inertia user prop (if available)
    let user = null;
    try {
        // eslint-disable-next-line
        user = require('@inertiajs/react').usePage().props.user;
    } catch (e) {}

    // Get saved theme from localStorage or default to 'classic'
    const [theme, setTheme] = useState(() => {
        if (user && user.preferences?.theme) {
            return user.preferences.theme;
        }
        const saved = localStorage.getItem('fyi-theme');
        return saved || 'classic';
    });

    // Get dark mode preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (user && user.preferences?.dark_mode !== undefined) {
            return user.preferences.dark_mode;
        }
        const saved = localStorage.getItem('fyi-dark-mode');
        if (saved !== null) return saved === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Load user preferences on mount
    useEffect(() => {
        if (user) {
            if (user.preferences?.theme) {
                setTheme(user.preferences.theme);
            }
            if (user.preferences?.dark_mode !== undefined) {
                setIsDarkMode(user.preferences.dark_mode);
            }
        }
    }, [user]);

    // Save to backend when changed
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line
            require('axios').post('/api/user/preferences', {
                theme: theme,
                dark_mode: isDarkMode
            }).catch(error => {
                console.error('Failed to save preferences:', error);
            });
        }
    }, [theme, isDarkMode, user]);

    // Get current theme colors based on dark/light mode
    const currentTheme = themeDefinitions[theme];
    const colors = currentTheme[isDarkMode ? 'dark' : 'light'];

    // Save theme to localStorage when changed
    useEffect(() => {
        localStorage.setItem('fyi-theme', theme);
    }, [theme]);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('fyi-dark-mode', isDarkMode);

        // Apply dark mode class to html element
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Listen for system dark mode changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            if (localStorage.getItem('fyi-dark-mode') === null) {
                setIsDarkMode(e.matches);
            }
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Available themes (filtered to requested ones)
    const availableThemes = {
        classic: themeDefinitions.classic,
        modern: themeDefinitions.modern,
        broadsheet: themeDefinitions.broadsheet,
        guardian: themeDefinitions.guardian,
        berliner: themeDefinitions.berliner,
        heritage: themeDefinitions.heritage,
        dawn: themeDefinitions.dawn,
        rustic: themeDefinitions.rustic,
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            isDarkMode,
            setIsDarkMode,
            colors,
            availableThemes,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use theme
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
