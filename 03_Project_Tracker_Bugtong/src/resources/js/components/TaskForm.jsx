import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem
} from '@mui/material';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export default function TaskForm({ open, onClose, onSuccess, projectId, task }) {
  const isEdit = Boolean(task);
  const [form, setForm] = React.useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    due_date: task?.due_date ? task.due_date.slice(0, 10) : ''
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setForm({
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      due_date: task?.due_date ? task.due_date.slice(0, 10) : ''
    });
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const url = isEdit ? `/projects/${projectId}/tasks/${task.id}` : `/projects/${projectId}/tasks`;
    const method = isEdit ? 'put' : 'post';
    Inertia[method](url, form, {
      onError: (errs) => setErrors(errs),
      onSuccess: () => {
        onSuccess(isEdit ? 'Task updated!' : 'Task created!');
        setForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
      },
      onFinish: () => setSubmitting(false)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Task' : 'New Task'}</DialogTitle>
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
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              error={Boolean(errors.status)}
              helperText={errors.status}
              fullWidth
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              error={Boolean(errors.priority)}
              helperText={errors.priority}
              fullWidth
            >
              {priorityOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              error={Boolean(errors.due_date)}
              helperText={errors.due_date}
              fullWidth
              InputLabelProps={{ shrink: true }}
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
