import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Box,
    Chip,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';

export default function Index({ projects }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Link href={route('dashboard')}>
                            <Button
                                variant="text"
                                sx={{
                                    color: '#2e7d32',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#2e7d32' }}>
                            My Projects
                        </Typography>
                    </Box>
                    <Link href={route('projects.create')}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#2e7d32',
                                '&:hover': { backgroundColor: '#1b5e20' },
                                textTransform: 'none',
                                borderRadius: 2,
                            }}
                        >
                            New Project
                        </Button>
                    </Link>
                </Box>
            }
        >
            <Head title="Projects" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {projects.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 8, border: '1px solid #a5d6a7' }}>
                        <CardContent>
                            <FolderIcon sx={{ fontSize: 80, color: '#a5d6a7', mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
                                No Projects Yet
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Create your first project to get started!
                            </Typography>
                            <Link href={route('projects.create')}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' },
                                        textTransform: 'none',
                                    }}
                                >
                                    Create Project
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease-in-out',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #a5d6a7',
                                        borderRadius: 2,
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(46,125,50,0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ fontWeight: 600, color: '#2e7d32' }}
                                        >
                                            {project.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {project.description || 'No description'}
                                        </Typography>
                                        <Chip
                                            label={`${project.tasks?.length || 0} Tasks`}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                border: '1px solid #a5d6a7',
                                            }}
                                        />
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <Link href={route('projects.show', project.id)}>
                                            <IconButton size="small" sx={{ color: '#2e7d32' }}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Link>
                                        <Box>
                                            <Link href={route('projects.edit', project.id)}>
                                                <IconButton size="small" sx={{ color: '#4caf50' }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(project.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
