import { createTheme } from '@mui/material/styles';
import { indigo, deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: indigo[100],
      dark: indigo[900],
    },
    secondary: {
      main: deepPurple[500],
    },
    background: {
      default: '#f5f7fb',
      paper: '#fff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0 2px 8px 0 rgba(60,72,100,0.07)',
    ...Array(23).fill('0 2px 8px 0 rgba(60,72,100,0.07)'),
  ],
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
  },
  spacing: 8,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 8px 0 rgba(60,72,100,0.07)',
          transition: 'box-shadow 0.2s',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 8px 0 rgba(60,72,100,0.07)',
        },
      },
    },
  },
});

export default theme;
