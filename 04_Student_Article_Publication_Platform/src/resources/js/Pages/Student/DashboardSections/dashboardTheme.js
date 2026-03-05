import { createTheme } from '@mui/material';

export const COLORS = {
  // Primary palette - more sophisticated
  deepPurple: '#2A2A4E', // Deeper, more elegant
  royalPurple: '#4A3B7C', // Richer purple
  mediumPurple: '#6D5B98', // Softer mid-tone
  softPink: '#E8A2B0', // More subtle pink

  // New accent colors
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  error: '#F44336',

  // Neutrals
  gray50: '#FAFAFC',
  gray100: '#F5F5F7',
  gray200: '#E5E5E7',
  gray300: '#D4D4D8',
  gray400: '#A3A3A7',
  gray500: '#737378',
  gray600: '#525257',
  gray700: '#3A3A3F',
  gray800: '#2A2A2E',
  gray900: '#1A1A1E',
};

export const DARK_COLORS = {
  pageBg: '#0B0B1A',
  cardBg: '#151528',
  border: '#2A2A45',
  textPrimary: '#F0F0FF',
  textSecondary: '#B8B8D0',
  royalPurple: '#9F93C0',
  mediumPurple: '#B4A6D4',
  softPink: '#F0B5C0',
};

export const SIDEBAR_ITEMS = [
  { key: 'feed', label: 'Feed', icon: '📚', iconComponent: 'Feed' },
  { key: 'saved', label: 'Saved', icon: '🔖', iconComponent: 'Bookmark' },
  { key: 'history', label: 'History', icon: '⏱️', iconComponent: 'History' },
  { key: 'settings', label: 'Settings', icon: '⚙️', iconComponent: 'Settings' },
];

export const SORT_OPTIONS = ['Newest', 'Popular', 'Most Discussed', 'Trending'];

export function estimateReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function createDashboardTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    typography: {
      fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'].join(','),
      h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
      h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
      h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
      caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
      subtitle1: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
      subtitle2: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 },
    },
    palette: {
      mode,
      primary: {
        main: COLORS.deepPurple,
        light: COLORS.royalPurple,
        dark: '#1A1A3A',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: COLORS.softPink,
        light: '#FFB6C1',
        dark: '#C48A9A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? DARK_COLORS.pageBg : COLORS.gray50,
        paper: isDark ? DARK_COLORS.cardBg : '#FFFFFF',
      },
      text: {
        primary: isDark ? DARK_COLORS.textPrimary : COLORS.gray900,
        secondary: isDark ? DARK_COLORS.textSecondary : COLORS.gray600,
        disabled: isDark ? COLORS.gray600 : COLORS.gray400,
      },
      divider: isDark ? DARK_COLORS.border : COLORS.gray200,
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 2px 4px rgba(0,0,0,0.05)',
      '0 4px 8px rgba(0,0,0,0.05)',
      '0 8px 16px rgba(0,0,0,0.05)',
      '0 12px 24px rgba(0,0,0,0.05)',
      '0 16px 32px rgba(0,0,0,0.05)',
      ...Array(20).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? DARK_COLORS.pageBg : COLORS.gray50,
            transition: 'background-color 300ms ease, color 300ms ease',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: isDark ? DARK_COLORS.border : COLORS.gray100,
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
            borderRadius: '4px',
            '&:hover': {
              background: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            transition: 'all 200ms ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 200ms ease',
          },
        },
      },
    },
  });
}

export function getSurfaceTokens(mode) {
  const isDark = mode === 'dark';
  return {
    textPrimary: isDark ? DARK_COLORS.textPrimary : COLORS.gray900,
    textSecondary: isDark ? DARK_COLORS.textSecondary : COLORS.gray600,
    borderColor: isDark ? DARK_COLORS.border : COLORS.gray200,
    hoverBg: isDark ? `${DARK_COLORS.royalPurple}15` : `${COLORS.royalPurple}08`,
    activeBg: isDark ? `${DARK_COLORS.royalPurple}25` : `${COLORS.royalPurple}15`,
  };
}
