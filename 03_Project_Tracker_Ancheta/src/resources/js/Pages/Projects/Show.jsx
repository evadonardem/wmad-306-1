import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import {
  Box,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProjectFormDialog from './Components/ProjectFormDialog';
import ProjectDeleteDialog from './Components/ProjectDeleteDialog';
import TaskFormDialog from './Components/TaskFormDialog';
import TaskDeleteDialog from './Components/TaskDeleteDialog';
import TaskFilters from './Components/TaskFilters';
import TaskItem from './Components/TaskItem';

export default function Show({ project, can }) {
  const { colors, isDarkMode, getGradient } = useTheme();

  // Dialog states
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [openProjectDelete, setOpenProjectDelete] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [openTaskDelete, setOpenTaskDelete] = useState(false);

  // Edit states
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filter states
  const [taskFilter, setTaskFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Local tasks state to ensure UI updates
  const [localTasks, setLocalTasks] = useState([]);

  // Update local tasks when project prop changes
  useEffect(() => {
    const normalizedTasks = (project.tasks || []).map(t => ({
      ...t,
      status: t.status || 'pending',
      priority: normalizePriority(t.priority),
    }));
    setLocalTasks(normalizedTasks);
  }, [project.tasks]);

  const { data: taskData, setData: setTaskData, post: postTask, put: putTask, delete: destroyTask, reset: resetTask } = useForm({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  });

  const { data: projectData, setData: setProjectData, put: putProject, delete: destroyProject } = useForm({
    title: project.title,
    description: project.description || '',
  });

  // Normalize priority values
  const normalizePriority = (p) => {
    if (p === 1 || p === '1' || p === 'low') return 'low';
    if (p === 2 || p === '2' || p === 'medium') return 'medium';
    if (p === 3 || p === '3' || p === 'high') return 'high';
    return p || 'medium';
  };

  // Task statistics using localTasks
  const completedTasks = localTasks.filter(t => t.status === 'completed');
  const pendingTasks = localTasks.filter(t => t.status === 'pending');
  const inProgressTasks = localTasks.filter(t => t.status === 'in_progress');
  const completionRate = localTasks.length > 0 ? Math.round((completedTasks.length / localTasks.length) * 100) : 0;

  // Filter tasks using both status and priority
  const filteredTasks = localTasks.filter(task => {
    const statusMatch = taskFilter === 'all' ? true : task.status === taskFilter;
    const priorityMatch = priorityFilter === 'all' ? true : task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  // Task handlers
  const handleOpenTaskForm = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      resetTask();
    }
    setOpenTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false);
    setEditingTask(null);
    resetTask();
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();

    if (editingTask) {
      putTask(route('projects.tasks.update', [project.id, editingTask.id]), {
        onSuccess: (response) => {
          handleCloseTaskForm();
          // Update local state with response data
          if (response?.props?.project) {
            setLocalTasks(response.props.project.tasks || []);
          }
          setSuccessMessage('Task updated successfully');
          setShowSuccess(true);
        },
      });
    } else {
      postTask(route('projects.tasks.store', project.id), {
        onSuccess: (response) => {
          handleCloseTaskForm();
          // Update local state with response data
          if (response?.props?.project) {
            setLocalTasks(response.props.project.tasks || []);
          }
          setSuccessMessage('Task created successfully');
          setShowSuccess(true);
        },
      });
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setOpenTaskDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      destroyTask(route('projects.tasks.destroy', [project.id, taskToDelete.id]), {
        onSuccess: (response) => {
          setOpenTaskDelete(false);
          setTaskToDelete(null);
          // Update local state with response data
          if (response?.props?.project) {
            setLocalTasks(response.props.project.tasks || []);
          }
          setSuccessMessage('Task deleted successfully');
          setShowSuccess(true);
        },
      });
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    const task = localTasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistically update local state
    setLocalTasks(prevTasks =>
      prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    Inertia.post(route('projects.tasks.update-status', [project.id, taskId]), { status: newStatus }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (response) => {
        setSuccessMessage('Task status updated successfully');
        setShowSuccess(true);
      },
      onError: () => {
        // Revert on error
        setLocalTasks(prevTasks =>
          prevTasks.map(t => t.id === taskId ? { ...t, status: task.status } : t)
        );
        setSuccessMessage('Failed to update task status');
        setShowSuccess(true);
      },
    });
  };

  // Project handlers
  const handleUpdateProject = (e) => {
    e.preventDefault();
    putProject(route('projects.update', project.id), {
      onSuccess: (response) => {
        setOpenProjectForm(false);
        setSuccessMessage('Project updated successfully');
        setShowSuccess(true);
      },
    });
  };

  const handleDeleteProject = () => {
    destroyProject(route('projects.destroy', project.id), {
      onSuccess: () => {
        setSuccessMessage('Project deleted successfully');
        setShowSuccess(true);
        // Use Inertia visit instead of window.location for smooth navigation
        Inertia.visit(route('projects.index'));
      },
    });
  };

  const glassCardStyle = {
    background: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
  };

  return (
    <AuthenticatedLayout
      header={
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link href={route('projects.index')}>
                <IconButton sx={{ color: colors.primary, backgroundColor: `${colors.primary}10` }}>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                  {project.title}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {localTasks.length} tasks • {completedTasks.length} completed
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              {can.update_project && (
                <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => setOpenProjectForm(true)}
                  sx={{ borderColor: colors.primary, color: colors.primary, fontSize: '0.8rem' }}>
                  Edit
                </Button>
              )}
              {can.delete_project && (
                <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpenProjectDelete(true)}
                  sx={{ borderColor: colors.danger, color: colors.danger, fontSize: '0.8rem' }}>
                  Delete
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Project Description */}
          {project.description && (
            <Paper sx={{ p: 1.5, ...glassCardStyle, background: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.7)' }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                {project.description}
              </Typography>
            </Paper>
          )}
        </Box>
      }
    >
      <Head title={project.title} />

      <Box sx={{ py: 2 }}>
        {/* Compact Progress Overview */}
        <Paper sx={{ ...glassCardStyle, p: 1.5, mb: 2 }}>
          <Stack spacing={1}>
            {/* Progress Bar Row */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 600, minWidth: 45 }}>
                {completionRate}%
              </Typography>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.border,
                    '& .MuiLinearProgress-bar': {
                      background: getGradient(),
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: colors.textSecondary, minWidth: 60 }}>
                {completedTasks.length}/{localTasks.length}
              </Typography>
            </Stack>

            {/* Stats Row */}
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: colors.warning, fontWeight: 600, display: 'block' }}>
                  {pendingTasks.length}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.6rem' }}>
                  Pending
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: colors.info, fontWeight: 600, display: 'block' }}>
                  {inProgressTasks.length}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.6rem' }}>
                  In Prog
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: colors.success, fontWeight: 600, display: 'block' }}>
                  {completedTasks.length}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.6rem' }}>
                  Done
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* Tasks Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 600 }}>Tasks</Typography>
          {can.create_task && (
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenTaskForm()}
              sx={{ background: getGradient(), color: '#fff', fontSize: '0.75rem', py: 0.5 }}>
              New Task
            </Button>
          )}
        </Stack>

        {/* Task Filters */}
        <TaskFilters
          currentFilter={taskFilter}
          onFilterChange={setTaskFilter}
          currentPriorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Results Count */}
        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mt: 1, mb: 1.5 }}>
          Showing {filteredTasks.length} of {localTasks.length} tasks
        </Typography>

        {/* Tasks List */}
        <Stack spacing={1}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleOpenTaskForm}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                canEdit={can.update_task}
                canDelete={can.delete_task}
              />
            ))
          ) : (
            <Paper sx={{ ...glassCardStyle, p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {localTasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </Typography>
              {localTasks.length === 0 && can.create_task && (
                <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenTaskForm()}
                  sx={{ borderColor: colors.primary, color: colors.primary, fontSize: '0.75rem', mt: 1 }}>
                  Create First Task
                </Button>
              )}
            </Paper>
          )}
        </Stack>
      </Box>

      {/* Dialogs */}
      <ProjectFormDialog
        open={openProjectForm}
        onClose={() => setOpenProjectForm(false)}
        onSubmit={handleUpdateProject}
        data={projectData}
        setData={setProjectData}
        isEditing={true}
      />

      <ProjectDeleteDialog
        open={openProjectDelete}
        onClose={() => setOpenProjectDelete(false)}
        onConfirm={handleDeleteProject}
        project={project}
      />

      <TaskFormDialog
        open={openTaskForm}
        onClose={handleCloseTaskForm}
        onSubmit={handleSubmitTask}
        data={taskData}
        setData={setTaskData}
        isEditing={!!editingTask}
      />

      <TaskDeleteDialog
        open={openTaskDelete}
        onClose={() => setOpenTaskDelete(false)}
        onConfirm={handleDeleteConfirm}
        task={taskToDelete}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{
            background: isDarkMode ? 'rgba(16,185,129,0.9)' : colors.success,
            color: '#fff',
            fontWeight: 500,
            '& .MuiAlert-icon': { color: '#fff' }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </AuthenticatedLayout>
  );
}
