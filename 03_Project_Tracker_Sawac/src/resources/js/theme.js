import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0b5fff',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6f61',
        },
        background: {
            default: '#f3f6f9',
            paper: '#ffffff',
        },
        info: {
            main: '#1976d2'
        }
    },
    typography: {
        fontFamily: ['Figtree', 'Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                },
            },
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 1,
            },
        },
    },
});

export default theme;
