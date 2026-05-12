import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { Article, Add, School } from '@mui/icons-material';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Student Article Publication Platform
                </h2>
            }
        >
            <Head title="Dashboard" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                    Welcome to the Student Article Publication Platform!
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Article sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    My Articles
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Create, edit, and manage your articles. Share your knowledge with the community.
                                </Typography>
                                <Link href={route('articles.index')}>
                                    <Button variant="contained" fullWidth>
                                        View My Articles
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Add sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Create New Article
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Start writing your next great article. Use our rich text editor to format your content.
                                </Typography>
                                <Link href={route('articles.create')}>
                                    <Button variant="outlined" fullWidth>
                                        Create Article
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <School sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Student Article Publication Platform
                                </Typography>
                                <Typography variant="body1">
                                    This platform allows students to create, publish, and share articles.
                                    Use the rich text editor to format your content beautifully.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </AuthenticatedLayout>
    );
}
