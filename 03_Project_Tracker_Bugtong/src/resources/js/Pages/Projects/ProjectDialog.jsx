import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Inertia } from '@inertiajs/inertia';
import { useFeedback } from '../../components/Feedback';

export default function ProjectDialog({ open, onClose, onSuccess, project }) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const feedback = useFeedback();

  useEffect(() => {
    setForm({
      title: project?.title || '',
      description: project?.description || '',
    });
    setErrors({});
  }, [project, open]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/projects/${project.id}` : '/projects';
    Inertia[method](url, form, {
      onSuccess: () => {
        feedback.show(`Project ${isEdit ? 'updated' : 'created'}!`, 'success');
        setSubmitting(false);
        onSuccess && onSuccess();
      },
      onError: (err) => {
        setErrors(err);
        feedback.show('Please fix the errors.', 'error');
        setSubmitting(false);
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            required
            value={form.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>{isEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
