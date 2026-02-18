import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    FolderKanban,
    ListChecks,
    SlidersHorizontal,
    LogIn,
    UserPlus,
    ArrowRight,
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            <Head title="Project Tracker of Juswa" />

            <Container maxWidth="lg">
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: 3 }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={(theme) => ({
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.16),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                            })}
                        >
                            <FolderKanban size={18} />
                        </Box>
                        <Typography
                            component={Link}
                            href="/"
                            color="inherit"
                            sx={{ textDecoration: 'none' }}
                            fontWeight={900}
                        >
                            Project Tracker of Juswa
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {auth?.user ? (
                            <Button
                                component={Link}
                                href={route('projects.index')}
                                variant="contained"
                                endIcon={<ArrowRight size={18} />}
                            >
                                Open Projects
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href={route('login')}
                                    variant="outlined"
                                    startIcon={<LogIn size={18} />}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('register')}
                                    variant="contained"
                                    startIcon={<UserPlus size={18} />}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>

                <Box
                    sx={(theme) => ({
                        borderRadius: 4,
                        px: { xs: 2, md: 4 },
                        py: { xs: 4, md: 6 },
                        mb: 5,
                        background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.18,
                        )}, ${alpha(theme.palette.background.paper, 0.6)})`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                    })}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Stack spacing={2}>
                                <Chip
                                    label="Project → Task Tracker"
                                    sx={{ alignSelf: 'flex-start' }}
                                />
                                <Typography variant="h2" fontWeight={950}>
                                    Track projects.
                                    <br />
                                    Finish tasks.
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    A clean, professional tracker with Projects and Tasks, built with Laravel + Inertia + React + MUI.
                                </Typography>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    sx={{ mt: 1 }}
                                >
                                    {auth?.user ? (
                                        <Button
                                            component={Link}
                                            href={route('projects.index')}
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowRight size={18} />}
                                        >
                                            Go to Projects
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                component={Link}
                                                href={route('login')}
                                                variant="contained"
                                                size="large"
                                                endIcon={<ArrowRight size={18} />}
                                            >
                                                Get Started
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={route('register')}
                                                variant="outlined"
                                                size="large"
                                            >
                                                Create an account
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </Grid>

                    <Grid item xs={12} md={5}>
                        <Stack spacing={2}>
                            <Paper
                                variant="outlined"
                                sx={(theme) => ({
                                    p: 2,
                                    transition:
                                        'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[8],
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                    },
                                })}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <IconButton
                                        size="small"
                                        sx={(theme) => ({
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.14,
                                            ),
                                            border: `1px solid ${alpha(
                                                theme.palette.primary.main,
                                                0.24,
                                            )}`,
                                        })}
                                    >
                                        <FolderKanban size={18} />
                                    </IconButton>
                                    <Box>
                                        <Typography fontWeight={800}>
                                            Projects
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Create, edit, and delete your projects.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={(theme) => ({
                                    p: 2,
                                    transition:
                                        'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[8],
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                    },
                                })}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <IconButton
                                        size="small"
                                        sx={(theme) => ({
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.14,
                                            ),
                                            border: `1px solid ${alpha(
                                                theme.palette.primary.main,
                                                0.24,
                                            )}`,
                                        })}
                                    >
                                        <ListChecks size={18} />
                                    </IconButton>
                                    <Box>
                                        <Typography fontWeight={800}>Tasks</Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Add tasks under projects and keep notes.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={(theme) => ({
                                    p: 2,
                                    transition:
                                        'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[8],
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                    },
                                })}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <IconButton
                                        size="small"
                                        sx={(theme) => ({
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.14,
                                            ),
                                            border: `1px solid ${alpha(
                                                theme.palette.primary.main,
                                                0.24,
                                            )}`,
                                        })}
                                    >
                                        <SlidersHorizontal size={18} />
                                    </IconButton>
                                    <Box>
                                        <Typography fontWeight={800}>
                                            Status & Priority
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Track work with status (todo/doing/done) and priority (low/medium/high).
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
                </Box>

                <Box sx={{ pb: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                        Built for Juswa — simple, secure, and focused.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
