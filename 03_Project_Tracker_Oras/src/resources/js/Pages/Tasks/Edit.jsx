import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Edit({ task, projects }) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: task.project_id || '',
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#2e7d32' }}>
                    Edit Task
                </Typography>
            }
        >
            <Head title="Edit Task" />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid #a5d6a7',
                        borderRadius: 2,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Project"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                                error={!!errors.project_id}
                                helperText={errors.project_id}
                                required
                            >
                                <MenuItem value="">Select a project</MenuItem>
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Task Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={4}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                error={!!errors.priority}
                                helperText={errors.priority}
                                required
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                error={!!errors.status}
                                helperText={errors.status}
                                required
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Link href={route('tasks.index')}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        borderColor: '#a5d6a7',
                                        color: '#2e7d32',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#2e7d32',
                                            backgroundColor: 'rgba(46,125,50,0.04)',
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    '&:hover': { backgroundColor: '#1b5e20' },
                                    textTransform: 'none',
                                }}
                            >
                                Update Task
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
