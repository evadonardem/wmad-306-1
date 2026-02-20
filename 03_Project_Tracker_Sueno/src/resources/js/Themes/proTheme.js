// resources/js/themes/proTheme.js
import { createTheme } from '@mui/material/styles';

const proTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // clean corporate blue
    secondary: { main: '#424242' }, // neutral gray
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default proTheme;
