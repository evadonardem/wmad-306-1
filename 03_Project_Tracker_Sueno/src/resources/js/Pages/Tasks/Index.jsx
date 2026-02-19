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
import AssignmentIcon from '@mui/icons-material/Assignment';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export default function Index({ tasks, projects }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', id));
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route('tasks.toggle-status', id));
    };

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
                <Box display="flex" justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Link href={route('dashboard')}>
                            <Button
                                variant="text"
                                sx={{
                                    color: '#d4af37',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#d4af37' }}>
                            My Tasks
                        </Typography>
                    </Box>
                    <Link href={route('tasks.create')}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#d4af37',
                                '&:hover': { backgroundColor: '#c9995d' },
                                textTransform: 'none',
                                borderRadius: 2,
                            }}
                        >
                            New Task
                        </Button>
                    </Link>
                </Box>
            }
        >
            <Head title="Tasks" />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {tasks.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 8, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <CardContent>
                            <AssignmentIcon sx={{ fontSize: 80, color: 'rgba(212, 175, 55, 0.2)', mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ color: '#1a1a1a' }}>
                                No Tasks Yet
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Create your first task to get started!
                            </Typography>
                            <Link href={route('tasks.create')}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        '&:hover': { backgroundColor: '#c9995d' },
                                        textTransform: 'none',
                                    }}
                                >
                                    Create Task
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {tasks.map((task) => (
                            <Grid item xs={12} sm={6} md={4} key={task.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease-in-out',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid rgba(212, 175, 55, 0.2)',
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
                                            sx={{ fontWeight: 600, color: '#d4af37' }}
                                        >
                                            {task.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {task.description || 'No description'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                color={getPriorityColor(task.priority)}
                                            />
                                            <Chip
                                                label={task.status.replace('_', ' ')}
                                                size="small"
                                                color={getStatusColor(task.status)}
                                            />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Project: {task.project?.title}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#d4af37' }}
                                            onClick={() => handleToggleStatus(task.id)}
                                            title="Toggle Status"
                                        >
                                            <ToggleOnIcon />
                                        </IconButton>
                                        <Box>
                                            <Link href={route('tasks.edit', task.id)}>
                                                <IconButton size="small" sx={{ color: '#d4af37' }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(task.id)}
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
