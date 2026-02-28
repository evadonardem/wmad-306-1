import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

export default function TasksIndex({ project, tasks }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const submitNew = (e) => {
        e.preventDefault();

        post(route('tasks.store', project.id), {
            onSuccess: () => reset(),
        });
    };

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditValues({
            title: task.title ?? '',
            description: task.description ?? '',
            priority: task.priority ?? 'medium',
            status: task.status ?? 'pending',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValues({
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
        });
    };

    const saveEdit = (e, task) => {
        e.preventDefault();

        router.put(route('tasks.update', task.id), editValues, {
            onSuccess: () => cancelEdit(),
        });
    };

    const destroy = (task) => {
        router.delete(route('tasks.destroy', task.id));
    };

    const toggleStatus = (task) => {
        router.post(route('tasks.toggleStatus', task.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tasks: {project.title}
                </h2>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Add Task
                                </Typography>

                                <form onSubmit={submitNew} className="mt-4 space-y-4">
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={Boolean(errors.title)}
                                        helperText={errors.title}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        minRows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormControl fullWidth>
                                            <InputLabel id="priority-label">
                                                Priority
                                            </InputLabel>
                                            <Select
                                                labelId="priority-label"
                                                label="Priority"
                                                value={data.priority}
                                                onChange={(e) =>
                                                    setData('priority', e.target.value)
                                                }
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel id="status-label">
                                                Status
                                            </InputLabel>
                                            <Select
                                                labelId="status-label"
                                                label="Status"
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData('status', e.target.value)
                                                }
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="completed">
                                                    Completed
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2">
                            {tasks.map((task) => {
                                const isEditing = task.id === editingId;

                                return (
                                    <Card key={task.id}>
                                        <CardContent>
                                            {isEditing ? (
                                                <form
                                                    onSubmit={(e) =>
                                                        saveEdit(e, task)
                                                    }
                                                    className="space-y-4"
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="Title"
                                                        value={editValues.title}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                title: e.target.value,
                                                            }))
                                                        }
                                                    />

                                                    <TextField
                                                        fullWidth
                                                        label="Description"
                                                        multiline
                                                        minRows={3}
                                                        value={editValues.description}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                description:
                                                                    e.target.value,
                                                            }))
                                                        }
                                                    />

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FormControl fullWidth>
                                                            <InputLabel id={`priority-${task.id}`}>
                                                                Priority
                                                            </InputLabel>
                                                            <Select
                                                                labelId={`priority-${task.id}`}
                                                                label="Priority"
                                                                value={editValues.priority}
                                                                onChange={(e) =>
                                                                    setEditValues((prev) => ({
                                                                        ...prev,
                                                                        priority:
                                                                            e.target
                                                                                .value,
                                                                    }))
                                                                }
                                                            >
                                                                <MenuItem value="low">
                                                                    Low
                                                                </MenuItem>
                                                                <MenuItem value="medium">
                                                                    Medium
                                                                </MenuItem>
                                                                <MenuItem value="high">
                                                                    High
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        <FormControl fullWidth>
                                                            <InputLabel id={`status-${task.id}`}>
                                                                Status
                                                            </InputLabel>
                                                            <Select
                                                                labelId={`status-${task.id}`}
                                                                label="Status"
                                                                value={editValues.status}
                                                                onChange={(e) =>
                                                                    setEditValues((prev) => ({
                                                                        ...prev,
                                                                        status:
                                                                            e.target
                                                                                .value,
                                                                    }))
                                                                }
                                                            >
                                                                <MenuItem value="pending">
                                                                    Pending
                                                                </MenuItem>
                                                                <MenuItem value="completed">
                                                                    Completed
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button type="submit" variant="contained">
                                                            Save
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            onClick={cancelEdit}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <Typography variant="h6" component="div">
                                                        {task.title}
                                                    </Typography>

                                                    {task.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            className="mt-2"
                                                        >
                                                            {task.description}
                                                        </Typography>
                                                    )}

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        className="mt-2"
                                                    >
                                                        Priority: {task.priority} | Status:{' '}
                                                        {task.status}
                                                    </Typography>
                                                </>
                                            )}
                                        </CardContent>

                                        {!isEditing && (
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => toggleStatus(task)}
                                                >
                                                    Toggle Status
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => startEdit(task)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => destroy(task)}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
