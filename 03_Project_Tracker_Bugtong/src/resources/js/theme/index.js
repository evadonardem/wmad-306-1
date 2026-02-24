import { createTheme } from '@mui/material/styles';

const palette = {
  light: {
    mode: 'light',
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
    success: { main: '#4caf50' },
    background: { default: '#f4f6fa', paper: '#fff' },
  },
  dark: {
    mode: 'dark',
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    error: { main: '#ef5350' },
    warning: { main: '#ffa726' },
    info: { main: '#29b6f6' },
    success: { main: '#66bb6a' },
    background: { default: '#181a20', paper: '#23272f' },
  },
};

const themeBuilder = (mode = 'light') =>
  createTheme({
    palette: palette[mode],
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: '0.2s',
            '&:hover': { boxShadow: 6 },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRadius: '0 16px 16px 0' },
        },
      },
    },
  });

export default themeBuilder;
