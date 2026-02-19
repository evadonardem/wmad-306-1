import React, { useState } from 'react';
import {
    Container,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Dialog,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    InputAdornment,
    Stack,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';

export default function Projects({ projects: initialProjects }) {
    const [projects, setProjects] = useState(initialProjects);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active',
        start_date: '',
        end_date: '',
    });

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        avgProgress: projects.length > 0
            ? Math.round(projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / projects.length)
            : 0,
    };

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                description: project.description,
                status: project.status,
                start_date: project.start_date,
                end_date: project.end_date,
            });
        } else {
            setEditingProject(null);
            setFormData({
                name: '',
                description: '',
                status: 'active',
                start_date: '',
                end_date: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingProject) {
                await axios.put(`/projects/${editingProject.id}`, formData);
            } else {
                await axios.post('/projects', formData);
            }
            router.reload();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`/projects/${id}`);
                router.reload();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            paused: 'warning',
            completed: 'info',
            archived: 'default',
        };
        return colors[status] || 'default';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Projects" />

            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                position: 'relative',
                overflow: 'hidden',
                py: 0,
            }}>
                {/* Premium Hero Banner with Business Image */}
                <Box sx={{
                    position: 'relative',
                    height: '480px',
                    background: `linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%),
                                  url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop') center/cover`,
                    backgroundBlendMode: 'overlay',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '60px 40px 40px',
                    mb: 0,
                    overflow: 'hidden',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.2) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100px',
                        background: 'linear-gradient(to top, #0f172a 0%, transparent 100%)',
                        pointerEvents: 'none',
                    }
                }}>
                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                        <Box sx={{ animation: 'slideInUp 0.8s ease-out' }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 900,
                                    color: 'white',
                                    mb: 1,
                                    letterSpacing: '-1px',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                }}
                            >
                                Project Management
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: 300,
                                    fontSize: '1.2rem',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                }}
                            >
                                Track progress and manage all your projects in one unified interface
                            </Typography>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="xl" sx={{ py: 6 }}>
                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 6, mt: -5, position: 'relative', zIndex: 10 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{
                                p: 3.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-12px)',
                                    boxShadow: '0 30px 80px rgba(102, 126, 234, 0.25)',
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            color: '#667eea',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>
                                            Total Projects
                                        </Typography>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            color: '#667eea',
                                            mt: 1,
                                            fontSize: '2.8rem',
                                        }}>
                                            {stats.total}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                                    }}>
                                        <TrendingUpIcon sx={{ color: 'white', fontSize: 40 }} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{
                                p: 3.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-12px)',
                                    boxShadow: '0 30px 80px rgba(72, 187, 120, 0.25)',
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            color: '#48bb78',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>
                                            Active
                                        </Typography>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            color: '#48bb78',
                                            mt: 1,
                                            fontSize: '2.8rem',
                                        }}>
                                            {stats.active}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(72, 187, 120, 0.3)',
                                    }}>
                                        <ScheduleIcon sx={{ color: 'white', fontSize: 40 }} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>


                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{
                                p: 3.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-12px)',
                                    boxShadow: '0 30px 80px rgba(66, 153, 225, 0.25)',
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            color: '#4299e1',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>
                                            Completed
                                        </Typography>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            color: '#4299e1',
                                            mt: 1,
                                            fontSize: '2.8rem',
                                        }}>
                                            {stats.completed}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(66, 153, 225, 0.3)',
                                    }}>
                                        <CheckCircleIcon sx={{ color: 'white', fontSize: 40 }} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper sx={{
                                p: 3.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-12px)',
                                    boxShadow: '0 30px 80px rgba(237, 137, 54, 0.25)',
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            color: '#ed8936',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>
                                            Avg Progress
                                        </Typography>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            color: '#ed8936',
                                            mt: 1,
                                            fontSize: '2.8rem',
                                        }}>
                                            {stats.avgProgress}%
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        background: `conic-gradient(#ed8936 0% ${stats.avgProgress}%, rgba(237, 137, 54, 0.2) ${stats.avgProgress}% 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(237, 137, 54, 0.3)',
                                    }}>
                                        <Typography sx={{ color: '#ed8936', fontWeight: 900, fontSize: '1.2rem' }}>
                                            {stats.avgProgress}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Search and Filter Section */}
                    <Paper sx={{
                        p: 4,
                        borderRadius: 3,
                        mb: 4,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    placeholder="🔍 Search projects by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#667eea', fontSize: 28 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            '& fieldset': {
                                                borderColor: '#e2e8f0',
                                                borderWidth: 1.5,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#667eea',
                                                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#667eea',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
                                            }
                                        },
                                        '& .MuiOutlinedInput-input::placeholder': {
                                            color: '#a0aec0',
                                            opacity: 1,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{
                                        '&.Mui-focused': {
                                            color: '#667eea',
                                        }
                                    }}>
                                        Filter by Status
                                    </InputLabel>
                                    <Select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        label="Filter by Status"
                                        sx={{
                                            borderRadius: 2,
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#e2e8f0',
                                                borderWidth: 1.5,
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#667eea',
                                                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#667eea',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
                                            }
                                        }}
                                    >
                                        <MenuItem value="all">📋 All Statuses</MenuItem>
                                        <MenuItem value="active">🟢 Active</MenuItem>
                                        <MenuItem value="paused">⏸️ Paused</MenuItem>
                                        <MenuItem value="completed">✅ Completed</MenuItem>
                                        <MenuItem value="archived">📦 Archived</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Projects Grid */}
                    {filteredProjects.length === 0 ? (
                        <Paper sx={{
                            textAlign: 'center',
                            py: 12,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 3,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(255,255,255,0.3)',
                        }}>
                            <Typography variant="h5" sx={{
                                color: '#1a202c',
                                fontWeight: 700,
                                mb: 2,
                            }}>
                                📭 No Projects Found
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: '#718096',
                                mb: 4,
                                fontSize: '1rem',
                            }}>
                                No projects found
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Try adjusting your search criteria or create your first project
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 5,
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 15px 50px rgba(102, 126, 234, 0.5)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                ✨ Create Project
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {filteredProjects.map(project => (
                                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '5px',
                                            background: `linear-gradient(90deg, ${
                                                project.status === 'active' ? '#48bb78' :
                                                project.status === 'completed' ? '#4299e1' :
                                                project.status === 'paused' ? '#ed8936' : '#cbd5e0'
                                            }, transparent)`,
                                            transition: 'height 0.3s ease',
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-12px)',
                                            boxShadow: '0 30px 80px rgba(102, 126, 234, 0.25)',
                                            '&:before': {
                                                height: '8px',
                                            }
                                        }
                                    }}>
                                        <CardContent sx={{ flexGrow: 1, pt: 3, pb: 0 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                                                <Box sx={{ flex: 1, pr: 2 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: '#0f172a',
                                                            mb: 0.5,
                                                            fontSize: '1.15rem',
                                                            letterSpacing: '-0.3px',
                                                        }}
                                                    >
                                                        {project.name}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={project.status}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        borderRadius: 1.5,
                                                        background:
                                                            project.status === 'active' ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' :
                                                            project.status === 'completed' ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' :
                                                            project.status === 'paused' ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' :
                                                            'linear-gradient(135deg, #a0aec0 0%, #78909c 100%)',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#475569',
                                                    mb: 2.5,
                                                    lineHeight: 1.65,
                                                    minHeight: '44px',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {project.description || 'No description'}
                                            </Typography>

                                            {/* Progress Section */}
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#667eea',
                                                            fontSize: '0.75rem',
                                                            letterSpacing: '0.5px',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    >
                                                        COMPLETION
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 800,
                                                            color: '#667eea',
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        {project.completed_tasks_count}/{project.tasks_count}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={project.progress_percentage}
                                                    sx={{
                                                        height: 7,
                                                        borderRadius: 4,
                                                        background: '#e2e8f0',
                                                        '& .MuiLinearProgress-bar': {
                                                            background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                                                            borderRadius: 4,
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Dates */}
                                            {project.start_date && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#94a3b8',
                                                        display: 'block',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    📅 {project.start_date} — {project.end_date}
                                                </Typography>
                                            )}
                                        </CardContent>

                                        <CardActions sx={{
                                            justifyContent: 'space-between',
                                            gap: 0.5,
                                            pt: 0,
                                            pb: 2,
                                            px: 2,
                                        }}>
                                            <Tooltip title="View Project">
                                                <Link href={`/projects/${project.id}`}>
                                                    <Button
                                                        size="small"
                                                        sx={{
                                                            color: '#667eea',
                                                            fontWeight: 700,
                                                            textTransform: 'none',
                                                            fontSize: '0.85rem',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                background: 'rgba(102, 126, 234, 0.15)',
                                                                color: '#667eea',
                                                            }
                                                        }}
                                                        startIcon={<ViewIcon sx={{ fontSize: '1rem' }} />}
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Edit Project">
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        color: '#4299e1',
                                                        fontWeight: 700,
                                                        textTransform: 'none',
                                                        fontSize: '0.85rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: 'rgba(66, 153, 225, 0.15)',
                                                            color: '#4299e1',
                                                        }
                                                    }}
                                                    startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={() => handleOpenDialog(project)}
                                                >
                                                    Edit
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Delete Project">
                                                <Button
                                                    size="small"
                                                    sx={{
                                                        color: '#f56565',
                                                        fontWeight: 700,
                                                        textTransform: 'none',
                                                        fontSize: '0.85rem',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: 'rgba(245, 101, 101, 0.15)',
                                                            color: '#f56565',
                                                        }
                                                    }}
                                                    startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Tooltip>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Floating Action Button */}
                    <Box sx={{
                        position: 'fixed',
                        bottom: 40,
                        right: 40,
                        zIndex: 50,
                    }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleOpenDialog()}
                            startIcon={<AddIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 3,
                                padding: '18px 36px',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                textTransform: 'none',
                                boxShadow: '0 15px 50px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: '0 20px 70px rgba(102, 126, 234, 0.6)',
                                    transform: 'translateY(-4px) scale(1.08)',
                                }
                            }}
                        >
                            ✨ New Project
                        </Button>
                    </Box>
                </Container>

                {/* Global Animation Styles */}
                <style>{`
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </Box>

            {/* Premium Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    }
                }}
            >
                <Box sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 3,
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            letterSpacing: '-0.3px',
                        }}
                    >
                        {editingProject ? '✏️ Edit Project' : '➕ Create New Project'}
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Stack spacing={2.5}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter project name..."
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            placeholder="Describe your project..."
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{
                                '&.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}>
                                Status
                            </InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                label="Status"
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e2e8f0',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    }
                                }}
                            >
                                <MenuItem value="active">🟢 Active</MenuItem>
                                <MenuItem value="paused">⏸️ Paused</MenuItem>
                                <MenuItem value="completed">✅ Completed</MenuItem>
                                <MenuItem value="archived">📦 Archived</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="End Date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                    </Stack>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleCloseDialog}
                            sx={{
                                color: '#718096',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                '&:hover': {
                                    background: 'rgba(0,0,0,0.05)',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 4,
                                '&:hover': {
                                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            {editingProject ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </AuthenticatedLayout>
    );
}
