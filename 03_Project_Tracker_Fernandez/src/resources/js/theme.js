import { createTheme, alpha } from '@mui/material/styles';

export function buildTheme(mode) {
    return createTheme({
        palette: {
            mode,
        },
        typography: {
            h4: {
                fontSize: '2rem',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
            },
            h5: {
                fontSize: '1.5rem',
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: '-0.005em',
            },
            h6: {
                fontSize: '1.2rem',
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: 0,
            },
            subtitle1: {
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.45,
                letterSpacing: 0,
            },
            body1: {
                fontSize: '0.95rem',
                fontWeight: 400,
                lineHeight: 1.6,
                letterSpacing: 0,
            },
            body2: {
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: 1.55,
                letterSpacing: 0,
            },
            caption: {
                fontSize: '0.78rem',
                fontWeight: 500,
                lineHeight: 1.45,
                letterSpacing: '0.01em',
            },
            button: {
                fontWeight: 600,
                letterSpacing: '0.01em',
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiTypography: {
                defaultProps: {
                    variantMapping: {
                        h4: 'h1',
                        h5: 'h2',
                        h6: 'h3',
                        subtitle1: 'p',
                        body1: 'p',
                        body2: 'p',
                    },
                },
            },
            MuiCssBaseline: {
                styleOverrides: {
                    html: {
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                    },
                    body: {
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                    },
                    '@keyframes pt-float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                    },
                    '@keyframes pt-pop': {
                        '0%': { transform: 'scale(0.98)', opacity: 0 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                    },
                    '@keyframes pt-shimmer': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '100%': { backgroundPosition: '100% 50%' },
                    },
                },
            },
            MuiCard: {
                defaultProps: {
                    variant: 'outlined',
                },
                styleOverrides: {
                    root: ({ theme }) => ({
                        transition: theme.transitions.create(
                            ['transform', 'box-shadow', 'border-color'],
                            { duration: 220 },
                        ),
                        '&:hover': {
                            transform: 'none',
                            boxShadow: theme.shadows[2],
                            borderColor: alpha(theme.palette.text.primary, 0.16),
                        },
                        '&:active': {
                            transform: 'none',
                        },
                    }),
                },
            },
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
                styleOverrides: {
                    root: ({ theme }) => ({
                        textTransform: 'none',
                        transition: theme.transitions.create(
                            ['transform', 'background-color', 'border-color'],
                            { duration: 180 },
                        ),
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                        '&:active': {
                            transform: 'translateY(0px) scale(0.98)',
                        },
                    }),
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        transition: theme.transitions.create(['transform'], {
                            duration: 180,
                        }),
                        '&:hover': {
                            transform: 'scale(1.07) rotate(-6deg)',
                        },
                        '&:active': {
                            transform: 'scale(0.95) rotate(0deg)',
                        },
                    }),
                },
            },
        },
    });
}
