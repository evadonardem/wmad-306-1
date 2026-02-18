import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Container,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Index({ projects }) {
    const { flash } = usePage().props;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const handleDeleteOpen = (project) => {
        setProjectToDelete(project);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setProjectToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            router.delete(route('projects.destroy', projectToDelete.id), {
                onSuccess: handleDeleteClose,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Projects" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Projects
                    </Typography>
                    <Link href={route('projects.create')}>
                        <Button variant="contained" startIcon={<AddIcon />}>
                            New Project
                        </Button>
                    </Link>
                </Box>

                {flash?.success && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 1 }}>
                        <Typography sx={{ color: '#155724' }}>
                            {flash.success}
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={3}>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" paragraph>
                                            {project.description || 'No description'}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Tasks: {project.tasks?.length || 0}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Link href={route('tasks.index', project.id)}>
                                            <Button size="small" startIcon={<VisibilityIcon />}>
                                                View Tasks
                                            </Button>
                                        </Link>
                                        <Link href={route('projects.edit', project.id)}>
                                            <Button size="small" startIcon={<EditIcon />}>
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteOpen(project)}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="textSecondary" paragraph>
                                    No projects yet. Create one to get started!
                                </Typography>
                                <Link href={route('projects.create')}>
                                    <Button variant="contained" startIcon={<AddIcon />}>
                                        Create Project
                                    </Button>
                                </Link>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </AuthenticatedLayout>
    );
}
