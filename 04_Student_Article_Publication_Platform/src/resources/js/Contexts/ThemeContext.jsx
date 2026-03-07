import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

const themeDefinitions = {
    classic: {
        name: 'Classic Times',
        icon: '[C]',
        light: {
            primary: '#1a1a1a',
            secondary: '#4a4a4a',
            background: '#f8f8f8',
            surface: '#ffffff',
            accent: '#4a4a4a',
            border: '#d4d4d4',
            text: '#1a1a1a',
            textSecondary: '#666666',
            hover: '#e8e8e8',
            success: '#2e7d32',
            warning: '#ed6c02',
            error: '#d32f2f',
            info: '#0288d1',
        },
        dark: {
            primary: '#e0e0e0',
            secondary: '#b0b0b0',
            background: '#121212',
            surface: '#1e1e1e',
            accent: '#9e9e9e',
            border: '#333333',
            text: '#ffffff',
            textSecondary: '#b0b0b0',
            hover: '#2d2d2d',
            success: '#81c784',
            warning: '#ffb74d',
            error: '#e57373',
            info: '#4fc3f7',
        },
    },
    vintage: {
        name: 'Vintage',
        icon: '[V]',
        light: {
            primary: '#5c4b3c', secondary: '#7a6452', background: '#f4ecd8', surface: '#fbf4e8', accent: '#8b7a66', border: '#cbb99f', text: '#3e3328', textSecondary: '#7f6e5a', hover: '#eadcc8', success: '#5f7b5f', warning: '#b78f5b', error: '#b55a5a', info: '#6a8ca0',
        },
        dark: {
            primary: '#ecdcc9', secondary: '#cfbba3', background: '#2f261f', surface: '#3b3128', accent: '#b69f84', border: '#5a4a3d', text: '#f4e8d8', textSecondary: '#d5c3ac', hover: '#4a3e33', success: '#a8c6a8', warning: '#e6c3a0', error: '#e6b3b3', info: '#b3c9e0',
        },
    },
    modern: {
        name: 'Modern Minimal',
        icon: '[M]',
        light: {
            primary: '#0a0a0a', secondary: '#2d2d2d', background: '#ffffff', surface: '#fafafa', accent: '#636363', border: '#eaeaea', text: '#0a0a0a', textSecondary: '#757575', hover: '#f0f0f0', success: '#00a86b', warning: '#f5a623', error: '#e54b4b', info: '#3b7cbf',
        },
        dark: {
            primary: '#f5f5f5', secondary: '#d4d4d4', background: '#0d0d0d', surface: '#1a1a1a', accent: '#a0a0a0', border: '#2d2d2d', text: '#ffffff', textSecondary: '#b3b3b3', hover: '#2a2a2a', success: '#4caf7f', warning: '#ffb347', error: '#ff6b6b', info: '#5c9bd5',
        },
    },
    financial: {
        name: 'Financial',
        icon: '[F]',
        light: {
            primary: '#2c2c2c', secondary: '#4a4a4a', background: '#fff1e0', surface: '#fff8ef', accent: '#ff8c69', border: '#ffb399', text: '#333333', textSecondary: '#8a6c5f', hover: '#ffe8d4', success: '#2e7d32', warning: '#ed6c02', error: '#d32f2f', info: '#0288d1',
        },
        dark: {
            primary: '#ffd9c9', secondary: '#ffc2ab', background: '#2d221d', surface: '#3b2d26', accent: '#ff9c7f', border: '#7a5c4f', text: '#ffe9df', textSecondary: '#d7b7a9', hover: '#4a3931', success: '#81c784', warning: '#ffb74d', error: '#e57373', info: '#4fc3f7',
        },
    },
    broadsheet: {
        name: 'Broadsheet Blue',
        icon: '[B]',
        light: {
            primary: '#1e3a5f', secondary: '#2b4c7c', background: '#f0f7ff', surface: '#ffffff', accent: '#517ea6', border: '#c5d9f0', text: '#1e3a5f', textSecondary: '#4a6f8f', hover: '#e6f0fa', success: '#2e7d32', warning: '#ed6c02', error: '#d32f2f', info: '#0288d1',
        },
        dark: {
            primary: '#8bb9ff', secondary: '#6a9ae0', background: '#0b1a2b', surface: '#14273e', accent: '#3a6ea5', border: '#2a4059', text: '#e3f0ff', textSecondary: '#a9c9f0', hover: '#1f3449', success: '#81c784', warning: '#ffb74d', error: '#e57373', info: '#4fc3f7',
        },
    },
    berliner: {
        name: 'Berliner Burgundy',
        icon: '[BE]',
        light: {
            primary: '#4a2c3a', secondary: '#6d3f54', background: '#fdf5f5', surface: '#ffffff', accent: '#9b5b75', border: '#ecd9e0', text: '#4a2c3a', textSecondary: '#7b5568', hover: '#f9e9ee', success: '#2e7d32', warning: '#ed6c02', error: '#d32f2f', info: '#0288d1',
        },
        dark: {
            primary: '#e6b8cc', secondary: '#c99ab1', background: '#24161d', surface: '#35242e', accent: '#a86f89', border: '#4f3647', text: '#f8e2ed', textSecondary: '#ddb8cc', hover: '#402f3a', success: '#81c784', warning: '#ffb74d', error: '#e57373', info: '#4fc3f7',
        },
    },
    guardian: {
        name: 'Guardian Green',
        icon: '[G]',
        light: {
            primary: '#1a4d3e', secondary: '#236b54', background: '#f2f9f2', surface: '#ffffff', accent: '#3c8d6e', border: '#c1e0d1', text: '#1a4d3e', textSecondary: '#3d6b5a', hover: '#e3f3e9', success: '#2e7d32', warning: '#ed6c02', error: '#d32f2f', info: '#0288d1',
        },
        dark: {
            primary: '#E8F3E9', secondary: '#B8D9C0', background: '#0F2A21', surface: '#1A3D31', accent: '#6FCF97', border: '#2A5543', text: '#F0F7F0', textSecondary: '#B8D9C0', hover: '#244B3C', success: '#A5D6A7', warning: '#FFB74D', error: '#EF9A9A', info: '#81D4FA',
        },
    },
    sunset: {
        name: 'Sunset',
        icon: '[S]',
        light: {
            primary: '#3a2618', secondary: '#5e4030', background: '#fff1e6', surface: '#fff7f1', accent: '#ff9966', border: '#ffccbb', text: '#4a3322', textSecondary: '#cc8866', hover: '#ffe4d6', success: '#6f8f6f', warning: '#cc8f5a', error: '#c26767', info: '#6797b3',
        },
        dark: {
            primary: '#ffd8c4', secondary: '#ffbea0', background: '#2c1d14', surface: '#3a281d', accent: '#ffad80', border: '#6b4a3a', text: '#ffece3', textSecondary: '#e5b8a0', hover: '#493429', success: '#b3d1b3', warning: '#f2c9a6', error: '#f2b8b8', info: '#b3d1e6',
        },
    },
    heritage: {
        name: 'Heritage Vintage',
        icon: '[H]',
        light: {
            primary: '#5c4b3c', secondary: '#7a6452', background: '#faf3e8', surface: '#fff9f0', accent: '#a48d76', border: '#e2d5c5', text: '#4a3c2f', textSecondary: '#7f6e5a', hover: '#f0e6d9', success: '#5f7b5f', warning: '#b78f5b', error: '#b55a5a', info: '#6a8ca0',
        },
        dark: {
            primary: '#F0E6D9', secondary: '#D4C0A9', background: '#2C241D', surface: '#3E332B', accent: '#C4A484', border: '#5F4F40', text: '#F5EDE0', textSecondary: '#D4C0A9', hover: '#4F4238', success: '#A8C6A8', warning: '#E6C3A0', error: '#E6B3B3', info: '#B3C9E0',
        },
    },
    dawn: {
        name: 'Dawn Edition',
        icon: '[D]',
        light: {
            primary: '#8b5e4c', secondary: '#b27a64', background: '#fff4e6', surface: '#fffaf2', accent: '#d99976', border: '#f0d9cc', text: '#5c4033', textSecondary: '#a07460', hover: '#faede3', success: '#6f8f6f', warning: '#cc8f5a', error: '#c26767', info: '#6797b3',
        },
        dark: {
            primary: '#ffccb3', secondary: '#e6af96', background: '#2f241f', surface: '#42342d', accent: '#cf8f70', border: '#6b5245', text: '#ffe6d9', textSecondary: '#e6c4b3', hover: '#55433b', success: '#b3d1b3', warning: '#f2c9a6', error: '#f2b8b8', info: '#b3d1e6',
        },
    },
    rustic: {
        name: 'Rustic Charm',
        icon: '[R]',
        light: {
            primary: '#6b4f3f', secondary: '#8e6b56', background: '#f7efe7', surface: '#fef7f0', accent: '#bf8f7a', border: '#ead7cc', text: '#4f3b2f', textSecondary: '#9c7a67', hover: '#f5e8df', success: '#6d8f6d', warning: '#c6925a', error: '#b96161', info: '#5f89a3',
        },
        dark: {
            primary: '#ebc9b8', secondary: '#cfaa96', background: '#2e241f', surface: '#42362f', accent: '#bc8872', border: '#6b5247', text: '#faeade', textSecondary: '#e0c5b8', hover: '#55453d', success: '#a8c6a8', warning: '#edc9a6', error: '#edb3b3', info: '#b3cce0',
        },
    },
};

const ThemeContext = createContext();

export function ThemeProvider({ children, initialTheme = null, shouldSyncToServer = false }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('fyi-theme');
        const candidate = saved ?? initialTheme ?? 'classic';
        return themeDefinitions[candidate] ? candidate : 'classic';
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('fyi-dark-mode');
        if (saved !== null) return saved === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const didMountRef = useRef(false);

    useEffect(() => {
        if (!initialTheme || !themeDefinitions[initialTheme]) return;
        const saved = localStorage.getItem('fyi-theme');
        if (!saved) {
            setTheme((prev) => (prev === initialTheme ? prev : initialTheme));
        }
    }, [initialTheme]);

    const currentTheme = themeDefinitions[theme] ?? themeDefinitions.classic;
    const colors = currentTheme[isDarkMode ? 'dark' : 'light'];

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--fyi-primary', colors.primary);
        root.style.setProperty('--fyi-secondary', colors.secondary);
        root.style.setProperty('--fyi-background', colors.background);
        root.style.setProperty('--fyi-surface', colors.surface);
        root.style.setProperty('--fyi-accent', colors.accent);
        root.style.setProperty('--fyi-border', colors.border);
        root.style.setProperty('--fyi-text', colors.text);
        root.style.setProperty('--fyi-text-secondary', colors.textSecondary);
        root.style.setProperty('--fyi-hover', colors.hover);
        root.style.setProperty('--fyi-success', colors.success);
        root.style.setProperty('--fyi-warning', colors.warning);
        root.style.setProperty('--fyi-error', colors.error);
        root.style.setProperty('--fyi-info', colors.info);

        // Backward-compatible newspaper aliases used by older pages.
        root.style.setProperty('--newspaper-newsprint', colors.primary);
        root.style.setProperty('--newspaper-paper', colors.background);
        root.style.setProperty('--newspaper-aged', colors.surface);
        root.style.setProperty('--newspaper-ink', colors.text);
        root.style.setProperty('--newspaper-accent', colors.accent);
        root.style.setProperty('--newspaper-border', colors.border);
        root.style.setProperty('--newspaper-byline', colors.textSecondary);
        root.style.setProperty('--newspaper-headline', colors.primary);
    }, [colors]);

    useEffect(() => {
        localStorage.setItem('fyi-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('fyi-dark-mode', String(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e) => {
            if (localStorage.getItem('fyi-dark-mode') === null) {
                setIsDarkMode(e.matches);
            }
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        if (!shouldSyncToServer) return;

        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }

        axios
            .patch('/preferences/theme', {
                theme,
            })
            .catch(() => {});
    }, [theme, isDarkMode, shouldSyncToServer]);

    const availableThemes = useMemo(
        () => Object.fromEntries(Object.entries(themeDefinitions)),
        []
    );

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                isDarkMode,
                setIsDarkMode,
                colors,
                availableThemes,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

