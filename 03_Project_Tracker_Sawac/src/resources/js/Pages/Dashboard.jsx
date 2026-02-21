import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Grid,
    Stack,
    Chip,
    Paper,
    Alert,
    AlertTitle,
    LinearProgress,
    useTheme,
    InputAdornment,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useState } from 'react';

export default function Dashboard({ recentProjects, recentTasks, projectCount, taskCount, completedTaskCount }) {
    const user = usePage().props.auth.user;
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: `${color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    const TaskCard = (task) => {
        const getPriorityColor = () => {
            switch (task.priority) {
                case 'high':
                    return theme.palette.error.main;
                case 'medium':
                    return theme.palette.warning.main;
                case 'low':
                    return theme.palette.success.main;
                default:
                    return theme.palette.info.main;
            }
        };

        return (
            <Card
                key={task.id}
                sx={{
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        backgroundColor: getPriorityColor(),
                    },
                }}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    mb: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {task.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {task.project?.title || `Project #${task.project_id}`}
                            </Typography>
                        </Box>
                        <Chip
                            label={task.status === 'done' ? 'Done' : 'Open'}
                            size="small"
                            color={task.status === 'done' ? 'success' : 'default'}
                            variant="filled"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2, overflowX: 'hidden' }}>
                {/* Welcome Hero Section */}
                <Paper
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'primary.contrastText',
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    />
                    <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Welcome back, {user.name}! 👋
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.95 }}>
                                Here's what's happening with your projects today.
                            </Typography>
                        </Box>

                        {/* Search Bar in Hero */}
                        <TextField
                            placeholder="Search projects, tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            size="small"
                            sx={{
                                maxWidth: 400,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                    </Stack>
                </Paper>

                {/* Quick Stats */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Total Projects"
                            value={projectCount}
                            icon={<FolderIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
                            color="primary.main"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Total Tasks"
                            value={taskCount}
                            icon={<TaskIcon sx={{ fontSize: 28, color: 'secondary.main' }} />}
                            color="secondary.main"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Completed Tasks"
                            value={completedTaskCount}
                            icon={<CheckCircleIcon sx={{ fontSize: 28, color: 'success.main' }} />}
                            color="success.main"
                        />
                    </Grid>
                </Grid>

                {/* Quick Action Buttons */}
                <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Quick Actions
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            component={Link}
                            href={route('projects.index')}
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ flex: 1 }}
                        >
                            Create Project
                        </Button>
                        <Button
                            component={Link}
                            href={route('tasks.index')}
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={{ flex: 1 }}
                        >
                            Create Task
                        </Button>
                        <Button
                            component={Link}
                            href={route('projects.index')}
                            variant="text"
                            endIcon={<ArrowRightIcon />}
                            sx={{ flex: 1 }}
                        >
                            View All Projects
                        </Button>
                        <Button
                            component={Link}
                            href={route('tasks.index')}
                            variant="text"
                            endIcon={<ArrowRightIcon />}
                            sx={{ flex: 1 }}
                        >
                            View All Tasks
                        </Button>
                    </Stack>
                </Paper>

                {/* Recent Activity Section */}
                <Grid container spacing={2}>
                    {/* Recent Projects */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <FolderIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    Recent Projects
                                </Typography>
                                <Button component={Link} href={route('projects.index')} size="small" endIcon={<ArrowRightIcon />}>
                                    View All
                                </Button>
                            </Stack>

                            {recentProjects.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <FolderIcon sx={{ fontSize: 48, color: 'primary.light', opacity: 0.5, mb: 1 }} />
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        No projects yet. Create your first project to get started!
                                    </Typography>
                                    <Button variant="contained" component={Link} href={route('projects.index')} startIcon={<AddIcon />}>
                                        Create Project
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {recentProjects.map((project) => (
                                        <Card
                                            key={project.id}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 200ms',
                                                '&:hover': { bgcolor: 'action.hover', transform: 'translateX(4px)' },
                                            }}
                                            component={Link}
                                            href={route('projects.index')}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {project.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {project.tasks_count || 0} tasks
                                                </Typography>
                                            </Box>
                                            <ArrowRightIcon sx={{ opacity: 0.5 }} />
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </Grid>

                    {/* Recent Tasks */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TaskIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                                    Recent Tasks
                                </Typography>
                                <Button component={Link} href={route('tasks.index')} size="small" endIcon={<ArrowRightIcon />}>
                                    View All
                                </Button>
                            </Stack>

                            {recentTasks.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <TaskIcon sx={{ fontSize: 48, color: 'secondary.light', opacity: 0.5, mb: 1 }} />
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                        No tasks yet. Create a task to organize your work!
                                    </Typography>
                                    <Button variant="contained" component={Link} href={route('tasks.index')} startIcon={<AddIcon />}>
                                        Create Task
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {recentTasks.slice(0, 4).map((task) => TaskCard(task))}
                                </Stack>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tips Section */}
                <Alert severity="info" icon={<CheckCircleIcon />}>
                    <AlertTitle sx={{ fontWeight: 600 }}>Pro Tip</AlertTitle>
                    You can use keyboard shortcuts to navigate faster: press <strong>g+p</strong> for Projects,{' '}
                    <strong>g+t</strong> for Tasks, or <strong>g+d</strong> for Dashboard.
                </Alert>
            </Box>
        </AuthenticatedLayout>
    );
}
