import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';

export default function TaskDeleteDialog({
  open,
  onClose,
  onConfirm,
  task,
}) {
  const { colors, isDarkMode } = useTheme();

  const glassStyle = {
    background: isDarkMode ? 'rgba(17, 25, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: glassStyle,
      }}
    >
      <DialogTitle sx={{
        color: colors.danger,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <WarningAmber sx={{ color: colors.danger, fontSize: 20 }} />
        Delete Task
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Are you sure you want to delete "{task?.title}"?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: colors.textSecondary }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: colors.danger,
            color: '#fff',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
