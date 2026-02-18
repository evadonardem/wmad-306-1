import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Container, Button, Box, Typography, Card, CardContent } from '@mui/material';
import ProjectsIcon from '@mui/icons-material/FolderOpen';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <Container maxWidth="md" sx={{ py: 12 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome to Project Tracker
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            You're logged in! Start managing your projects and tasks.
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Link href={route('projects.index')}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ProjectsIcon />}
                                >
                                    Go to Projects
                                </Button>
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
