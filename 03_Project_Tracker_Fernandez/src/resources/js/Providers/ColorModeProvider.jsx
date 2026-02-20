import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createContext, useMemo } from 'react';
import { buildTheme } from '../theme';

export const ColorModeContext = createContext({
    mode: 'dark',
    toggleMode: () => {},
    setMode: (_mode) => {},
});

export default function ColorModeProvider({ children }) {
    const mode = 'dark';
    const theme = useMemo(() => buildTheme(mode), []);

    const value = useMemo(
        () => ({
            mode,
            toggleMode: () => {},
            setMode: () => {},
        }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
