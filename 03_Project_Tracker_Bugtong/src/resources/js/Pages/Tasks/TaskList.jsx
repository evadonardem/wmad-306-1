import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {
  Box, Typography, IconButton, Paper, Stack, Chip, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StatusChip from '../../components/StatusChip';
import PriorityChip from '../../components/PriorityChip';
import TaskForm from '../../components/TaskForm';

export default function TaskList({ projectId, tasks = [] }) {
  const [showForm, setShowForm] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '' });

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };
  const handleDelete = (task) => {
    if (window.confirm('Delete this task?')) {
      Inertia.delete(`/projects/${projectId}/tasks/${task.id}`);
    }
  };
  const handleFormSuccess = (msg) => {
    setSnackbar({ open: true, message: msg });
    setShowForm(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditTask(null); setShowForm(true); }}>
          Add Task
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No tasks found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {tasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell><StatusChip status={task.status} /></TableCell>
                <TableCell><PriorityChip priority={task.priority} /></TableCell>
                <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit"><IconButton onClick={() => handleEdit(task)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => handleDelete(task)} color="error"><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        projectId={projectId}
        task={editTask}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
