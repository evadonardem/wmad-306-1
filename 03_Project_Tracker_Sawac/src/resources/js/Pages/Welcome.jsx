import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    Card,
    CardContent,
    Grid,
    useTheme,
    InputAdornment,
    TextField,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export default function Welcome({ auth }) {
    const theme = useTheme();

    const FeatureCard = ({ icon, title, description }) => (
        <Card
            sx={{
                height: '100%',
                transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                },
            }}
        >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="Welcome to Project Tracker" />

            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Navigation Bar */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 2,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FolderIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Project Tracker
                                </Typography>
                            </Box>

                            {auth?.user ? (
                                <Button component={Link} href={route('dashboard')} variant="contained">
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={1}>
                                    <Button component={Link} href={route('login')} variant="text">
                                        Log In
                                    </Button>
                                    <Button component={Link} href={route('register')} variant="contained">
                                        Sign Up
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Container>
                </Box>

                {/* Hero Section */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        py: 8,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            component="h1"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 2,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            Manage Projects with Ease
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.8 }}>
                                            A modern, lightweight project and task management application built with Material UI.
                                            Organize your work, track progress, and achieve your goals efficiently.
                                        </Typography>
                                    </Box>

                                    {!auth?.user && (
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <Button
                                                component={Link}
                                                href={route('register')}
                                                variant="contained"
                                                size="large"
                                                endIcon={<ArrowRightIcon />}
                                                sx={{ py: 1.5 }}
                                            >
                                                Get Started Free
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={route('login')}
                                                variant="outlined"
                                                size="large"
                                                sx={{ py: 1.5 }}
                                            >
                                                Log In
                                            </Button>
                                        </Stack>
                                    )}

                                    <Typography variant="caption" color="text.secondary">
                                        No credit card required • Free forever for basic use • Built with Laravel, React, and Material UI
                                    </Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
                                        borderRadius: 3,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        placeholder="Search projects, tasks, ideas..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                            },
                                        }}
                                    />

                                    <Stack spacing={2}>
                                        {[
                                            { title: 'Web Redesign', project: 'Design System', status: '60%' },
                                            { title: 'API Integration', project: 'Backend', status: '85%' },
                                            { title: 'Testing Suite', project: 'QA', status: '45%' },
                                        ].map((item, idx) => (
                                            <Card key={idx} variant="outlined" sx={{ p: 2 }}>
                                                <Stack spacing={1}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.status}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.project}
                                                    </Typography>
                                                </Stack>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Features Section */}
                <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                                Everything You Need to Stay Organized
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Streamlined features designed for teams and individuals.
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<FolderIcon sx={{ fontSize: 32 }} />}
                                    title="Project Management"
                                    description="Create and organize projects with descriptions, track progress, and collaborate with your team."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<TaskIcon sx={{ fontSize: 32 }} />}
                                    title="Task Tracking"
                                    description="Break down projects into tasks, set priorities, and monitor completion status in real-time."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<SpeedIcon sx={{ fontSize: 32 }} />}
                                    title="Lightning Fast"
                                    description="Built with modern technology for instant responsiveness and seamless performance."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<LightbulbIcon sx={{ fontSize: 32 }} />}
                                    title="Intuitive Design"
                                    description="Clean Material UI interface that's easy to learn and enjoyable to use every day."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<SecurityIcon sx={{ fontSize: 32 }} />}
                                    title="Secure & Private"
                                    description="Your data is encrypted and stored safely in the cloud with enterprise-grade security."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FeatureCard
                                    icon={<SearchIcon sx={{ fontSize: 32 }} />}
                                    title="Powerful Search"
                                    description="Quickly find projects and tasks with keyboard shortcuts and intelligent search."
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        py: 8,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'primary.contrastText',
                    }}
                >
                    <Container maxWidth="md">
                        <Stack spacing={4} sx={{ textAlign: 'center' }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                                    Ready to Get Started?
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.95 }}>
                                    Join thousands of users who are managing their projects more efficiently.
                                </Typography>
                            </Box>

                            {!auth?.user && (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                    <Button
                                        component={Link}
                                        href={route('register')}
                                        variant="contained"
                                        color="inherit"
                                        size="large"
                                        sx={{ minWidth: 200 }}
                                    >
                                        Sign Up Now
                                    </Button>
                                    <Button
                                        component={Link}
                                        href={route('login')}
                                        variant="outlined"
                                        color="inherit"
                                        size="large"
                                        sx={{ minWidth: 200, borderColor: 'currentColor' }}
                                    >
                                        Already a Member?
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{ py: 4, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Container maxWidth="lg">
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                © 2026 Project Tracker. Built with{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                    ❤️
                                </Box>{' '}
                                using Laravel, React, and Material UI.
                            </Typography>
                            <Stack direction="row" spacing={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Not authenticated
                                </Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
