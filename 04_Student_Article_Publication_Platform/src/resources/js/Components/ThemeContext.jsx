import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ThemeContext = createContext();

export const DEFAULT_NEWSPAPER_THEME = 'classic';

export const NEWSPAPER_THEMES = {
    classic: {
        name: 'Classic',
        icon: '\u{1F4F0}',
        newsprint: '#1a1a1a',
        paper: '#f8f8f8',
        aged: '#f0f0f0',
        ink: '#2c2c2c',
        accent: '#4a4a4a',
        border: '#d4d4d4',
        byline: '#666666',
        headline: '#1a1a1a',
        accent1: '#4a4a4a',
        accent2: '#666666',
    },
    vintage: {
        name: 'Vintage',
        icon: '\u{1F4DC}',
        newsprint: '#5c4b3c',
        paper: '#f4ecd8',
        aged: '#e8d9c5',
        ink: '#3e3328',
        accent: '#8b7a66',
        border: '#cbb99f',
        byline: '#7f6e5a',
        headline: '#4a3c2f',
        accent1: '#a48d76',
        accent2: '#b6a187',
    },
    modern: {
        name: 'Modern',
        icon: '\u2728',
        newsprint: '#0a0a0a',
        paper: '#ffffff',
        aged: '#fafafa',
        ink: '#1e1e1e',
        accent: '#757575',
        border: '#e0e0e0',
        byline: '#9e9e9e',
        headline: '#212121',
        accent1: '#616161',
        accent2: '#424242',
    },
    financial: {
        name: 'Financial',
        icon: '\u{1F4C8}',
        newsprint: '#2c2c2c',
        paper: '#fff1e0',
        aged: '#ffe8d4',
        ink: '#333333',
        accent: '#ff8c69',
        border: '#ffb399',
        byline: '#ff6b4a',
        headline: '#2b2b2b',
        accent1: '#ff5252',
        accent2: '#ff7b7b',
    },
    broadsheet: {
        name: 'Broadsheet',
        icon: '\u{1F30A}',
        newsprint: '#1e2b3c',
        paper: '#f0f4fa',
        aged: '#e4ecf5',
        ink: '#2c3e50',
        accent: '#3498db',
        border: '#bdd8f0',
        byline: '#5d7a9a',
        headline: '#1a2634',
        accent1: '#2980b9',
        accent2: '#4a6fa5',
    },
    berliner: {
        name: 'Berliner',
        icon: '\u{1F1E9}\u{1F1EA}',
        newsprint: '#2d1f24',
        paper: '#f5ece9',
        aged: '#efe1dc',
        ink: '#3c2a30',
        accent: '#9e4a5c',
        border: '#ddc5c0',
        byline: '#b28b95',
        headline: '#351f26',
        accent1: '#b45d6f',
        accent2: '#a1455a',
    },
    guardian: {
        name: 'Guardian',
        icon: '\u{1F33F}',
        newsprint: '#1f3a3a',
        paper: '#f0f7f0',
        aged: '#e4f0e4',
        ink: '#2d4a4a',
        accent: '#2e8b57',
        border: '#b8d9b8',
        byline: '#4f7a4f',
        headline: '#1d3535',
        accent1: '#3cb371',
        accent2: '#66b266',
    },
    sunset: {
        name: 'Sunset',
        icon: '\u{1F305}',
        newsprint: '#3a2618',
        paper: '#fff1e6',
        aged: '#ffe4d6',
        ink: '#4a3322',
        accent: '#ff9966',
        border: '#ffccbb',
        byline: '#cc8866',
        headline: '#442e1c',
        accent1: '#ff884d',
        accent2: '#ffaa80',
    },
};

const VALID_THEME_KEYS = Object.keys(NEWSPAPER_THEMES);

export function normalizeThemeKey(themeKey) {
    return VALID_THEME_KEYS.includes(themeKey) ? themeKey : DEFAULT_NEWSPAPER_THEME;
}

export function getThemeColors(themeKey) {
    return NEWSPAPER_THEMES[normalizeThemeKey(themeKey)];
}

export function ThemeProvider({ children, initialTheme = null, shouldSyncToServer = false }) {
    const normalizedInitialTheme = normalizeThemeKey(initialTheme);

    const [syncToServer, setSyncToServer] = useState(Boolean(shouldSyncToServer));
    const [theme, setThemeState] = useState(() => {
        if (shouldSyncToServer && initialTheme) {
            return normalizedInitialTheme;
        }

        if (typeof window !== 'undefined') {
            return normalizeThemeKey(localStorage.getItem('newspaperTheme'));
        }

        return normalizedInitialTheme;
    });

    const lastSyncedThemeRef = useRef(shouldSyncToServer && initialTheme ? normalizedInitialTheme : null);

    useEffect(() => {
        if (!shouldSyncToServer || !initialTheme) {
            return;
        }

        const serverTheme = normalizeThemeKey(initialTheme);
        setThemeState(serverTheme);
        setSyncToServer(true);
        lastSyncedThemeRef.current = serverTheme;
    }, [initialTheme, shouldSyncToServer]);

    useEffect(() => {
        const handleInertiaNavigate = (event) => {
            const user = event?.detail?.page?.props?.auth?.user ?? null;

            if (!user) {
                setSyncToServer(false);
                lastSyncedThemeRef.current = null;
                return;
            }

            const serverTheme = normalizeThemeKey(user.theme_preference);
            setSyncToServer(true);
            setThemeState(serverTheme);
            lastSyncedThemeRef.current = serverTheme;
        };

        window.addEventListener('inertia:navigate', handleInertiaNavigate);

        return () => {
            window.removeEventListener('inertia:navigate', handleInertiaNavigate);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const colors = getThemeColors(theme);
        localStorage.setItem('newspaperTheme', theme);

        const root = document.documentElement;
        root.setAttribute('data-newspaper-theme', theme);
        root.style.setProperty('--newspaper-newsprint', colors.newsprint);
        root.style.setProperty('--newspaper-paper', colors.paper);
        root.style.setProperty('--newspaper-aged', colors.aged);
        root.style.setProperty('--newspaper-ink', colors.ink);
        root.style.setProperty('--newspaper-accent', colors.accent);
        root.style.setProperty('--newspaper-border', colors.border);
        root.style.setProperty('--newspaper-byline', colors.byline);
        root.style.setProperty('--newspaper-headline', colors.headline);
        root.style.setProperty('--newspaper-accent1', colors.accent1);
        root.style.setProperty('--newspaper-accent2', colors.accent2);
    }, [theme]);

    useEffect(() => {
        if (!syncToServer || !window.axios) {
            return;
        }

        if (lastSyncedThemeRef.current === theme) {
            return;
        }

        let cancelled = false;

        window.axios
            .patch('/preferences/theme', { theme })
            .then(() => {
                if (!cancelled) {
                    lastSyncedThemeRef.current = theme;
                }
            })
            .catch(() => {
                // Keep local preference applied even if network update fails.
            });

        return () => {
            cancelled = true;
        };
    }, [theme, syncToServer]);

    const setTheme = (nextTheme) => {
        setThemeState(normalizeThemeKey(nextTheme));
    };

    const value = useMemo(
        () => ({
            theme,
            setTheme,
            themes: NEWSPAPER_THEMES,
            colors: getThemeColors(theme),
        }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
    return useContext(ThemeContext);
}
