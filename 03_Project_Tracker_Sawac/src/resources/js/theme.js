import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: '#FF2D20',
        },
        background: {
            default: '#FAFAFB',
            paper: '#FFFFFF',
        },
        mode: 'light',
    },
    typography: {
        fontFamily: 'Figtree, Roboto, Helvetica, Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
