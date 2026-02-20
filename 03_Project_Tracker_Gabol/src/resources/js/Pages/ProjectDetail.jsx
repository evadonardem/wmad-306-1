import React, { useState } from 'react';
import {
    Container,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    Dialog,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Paper,
    LinearProgress,
    Checkbox,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as BackIcon,
    CheckCircle as CompleteIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

export default function ProjectDetail({ project: initialProject, tasks: initialTasks }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
    });

    const handleOpenDialog = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                due_date: task.due_date,
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                due_date: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTask(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingTask) {
                await axios.put(`/projects/${initialProject.id}/tasks/${editingTask.id}`, formData);
            } else {
                await axios.post(`/projects/${initialProject.id}/tasks`, formData);
            }
            router.reload();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/projects/${initialProject.id}/tasks/${taskId}`);
                router.reload();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleToggleTask = async (task) => {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        try {
            await axios.put(`/projects/${initialProject.id}/tasks/${task.id}`, {
                ...task,
                status: newStatus,
            });
            router.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'success',
            medium: 'warning',
            high: 'error',
            urgent: 'error',
        };
        return colors[priority] || 'default';
    };

    const getStatusColor = (status) => {
        const colors = {
            todo: 'default',
            in_progress: 'info',
            completed: 'success',
            on_hold: 'warning',
        };
        return colors[status] || 'default';
    };

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return (
        <AuthenticatedLayout>
            <Head title={initialProject.name} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Link href="/projects">
                    <Button startIcon={<BackIcon />} sx={{ mb: 2 }}>
                        Back to Projects
                    </Button>
                </Link>

                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {initialProject.name}
                            </Typography>
                            <Typography variant="body1">{initialProject.description}</Typography>
                        </Box>
                        <Chip label={initialProject.status} sx={{ color: 'white' }} />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Progress: {completedTasks}/{tasks.length} tasks completed
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progressPercentage}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#fff',
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {Math.round(progressPercentage)}% Complete
                        </Typography>
                    </Box>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        ✅ Tasks ({tasks.length})
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Task
                    </Button>
                </Box>

                {tasks.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h6" color="textSecondary">
                            No tasks yet. Create your first task!
                        </Typography>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {tasks.map(task => (
                            <Card
                                key={task.id}
                                sx={{
                                    opacity: task.status === 'completed' ? 0.7 : 1,
                                    transition: 'all 0.2s',
                                    '&:hover': { boxShadow: 3 },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                                        <Checkbox
                                            checked={task.status === 'completed'}
                                            onChange={() => handleToggleTask(task)}
                                            icon={<CompleteIcon />}
                                            checkedIcon={<CompleteIcon />}
                                            sx={{ mt: 0.5 }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                    mb: 1,
                                                }}
                                            >
                                                {task.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                {task.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={task.status.replace('_', ' ')}
                                                    color={getStatusColor(task.status)}
                                                    size="small"
                                                />
                                                <Chip
                                                    label={task.priority}
                                                    color={getPriorityColor(task.priority)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                {task.due_date && (
                                                    <Chip
                                                        label={`📅 ${task.due_date}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleOpenDialog(task)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Stack>
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </Typography>

                        <TextField
                            fullWidth
                            label="Task Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                label="Status"
                            >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="on_hold">On Hold</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                label="Priority"
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="date"
                            label="Due Date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleInputChange}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                {editingTask ? 'Update' : 'Create'}
                            </Button>
                        </Box>
                    </Box>
                </Dialog>
            </Container>
        </AuthenticatedLayout>
    );
}
