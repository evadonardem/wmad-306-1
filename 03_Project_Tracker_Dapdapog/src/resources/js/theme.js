import { createTheme } from '@mui/material/styles';

// corporate colour palette example - adjust to your branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // dark navy
    },
    secondary: {
      main: '#6c757d', // medium grey
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
