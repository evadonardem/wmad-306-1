import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6E2F7A' },
    secondary: { main: '#00AFA0' },
    accent: { main: '#FFB000' },
    background: {
      default: '#F6F7F8',
      paper: '#fff',
    },
    text: {
      primary: '#0E0E10',
      secondary: '#6E2F7A',
    },
    success: { main: '#2BB673' },
    error: { main: '#E5484D' },
    neutral: {
      900: '#0E0E10',
      100: '#F6F7F8',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    body1: { fontSize: 16, lineHeight: 1.6 },
    body2: { fontSize: 15, lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'background 180ms ease',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #6E2F7A 0%, #00AFA0 100%)',
            boxShadow: '0 2px 12px 0 rgba(110,47,122,0.10)',
          },
          '&:focus-visible': {
            outline: '2px solid #00AFA0',
            outlineOffset: 2,
          },
        },
        sizeMedium: {
          padding: '10px 28px',
        },
      },
      defaultProps: {
        size: 'medium',
        disableElevation: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderWidth: 2,
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00AFA0',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00AFA0',
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 24px 0 rgba(14,14,16,0.07)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
