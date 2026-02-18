import BrandMark from '@/Components/BrandMark';
import { Head, Link } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Grow,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    FolderKanban,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const theme = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const isAuthed = Boolean(auth?.user);

    const featureCards = useMemo(
        () => [
            {
                title: 'Projects that stay organized',
                description:
                    'Create projects fast, keep context in one place, and stay on top of progress.',
                icon: <FolderKanban size={20} />,
            },
            {
                title: 'Tasks with clear momentum',
                description:
                    'Add tasks, set priorities, and flip completion status as you work.',
                icon: <ClipboardList size={20} />,
            },
            {
                title: 'Secure by default',
                description:
                    'Ownership-based authorization keeps your data private and safe.',
                icon: <ShieldCheck size={20} />,
            },
        ],
        [],
    );

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Head title="Welcome" />

            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.72),
                }}
            >
                <Toolbar>
                    <Box
                        component={Link}
                        href="/"
                        sx={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <BrandMark />
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    <Stack direction="row" spacing={1} alignItems="center">
                        {isAuthed ? (
                            <Button
                                component={Link}
                                href={route('dashboard')}
                                variant="contained"
                                endIcon={<ArrowRight size={18} />}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href={route('login')}
                                    variant="text"
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('register')}
                                    variant="contained"
                                    endIcon={<ArrowRight size={18} />}
                                >
                                    Get started
                                </Button>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: theme.palette.mode === 'dark' ? 0.45 : 0.35,
                    backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(
                        theme.palette.primary.main,
                        0.22,
                    )} 0%, transparent 35%), radial-gradient(circle at 90% 30%, ${alpha(
                        theme.palette.secondary.main,
                        0.18,
                    )} 0%, transparent 40%), radial-gradient(circle at 35% 90%, ${alpha(
                        theme.palette.primary.main,
                        0.14,
                    )} 0%, transparent 45%)`,
                }}
            />

            <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Grow in={mounted} timeout={520}>
                            <Stack spacing={2.5}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        icon={<Sparkles size={16} />}
                                        label="Project Tracker"
                                        variant="outlined"
                                        sx={{ '& .MuiChip-icon': { mr: 0.5 } }}
                                    />
                                    <Chip
                                        icon={<CheckCircle2 size={16} />}
                                        label="Fast + focused"
                                        variant="outlined"
                                        sx={{ '& .MuiChip-icon': { mr: 0.5 } }}
                                    />
                                </Stack>

                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: -1,
                                        lineHeight: 1.05,
                                        animation: mounted
                                            ? 'pt-pop 420ms ease-out both'
                                            : 'none',
                                    }}
                                >
                                    Track projects.
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'block',
                                            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                                            backgroundSize: '200% 200%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            animation:
                                                'pt-shimmer 1800ms ease-in-out infinite alternate',
                                        }}
                                    >
                                        Ship tasks.
                                    </Box>
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{ maxWidth: 560 }}
                                >
                                    A clean, modern tracker for projects and tasks —
                                    built on Laravel, Inertia, React, and MUI.
                                </Typography>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1.5}
                                >
                                    {isAuthed ? (
                                        <Button
                                            component={Link}
                                            href={route('projects.index')}
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowRight size={18} />}
                                        >
                                            Go to projects
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                component={Link}
                                                href={route('register')}
                                                variant="contained"
                                                size="large"
                                                endIcon={<ArrowRight size={18} />}
                                            >
                                                Create your account
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={route('login')}
                                                variant="outlined"
                                                size="large"
                                            >
                                                Sign in
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </Grow>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: '1fr',
                            }}
                        >
                            {featureCards.map((card, idx) => (
                                <Grow
                                    key={card.title}
                                    in={mounted}
                                    timeout={560 + idx * 160}
                                >
                                    <Card
                                        sx={{
                                            p: 0,
                                            animation:
                                                'pt-float 7s ease-in-out infinite',
                                            animationDelay: `${idx * 260}ms`,
                                        }}
                                    >
                                        <CardContent>
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="flex-start"
                                            >
                                                <Box
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        borderRadius: 999,
                                                        backgroundColor: alpha(
                                                            theme.palette.primary.main,
                                                            0.12,
                                                        ),
                                                    }}
                                                >
                                                    {card.icon}
                                                </Box>

                                                <Box>
                                                    <Typography
                                                        sx={{ fontWeight: 800 }}
                                                    >
                                                        {card.title}
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {card.description}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: { xs: 6, sm: 8 },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                        color: 'text.secondary',
                    }}
                >
                    <Typography variant="body2">
                        Built with Laravel v{laravelVersion} + PHP v{phpVersion}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center',
                        }}
                    >
                        <Sparkles size={16} />
                        Keep it simple. Keep it shipping.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
