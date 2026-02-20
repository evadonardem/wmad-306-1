import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useThemeMode } from '@/Components/ThemeProvider';
import { Head, Link } from '@inertiajs/react';
import { Container, Paper, Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Folder, Assignment, Settings } from '@mui/icons-material';

function Dashboard() {
    const { styles, mode } = useThemeMode();
    const isPro = mode === 'professional';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-12">
                <Container maxWidth="md" sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{
                                height: '100%',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
                                    borderColor: 'rgba(212, 175, 55, 0.4)',
                                },
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Folder sx={{ fontSize: 40, color: '#d4af37', mb: 2 }} />
                                    <Typography sx={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        mb: 1,
                                    }}>
                                        {isPro ? 'My Projects' : '📁 My Projects'}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '13px',
                                        color: '#1a1a1a',
                                    }}>
                                        {isPro ? 'View and manage all your projects' : 'Organize your work'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Link href={route('projects.index')}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: '#d4af37',
                                                color: '#1a1a1a',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                '&:hover': {
                                                    background: '#e6c550',
                                                },
                                            }}
                                        >
                                            View Projects
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{
                                height: '100%',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
                                    borderColor: 'rgba(212, 175, 55, 0.4)',
                                },
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Assignment sx={{ fontSize: 40, color: '#d4af37', mb: 2 }} />
                                    <Typography sx={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        mb: 1,
                                    }}>
                                        {isPro ? 'My Tasks' : '✓ My Tasks'}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '13px',
                                        color: '#1a1a1a',
                                    }}>
                                        {isPro ? 'Track and manage your tasks' : 'Stay on top of your work'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Link href={route('tasks.index')}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: '#d4af37',
                                                color: '#1a1a1a',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                '&:hover': {
                                                    background: '#e6c550',
                                                },
                                            }}
                                        >
                                            View Tasks
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{
                                height: '100%',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
                                    borderColor: 'rgba(212, 175, 55, 0.4)',
                                },
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Settings sx={{ fontSize: 40, color: '#d4af37', mb: 2 }} />
                                    <Typography sx={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        mb: 1,
                                    }}>
                                        {isPro ? 'Settings' : '⚙️ Settings'}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '13px',
                                        color: '#1a1a1a',
                                    }}>
                                        {isPro ? 'Manage your account settings' : 'Control your profile'}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Link href={route('profile.edit')}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: '#d4af37',
                                                color: '#1a1a1a',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                '&:hover': {
                                                    background: '#e6c550',
                                                },
                                            }}
                                        >
                                            Go to Settings
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;
