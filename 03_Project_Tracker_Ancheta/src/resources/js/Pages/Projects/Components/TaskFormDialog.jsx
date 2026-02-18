import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@/Context/ThemeContext';

export default function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  data = { title: '', description: '', priority: 'medium' }, // Default values
  setData,
  isEditing = false,
}) {
  const { colors, isDarkMode, getGradient } = useTheme();

  // Safely access data properties with fallbacks
  const title = data?.title || '';
  const description = data?.description || '';
  const priority = data?.priority || 'medium';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
        },
      }}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: '1.1rem' }}>
          {isEditing ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              size="small"
              fullWidth
              required
              value={title}
              onChange={e => setData?.('title', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />
            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={e => setData?.('description', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: colors.textSecondary }}>Priority</InputLabel>
              <Select
                value={priority}
                onChange={e => setData?.('priority', e.target.value)}
                label="Priority"
                sx={{
                  color: colors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} size="small" sx={{ color: colors.textSecondary }}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="small"
            variant="contained"
            sx={{
              background: getGradient(),
              color: '#fff',
              px: 3,
              '&:hover': { opacity: 0.9 },
            }}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
