import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function Show({ task }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            default:
                return 'info';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#d4af37' }}>
                        Task Details
                    </Typography>
                    <Link href={route('tasks.index')}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                borderColor: 'rgba(212, 175, 55, 0.2)',
                                color: '#d4af37',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#d4af37',
                                    backgroundColor: 'rgba(46,125,50,0.04)',
                                },
                            }}
                        >
                            Back to Tasks
                        </Button>
                    </Link>
                </Box>
            }
        >
            <Head title={`Task: ${task.title}`} />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                        <Typography variant="h4" gutterBottom sx={{ color: '#d4af37', fontWeight: 600 }}>
                            {task.title}
                        </Typography>
                        <Link href={route('tasks.edit', task.id)}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                }}
                            >
                                Edit Task
                            </Button>
                        </Link>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1">
                            {task.description || 'No description provided'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Priority
                            </Typography>
                            <Chip
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Status
                            </Typography>
                            <Chip
                                label={task.status.replace('_', ' ')}
                                color={getStatusColor(task.status)}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Project
                        </Typography>
                        <Link href={route('projects.show', task.project.id)}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#d4af37',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    mt: 1,
                                }}
                            >
                                {task.project?.title}
                            </Typography>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
