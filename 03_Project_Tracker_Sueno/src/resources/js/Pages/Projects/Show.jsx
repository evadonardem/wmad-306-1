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
    Grid,
    LinearProgress,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function Show({ project }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    const [filterPriority, setFilterPriority] = useState(null);

    // Calculate project statistics
    const stats = useMemo(() => {
        const tasks = project.tasks || [];
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in_progress').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const total = tasks.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        const highPriority = tasks.filter(t => t.priority === 'high').length;
        const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
        const lowPriority = tasks.filter(t => t.priority === 'low').length;

        return {
            total,
            completed,
            inProgress,
            pending,
            percentage,
            highPriority,
            mediumPriority,
            lowPriority,
        };
    }, [project.tasks]);

    // Filter and search tasks
    const filteredTasks = useMemo(() => {
        let tasks = project.tasks || [];

        // Search filter
        if (searchQuery) {
            tasks = tasks.filter(t =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus) {
            tasks = tasks.filter(t => t.status === filterStatus);
        }

        // Priority filter
        if (filterPriority) {
            tasks = tasks.filter(t => t.priority === filterPriority);
        }

        return tasks;
    }, [project.tasks, searchQuery, filterStatus, filterPriority]);

    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', taskId));
        }
    };

    const handleDeleteProject = () => {
        if (confirm('Are you sure you want to delete this entire project? This action cannot be undone.')) {
            router.delete(route('projects.destroy', project.id), {
                onSuccess: () => router.push(route('projects.index')),
            });
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#d4af37' }}>
                        Project Details
                    </Typography>
                    <Link href={route('projects.index')}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                borderColor: 'rgba(212, 175, 55, 0.2)',
                                color: '#d4af37',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#d4af37',
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
                {/* Project Header */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
                        <Box flex={1}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d4af37', fontWeight: 600 }}>
                                {project.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {project.description || 'No description provided'}
                            </Typography>
                            <Box display="flex" gap={2} alignItems="center" mt={2}>
                                <Typography variant="body2" color="text.secondary">
                                    📅 Created: {formatDate(project.created_at)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ♻️ Updated: {formatDate(project.updated_at)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={2} flexDirection="column">
                            <Link href={route('projects.edit', project.id)}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        '&:hover': { backgroundColor: '#c9995d' },
                                        textTransform: 'none',
                                    }}
                                >
                                    Edit Project
                                </Button>
                            </Link>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteProject}
                                sx={{
                                    textTransform: 'none',
                                }}
                            >
                                Delete Project
                            </Button>
                        </Box>
                    </Box>

                    {/* Project Statistics */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 2 }}>
                            Project Progress
                        </Typography>
                        <Grid container spacing={2} mb={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2">Overall Completion</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {stats.percentage}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={stats.percentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#d4af37',
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Stats Grid */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 600 }}>
                                        {stats.total}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Tasks
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                        border: '1px solid rgba(76, 175, 80, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                        {stats.completed}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Completed
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 193, 7, 0.05)',
                                        border: '1px solid rgba(255, 193, 7, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#ffc107', fontWeight: 600 }}>
                                        {stats.inProgress}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        In Progress
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(158, 158, 158, 0.05)',
                                        border: '1px solid rgba(158, 158, 158, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#9e9e9e', fontWeight: 600 }}>
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* Priority Breakdown */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                                        border: '1px solid rgba(244, 67, 54, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 600 }}>
                                        {stats.highPriority}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        High Priority
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 152, 0, 0.05)',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                        {stats.mediumPriority}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Medium Priority
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 600 }}>
                                        {stats.lowPriority}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Low Priority
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Tasks Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                            Tasks ({filteredTasks.length} of {project.tasks?.length || 0})
                        </Typography>
                        <Link href={route('tasks.create')}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                }}
                            >
                                New Task
                            </Button>
                        </Link>
                    </Box>

                    {/* Search and Filters */}
                    {(project.tasks?.length || 0) > 0 && (
                        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <TextField
                                placeholder="Search tasks..."
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: '#d4af37' }} />,
                                }}
                                sx={{ minWidth: 200 }}
                            />

                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="body2" fontWeight={600}>
                                    Status:
                                </Typography>
                                <ToggleButtonGroup
                                    value={filterStatus}
                                    exclusive
                                    onChange={(e, newValue) => setFilterStatus(newValue)}
                                    size="small"
                                >
                                    <ToggleButton value={null}>All</ToggleButton>
                                    <ToggleButton value="pending">Pending</ToggleButton>
                                    <ToggleButton value="in_progress">In Progress</ToggleButton>
                                    <ToggleButton value="completed">Completed</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="body2" fontWeight={600}>
                                    Priority:
                                </Typography>
                                <ToggleButtonGroup
                                    value={filterPriority}
                                    exclusive
                                    onChange={(e, newValue) => setFilterPriority(newValue)}
                                    size="small"
                                >
                                    <ToggleButton value={null}>All</ToggleButton>
                                    <ToggleButton value="high">High</ToggleButton>
                                    <ToggleButton value="medium">Medium</ToggleButton>
                                    <ToggleButton value="low">Low</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    )}

                    {/* Tasks Table */}
                    {filteredTasks.length > 0 ? (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTasks.map((task) => (
                                        <TableRow key={task.id} hover>
                                            <TableCell><strong>{task.title}</strong></TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#d4af37' }} />
                                                    {formatDate(task.due_date)}
                                                </Box>
                                            </TableCell>
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
                                                    <IconButton size="small" sx={{ color: '#d4af37' }}>
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
                                {searchQuery || filterStatus || filterPriority
                                    ? 'No tasks match your filters'
                                    : 'No tasks yet'}
                            </Typography>
                            <Link href={route('tasks.create')}>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    size="small"
                                    sx={{
                                        borderColor: 'rgba(212, 175, 55, 0.2)',
                                        color: '#d4af37',
                                        textTransform: 'none',
                                    }}
                                >
                                    Create First Task
                                </Button>
                            </Link>
                        </Box>
                    )}
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
