import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { 
    Grid, Card, CardContent, Typography, Box, 
    Button, TextField, Dialog, DialogTitle, 
    DialogContent, DialogActions, IconButton, Chip,
    Checkbox, FormControlLabel
} from '@mui/material';
import { 
    Add as AddIcon, 
    Delete as DeleteIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    pending as PendingIcon
} from '@mui/icons-material';
import { useState } from 'react';

export default function ProjectsIndex({ projects, stats }) {
    const [open, setOpen] = useState(false);
    const [taskOpen, setTaskOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleTaskOpen = (project) => {
        setSelectedProject(project);
        setTaskOpen(true);
    };
    const handleTaskClose = () => setTaskOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/projects', newProject);
        handleClose();
        setNewProject({ title: '', description: '' });
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        router.post(`/projects/${selectedProject.id}/tasks`, newTask);
        handleTaskClose();
        setNewTask({ title: '', description: '', due_date: '' });
    };

    const handleToggleTask = (taskId) => {
        router.patch(`/tasks/${taskId}/toggle`);
    };

    const handleDeleteProject = (projectId) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${projectId}`);
        }
    };

    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(`/tasks/${taskId}`);
        }
    };

    const statCards = [
        { title: 'Total Projects', value: stats?.totalProjects || 0, color: '#e3f2fd' },
        { title: 'Completed Projects', value: stats?.completedProjects || 0, color: '#e8f5e9' },
        { title: 'Pending Projects', value: stats?.pendingProjects || 0, color: '#fff3e0' },
        { title: 'Total Tasks', value: stats?.totalTasks || 0, color: '#f3e5f5' },
        { title: 'Completed Tasks', value: stats?.completedTasks || 0, color: '#e8f5e9' },
        { title: 'Pending Tasks', value: stats?.pendingTasks || 0, color: '#fff3e0' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Projects
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                    >
                        New Project
                    </Button>
                </Box>
            }
        >
            <Head title="Projects" />

            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {statCards.map((card, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                            <Card sx={{ backgroundColor: card.color }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <Grid item xs={12} md={6} key={project.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" component="div">
                                                    {project.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {project.description}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={project.status} 
                                                color={project.status === 'completed' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Tasks ({project.tasks?.length || 0})
                                            </Typography>
                                            {project.tasks && project.tasks.map((task) => (
                                                <Box 
                                                    key={task.id}
                                                    sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        py: 0.5
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={task.status === 'completed'}
                                                                onChange={() => handleToggleTask(task.id)}
                                                                size="small"
                                                            />
                                                        }
                                                        label={
                                                            <Typography 
                                                                variant="body2"
                                                                sx={{ 
                                                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                        }
                                                    />
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button 
                                                size="small" 
                                                startIcon={<AddIcon />}
                                                onClick={() => handleTaskOpen(project)}
                                            >
                                                Add Task
                                            </Button>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteProject(project.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No projects yet. Create your first project!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Project Title"
                            fullWidth
                            variant="outlined"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={taskOpen} onClose={handleTaskClose}>
                <form onSubmit={handleTaskSubmit}>
                    <DialogTitle>Add Task to {selectedProject?.title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Task Title"
                            fullWidth
                            variant="outlined"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Due Date"
                            type="date"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={newTask.due_date}
                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleTaskClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
            </Dialog>
        </AuthenticatedLayout>
    );
}
