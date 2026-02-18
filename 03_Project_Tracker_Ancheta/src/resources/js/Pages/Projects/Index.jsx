import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack,
  Chip,
  TextField,
  LinearProgress,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FolderOpen,
  Task,
  CheckCircle,
  Sort,
  Search,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Context/ThemeContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProjectFormDialog from './Components/ProjectFormDialog';
import ProjectDeleteDialog from './Components/ProjectDeleteDialog';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

export default function Index({ projects = [], can = {} }) {
  const { colors, isDarkMode, getGradient } = useTheme();

  // Load view mode from localStorage or default to 'grid'
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('projectViewMode');
    return saved || 'grid';
  });

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('projectViewMode', viewMode);
  }, [viewMode]);

  const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
    title: '',
    description: '',
  });

  const handleViewModeChange = (event, newMode) => {
    if (newMode) {
      setViewMode(newMode);
    }
  };

  const handleOpenForm = (project = null) => {
    if (project) {
      setEditingProject(project);
      setData({
        title: project.title,
        description: project.description || '',
      });
    } else {
      setEditingProject(null);
      reset();
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingProject(null);
    reset();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (editingProject) {
      put(route('projects.update', editingProject.id), {
        onSuccess: handleCloseForm,
      });
    } else {
      post(route('projects.store'), {
        onSuccess: handleCloseForm,
      });
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      destroy(route('projects.destroy', projectToDelete.id), {
        onSuccess: () => {
          setOpenDelete(false);
          setProjectToDelete(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setProjectToDelete(null);
  };

  // Ensure projects is an array
  const projectsArray = Array.isArray(projects) ? projects : [];

  // Filter and sort projects
  const filteredProjects = projectsArray
    .filter(project => {
      if (!project) return false;
      const titleMatch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const descMatch = project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return titleMatch || descMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'tasks') return (b.tasks_count || 0) - (a.tasks_count || 0);
      return 0;
    });

  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.95))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: `1px solid ${colors.border}`,
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: isDarkMode
        ? '0 16px 48px rgba(0, 0, 0, 0.4)'
        : '0 16px 48px rgba(0, 0, 0, 0.12)',
    },
  };

  return (
    <AuthenticatedLayout
      header={
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: getGradient(),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Projects
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
            {filteredProjects.length} total projects • {projectsArray.reduce((acc, p) => acc + (p?.tasks_count || 0), 0)} total tasks
          </Typography>
        </Box>
      }
    >
      <Head title="Projects" />

      <Box sx={{ py: 0 }}>
        {/* Search Bar - Outside header, inside main content */}
        <TextField
          placeholder="🔍 Search projects by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1.5, color: colors.textSecondary, fontSize: 20 }} />,
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: colors.textPrimary,
              background: isDarkMode
                ? 'rgba(30, 41, 59, 0.6)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              '& fieldset': { borderColor: colors.border },
              '&:hover fieldset': { borderColor: colors.primary },
            },
          }}
        />

        {/* Action Bar - Outside header, below search */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Sort Button */}
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              size="small"
              sx={{
                borderColor: colors.border,
                color: colors.textPrimary,
                fontSize: '0.8rem',
              }}
            >
              Sort
            </Button>

            {/* View Toggle */}
            <Paper
              sx={{
                display: 'flex',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
              }}
            >
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton
                  value="grid"
                  sx={{
                    border: 'none',
                    color: viewMode === 'grid' ? colors.primary : colors.textSecondary,
                    backgroundColor: viewMode === 'grid' ? `${colors.primary}20` : 'transparent',
                    p: 1,
                  }}
                >
                  <ViewModule fontSize="small" />
                </ToggleButton>
                <ToggleButton
                  value="list"
                  sx={{
                    border: 'none',
                    color: viewMode === 'list' ? colors.primary : colors.textSecondary,
                    backgroundColor: viewMode === 'list' ? `${colors.primary}20` : 'transparent',
                    p: 1,
                  }}
                >
                  <ViewList fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Stack>

          {/* New Project Button */}
          {can?.create_project && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenForm()}
              size="small"
              sx={{
                background: getGradient(),
                color: '#fff',
                borderRadius: '8px',
                px: 2,
                fontSize: '0.8rem',
              }}
            >
              New Project
            </Button>
          )}
        </Stack>

        {/* Sort Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          PaperProps={{
            sx: {
              background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              minWidth: 160,
            },
          }}
        >
          <MenuItem onClick={() => { setSortBy('latest'); setFilterAnchorEl(null); }} selected={sortBy === 'latest'}>
            Latest First
          </MenuItem>
          <MenuItem onClick={() => { setSortBy('oldest'); setFilterAnchorEl(null); }} selected={sortBy === 'oldest'}>
            Oldest First
          </MenuItem>
          <MenuItem onClick={() => { setSortBy('name'); setFilterAnchorEl(null); }} selected={sortBy === 'name'}>
            Name (A-Z)
          </MenuItem>
          <MenuItem onClick={() => { setSortBy('tasks'); setFilterAnchorEl(null); }} selected={sortBy === 'tasks'}>
            Most Tasks
          </MenuItem>
        </Menu>

        {viewMode === 'grid' ? (
          /* ===== GRID VIEW ===== */
          <Grid container spacing={2}>
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    sx={{ height: '100%' }}
                  >
                    <Card sx={cardStyle}>
                      {/* Gradient Accent Line */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: getGradient(),
                        }}
                      />

                      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Header with Project Icon */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: `${colors.primary}20`,
                              color: colors.primary,
                              width: 40,
                              height: 40,
                            }}
                          >
                            <FolderOpen fontSize="small" />
                          </Avatar>
                        </Stack>

                        {/* Project Title */}
                        <Link
                          href={route('projects.show', project.id)}
                          style={{ textDecoration: 'none' }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: colors.textPrimary,
                              mb: 0.5,
                              fontSize: '1.1rem',
                              '&:hover': { color: colors.primary },
                            }}
                          >
                            {project.title}
                          </Typography>
                        </Link>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.textSecondary,
                            mb: 2,
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {project.description || 'No description provided'}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              Progress
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
                              {project.progress || 0}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={project.progress || 0}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                background: getGradient(),
                              },
                            }}
                          />
                        </Box>

                        {/* Footer Stats */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 'auto' }}
                        >
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Total Tasks">
                              <Chip
                                icon={<Task sx={{ fontSize: 12 }} />}
                                label={project.tasks_count || 0}
                                size="small"
                                sx={{
                                  height: 22,
                                  background: isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                                  color: colors.primary,
                                  fontWeight: 600,
                                  '& .MuiChip-icon': { fontSize: 12 },
                                }}
                              />
                            </Tooltip>

                            <Tooltip title="Completed">
                              <Chip
                                icon={<CheckCircle sx={{ fontSize: 12 }} />}
                                label={project.completed_tasks || 0}
                                size="small"
                                sx={{
                                  height: 22,
                                  background: isDarkMode ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
                                  color: colors.success,
                                  fontWeight: 600,
                                  '& .MuiChip-icon': { fontSize: 12 },
                                }}
                              />
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={0.5}>
                            {can?.update_project && (
                              <Tooltip title="Edit Project">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenForm(project)}
                                  sx={{
                                    color: colors.primary,
                                    p: 0.5,
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {can?.delete_project && (
                              <Tooltip title="Delete Project">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(project)}
                                  sx={{
                                    color: colors.danger,
                                    p: 0.5,
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </MotionBox>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        ) : (
          /* ===== LIST VIEW ===== */
          <Stack spacing={1}>
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <MotionBox
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Paper
                    sx={{
                      background: isDarkMode
                        ? 'rgba(30, 41, 59, 0.9)'
                        : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '10px',
                      border: `1px solid ${colors.border}`,
                      p: 1.5,
                      '&:hover': {
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: `${colors.primary}20`,
                          color: colors.primary,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <FolderOpen sx={{ fontSize: 16 }} />
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Link href={route('projects.show', project.id)} style={{ textDecoration: 'none' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                            {project.title}
                          </Typography>
                        </Link>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                          {project.description || 'No description'}
                        </Typography>
                      </Box>

                      <Box sx={{ width: 100 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress || 0}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': { background: getGradient() },
                          }}
                        />
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          label={project.tasks_count || 0}
                          size="small"
                          sx={{ height: 20, fontSize: '0.65rem', background: `${colors.primary}15`, color: colors.primary }}
                        />
                        <Chip
                          label={project.completed_tasks || 0}
                          size="small"
                          sx={{ height: 20, fontSize: '0.65rem', background: `${colors.success}15`, color: colors.success }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={0.5}>
                        {can?.update_project && (
                          <IconButton size="small" onClick={() => handleOpenForm(project)} sx={{ color: colors.primary, p: 0.5 }}>
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                        {can?.delete_project && (
                          <IconButton size="small" onClick={() => handleDeleteClick(project)} sx={{ color: colors.danger, p: 0.5 }}>
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </MotionBox>
              ))}
            </AnimatePresence>
          </Stack>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, background: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.7)', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
            <FolderOpen sx={{ fontSize: 48, color: colors.textSecondary, mb: 1, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 0.5, fontSize: '1.1rem' }}>No Projects Found</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2, fontSize: '0.8rem' }}>
              {searchTerm ? 'Try adjusting your search' : 'Create your first project to get started'}
            </Typography>
            {!searchTerm && can?.create_project && (
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}
                sx={{ background: getGradient(), color: '#fff', borderRadius: '8px', px: 3, fontSize: '0.8rem' }}>
                Create Project
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Dialogs */}
      <ProjectFormDialog
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        data={data}
        setData={setData}
        errors={errors}
        isEditing={!!editingProject}
      />

      <ProjectDeleteDialog
        open={openDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        project={projectToDelete}
      />
    </AuthenticatedLayout>
  );
}
