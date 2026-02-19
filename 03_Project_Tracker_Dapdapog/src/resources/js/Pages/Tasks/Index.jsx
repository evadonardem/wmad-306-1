import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';

export default function TasksIndex({ project }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');

  const submit = (e) => {
    e.preventDefault();
    Inertia.post(`/projects/${project.id}/tasks`, { title, description, priority });
  };

  const destroy = (id) => {
    if (confirm('Delete this task?')) {
      Inertia.delete(`/tasks/${id}`);
    }
  };

  const toggle = (id) => {
    Inertia.post(`/tasks/${id}/toggle-status`);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Tasks for: {project.title}
      </Typography>

      <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create Task
        </Button>
      </form>

      {project.tasks.map((task) => (
        <Card key={task.id} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">
              {task.title} ({task.priority})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {task.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {task.status}
            </Typography>
            <Button
              size="small"
              color="secondary"
              onClick={() => destroy(task.id)}
            >
              Delete
            </Button>
            <Button size="small" onClick={() => toggle(task.id)}>
              Toggle Status
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
