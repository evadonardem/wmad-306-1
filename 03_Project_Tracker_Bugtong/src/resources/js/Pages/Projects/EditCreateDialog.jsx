import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack
} from '@mui/material';

export default function EditCreateDialog({ open, onClose, onSuccess, project }) {
  const isEdit = Boolean(project);
  const [form, setForm] = React.useState({
    title: project?.title || '',
    description: project?.description || ''
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setForm({
      title: project?.title || '',
      description: project?.description || ''
    });
    setErrors({});
  }, [project, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const url = isEdit ? `/projects/${project.id}` : '/projects';
    const method = isEdit ? 'put' : 'post';
    Inertia[method](url, form, {
      onError: (errs) => setErrors(errs),
      onSuccess: () => {
        onSuccess(isEdit ? 'Project updated!' : 'Project created!');
        setForm({ title: '', description: '' });
      },
      onFinish: () => setSubmitting(false)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
