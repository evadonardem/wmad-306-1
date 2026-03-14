import { ThemeProvider, useTheme } from '@/Contexts/ThemeContext';

const useThemeContext = useTheme;

export const NEWSPAPER_THEMES = {
    classic: { name: 'Classic', icon: '[C]' },
    vintage: { name: 'Vintage', icon: '[V]' },
    modern: { name: 'Modern', icon: '[M]' },
    financial: { name: 'Financial', icon: '[F]' },
    broadsheet: { name: 'Broadsheet', icon: '[B]' },
    berliner: { name: 'Berliner', icon: '[BE]' },
    guardian: { name: 'Guardian', icon: '[G]' },
    sunset: { name: 'Sunset', icon: '[S]' },
    heritage: { name: 'Heritage', icon: '[H]' },
    dawn: { name: 'Dawn', icon: '[D]' },
    rustic: { name: 'Rustic', icon: '[R]' },
};

const PALETTES = {
    classic: { newsprint: '#1a1a1a', paper: '#f8f8f8', aged: '#f0f0f0', ink: '#2c2c2c', accent: '#4a4a4a', border: '#d4d4d4', byline: '#666666', headline: '#1a1a1a' },
    vintage: { newsprint: '#5c4b3c', paper: '#f4ecd8', aged: '#e8d9c5', ink: '#3e3328', accent: '#8b7a66', border: '#cbb99f', byline: '#7f6e5a', headline: '#4a3c2f' },
    modern: { newsprint: '#0a0a0a', paper: '#ffffff', aged: '#fafafa', ink: '#1e1e1e', accent: '#757575', border: '#e0e0e0', byline: '#9e9e9e', headline: '#212121' },
    financial: { newsprint: '#2c2c2c', paper: '#fff1e0', aged: '#ffe8d4', ink: '#333333', accent: '#ff8c69', border: '#ffb399', byline: '#ff6b4a', headline: '#2b2b2b' },
    broadsheet: { newsprint: '#1e2b3c', paper: '#f0f4fa', aged: '#e4ecf5', ink: '#2c3e50', accent: '#3498db', border: '#bdd8f0', byline: '#5d7a9a', headline: '#1a2634' },
    berliner: { newsprint: '#2d1f24', paper: '#f5ece9', aged: '#efe1dc', ink: '#3c2a30', accent: '#9e4a5c', border: '#ddc5c0', byline: '#b28b95', headline: '#351f26' },
    guardian: { newsprint: '#1f3a3a', paper: '#f0f7f0', aged: '#e4f0e4', ink: '#2d4a4a', accent: '#2e8b57', border: '#b8d9b8', byline: '#4f7a4f', headline: '#1d3535' },
    sunset: { newsprint: '#3a2618', paper: '#fff1e6', aged: '#ffe4d6', ink: '#4a3322', accent: '#ff9966', border: '#ffccbb', byline: '#cc8866', headline: '#442e1c' },
    heritage: { newsprint: '#5c4b3c', paper: '#faf3e8', aged: '#f0e6d9', ink: '#4a3c2f', accent: '#a48d76', border: '#e2d5c5', byline: '#7f6e5a', headline: '#4a3c2f' },
    dawn: { newsprint: '#8b5e4c', paper: '#fff4e6', aged: '#faede3', ink: '#5c4033', accent: '#d99976', border: '#f0d9cc', byline: '#a07460', headline: '#6d4a3a' },
    rustic: { newsprint: '#6b4f3f', paper: '#f7efe7', aged: '#f5e8df', ink: '#4f3b2f', accent: '#bf8f7a', border: '#ead7cc', byline: '#9c7a67', headline: '#5b4335' },
};

export function getThemeColors(themeName = 'classic') {
    return PALETTES[themeName] ?? PALETTES.classic;
}

export { ThemeProvider, useTheme, useThemeContext };
