import React, { createContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { COLORS, DARK_COLORS } from '../../Student/DashboardSections/dashboardTheme';

// Create the color mode context
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function StudentLayout({ children }) {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('dashboardTheme');
        return savedMode || 'light';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('dashboardTheme', newMode);
                    return newMode;
                });
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            primary: { main: COLORS.deepPurple },
                            secondary: { main: COLORS.softPink },
                            background: {
                                default: '#F5F7FA',
                                paper: '#FFFFFF',
                            },
                        }
                        : {
                            primary: { main: DARK_COLORS.softPink },
                            secondary: { main: DARK_COLORS.royalPurple },
                            background: {
                                default: DARK_COLORS.pageBg,
                                paper: DARK_COLORS.cardBg,
                            },
                        }),
                },
                typography: {
                    fontFamily: ['Inter', '-apple-system', 'sans-serif'].join(','),
                },
                shape: { borderRadius: 8 },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
