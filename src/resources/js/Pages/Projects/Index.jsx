import AuthHeader from '@/Components/AuthHeader';
import { router, useForm, usePage } from '@inertiajs/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

export default function ProjectsIndex({ projects }) {
    const { flash } = usePage().props;
    const createForm = useForm({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const editForm = useForm({ title: '', description: '' });

    const createProject = (event) => {
        event.preventDefault();
        createForm.post('/projects', {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (project) => {
        setEditingId(project.id);
        editForm.setData({
            title: project.title,
            description: project.description ?? '',
        });
    };

    const updateProject = (event) => {
        event.preventDefault();
        editForm.put(`/projects/${editingId}`, {
            onSuccess: () => {
                setEditingId(null);
                editForm.reset();
            },
        });
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 5,
                px: { xs: 1.5, sm: 2.5 },
                minHeight: '100vh',
                background:
                    'linear-gradient(180deg, rgba(244,241,234,0.65) 0%, rgba(229,241,247,0.65) 100%)',
                borderRadius: 6,
            }}
        >
            <AuthHeader title="Project Tracker" />
            {flash?.status ? <Alert sx={{ mb: 2 }}>{flash.status}</Alert> : null}

            <Card sx={{ mb: 4, borderRadius: 5 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddCircleOutlineIcon fontSize="small" />
                        Add Project
                    </Typography>
                    <Box component="form" onSubmit={createProject}>
                        <Stack spacing={2}>
                            <TextField
                                label="Title"
                                value={createForm.data.title}
                                onChange={(e) => createForm.setData('title', e.target.value)}
                                error={Boolean(createForm.errors.title)}
                                helperText={createForm.errors.title}
                                required
                            />
                            <TextField
                                label="Description"
                                multiline
                                minRows={3}
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                error={Boolean(createForm.errors.description)}
                                helperText={createForm.errors.description}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={createForm.processing}
                                startIcon={<AddCircleOutlineIcon />}
                            >
                                Save Project
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            <Stack spacing={2}>
                {projects.map((project) => (
                    <Card key={project.id} sx={{ borderRadius: 4 }}>
                        <CardContent>
                            {editingId === project.id ? (
                                <Box component="form" onSubmit={updateProject}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Title"
                                            value={editForm.data.title}
                                            onChange={(e) => editForm.setData('title', e.target.value)}
                                            error={Boolean(editForm.errors.title)}
                                            helperText={editForm.errors.title}
                                            required
                                        />
                                        <TextField
                                            label="Description"
                                            multiline
                                            minRows={3}
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            error={Boolean(editForm.errors.description)}
                                            helperText={editForm.errors.description}
                                        />
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={editForm.processing}
                                                startIcon={<EditOutlinedIcon />}
                                            >
                                                Update
                                            </Button>
                                            <Button variant="outlined" onClick={() => setEditingId(null)}>
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="h6">{project.title}</Typography>
                                    <Typography sx={{ mt: 1, mb: 1.5 }} color="text.secondary">
                                        {project.description || 'No description'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Tasks: {project.tasks_count}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                        {editingId !== project.id && (
                            <CardActions sx={{ flexWrap: 'wrap', gap: 1, px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ListAltOutlinedIcon />}
                                    onClick={() => router.get(`/projects/${project.id}/tasks`)}
                                >
                                    Open Tasks
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => startEdit(project)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() => {
                                        if (window.confirm('Delete this project and all tasks?')) {
                                            router.delete(`/projects/${project.id}`);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        )}
                    </Card>
                ))}
            </Stack>
            {projects.length === 0 ? (
                <Card sx={{ mt: 2, borderRadius: 4 }}>
                    <CardContent>
                        <Typography color="text.secondary">No projects yet. Create your first project above.</Typography>
                    </CardContent>
                </Card>
            ) : null}
        </Container>
    );
}
