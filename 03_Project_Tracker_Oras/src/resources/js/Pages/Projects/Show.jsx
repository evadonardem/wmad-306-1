import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function Show({ project }) {
    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', taskId));
        }
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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#2e7d32' }}>
                        Project Details
                    </Typography>
                    <Link href={route('projects.index')}>
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
                            Back to Projects
                        </Button>
                    </Link>
                </Box>
            }
        >
            <Head title={`Project: ${project.title}`} />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid #a5d6a7',
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 600 }}>
                                {project.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {project.description || 'No description provided'}
                            </Typography>
                        </Box>
                        <Link href={route('projects.edit', project.id)}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    '&:hover': { backgroundColor: '#1b5e20' },
                                    textTransform: 'none',
                                }}
                            >
                                Edit Project
                            </Button>
                        </Link>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" sx={{ color: '#333', fontWeight: 600 }}>
                                Tasks ({project.tasks?.length || 0})
                            </Typography>
                            <Link href={route('tasks.create')}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' },
                                        textTransform: 'none',
                                    }}
                                >
                                    New Task
                                </Button>
                            </Link>
                        </Box>

                        {project.tasks && project.tasks.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Priority</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {project.tasks.map((task) => (
                                            <TableRow key={task.id} hover>
                                                <TableCell>{task.title}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={task.priority}
                                                        color={getPriorityColor(task.priority)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={task.status.replace('_', ' ')}
                                                        color={getStatusColor(task.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Link href={route('tasks.edit', task.id)}>
                                                        <IconButton size="small" sx={{ color: '#4caf50' }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Link>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box textAlign="center" py={4}>
                                <Typography color="text.secondary" gutterBottom>
                                    No tasks yet
                                </Typography>
                                <Link href={route('tasks.create')}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        size="small"
                                        sx={{
                                            borderColor: '#a5d6a7',
                                            color: '#2e7d32',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Create First Task
                                    </Button>
                                </Link>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
