import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Checkbox,
    Container,
    Divider,
    FormControl,
    InputLabel,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export default function Show({ project, tasks }) {
    const theme = useTheme();
    const [editingProject, setEditingProject] = useState(false);
    const [projectDraft, setProjectDraft] = useState({
        title: project.title ?? '',
        description: project.description ?? '',
    });

    const {
        data: taskData,
        setData: setTaskData,
        processing: creatingTask,
        errors: taskErrors,
        reset: resetTask,
        post: postTask,
    } = useForm({
        title: '',
        description: '',
        priority: 'medium',
    });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskDraft, setTaskDraft] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: false,
    });

    const taskById = useMemo(() => {
        const map = new Map();
        tasks.forEach((t) => map.set(t.id, t));
        return map;
    }, [tasks]);

    const unfinishedTasks = useMemo(
        () => tasks.filter((task) => !task.status),
        [tasks],
    );

    const finishedTasks = useMemo(
        () => tasks.filter((task) => Boolean(task.status)),
        [tasks],
    );

    const createTask = (e) => {
        e.preventDefault();
        postTask(route('projects.tasks.store', project.id), {
            onSuccess: () => resetTask(),
        });
    };

    const startTaskEdit = (taskId) => {
        const t = taskById.get(taskId);
        if (!t) return;

        setEditingTaskId(taskId);
        setTaskDraft({
            title: t.title ?? '',
            description: t.description ?? '',
            priority: t.priority ?? 'medium',
            status: Boolean(t.status),
        });
    };

    const cancelTaskEdit = () => {
        setEditingTaskId(null);
        setTaskDraft({
            title: '',
            description: '',
            priority: 'medium',
            status: false,
        });
    };

    const updateProject = () => {
        router.patch(route('projects.update', project.id), projectDraft, {
            preserveScroll: true,
            onSuccess: () => setEditingProject(false),
        });
    };

    const toggleTaskStatus = (taskId) => {
        router.post(route('tasks.toggleStatus', taskId), {}, {
            preserveScroll: true,
        });
    };

    const updateTask = (taskId) => {
        router.patch(route('tasks.update', taskId), taskDraft, {
            preserveScroll: true,
            onSuccess: () => cancelTaskEdit(),
        });
    };

    const deleteTask = (taskId) => {
        if (!confirm('Delete this task?')) return;

        router.delete(route('tasks.destroy', taskId), {
            preserveScroll: true,
        });
    };

    const scrollToNewTaskForm = () => {
        const target = document.getElementById('new-task');
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const input = document.getElementById('new-task-title');
        if (input) {
            requestAnimationFrame(() => input.focus());
        }
    };

    const renderTaskCard = (task) => {
        const isEditing = editingTaskId === task.id;

        return (
            <Card
                key={task.id}
                variant="outlined"
            >
                {isEditing ? (
                    <CardContent>
                        <Stack spacing={2}>
                            <TextField
                                label="Title"
                                value={taskDraft.title}
                                onChange={(e) =>
                                    setTaskDraft((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={taskDraft.description}
                                onChange={(e) =>
                                    setTaskDraft((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                fullWidth
                                multiline
                                minRows={3}
                            />
                            <FormControl fullWidth>
                                <InputLabel id={`priority-${task.id}`}>
                                    Priority
                                </InputLabel>
                                <Select
                                    labelId={`priority-${task.id}`}
                                    label="Priority"
                                    value={taskDraft.priority}
                                    onChange={(e) =>
                                        setTaskDraft((prev) => ({
                                            ...prev,
                                            priority: e.target.value,
                                        }))
                                    }
                                >
                                    {priorityOptions.map((opt) => (
                                        <MenuItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                <Button onClick={cancelTaskEdit}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        updateTask(task.id)
                                    }
                                    startIcon={<Pencil size={18} />}
                                >
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                ) : (
                    <Box sx={{ position: 'relative' }}>
                        <CardActionArea
                            sx={{
                                borderRadius: 1,
                                '&:hover .edit-task-overlay': {
                                    opacity: 1,
                                    transform: 'translate(-50%, -50%)',
                                },
                            }}
                            onClick={() => startTaskEdit(task.id)}
                        >
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <Checkbox
                                            checked={Boolean(task.status)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() =>
                                                toggleTaskStatus(task.id)
                                            }
                                        />
                                        <Typography
                                            sx={{
                                                textDecoration:
                                                    task.status
                                                        ? 'line-through'
                                                        : 'none',
                                            }}
                                            variant="subtitle1"
                                        >
                                            {task.title}
                                        </Typography>

                                        <Box sx={{ flex: 1 }} />

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {task.priority}
                                        </Typography>
                                    </Stack>

                                    {task.description ? (
                                        <Typography color="text.secondary">
                                            {task.description}
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </CardContent>

                            <Box
                                className="edit-task-overlay"
                                sx={(theme) => ({
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, calc(-50% + 6px))',
                                    width: 34,
                                    height: 34,
                                    borderRadius: '50%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                    opacity: 0,
                                    transition: 'all 180ms ease',
                                    pointerEvents: 'none',
                                })}
                            >
                                <Pencil size={16} />
                            </Box>
                        </CardActionArea>
                    </Box>
                )}

                <CardActions sx={{ px: 2, pb: 2 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ width: '100%' }}
                        justifyContent="flex-end"
                    >
                        {!isEditing ? (
                            <Tooltip title="Delete task">
                                <IconButton
                                    color="error"
                                    onClick={() =>
                                        deleteTask(task.id)
                                    }
                                    aria-label="Delete task"
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </Stack>
                </CardActions>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <Button
                    component={Link}
                    href={route('projects.index')}
                    startIcon={<ArrowLeft size={18} />}
                >
                    Back
                </Button>
            }
        >
            <Head title={project.title} />

            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        opacity: 0.45,
                        backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(
                            theme.palette.primary.main,
                            0.22,
                        )} 0%, transparent 35%), radial-gradient(circle at 90% 30%, ${alpha(
                            theme.palette.secondary.main,
                            0.18,
                        )} 0%, transparent 40%), radial-gradient(circle at 35% 90%, ${alpha(
                            theme.palette.primary.main,
                            0.14,
                        )} 0%, transparent 45%)`,
                    }}
                />

                <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{project.title}</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={scrollToNewTaskForm}
                        >
                            Add Task
                        </Button>
                    </Stack>

                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">Project</Typography>
                                    <Button
                                        onClick={() =>
                                            setEditingProject((v) => !v)
                                        }
                                        startIcon={<Pencil size={18} />}
                                    >
                                        {editingProject ? 'Close' : 'Edit'}
                                    </Button>
                                </Stack>

                                {editingProject ? (
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Title"
                                            value={projectDraft.title}
                                            onChange={(e) =>
                                                setProjectDraft((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            required
                                            fullWidth
                                        />

                                        <TextField
                                            label="Description"
                                            value={projectDraft.description}
                                            onChange={(e) =>
                                                setProjectDraft((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            fullWidth
                                            multiline
                                            minRows={3}
                                        />

                                        <Stack direction="row" justifyContent="flex-end">
                                            <Button
                                                variant="contained"
                                                onClick={updateProject}
                                                startIcon={<Pencil size={18} />}
                                            >
                                                Save
                                            </Button>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <>
                                        {project.description ? (
                                            <Typography color="text.secondary">
                                                {project.description}
                                            </Typography>
                                        ) : (
                                            <Typography color="text.secondary">
                                                No description.
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Divider />

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tasks
                            </Typography>

                            <Stack spacing={2}>
                                {tasks.length === 0 ? (
                                    <Typography color="text.secondary">
                                        No tasks yet.
                                    </Typography>
                                ) : (
                                    <>
                                        {unfinishedTasks.length > 0 ? (
                                            <>
                                                <Divider textAlign="left">
                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                        Unfinished
                                                    </Typography>
                                                </Divider>
                                                {unfinishedTasks.map(renderTaskCard)}
                                            </>
                                        ) : null}

                                        {finishedTasks.length > 0 ? (
                                            <>
                                                <Divider textAlign="left">
                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                        Finished
                                                    </Typography>
                                                </Divider>
                                                {finishedTasks.map(renderTaskCard)}
                                            </>
                                        ) : null}
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Divider />

                    <Card id="new-task">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                New task
                            </Typography>

                            <Box component="form" onSubmit={createTask}>
                                <Stack spacing={2}>
                                    <TextField
                                        id="new-task-title"
                                        label="Title"
                                        value={taskData.title}
                                        onChange={(e) =>
                                            setTaskData('title', e.target.value)
                                        }
                                        error={Boolean(taskErrors.title)}
                                        helperText={taskErrors.title}
                                        required
                                        fullWidth
                                    />

                                    <TextField
                                        label="Description"
                                        value={taskData.description}
                                        onChange={(e) =>
                                            setTaskData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        error={Boolean(taskErrors.description)}
                                        helperText={taskErrors.description}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="priority-label">
                                            Priority
                                        </InputLabel>
                                        <Select
                                            labelId="priority-label"
                                            label="Priority"
                                            value={taskData.priority}
                                            onChange={(e) =>
                                                setTaskData(
                                                    'priority',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {priorityOptions.map((opt) => (
                                                <MenuItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Plus size={18} />}
                                            disabled={creatingTask}
                                        >
                                            Add task
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
