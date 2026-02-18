import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@/Context/ThemeContext';
import { getGlassStyles } from '@/Utils/theme';
import { Close as CloseIcon, Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  data,
  setData,
  isEditing,
}) {
  const { isDarkMode, colors } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const priorityColors = {
    low: '#10B981',       // Green
    medium: '#F59E0B',    // Amber
    high: '#EF4444',      // Red
    1: '#10B981',         // Green (legacy)
    2: '#F59E0B',         // Amber (legacy)
    3: '#EF4444',         // Red (legacy)
  };

  const statusColors = {
    pending: '#6366F1',      // Primary blue
    in_progress: '#F59E0B',  // Amber
    completed: '#10B981',    // Green
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 250, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isDarkMode
            ? 'rgba(71, 85, 105, 0.3)'
            : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: '24px',
          boxShadow: isDarkMode
            ? '0 20px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
            : '0 20px 60px -12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        },
      }}
      TransitionComponent={motion.div}
      transitionDuration={{ enter: 300, exit: 200 }}
    >
      {/* Glass shine effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          opacity: 0.5,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          borderRadius: '24px 24px 0 0',
        }}
      />

      <DialogTitle
        sx={{
          color: colors.textPrimary,
          fontSize: '1.5rem',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: `1px solid ${isDarkMode
            ? 'rgba(71, 85, 105, 0.2)'
            : 'rgba(229, 231, 235, 0.3)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? '✏️ Edit Task' : '➕ Create New Task'}
        </Box>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 0,
            width: 32,
            height: 32,
            borderRadius: '8px',
            color: colors.textSecondary,
            '&:hover': {
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
              color: colors.textPrimary,
            },
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <MotionBox
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title Field */}
          <Box>
            <TextField
              label="Task Title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter task title..."
              InputLabelProps={{
                sx: {
                  color: `${colors.textSecondary} !important`,
                  '&.Mui-focused': {
                    color: `${colors.primary} !important`,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  fontSize: '0.95rem',
                  '& fieldset': {
                    borderColor: isDarkMode
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: colors.textSecondary,
                  opacity: 0.5,
                },
              }}
            />
          </Box>

          {/* Description Field */}
          <Box>
            <TextField
              label="Description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Add task description..."
              InputLabelProps={{
                sx: {
                  color: `${colors.textSecondary} !important`,
                  '&.Mui-focused': {
                    color: `${colors.primary} !important`,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  fontSize: '0.95rem',
                  '& fieldset': {
                    borderColor: isDarkMode
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(229, 231, 235, 0.5)',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: colors.textSecondary,
                  opacity: 0.5,
                },
              }}
            />
          </Box>

          {/* Priority and Status Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {/* Priority Select */}
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: `${colors.textSecondary} !important`,
                  '&.Mui-focused': {
                    color: `${colors.primary} !important`,
                  },
                }}
              >
                Priority
              </InputLabel>
              <Select
                value={data.priority || 'medium'}
                onChange={(e) => setData('priority', e.target.value)}
                label="Priority"
                sx={{
                  color: colors.textPrimary,
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(229, 231, 235, 0.5)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                  '& .MuiSvgIcon-root': {
                    color: colors.primary,
                  },
                }}
              >
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: priorityColors.low,
                      }}
                    />
                    Low
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: priorityColors.medium,
                      }}
                    />
                    Medium
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: priorityColors.high,
                      }}
                    />
                    High
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Status Select */}
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: `${colors.textSecondary} !important`,
                  '&.Mui-focused': {
                    color: `${colors.primary} !important`,
                  },
                }}
              >
                Status
              </InputLabel>
              <Select
                value={data.status || 'pending'}
                onChange={(e) => setData('status', e.target.value)}
                label="Status"
                sx={{
                  color: colors.textPrimary,
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(229, 231, 235, 0.5)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                  '& .MuiSvgIcon-root': {
                    color: colors.primary,
                  },
                }}
              >
                <MenuItem value="pending">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusColors.pending,
                      }}
                    />
                    Pending
                  </Box>
                </MenuItem>                <MenuItem value="in_progress">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusColors.in_progress,
                      }}
                    />
                    In Progress
                  </Box>
                </MenuItem>                <MenuItem value="completed">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusColors.completed,
                      }}
                    />
                    Completed
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </MotionBox>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          borderTop: `1px solid ${isDarkMode
            ? 'rgba(71, 85, 105, 0.2)'
            : 'rgba(229, 231, 235, 0.3)'}`,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: colors.textSecondary,
            borderRadius: '10px',
            textTransform: 'capitalize',
            fontSize: '0.95rem',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            '&:hover': {
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: '#fff',
            borderRadius: '10px',
            textTransform: 'capitalize',
            fontSize: '0.95rem',
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: `0 4px 15px ${isDarkMode
              ? 'rgba(99, 102, 241, 0.2)'
              : 'rgba(79, 70, 229, 0.2)'}`,
            '&:hover': {
              filter: 'brightness(1.1)',
              boxShadow: `0 8px 25px ${isDarkMode
                ? 'rgba(99, 102, 241, 0.3)'
                : 'rgba(79, 70, 229, 0.3)'}`,
            },
          }}
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
