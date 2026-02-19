import { Head, Link } from '@inertiajs/react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@/Context/ThemeContext';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { theme } = useTheme();

    return (
        <>
            <Head title="Welcome" />

            <div style={{
                minHeight: '100vh',
                backgroundColor: theme.bg.primary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}>
                <ThemeToggle />
                <Container maxWidth="sm" style={{ textAlign: 'center' }}>
                    {/* DS Logo Icon */}
                    <Box sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, #d4af37 0%, #e6c550 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    }}>
                        <Typography sx={{
                            fontSize: '2.5rem',
                            fontWeight: 900,
                            color: '#1a1a1a',
                            fontFamily: 'Georgia, serif',
                            letterSpacing: '1px',
                        }}>
                            DS
                        </Typography>
                    </Box>

                    {/* Brand */}
                    <Typography sx={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#d4af37',
                        fontFamily: 'Georgia, serif',
                        letterSpacing: '2px',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                    }}>
                        Project Manager
                    </Typography>

                    {/* Main Heading */}
                    <Typography variant="h2" sx={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: theme.text.primary,
                        marginBottom: '1rem',
                        fontFamily: 'Georgia, serif',
                    }}>
                        Manage Projects with Ease
                    </Typography>

                    {/* Description */}
                    <Typography sx={{
                        fontSize: '1rem',
                        color: theme.text.secondary,
                        marginBottom: '3rem',
                        lineHeight: '1.7',
                    }}>
                        A professional platform for organizing, tracking, and collaborating on projects and tasks with streamlined efficiency.
                    </Typography>

                    {/* CTA Buttons */}
                    <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
                        {auth.user ? (
                            <>
                                <Button
                                    component={Link}
                                    href="/dashboard"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        color: '#1a1a1a',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.2,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#e6c550',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href="/login"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        color: '#1a1a1a',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.2,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#e6c550',
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    component={Link}
                                    href="/register"
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#d4af37',
                                        color: '#d4af37',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.2,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                            borderColor: '#e6c550',
                                            color: '#e6c550',
                                        },
                                    }}
                                >
                                    REGISTER
                                </Button>
                            </>
                        )}
                    </Stack>
                </Container>

                {/* Footer */}
                <Box sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(4px)',
                    padding: '1rem',
                    textAlign: 'center',
                    borderTop: `1px solid ${theme.border}`,
                }}>
                    <Typography sx={{
                        fontSize: '0.8rem',
                        color: theme.text.secondary,
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                    }}>
                        © 2026 DSueno. All rights reserved.
                    </Typography>
                </Box>
            </div>
        </>
    );
}
