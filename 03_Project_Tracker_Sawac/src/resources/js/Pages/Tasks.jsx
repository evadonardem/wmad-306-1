import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useForm, Link as InertiaLink } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    TextField,
    Typography,
    Grid,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    InputLabel,
    FormControl,
    Box,
    InputAdornment,
    useTheme,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskIcon from '@mui/icons-material/Task';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Tasks({ tasks, projects }) {
    const theme = useTheme();
    const { data, setData, post, put, reset, processing } = useForm({ project_id: '', title: '', description: '', priority: 'medium', id: null });
    const errors = usePage().props.errors || {};
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    function openCreate() {
        reset();
        setOpen(true);
    }

    function submit(e) {
        e.preventDefault();

        if (data.id) {
            put(`/tasks/${data.id}`, {
                onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Task updated' } })),
            });
        } else {
            post('/tasks', {
                onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Task created' } })),
            });
        }

        setOpen(false);
        reset();
    }

    function edit(t) {
        setData({ project_id: t.project_id, title: t.title, description: t.description ?? '', priority: t.priority ?? 'medium', id: t.id });
        setOpen(true);
    }

    function confirmDelete(id) {
        setToDelete(id);
        setConfirmOpen(true);
    }

    function remove() {
        Inertia.delete(`/tasks/${toDelete}`, {
            onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Task deleted' } })),
        });
        setConfirmOpen(false);
    }

    function toggle(id) {
        post(`/tasks/${id}/toggle-status`, {
            onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Task status updated' } })),
        });
    }

    // Filter tasks based on search query
    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return { color: theme.palette.error.main, label: 'High' };
            case 'medium':
                return { color: theme.palette.warning.main, label: 'Medium' };
            case 'low':
                return { color: theme.palette.success.main, label: 'Low' };
            default:
                return { color: theme.palette.info.main, label: 'Medium' };
        }
    };

    return (
        <AuthenticatedLayout header="Tasks">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 1, overflowX: 'hidden' }}>
                {/* Header Section */}
                <Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 1.5 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TaskIcon sx={{ fontSize: 22, color: 'primary.main' }} />
                                Tasks
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Manage your work and prioritize.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={openCreate}
                            sx={{ whiteSpace: 'nowrap' }}
                            aria-label="create new task"
                        >
                            New Task
                        </Button>
                    </Stack>

                    {/* Search Bar */}
                    <TextField
                        fullWidth
                        placeholder="Search tasks by title, description, or project..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        size="small"
                        sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                backgroundColor: 'background.paper',
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                }
                            }
                        }}
                        aria-label="search tasks"
                        inputProps={{ 'aria-label': 'search-tasks' }}
                    />
                </Box>

                {/* Empty State */}
                {filteredTasks.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: { xs: 4, md: 6 },
                            px: 2,
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <TaskIcon sx={{ fontSize: 56, color: 'primary.light', opacity: 0.5 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                            {searchQuery ? 'No tasks found' : 'No tasks yet'}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 400, mx: 'auto' }}>
                            {searchQuery
                                ? 'Try adjusting your search or create a new task to get started.'
                                : 'Start by creating your first task or assign tasks to your projects.'
                            }
                        </Typography>
                        {!searchQuery && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={openCreate}
                                aria-label="create first task"
                            >
                                Create Task
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredTasks.map((t) => {
                            const priorityInfo = getPriorityColor(t.priority);
                            return (
                                <Grid item key={t.id} xs={12} sm={6} lg={4}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'visible',
                                            '&:hover': {
                                                transform: 'translateY(-6px)',
                                                boxShadow: theme.shadows[12],
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 3,
                                                backgroundColor: priorityInfo.color,
                                                borderRadius: '4px 4px 0 0'
                                            }
                                        }}
                                    >
                                        {/* Card Header */}
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                        width: 36,
                                                        height: 36
                                                    }}
                                                >
                                                    {t.project?.title?.charAt(0) ?? '?'}
                                                </Avatar>
                                            }
                                            title={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {t.title}
                                                </Typography>
                                            }
                                            subheader={
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {t.project?.title || `Project #${t.project_id}`}
                                                </Typography>
                                            }
                                            action={
                                                <Stack direction="row" spacing={0} sx={{ ml: 0 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => edit(t)}
                                                        aria-label={`edit-task-${t.id}`}
                                                        sx={{ width: 32, height: 32, opacity: 0.6, '&:hover': { opacity: 1 } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => confirmDelete(t.id)}
                                                        aria-label={`delete-task-${t.id}`}
                                                        sx={{ width: 32, height: 32, opacity: 0.6, '&:hover': { opacity: 1, color: 'error.main' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            }
                                            sx={{ pb: 1 }}
                                        />

                                        {/* Card Content */}
                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            {/* Description */}
                                            {t.description && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        lineHeight: 1.3,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {t.description}
                                                </Typography>
                                            )}

                                            {/* Chips and Status */}
                                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                                                <Chip
                                                    label={priorityInfo.label}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: priorityInfo.color,
                                                        color: priorityInfo.color,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        height: 20
                                                    }}
                                                    aria-label={`priority-${t.priority}`}
                                                />
                                                <Chip
                                                    icon={t.status === 'done' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />}
                                                    label={t.status === 'done' ? 'Done' : 'Open'}
                                                    size="small"
                                                    variant="filled"
                                                    color={t.status === 'done' ? 'success' : 'default'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        textTransform: 'capitalize',
                                                        height: 20
                                                    }}
                                                    aria-label={`status-${t.status}`}
                                                />
                                            </Stack>

                                            {/* Status Toggle Switch */}
                                            <Box sx={{ pt: 0 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={t.status === 'done'}
                                                            onChange={() => toggle(t.id)}
                                                            disabled={processing}
                                                            inputProps={{ 'aria-label': `toggle-task-${t.id}` }}
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                            {processing ? 'Updating...' : t.status === 'done' ? 'Mark open' : 'Mark done'}
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0, ml: -0.5 }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* Create/Edit Task Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {data.id ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth error={Boolean(errors.project_id)}>
                            <InputLabel id="project-select-label">Project *</InputLabel>
                            <Select
                                labelId="project-select-label"
                                value={data.project_id}
                                label="Project *"
                                onChange={(e) => setData('project_id', e.target.value)}
                                required
                                aria-label="select-project"
                            >
                                <MenuItem value="">
                                    <em>Select a project</em>
                                </MenuItem>
                                {projects.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.project_id && <FormHelperText>{errors.project_id}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Title *"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            fullWidth
                            placeholder="Task summary"
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                            inputProps={{ 'aria-label': 'task-title' }}
                        />

                        <TextField
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            placeholder="Add more details about this task..."
                            inputProps={{ 'aria-label': 'task-description' }}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="priority-select-label">Priority</InputLabel>
                            <Select
                                labelId="priority-select-label"
                                value={data.priority}
                                label="Priority"
                                onChange={(e) => setData('priority', e.target.value)}
                                aria-label="select-priority"
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>

                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button
                            onClick={() => setOpen(false)}
                            aria-label="cancel-task"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            aria-label="submit-task"
                            sx={{ minWidth: 120 }}
                        >
                            {processing ? (
                                <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                            ) : (
                                data.id ? 'Update Task' : 'Create Task'
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this task? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        aria-label="cancel-delete"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                        onClick={remove}
                        aria-label="confirm-delete"
                    >
                        Delete Task
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
