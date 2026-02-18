import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Button,
    TextField,
    Box,
    Typography,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Edit({ project, task }) {
    const { data, setData, put, errors, processing } = useForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('tasks.update', [project.id, task.id]));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${task.title}`} />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Link href={route('tasks.index', project.id)}>
                        <Button startIcon={<ArrowBackIcon />}>
                            Back to Tasks
                        </Button>
                    </Link>
                </Box>

                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Edit Task
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Project: {project.title}
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Task Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                                margin="normal"
                                multiline
                                rows={4}
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    label="Priority"
                                    error={!!errors.priority}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    label="Status"
                                    error={!!errors.status}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                </Select>
                            </FormControl>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Update Task
                                </Button>
                                <Link href={route('tasks.index', project.id)}>
                                    <Button variant="outlined">
                                        Cancel
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
