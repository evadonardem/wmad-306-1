import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    ArrowLeft,
    ListChecks,
    Pencil,
    Plus,
    RefreshCcw,
    SlidersHorizontal,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const statusLabel = {
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done',
};

const priorityLabel = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export default function TasksIndex({ project, tasks }) {
    const [editingTask, setEditingTask] = useState(null);

    const form = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
    });

    const editForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('projects.tasks.store', project.id), {
            onSuccess: () => form.reset('title', 'description'),
        });
    };

    const toggle = (taskId) => {
        router.patch(route('tasks.toggle-status', taskId));
    };

    const openEdit = (task) => {
        setEditingTask(task);
        editForm.setData({
            title: task.title ?? '',
            description: task.description ?? '',
            priority: task.priority ?? 'medium',
            status: task.status ?? 'todo',
        });
    };

    const closeEdit = () => {
        setEditingTask(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingTask) return;

        editForm.put(route('tasks.update', editingTask.id), {
            onSuccess: () => closeEdit(),
        });
    };

    const remove = (taskId) => {
        router.delete(route('tasks.destroy', taskId));
    };

    return (
        <AuthenticatedLayout
            header={
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={(theme) => ({
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.14),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                        })}
                    >
                        <ListChecks size={18} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" fontWeight={900}>
                            Tasks
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {project.title}
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href={route('projects.index')}
                        variant="outlined"
                        startIcon={<ArrowLeft size={18} />}
                    >
                        Projects
                    </Button>
                </Stack>
            }
        >
            <Head title={`Tasks - ${project.title}`} />

            <Stack spacing={3}>
                <Paper component="form" onSubmit={submit} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            error={Boolean(form.errors.title)}
                            helperText={form.errors.title}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            error={Boolean(form.errors.description)}
                            helperText={form.errors.description}
                        />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={form.data.priority}
                                onChange={(e) => form.setData('priority', e.target.value)}
                                error={Boolean(form.errors.priority)}
                                helperText={form.errors.priority}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                error={Boolean(form.errors.status)}
                                helperText={form.errors.status}
                            >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="doing">Doing</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </TextField>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={form.processing}
                                sx={{ whiteSpace: 'nowrap' }}
                                startIcon={<Plus size={18} />}
                            >
                                Add Task
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                <Paper sx={{ overflow: 'hidden' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(tasks ?? []).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2">
                                            No tasks yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (tasks ?? []).map((task) => (
                                    <TableRow key={task.id} hover>
                                        <TableCell>
                                            <Typography fontWeight={700}>
                                                {task.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{task.description ?? ''}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={priorityLabel[task.priority] ?? task.priority}
                                                icon={<SlidersHorizontal size={14} />}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={statusLabel[task.status] ?? task.status}
                                                icon={<ListChecks size={14} />}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => openEdit(task)}
                                                    startIcon={<Pencil size={16} />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => toggle(task.id)}
                                                    startIcon={<RefreshCcw size={16} />}
                                                >
                                                    Toggle Status
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => remove(task.id)}
                                                    startIcon={<Trash2 size={16} />}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>

            <Dialog open={Boolean(editingTask)} onClose={closeEdit} fullWidth>
                <DialogTitle>Edit Task</DialogTitle>
                <Box component="form" onSubmit={submitEdit}>
                    <DialogContent>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData('title', e.target.value)
                                }
                                error={Boolean(editForm.errors.title)}
                                helperText={editForm.errors.title}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                error={Boolean(editForm.errors.description)}
                                helperText={editForm.errors.description}
                            />
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                            >
                                <TextField
                                    select
                                    fullWidth
                                    label="Priority"
                                    value={editForm.data.priority}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'priority',
                                            e.target.value,
                                        )
                                    }
                                    error={Boolean(editForm.errors.priority)}
                                    helperText={editForm.errors.priority}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </TextField>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    value={editForm.data.status}
                                    onChange={(e) =>
                                        editForm.setData('status', e.target.value)
                                    }
                                    error={Boolean(editForm.errors.status)}
                                    helperText={editForm.errors.status}
                                >
                                    <MenuItem value="todo">To Do</MenuItem>
                                    <MenuItem value="doing">Doing</MenuItem>
                                    <MenuItem value="done">Done</MenuItem>
                                </TextField>
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEdit}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={editForm.processing}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </AuthenticatedLayout>
    );
}
