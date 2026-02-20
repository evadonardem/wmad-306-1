import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  IconButton,
  Paper,
  Fade,
  Box, // Added missing Box import
} from '@mui/material';
import {
  WarningAmber,
  Close as CloseIcon,
  DeleteForever,
  FolderOpen,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import { motion } from 'framer-motion';

// Fix motion deprecation warning
const MotionPaper = motion.create(Paper);

export default function ProjectDeleteDialog({
  open,
  onClose,
  onConfirm,
  project,
}) {
  const { colors, isDarkMode } = useTheme();

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
      {/* Warning Accent Line */}
      <MotionPaper
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: colors.danger,
          transformOrigin: 'left',
        }}
      />

      <DialogTitle sx={{ p: 3, pb: 2 }}>
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
                background: colors.danger,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${colors.danger}40`,
              }}
            >
              <WarningAmber sx={{ color: '#fff', fontSize: 24 }} />
            </MotionPaper>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                Delete Project
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                This action cannot be undone
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
        <Stack spacing={3}>
          {/* Project Preview */}
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            sx={{
              p: 2,
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <FolderOpen sx={{ color: colors.primary, fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  {project?.title}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {project?.description || 'No description'}
                </Typography>
              </Box>
            </Stack>
          </MotionPaper>

          {/* Warning Messages */}
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              p: 2,
              background: isDarkMode ? `${colors.danger}15` : `${colors.danger}08`,
              borderRadius: '12px',
              border: `1px solid ${colors.danger}30`,
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: colors.danger, fontWeight: 600 }}>
                ⚠️ This action will permanently delete:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 1 }}>
                  • The project "{project?.title}"
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 1 }}>
                  • All tasks associated with this project
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 1 }}>
                  • All task history and data
                </Typography>
              </Stack>
            </Stack>
          </MotionPaper>
        </Stack>
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
          onClick={onConfirm}
          variant="contained"
          startIcon={<DeleteForever />}
          sx={{
            background: colors.danger,
            color: '#fff',
            borderRadius: '10px',
            px: 4,
            py: 1,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${colors.danger}40`,
            '&:hover': {
              background: colors.danger,
              opacity: 0.9,
              boxShadow: `0 12px 24px ${colors.danger}60`,
            },
          }}
        >
          Delete Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
