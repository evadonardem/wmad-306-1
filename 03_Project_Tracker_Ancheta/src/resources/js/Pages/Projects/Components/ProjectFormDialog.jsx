import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Paper,
  Fade,
  Box, // Added missing Box import
} from '@mui/material';
import {
  Close as CloseIcon,
  FolderOpen as FolderIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import { motion } from 'framer-motion';

// Fix motion deprecation warning
const MotionPaper = motion.create(Paper);

export default function ProjectFormDialog({
  open,
  onClose,
  onSubmit,
  data = { title: '', description: '' },
  setData,
  errors = {},
  isEditing = false,
}) {
  const { colors, isDarkMode, getGradient } = useTheme();

  // Safely access data properties with fallbacks
  const title = data?.title || '';
  const description = data?.description || '';

  const glassStyle = {
    background: isDarkMode
      ? 'rgba(17, 25, 40, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    boxShadow: isDarkMode
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          ...glassStyle,
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      {/* Gradient Accent Line */}
      <MotionPaper
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: getGradient(),
          transformOrigin: 'left',
        }}
      />

      {/* Header with Gradient Background */}
      <DialogTitle sx={{
        p: 3,
        pb: 2,
        background: isDarkMode
          ? 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 100%)',
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <MotionPaper
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '16px',
                background: getGradient(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${colors.primary}40`,
              }}
            >
              <FolderIcon sx={{ color: '#fff', fontSize: 24 }} />
            </MotionPaper>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                {isEditing ? 'Update your project details' : 'Start organizing your tasks'}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.textSecondary,
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        bgcolor: 'transparent',
      }}>
        <form id="project-form" onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Title Field */}
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              sx={{
                p: 2,
                background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderRadius: '16px',
                border: `1px solid ${errors.title ? colors.danger : colors.border}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <FolderIcon sx={{ color: colors.primary, fontSize: 20, mt: 1 }} />
                <TextField
                  label="Project Title"
                  size="small"
                  fullWidth
                  required
                  value={title}
                  onChange={e => setData?.('title', e.target.value)}
                  error={!!errors?.title}
                  helperText={errors?.title}
                  placeholder="e.g., Website Redesign, Mobile App Development"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: colors.textSecondary,
                      fontSize: '0.9rem',
                    },
                    '& .MuiInputBase-root': {
                      color: colors.textPrimary,
                      fontSize: '1rem',
                      mt: 1,
                    },
                  }}
                />
              </Stack>
            </MotionPaper>

            {/* Description Field */}
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                p: 2,
                background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <DescriptionIcon sx={{ color: colors.secondary, fontSize: 20, mt: 1 }} />
                <TextField
                  label="Description"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={e => setData?.('description', e.target.value)}
                  placeholder="Describe what this project is about, its goals, and any important details..."
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: colors.textSecondary,
                      fontSize: '0.9rem',
                    },
                    '& .MuiInputBase-root': {
                      color: colors.textPrimary,
                      fontSize: '0.95rem',
                      mt: 1,
                      lineHeight: 1.6,
                    },
                  }}
                />
              </Stack>
            </MotionPaper>

            {/* Policy Info */}
            <MotionPaper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              sx={{
                p: 2,
                background: isDarkMode ? `${colors.primary}10` : `${colors.primary}08`,
                borderRadius: '12px',
                border: `1px solid ${colors.primary}30`,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                <strong>Note:</strong> Only you can {isEditing ? 'edit' : 'create'} projects.
                Projects are private to your account and cannot be accessed by other users.
              </Typography>
            </MotionPaper>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: colors.textSecondary,
            borderRadius: '10px',
            px: 3,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="project-form"
          variant="contained"
          sx={{
            background: getGradient(),
            color: '#fff',
            borderRadius: '10px',
            px: 4,
            py: 1,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${colors.primary}40`,
            '&:hover': {
              opacity: 0.9,
              boxShadow: `0 12px 24px ${colors.primary}60`,
            },
          }}
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
