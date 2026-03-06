import { ThemeProvider as BaseThemeProvider, useTheme } from '@/Contexts/ThemeContext';

export const DEFAULT_NEWSPAPER_THEME = 'classic';

const LEGACY_THEME_COLORS = {
    classic: {
        newsprint: '#1a1a1a', paper: '#f8f8f8', aged: '#f0f0f0', ink: '#2c2c2c', accent: '#4a4a4a', border: '#d4d4d4', byline: '#666666', headline: '#1a1a1a', accent1: '#4a4a4a', accent2: '#666666',
    },
    modern: {
        newsprint: '#0a0a0a', paper: '#ffffff', aged: '#fafafa', ink: '#1e1e1e', accent: '#757575', border: '#e0e0e0', byline: '#9e9e9e', headline: '#212121', accent1: '#616161', accent2: '#424242',
    },
    broadsheet: {
        newsprint: '#1e2b3c', paper: '#f0f4fa', aged: '#e4ecf5', ink: '#2c3e50', accent: '#3498db', border: '#bdd8f0', byline: '#5d7a9a', headline: '#1a2634', accent1: '#2980b9', accent2: '#4a6fa5',
    },
    guardian: {
        newsprint: '#1f3a3a', paper: '#f0f7f0', aged: '#e4f0e4', ink: '#2d4a4a', accent: '#2e8b57', border: '#b8d9b8', byline: '#4f7a4f', headline: '#1d3535', accent1: '#3cb371', accent2: '#66b266',
    },
    berliner: {
        newsprint: '#2d1f24', paper: '#f5ece9', aged: '#efe1dc', ink: '#3c2a30', accent: '#9e4a5c', border: '#ddc5c0', byline: '#b28b95', headline: '#351f26', accent1: '#b45d6f', accent2: '#a1455a',
    },
    heritage: {
        newsprint: '#5c4b3c', paper: '#f4ecd8', aged: '#e8d9c5', ink: '#3e3328', accent: '#8b7a66', border: '#cbb99f', byline: '#7f6e5a', headline: '#4a3c2f', accent1: '#a48d76', accent2: '#b6a187',
    },
    dawn: {
        newsprint: '#3a2618', paper: '#fff1e6', aged: '#ffe4d6', ink: '#4a3322', accent: '#ff9966', border: '#ffccbb', byline: '#cc8866', headline: '#442e1c', accent1: '#ff884d', accent2: '#ffaa80',
    },
    rustic: {
        newsprint: '#6b4f3f', paper: '#fef7f0', aged: '#f7efe7', ink: '#4f3b2f', accent: '#bf8f7a', border: '#ead7cc', byline: '#9c7a67', headline: '#5a4335', accent1: '#8e6b56', accent2: '#a98270',
    },
};

export const NEWSPAPER_THEMES = {
    classic: { name: 'Classic', icon: '??' },
    modern: { name: 'Modern', icon: '?' },
    broadsheet: { name: 'Broadsheet', icon: '??' },
    guardian: { name: 'Guardian', icon: '??' },
    berliner: { name: 'Berliner', icon: '????' },
    heritage: { name: 'Heritage', icon: '??' },
    dawn: { name: 'Dawn', icon: '??' },
    rustic: { name: 'Rustic', icon: '???' },
};

export function normalizeThemeKey(themeKey) {
    return NEWSPAPER_THEMES[themeKey] ? themeKey : DEFAULT_NEWSPAPER_THEME;
}

export function getThemeColors(themeKey) {
    return LEGACY_THEME_COLORS[normalizeThemeKey(themeKey)] || LEGACY_THEME_COLORS[DEFAULT_NEWSPAPER_THEME];
}

export function useThemeContext() {
    const ctx = useTheme();
    const normalized = normalizeThemeKey(ctx.theme);

    return {
        theme: normalized,
        setTheme: ctx.setTheme,
        themes: NEWSPAPER_THEMES,
        colors: getThemeColors(normalized),
        isDarkMode: ctx.isDarkMode,
        setIsDarkMode: ctx.setIsDarkMode,
        availableThemes: ctx.availableThemes,
    };
}

export function ThemeProvider({ children, initialTheme, shouldSyncToServer }) {
    return (
        <BaseThemeProvider initialTheme={initialTheme} shouldSyncToServer={shouldSyncToServer}>
            {children}
        </BaseThemeProvider>
    );
}
