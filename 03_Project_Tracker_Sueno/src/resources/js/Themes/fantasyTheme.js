// resources/js/themes/fantasyTheme.js
import { createTheme } from '@mui/material/styles';

const fantasyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9c27b0' }, // purple, mystical
    secondary: { main: '#ff9800' }, // fiery accent
    background: { default: '#1a1a2e', paper: '#16213e' },
  },
  typography: {
    fontFamily: 'Cinzel Decorative, cursive',
  },
});

export default fantasyTheme;
