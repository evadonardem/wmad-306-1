import { Container, CssBaseline, Box } from '@mui/material';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import RoleFooter from '@/Components/RoleFooter';
import EditorTopBar from '@/Pages/Editor/Components/EditorTopBar';

export default function EditorLayout({ children, active = 'queue', availableRoles = [] }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'light',
                    primary: { main: colors.newsprint },
                    secondary: { main: colors.accent },
                    background: {
                        default: colors.paper,
                        paper: '#ffffff',
                    },
                },
            }),
        [colors],
    );

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: colors.paper,
                    color: colors.ink,
                    transition: 'background-color 220ms ease, color 220ms ease',
                }}
            >
                <Container maxWidth="xl" className="fyi-page-shell" sx={{ py: 2 }}>
                    <EditorTopBar active={active} availableRoles={availableRoles} />
                    {children}
                </Container>
                <RoleFooter role="editor" />
            </Box>
        </MuiThemeProvider>
    );
}
