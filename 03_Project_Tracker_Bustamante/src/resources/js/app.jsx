// Global styles and bootstrap for axios/echo etc.
import '../css/app.css';
import './bootstrap';

// Inertia React adapter and Vite helpers to resolve page components
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { teal } from '@mui/material/colors';

// App name for dynamic document titles
const appName = import.meta.env.VITE_APP_NAME || 'Project Tracker of Juswa';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: teal[300],
        },
        secondary: {
            main: teal[200],
        },
        background: {
            default: '#070A0B',
            paper: '#0B1112',
        },
    },
    typography: {
        fontFamily:
            '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage:
                        'radial-gradient(900px circle at 20% -10%, rgba(45,212,191,0.20), transparent 55%), radial-gradient(700px circle at 90% 0%, rgba(45,212,191,0.12), transparent 50%), radial-gradient(900px circle at 50% 120%, rgba(255,255,255,0.06), transparent 55%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 800,
                    borderRadius: 12,
                    transition:
                        'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                    },
                },
                outlined: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage:
                        'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.00))',
                    border: `1px solid ${alpha('#ffffff', 0.06)}`,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(10px)',
                    backgroundColor: alpha('#070A0B', 0.72),
                    borderBottom: `1px solid ${alpha('#ffffff', 0.06)}`,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    backgroundColor: alpha('#ffffff', 0.02),
                    transition:
                        'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor: alpha('#ffffff', 0.03),
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${alpha(teal[300], 0.12)}`,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                },
            },
        },
    },
});

// Bootstraps the Inertia app, resolves pages dynamically, and mounts React
createInertiaApp({
    // Compose page titles
    title: (title) => `${title} - ${appName}`,
    // Resolve page components using Vite's dynamic import map
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    // Mount React application to the Inertia root element
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App {...props} />
            </ThemeProvider>,
        );
    },
    // Inertia progress bar configuration
    progress: {
        color: '#4B5563',
    },
});
