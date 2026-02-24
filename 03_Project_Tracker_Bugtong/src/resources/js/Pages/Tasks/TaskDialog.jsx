import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Inertia } from '@inertiajs/inertia';
import { useFeedback } from '../../components/Feedback';

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];
const statuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function TaskDialog({ open, onClose, onSuccess, task, project }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const feedback = useFeedback();

  useEffect(() => {
    setForm({
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'todo',
    });
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const method = isEdit ? 'put' : 'post';
    const url = isEdit ? `/tasks/${task.id}` : `/projects/${project.id}/tasks`;
    Inertia[method](url, form, {
      onSuccess: () => {
        feedback.show(`Task ${isEdit ? 'updated' : 'created'}!`, 'success');
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={form.priority}
              label="Priority"
              onChange={handleChange}
            >
              {priorities.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              {statuses.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>{isEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
