import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Container, Paper, Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Folder, Assignment } from '@mui/icons-material';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight" style={{ color: '#2e7d32' }}>
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <Container maxWidth="md">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 6,
                            backgroundColor: '#ffffff',
                            border: '1px solid #a5d6a7',
                            borderRadius: 3,
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#2e7d32', mb: 2 }}>
                                Welcome to Project Tracker
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#666' }}>
                                Manage your projects and tasks from one place.
                            </Typography>
                        </Box>

                        <Paper
                            elevation={1}
                            sx={{
                                p: 4,
                                backgroundColor: '#e8f5e9',
                                border: '1px solid #a5d6a7',
                                borderRadius: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1, fontWeight: 500 }}>
                                You are logged in!
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8 }}>
                                Use the navigation cards below to get started with your projects and tasks.
                            </Typography>
                        </Paper>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #a5d6a7',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(46,125,50,0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                                        <Folder sx={{ fontSize: 48, color: '#2e7d32', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1, fontWeight: 600 }}>
                                            My Projects
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            View and manage your projects
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                        <Link href={route('projects.index')}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#2e7d32',
                                                    '&:hover': { backgroundColor: '#1b5e20' },
                                                    textTransform: 'none',
                                                }}
                                            >
                                                View Projects
                                            </Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #a5d6a7',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(46,125,50,0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                                        <Assignment sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1, fontWeight: 600 }}>
                                            My Tasks
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            Track and complete your tasks
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                        <Link href={route('tasks.index')}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#2e7d32',
                                                    '&:hover': { backgroundColor: '#1b5e20' },
                                                    textTransform: 'none',
                                                }}
                                            >
                                                View Tasks
                                            </Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </div>
        </AuthenticatedLayout>
    );
}
