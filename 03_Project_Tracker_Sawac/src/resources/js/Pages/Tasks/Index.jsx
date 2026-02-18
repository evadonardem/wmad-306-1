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
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleIcon from '@mui/icons-material/SwapHoriz';

const PRIORITY_COLORS = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
};

const STATUS_COLORS = {
    pending: '#9c27b0',
    'in-progress': '#2196f3',
    completed: '#4caf50',
};

export default function Index({ project, tasks }) {
    const { flash } = usePage().props;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleDeleteOpen = (task) => {
        setTaskToDelete(task);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setTaskToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (taskToDelete) {
            router.delete(route('tasks.destroy', [project.id, taskToDelete.id]), {
                onSuccess: handleDeleteClose,
            });
        }
    };

    const handleToggleStatus = (task) => {
        router.post(route('tasks.toggle-status', [project.id, task.id]));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${project.title} - Tasks`} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Link href={route('projects.index')}>
                        <Button startIcon={<ArrowBackIcon />}>
                            Back to Projects
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" component="h1">
                            {project.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {project.description}
                        </Typography>
                    </Box>
                    <Link href={route('tasks.create', project.id)}>
                        <Button variant="contained" startIcon={<AddIcon />}>
                            New Task
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

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>Title</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {task.title}
                                            </Typography>
                                            {task.description && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {task.description.substring(0, 50)}...
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                sx={{ backgroundColor: PRIORITY_COLORS[task.priority], color: 'white' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status}
                                                size="small"
                                                sx={{ backgroundColor: STATUS_COLORS[task.status], color: 'white' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<ToggleIcon />}
                                                onClick={() => handleToggleStatus(task)}
                                                sx={{ mr: 1 }}
                                            >
                                                Toggle
                                            </Button>
                                            <Link href={route('tasks.edit', [project.id, task.id])}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<EditIcon />}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteOpen(task)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            No tasks yet. Create one to get started!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
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
