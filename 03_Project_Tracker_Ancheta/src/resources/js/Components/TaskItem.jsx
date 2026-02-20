import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@/Context/ThemeContext';
import { getGlassCardStyles } from '@/Utils/theme';

const MotionCard = motion(Card);

const priorityColors = {
  1: '#10B981', // low - green
  2: '#F59E0B', // medium - amber
  3: '#EF4444', // high - red
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const statusColors = {
  pending: '#6366F1',      // Primary blue
  in_progress: '#F59E0B',  // Amber
  completed: '#34D399',    // Green
};

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit,
  canDelete,
  isDragging,
}) {
  const { isDarkMode, colors } = useTheme();
  const isCompleted = task.status === 'completed';

  const getPriorityLabel = (priority) => {
    if (typeof priority === 'number') {
      return ['Low', 'Medium', 'High'][priority - 1] || 'Medium';
    }
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  const priorityColor = priorityColors[task.priority] || priorityColors[2];
  const statusColor = statusColors[task.status] || statusColors.pending;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <MotionCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -2, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' }}
      className="task-item"
      sx={{
        ...getGlassCardStyles(isDarkMode),
        opacity: isCompleted ? 0.75 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `2px solid ${isDarkMode
          ? 'rgba(71, 85, 105, 0.2)'
          : 'rgba(229, 231, 235, 0.5)'}`,
        '&:hover': {
          borderColor: isDarkMode
            ? 'rgba(99, 102, 241, 0.3)'
            : 'rgba(79, 70, 229, 0.2)',
          background: isDarkMode
            ? 'rgba(30, 41, 59, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          {/* Checkbox */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Checkbox
              checked={isCompleted}
              onChange={() => onToggleStatus(task.id)}
              sx={{
                color: colors.primary,
                '&.Mui-checked': {
                  color: statusColor,
                },
                mt: 0.5,
                p: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          </motion.div>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: colors.textPrimary,
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: isCompleted ? 'line-through' : 'none',
                wordBreak: 'break-word',
                transition: 'all 0.2s ease',
                opacity: isCompleted ? 0.8 : 1,
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSecondary,
                  mt: 0.75,
                  wordBreak: 'break-word',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* Status and Priority Badges */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={getPriorityLabel(task.priority)}
                  size="small"
                  sx={{
                    background: priorityColor,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    boxShadow: `0 2px 8px ${priorityColor}40`,
                    '&:hover': {
                      boxShadow: `0 4px 12px ${priorityColor}60`,
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={isCompleted ? '✓ Completed' : '⏱ Pending'}
                  size="small"
                  sx={{
                    background: statusColor,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    boxShadow: `0 2px 8px ${statusColor}40`,
                    '&:hover': {
                      boxShadow: `0 4px 12px ${statusColor}60`,
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              </motion.div>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
            {canEdit && (
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
              >
                <IconButton
                  size="small"
                  onClick={() => onEdit(task)}
                  sx={{
                    color: colors.primary,
                    borderRadius: '8px',
                    width: 36,
                    height: 36,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'rgba(79, 70, 229, 0.1)',
                      color: colors.secondary,
                      transform: 'rotate(5deg)',
                    },
                  }}
                  title="Edit task"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}

            {canDelete && (
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    if (confirm('Delete this task?')) {
                      onDelete(task.id);
                    }
                  }}
                  sx={{
                    color: colors.danger || '#EF4444',
                    borderRadius: '8px',
                    width: 36,
                    height: 36,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      transform: 'rotate(-5deg)',
                    },
                  }}
                  title="Delete task"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </Stack>
        </Box>
      </CardContent>
    </MotionCard>
  );
}
