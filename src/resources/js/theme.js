import { createTheme } from '@mui/material/styles';

const highlandScholarTheme = createTheme({
    palette: {
        primary: {
            main: '#064E3B',       // Deep Pine Green
            light: '#0D7354',
            dark: '#043829',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#C2410C',       // Warm Rust
            light: '#EA580C',
            dark: '#9A3412',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FAFAF9',    // Warm Stone
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1C1917',    // Deep Slate
            secondary: '#57534E',
        },
        success: {
            main: '#15803D',
        },
        warning: {
            main: '#D97706',
        },
        error: {
            main: '#DC2626',
        },
        divider: '#E7E5E4',
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 600, letterSpacing: '-0.01em' },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#9A3412',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: '#064E3B',
                        color: '#FFFFFF',
                        fontWeight: 600,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
    },
});

export default highlandScholarTheme;
