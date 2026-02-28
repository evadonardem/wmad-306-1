import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';

const ThemeModeContext = createContext(null);

export function useThemeMode() {
    const ctx = useContext(ThemeModeContext);
    if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
    return ctx;
}

export default function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const stored = window.localStorage.getItem('taskmo-theme');
        return stored === 'dark' || stored === 'light' ? stored : 'light';
    });

    useEffect(() => {
        window.localStorage.setItem('taskmo-theme', mode);
        document.documentElement.classList.toggle('dark', mode === 'dark');
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#6366f1',
                    },
                    secondary: {
                        main: '#ec4899',
                    },
                },
                shape: {
                    borderRadius: 20,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                borderRadius: 16,
                                textTransform: 'none',
                                fontWeight: 800,
                                letterSpacing: 0.2,
                                boxShadow:
                                    '0 14px 28px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -10px 20px rgba(0,0,0,0.06)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                            }),
                            contained: ({ theme }) => ({
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                                backgroundImage: `linear-gradient(135deg, ${alpha(
                                    theme.palette.primary.main,
                                    0.95,
                                )}, ${alpha(theme.palette.secondary.main, 0.85)})`,
                                boxShadow:
                                    '0 18px 36px rgba(99,102,241,0.22), 0 22px 55px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -14px 28px rgba(0,0,0,0.14)',
                            }),
                            outlined: ({ theme }) => ({
                                backgroundColor: alpha(theme.palette.background.paper, 0.62),
                            }),
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: 20,
                                border: `1px solid ${alpha(theme.palette.divider, 0.65)}`,
                                backgroundColor: alpha(theme.palette.background.paper, 0.62),
                                backdropFilter: 'blur(14px)',
                                boxShadow:
                                    '0 22px 55px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -14px 28px rgba(0,0,0,0.06)',
                            }),
                        },
                    },
                },
            }),
        [mode],
    );

    const value = useMemo(
        () => ({
            mode,
            setMode,
            toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
        }),
        [mode],
    );

    return (
        <ThemeModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}
