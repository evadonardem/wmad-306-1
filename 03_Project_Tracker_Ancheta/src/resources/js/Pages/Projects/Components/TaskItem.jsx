import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Pending,
  Schedule,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
  canDelete,
}) {
  const { colors, isDarkMode } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(task.status);

  // Update local status when task prop changes (after successful update)
  useEffect(() => {
    setLocalStatus(task.status);
    setIsUpdating(false);
  }, [task.status]);

  const getPriorityColor = (priority) => {
    return priority === 'high' ? colors.danger : priority === 'medium' ? colors.warning : colors.success;
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return colors.success;
      case 'in_progress': return colors.info;
      default: return colors.warning;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'in_progress': return <Schedule sx={{ fontSize: 16 }} />;
      default: return <Pending sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    // Don't update if status hasn't changed
    if (newStatus === task.status) return;

    // Update local state immediately for responsive UI
    setLocalStatus(newStatus);
    setIsUpdating(true);

    // Call the parent handler
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  const glassCardStyle = {
    background: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      // Remove layout animation completely
    >
      <Paper
        sx={{
          ...glassCardStyle,
          p: 2,
          opacity: 1,
          '&:hover': {
            borderColor: colors.primary,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Status Dropdown */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={localStatus}
              onChange={handleStatusChange}
              disabled={!canEdit || isUpdating}
              sx={{
                height: 36,
                backgroundColor: isDarkMode
                  ? `${getStatusColor(localStatus)}20`
                  : `${getStatusColor(localStatus)}10`,
                color: getStatusColor(localStatus),
                fontSize: '0.8rem',
                fontWeight: 600,
                opacity: isUpdating ? 0.5 : 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode
                    ? `${getStatusColor(localStatus)}40`
                    : `${getStatusColor(localStatus)}30`,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: getStatusColor(localStatus),
                },
                '& .MuiSelect-select': {
                  py: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                },
                '& .MuiSvgIcon-root': {
                  color: getStatusColor(localStatus),
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: isDarkMode ? '#1e293b' : '#ffffff',
                    backgroundImage: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    mt: 0.5,
                  }
                },
              }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(value)}
                  <Typography sx={{ color: getStatusColor(value), fontSize: '0.8rem', fontWeight: 600 }}>
                    {getStatusLabel(value)}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem
                value="pending"
                sx={{
                  py: 1,
                  borderBottom: `1px solid ${colors.border}`,
                  '&:hover': { bgcolor: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Pending sx={{ fontSize: 18, color: colors.warning }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>Pending</Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>Task is waiting to start</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem
                value="in_progress"
                sx={{
                  py: 1,
                  borderBottom: `1px solid ${colors.border}`,
                  '&:hover': { bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Schedule sx={{ fontSize: 18, color: colors.info }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>In Progress</Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>Task is actively being worked on</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem
                value="completed"
                sx={{
                  py: 1,
                  '&:hover': { bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircle sx={{ fontSize: 18, color: colors.success }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>Completed</Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>Task is finished</Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Task Content */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: colors.textPrimary,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  opacity: task.status === 'completed' ? 0.7 : 1,
                }}
              >
                {task.title}
              </Typography>
              <Chip
                label={getPriorityLabel(task.priority)}
                size="small"
                sx={{
                  height: 20,
                  backgroundColor: isDarkMode
                    ? `${getPriorityColor(task.priority)}30`
                    : `${getPriorityColor(task.priority)}15`,
                  color: getPriorityColor(task.priority),
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Stack>

            {task.description && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.textSecondary,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {task.description}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={0.5}>
            {canEdit && (
              <Tooltip title="Edit Task">
                <IconButton
                  size="small"
                  onClick={() => onEdit(task)}
                  disabled={isUpdating}
                  sx={{
                    color: colors.primary,
                    padding: 0.5,
                  }}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete Task">
                <IconButton
                  size="small"
                  onClick={() => onDelete(task)}
                  disabled={isUpdating}
                  sx={{
                    color: colors.danger,
                    padding: 0.5,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Paper>
    </MotionBox>
  );
}
