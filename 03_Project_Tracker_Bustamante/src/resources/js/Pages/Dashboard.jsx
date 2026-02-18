import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    ArrowRight,
    CheckCircle2,
    FolderKanban,
    ListChecks,
    Sparkles,
} from 'lucide-react';

export default function Dashboard() {
    const { props } = usePage();
    const stats = props.stats ?? { projects: 0, tasks: 0, done: 0 };

    const statCardSx = (theme) => ({
        p: { xs: 2.5, md: 3 },
        borderColor: alpha(theme.palette.primary.main, 0.14),
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minHeight: { xs: 112, md: 124 },
        justifyContent: 'center',
        textAlign: 'center',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[10],
        },
    });

    const iconBadgeSx = (theme) => ({
        width: 44,
        height: 44,
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        bgcolor: alpha(theme.palette.primary.main, 0.12),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        flexShrink: 0,
    });

    return (
        <AuthenticatedLayout
            header={
                <Stack spacing={0.75}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Sparkles size={18} />
                        <Typography variant="h5" fontWeight={950}>
                            Home
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        Your workspace overview and quick actions.
                    </Typography>
                </Stack>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
                <Stack spacing={3}>
                    <Paper
                        sx={(theme) => ({
                            p: { xs: 3, md: 4 },
                            overflow: 'hidden',
                            position: 'relative',
                            borderColor: alpha(theme.palette.primary.main, 0.18),
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                inset: -2,
                                background: `radial-gradient(700px circle at 18% 20%, ${alpha(
                                    theme.palette.primary.main,
                                    0.24,
                                )}, transparent 58%)`,
                                pointerEvents: 'none',
                            },
                        })}
                    >
                        <Stack
                            spacing={2.25}
                            sx={{
                                position: 'relative',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Stack spacing={1.25} alignItems="center">
                                <Typography variant="h4" fontWeight={950}>
                                    Keep your work moving.
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{ maxWidth: 720 }}
                                >
                                    Manage Projects and Tasks with clear priority and status.
                                </Typography>
                            </Stack>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.5}
                                useFlexGap
                                sx={{
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <Button
                                    component={Link}
                                    href={route('projects.index')}
                                    variant="contained"
                                    size="large"
                                    startIcon={<FolderKanban size={18} />}
                                    endIcon={<ArrowRight size={18} />}
                                    sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                                >
                                    Open Projects
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('profile.edit')}
                                    variant="outlined"
                                    size="large"
                                    sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                                >
                                    Profile Settings
                                </Button>
                            </Stack>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ pt: 0.25 }}
                                justifyContent="center"
                            >
                                <Chip label="Dark luxe" />
                                <Chip label="Emerald/teal" />
                                <Chip label="Bold motion" />
                            </Stack>
                        </Stack>
                    </Paper>

                    <Grid container spacing={2.5} alignItems="stretch" justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Paper sx={statCardSx}>
                                <Box sx={iconBadgeSx}>
                                    <FolderKanban size={18} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                        Projects
                                    </Typography>
                                    <Typography variant="h4" fontWeight={950}>
                                        {stats.projects}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={statCardSx}>
                                <Box sx={iconBadgeSx}>
                                    <ListChecks size={18} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                        Tasks
                                    </Typography>
                                    <Typography variant="h4" fontWeight={950}>
                                        {stats.tasks}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={statCardSx}>
                                <Box sx={iconBadgeSx}>
                                    <CheckCircle2 size={18} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                        Done
                                    </Typography>
                                    <Typography variant="h4" fontWeight={950}>
                                        {stats.done}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
