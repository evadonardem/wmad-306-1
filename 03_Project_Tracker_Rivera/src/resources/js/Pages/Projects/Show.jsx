import DraggableFab from '@/Components/DraggableFab';
import TaskMoLayout from '@/Layouts/TaskMoLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    MenuItem,
    Modal,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

export default function Show({ project, tasks }) {
    const [descriptionOpen, setDescriptionOpen] = useState(true);
    const [tab, setTab] = useState('low');

    const [projectEditOpen, setProjectEditOpen] = useState(false);
    const [taskCreateOpen, setTaskCreateOpen] = useState(false);
    const [taskEditOpen, setTaskEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const tasksForTab = useMemo(() => tasks?.[tab] ?? [], [tasks, tab]);

    const projectEditForm = useForm({
        title: project?.title ?? '',
        description: project?.description ?? '',
    });

    const taskCreateForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const taskEditForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const closeProjectEdit = () => {
        setProjectEditOpen(false);
        projectEditForm.clearErrors();
    };

    const closeTaskCreate = () => {
        setTaskCreateOpen(false);
        taskCreateForm.clearErrors();
    };

    const closeTaskEdit = () => {
        setTaskEditOpen(false);
        setEditingTask(null);
        taskEditForm.clearErrors();
    };

    const submitProjectEdit = (e) => {
        e.preventDefault();
        projectEditForm.put(route('projects.update', project.id), {
            onSuccess: closeProjectEdit,
        });
    };

    const destroyProject = () => {
        router.delete(route('projects.destroy', project.id));
    };

    const submitTaskCreate = (e) => {
        e.preventDefault();
        taskCreateForm.post(route('tasks.store', project.id), {
            onSuccess: () => {
                taskCreateForm.reset();
                closeTaskCreate();
            },
        });
    };

    const startTaskEdit = (task) => {
        setEditingTask(task);
        taskEditForm.setData({
            title: task?.title ?? '',
            description: task?.description ?? '',
            priority: task?.priority ?? 'medium',
            status: task?.status ?? 'pending',
        });
        setTaskEditOpen(true);
    };

    const submitTaskEdit = (e) => {
        e.preventDefault();
        if (!editingTask) return;

        taskEditForm.put(route('tasks.update', editingTask.id), {
            onSuccess: closeTaskEdit,
        });
    };

    const destroyTask = (task) => {
        router.delete(route('tasks.destroy', task.id));
    };

    const toggleTaskStatus = (task) => {
        router.post(route('tasks.toggleStatus', task.id));
    };

    return (
        <TaskMoLayout title={null}>
            <Head title={project?.title ?? 'Project'} />

            <div className="mx-auto max-w-4xl">
                <Paper
                    elevation={0}
                    className="taskmo-card p-6"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                            component={Link}
                            href={route('projects.index')}
                            startIcon={<ArrowBackIcon />}
                            variant="outlined"
                        >
                            Back
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                startIcon={<EditIcon />}
                                variant="outlined"
                                onClick={() => setProjectEditOpen(true)}
                            >
                                Edit
                            </Button>
                            <Button
                                startIcon={<DeleteIcon />}
                                variant="outlined"
                                color="error"
                                onClick={destroyProject}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="sticky top-[72px] z-10 taskmo-card p-4">
                            <div className="text-center text-3xl font-extrabold">
                                {project?.title}
                            </div>
                            {project?.description && (
                                <div className="mt-3 flex justify-center">
                                    <Button
                                        variant="text"
                                        onClick={() =>
                                            setDescriptionOpen((v) => !v)
                                        }
                                    >
                                        {descriptionOpen
                                            ? 'Hide description'
                                            : 'Show description'}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {descriptionOpen && project?.description && (
                            <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                                {project.description}
                            </div>
                        )}
                    </div>

                    <div className="mt-10 text-center">
                        <Typography variant="h5" className="font-extrabold">
                            Tasks
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-gray-600 dark:text-gray-300"
                        >
                            Manage tasks by priority.
                        </Typography>
                    </div>

                    <div className="mt-6">
                        <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            centered
                        >
                            <Tab value="low" label="Low" />
                            <Tab value="medium" label="Medium" />
                            <Tab value="high" label="High" />
                        </Tabs>

                        <div className="mt-6 space-y-4">
                            {tasksForTab.map((task) => (
                                <Paper
                                    key={task.id}
                                    elevation={0}
                                    className="taskmo-card p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="text-xl font-extrabold">
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    {task.description}
                                                </div>
                                            )}
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                Status: {task.status}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="contained"
                                                onClick={() => toggleTaskStatus(task)}
                                            >
                                                Toggle
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => startTaskEdit(task)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => destroyTask(task)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Paper>
                            ))}

                            {tasksForTab.length === 0 && (
                                <div className="text-center text-gray-600 dark:text-gray-300">
                                    No tasks in this category.
                                </div>
                            )}
                        </div>
                    </div>
                </Paper>
            </div>

            <DraggableFab
                icon={<AddIcon />}
                label="New Task"
                onClick={() => setTaskCreateOpen(true)}
            />

            <Modal open={projectEditOpen} onClose={closeProjectEdit}>
                <Box className="flex min-h-screen items-center justify-center p-6">
                    <Paper
                        className="taskmo-card w-full max-w-lg p-6"
                        elevation={0}
                    >
                        <Typography
                            variant="h6"
                            className="text-center font-extrabold"
                        >
                            Edit Project
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-center text-gray-600 dark:text-gray-300"
                        >
                            Update title and description.
                        </Typography>

                        <form
                            onSubmit={submitProjectEdit}
                            className="mt-6 grid gap-4"
                        >
                            <TextField
                                label="Title"
                                value={projectEditForm.data.title}
                                onChange={(e) =>
                                    projectEditForm.setData(
                                        'title',
                                        e.target.value
                                    )
                                }
                                error={Boolean(projectEditForm.errors.title)}
                                helperText={projectEditForm.errors.title}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={projectEditForm.data.description}
                                onChange={(e) =>
                                    projectEditForm.setData(
                                        'description',
                                        e.target.value
                                    )
                                }
                                error={Boolean(projectEditForm.errors.description)}
                                helperText={projectEditForm.errors.description}
                                multiline
                                minRows={3}
                                fullWidth
                            />

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={closeProjectEdit}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={projectEditForm.processing}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </Modal>

            <Modal open={taskCreateOpen} onClose={closeTaskCreate}>
                <Box className="flex min-h-screen items-center justify-center p-6">
                    <Paper
                        className="taskmo-card w-full max-w-lg p-6"
                        elevation={0}
                    >
                        <Typography
                            variant="h6"
                            className="text-center font-extrabold"
                        >
                            Create Task
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-center text-gray-600 dark:text-gray-300"
                        >
                            Add a task to this project.
                        </Typography>

                        <form
                            onSubmit={submitTaskCreate}
                            className="mt-6 grid gap-4"
                        >
                            <TextField
                                label="Title"
                                value={taskCreateForm.data.title}
                                onChange={(e) =>
                                    taskCreateForm.setData(
                                        'title',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskCreateForm.errors.title)}
                                helperText={taskCreateForm.errors.title}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={taskCreateForm.data.description}
                                onChange={(e) =>
                                    taskCreateForm.setData(
                                        'description',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskCreateForm.errors.description)}
                                helperText={taskCreateForm.errors.description}
                                multiline
                                minRows={3}
                                fullWidth
                            />
                            <TextField
                                label="Priority"
                                value={taskCreateForm.data.priority}
                                onChange={(e) =>
                                    taskCreateForm.setData(
                                        'priority',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskCreateForm.errors.priority)}
                                helperText={taskCreateForm.errors.priority}
                                fullWidth
                                select
                            >
                                <MenuItem value="low">low</MenuItem>
                                <MenuItem value="medium">medium</MenuItem>
                                <MenuItem value="high">high</MenuItem>
                            </TextField>
                            <TextField
                                label="Status"
                                value={taskCreateForm.data.status}
                                onChange={(e) =>
                                    taskCreateForm.setData(
                                        'status',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskCreateForm.errors.status)}
                                helperText={taskCreateForm.errors.status}
                                fullWidth
                                select
                            >
                                <MenuItem value="pending">pending</MenuItem>
                                <MenuItem value="completed">completed</MenuItem>
                            </TextField>

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={closeTaskCreate}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={taskCreateForm.processing}
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </Modal>

            <Modal open={taskEditOpen} onClose={closeTaskEdit}>
                <Box className="flex min-h-screen items-center justify-center p-6">
                    <Paper
                        className="taskmo-card w-full max-w-lg p-6"
                        elevation={0}
                    >
                        <Typography
                            variant="h6"
                            className="text-center font-extrabold"
                        >
                            Edit Task
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-center text-gray-600 dark:text-gray-300"
                        >
                            Update task details.
                        </Typography>

                        <form
                            onSubmit={submitTaskEdit}
                            className="mt-6 grid gap-4"
                        >
                            <TextField
                                label="Title"
                                value={taskEditForm.data.title}
                                onChange={(e) =>
                                    taskEditForm.setData(
                                        'title',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskEditForm.errors.title)}
                                helperText={taskEditForm.errors.title}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={taskEditForm.data.description}
                                onChange={(e) =>
                                    taskEditForm.setData(
                                        'description',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskEditForm.errors.description)}
                                helperText={taskEditForm.errors.description}
                                multiline
                                minRows={3}
                                fullWidth
                            />
                            <TextField
                                label="Priority"
                                value={taskEditForm.data.priority}
                                onChange={(e) =>
                                    taskEditForm.setData(
                                        'priority',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskEditForm.errors.priority)}
                                helperText={taskEditForm.errors.priority}
                                fullWidth
                                select
                            >
                                <MenuItem value="low">low</MenuItem>
                                <MenuItem value="medium">medium</MenuItem>
                                <MenuItem value="high">high</MenuItem>
                            </TextField>
                            <TextField
                                label="Status"
                                value={taskEditForm.data.status}
                                onChange={(e) =>
                                    taskEditForm.setData(
                                        'status',
                                        e.target.value
                                    )
                                }
                                error={Boolean(taskEditForm.errors.status)}
                                helperText={taskEditForm.errors.status}
                                fullWidth
                                select
                            >
                                <MenuItem value="pending">pending</MenuItem>
                                <MenuItem value="completed">completed</MenuItem>
                            </TextField>

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={closeTaskEdit}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={taskEditForm.processing}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </Modal>
        </TaskMoLayout>
    );
}
