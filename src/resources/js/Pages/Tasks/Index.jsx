import AuthHeader from '@/Components/AuthHeader';
import { router, useForm, usePage } from '@inertiajs/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

export default function TasksIndex({ project, tasks }) {
    const { flash } = usePage().props;
    const createForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });
    const [editingId, setEditingId] = useState(null);
    const editForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const createTask = (event) => {
        event.preventDefault();
        createForm.post(`/projects/${project.id}/tasks`, {
            onSuccess: () =>
                createForm.reset({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'pending',
                }),
        });
    };

    const startEdit = (task) => {
        setEditingId(task.id);
        editForm.setData({
            title: task.title,
            description: task.description ?? '',
            priority: task.priority,
            status: task.status,
        });
    };

    const updateTask = (event) => {
        event.preventDefault();
        editForm.put(`/tasks/${editingId}`, {
            onSuccess: () => {
                setEditingId(null);
                editForm.reset({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'pending',
                });
            },
        });
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                py: 5,
                px: { xs: 1.5, sm: 2.5 },
                minHeight: '100vh',
                background:
                    'linear-gradient(180deg, rgba(244,241,234,0.65) 0%, rgba(229,241,247,0.65) 100%)',
                borderRadius: 6,
            }}
        >
            <AuthHeader title={`${project.title} Tasks`} />
            {flash?.status ? <Alert sx={{ mb: 2 }}>{flash.status}</Alert> : null}
            <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 3 }}>
                <Button variant="outlined" onClick={() => router.get('/projects')}>
                    Back to Projects
                </Button>
            </Stack>

            <Card sx={{ mb: 3, borderRadius: 5 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DoneAllOutlinedIcon fontSize="small" />
                        Add Task
                    </Typography>
                    <Box component="form" onSubmit={createTask}>
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
                                minRows={2}
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                error={Boolean(createForm.errors.description)}
                                helperText={createForm.errors.description}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    label="Priority"
                                    value={createForm.data.priority}
                                    onChange={(e) => createForm.setData('priority', e.target.value)}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={createForm.data.status}
                                    onChange={(e) => createForm.setData('status', e.target.value)}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={createForm.processing}
                                startIcon={<AddCircleOutlineIcon />}
                            >
                                Save Task
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            <Stack spacing={2}>
                {tasks.map((task) => (
                    <Card key={task.id} sx={{ borderRadius: 4 }}>
                        <CardContent>
                            {editingId === task.id ? (
                                <Box component="form" onSubmit={updateTask}>
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
                                            minRows={2}
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            error={Boolean(editForm.errors.description)}
                                            helperText={editForm.errors.description}
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel>Priority</InputLabel>
                                            <Select
                                                label="Priority"
                                                value={editForm.data.priority}
                                                onChange={(e) => editForm.setData('priority', e.target.value)}
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                label="Status"
                                                value={editForm.data.status}
                                                onChange={(e) => editForm.setData('status', e.target.value)}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                            </Select>
                                        </FormControl>
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
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography sx={{ my: 1 }} color="text.secondary">
                                        {task.description || 'No description'}
                                    </Typography>
                                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                        <Chip
                                            label={`Priority: ${task.priority}`}
                                            color={
                                                task.priority === 'high'
                                                    ? 'error'
                                                    : task.priority === 'medium'
                                                        ? 'secondary'
                                                        : 'primary'
                                            }
                                        />
                                        <Chip
                                            label={`Status: ${task.status}`}
                                            color={task.status === 'completed' ? 'success' : 'default'}
                                        />
                                    </Stack>
                                </>
                            )}
                        </CardContent>
                        {editingId !== task.id && (
                            <CardActions sx={{ flexWrap: 'wrap', gap: 1, px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => startEdit(task)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SwapHorizOutlinedIcon />}
                                    onClick={() => router.post(`/tasks/${task.id}/toggle-status`)}
                                >
                                    Toggle Status
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() => {
                                        if (window.confirm('Delete this task?')) {
                                            router.delete(`/tasks/${task.id}`);
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
            {tasks.length === 0 ? (
                <Card sx={{ mt: 2, borderRadius: 4 }}>
                    <CardContent>
                        <Typography color="text.secondary">No tasks yet. Add a task for this project.</Typography>
                    </CardContent>
                </Card>
            ) : null}
        </Container>
    );
}
