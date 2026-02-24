// MUI Project Show Page stub (hosts tasks)
import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, Link } from '@inertiajs/react';
import {
  Box, Typography, IconButton, Stack, Paper, Button, Divider, Breadcrumbs, AppBar, Toolbar, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskList from '../Tasks/TaskList';

export default function ProjectShow({ project, tasks, projects: allProjects }) {
  // If using Inertia shared props, fallback to usePage
  const page = usePage();
  const proj = project || page.props.project;
  const taskList = tasks || page.props.tasks;
  const projects = allProjects || page.props.projects || [];
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDelete = () => {
    if (window.confirm('Delete this project?')) {
      Inertia.delete(`/projects/${proj.id}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Project Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button selected={false} onClick={() => Inertia.visit('/projects')}>
            <ListItemText primary="Projects" />
          </ListItem>
          {projects.map((p) => (
            <ListItem
              button
              key={p.id}
              selected={proj.id === p.id}
              onClick={() => Inertia.visit(`/projects/${p.id}`)}
            >
              <ListItemText primary={p.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Breadcrumbs sx={{ mb: 2, mt: 2 }}>
        <Link href="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>Projects</Link>
        <Typography color="text.primary">{proj.title}</Typography>
      </Breadcrumbs>
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton component={Link} href="/projects" aria-label="Back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{proj.title}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton component={Link} href={`/projects/${proj.id}/edit`} aria-label="Edit">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} aria-label="Delete" color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>{proj.description}</Typography>
      </Paper>
      <Divider sx={{ mb: 2 }}>Tasks</Divider>
      <TaskList projectId={proj.id} tasks={taskList} />
      <Box sx={{ mt: 3 }}>
        <Button component={Link} href="/projects" variant="outlined">Back to Projects</Button>
      </Box>
    </Box>
  );
}
