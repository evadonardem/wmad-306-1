import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

export default function ProjectsIndex({ projects }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = (e) => {
    e.preventDefault();
    Inertia.post('/projects', { title, description });
  };

  const destroy = (id) => {
    if (confirm('Delete this project?')) {
      Inertia.delete(`/projects/${id}`);
    }
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Your Projects
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
        <Button type="submit" variant="contained" color="primary">
          Create Project
        </Button>
      </form>

      {projects.map((project) => (
        <Card key={project.id} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">{project.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {project.description}
            </Typography>
            <Button
              size="small"
              color="secondary"
              onClick={() => destroy(project.id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              onClick={() => Inertia.get(`/projects/${project.id}`)}
            >
              View Tasks
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
