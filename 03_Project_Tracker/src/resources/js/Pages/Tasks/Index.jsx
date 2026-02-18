import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    Chip,
    Stack,
    IconButton,
    Divider,
    Paper,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FlagIcon from '@mui/icons-material/Flag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTaskIcon from '@mui/icons-material/AddTask';

export default function Index({ project, tasks }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        priority: 'low',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('projects.tasks.store', project.id), {
            onSuccess: () => reset(),
        });
    };

    const deleteTask = (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        router.delete(route('projects.tasks.destroy', [project.id, taskId]));
    };

    const toggleStatus = (task) => {
        router.put(
            route('projects.tasks.update', [project.id, task.id]),
            {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: !task.status,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const getPriorityStyle = (priority) => {
        if (priority === "high") {
            return { label: "High Priority", color: "error" };
        }
        if (priority === "medium") {
            return { label: "Medium Priority", color: "warning" };
        }
        return { label: "Low Priority", color: "success" };
    };

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status).length;
    const pendingTasks = totalTasks - doneTasks;

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight="bold">
                    Tasks
                </Typography>
            }
        >
            <Head title={`Tasks - ${project.title}`} />

            {/* Background */}
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
                    py: 6,
                }}
            >
                <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>

                    {/* Page Title Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "#111827" }}
                        >
                            {project.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ mt: 1, color: "#6b7280" }}
                        >
                            Manage your tasks and keep track of progress.
                        </Typography>

                        {/* Stats */}
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }} flexWrap="wrap">
                            <Chip
                                label={`Total: ${totalTasks}`}
                                sx={{
                                    fontWeight: "bold",
                                    borderRadius: 3,
                                    background: "#e0f2fe",
                                    color: "#0369a1",
                                }}
                            />

                            <Chip
                                icon={<CheckCircleIcon />}
                                label={`Done: ${doneTasks}`}
                                sx={{
                                    fontWeight: "bold",
                                    borderRadius: 3,
                                    background: "#dcfce7",
                                    color: "#166534",
                                }}
                            />

                            <Chip
                                icon={<PendingActionsIcon />}
                                label={`Pending: ${pendingTasks}`}
                                sx={{
                                    fontWeight: "bold",
                                    borderRadius: 3,
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Add Task Form */}
                    <Card
                        sx={{
                            mb: 5,
                            borderRadius: 4,
                            boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                            background: "linear-gradient(135deg, #ffffff, #f1f5ff)",
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <AddTaskIcon sx={{ color: "#4f46e5" }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Add New Task
                                </Typography>
                            </Stack>

                            <Typography variant="body2" sx={{ mt: 1, color: "#6b7280" }}>
                                Fill in the details below to create a new task.
                            </Typography>

                            <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Task Title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            error={!!errors.description}
                                            helperText={errors.description}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <Select
                                            fullWidth
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                        >
                                            <MenuItem value="low">Low</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                        </Select>
                                    </Grid>

                                    <Grid item xs={12} md={1}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                            fullWidth
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                fontWeight: "bold",
                                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Task List */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "#111827" }}>
                            Task List
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "#6b7280" }}>
                            View all tasks under this project.
                        </Typography>
                    </Box>

                    {tasks.length === 0 ? (
                        <Paper
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                textAlign: "center",
                                background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                                boxShadow: "0px 10px 25px rgba(0,0,0,0.05)",
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                No tasks yet 🚀
                            </Typography>
                            <Typography sx={{ mt: 1, color: "#6b7280" }}>
                                Add your first task above to get started.
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {tasks.map((task) => {
                                const priority = getPriorityStyle(task.priority);

                                return (
                                    <Grid item xs={12} md={4} key={task.id}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                boxShadow: "0px 12px 30px rgba(0,0,0,0.10)",
                                                transition: "0.25s ease",
                                                background: task.status
                                                    ? "linear-gradient(135deg, #dcfce7, #ffffff)"
                                                    : "linear-gradient(135deg, #eef2ff, #ffffff)",
                                                "&:hover": {
                                                    transform: "translateY(-6px)",
                                                    boxShadow: "0px 18px 40px rgba(0,0,0,0.18)",
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{
                                                        textDecoration: task.status ? "line-through" : "none",
                                                        opacity: task.status ? 0.7 : 1,
                                                    }}
                                                >
                                                    {task.title}
                                                </Typography>

                                                <Typography
                                                    sx={{ mt: 1 }}
                                                    color="text.secondary"
                                                >
                                                    {task.description || "No description"}
                                                </Typography>

                                                <Divider sx={{ my: 2 }} />

                                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                    <Chip
                                                        icon={<FlagIcon />}
                                                        label={priority.label}
                                                        color={priority.color}
                                                        sx={{
                                                            fontWeight: "bold",
                                                            borderRadius: 3,
                                                        }}
                                                    />

                                                    <Chip
                                                        label={task.status ? "Done" : "Pending"}
                                                        icon={task.status ? <CheckCircleIcon /> : <PendingActionsIcon />}
                                                        color={task.status ? "success" : "default"}
                                                        sx={{
                                                            fontWeight: "bold",
                                                            borderRadius: 3,
                                                        }}
                                                    />
                                                </Stack>

                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => toggleStatus(task)}
                                                        sx={{
                                                            borderRadius: 3,
                                                            fontWeight: "bold",
                                                            px: 2,
                                                            background: task.status
                                                                ? "linear-gradient(135deg, #f97316, #fb7185)"
                                                                : "linear-gradient(135deg, #22c55e, #16a34a)",
                                                        }}
                                                    >
                                                        {task.status ? "Mark Pending" : "Mark Done"}
                                                    </Button>

                                                    <IconButton
                                                        onClick={() => deleteTask(task.id)}
                                                        sx={{
                                                            background: "#fee2e2",
                                                            "&:hover": {
                                                                background: "#fecaca",
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ color: "#dc2626" }} />
                                                    </IconButton>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {/* Back Button */}
                    <Box sx={{ mt: 6 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            href="/dashboard"
                            sx={{
                                borderRadius: 3,
                                fontWeight: "bold",
                                px: 3,
                                py: 1.2,
                                background: "linear-gradient(135deg, #111827, #374151)",
                            }}
                        >
                            Back to Projects
                        </Button>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}