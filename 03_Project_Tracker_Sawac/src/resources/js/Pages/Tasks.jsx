import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Grid,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    InputLabel,
    FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

export default function Tasks({ tasks, projects }) {
    const { data, setData, post, put, reset } = useForm({ project_id: '', title: '', description: '', priority: 'medium', id: null });
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    function openCreate() {
        reset();
        setOpen(true);
    }

    function submit(e) {
        e.preventDefault();

        if (data.id) {
            put(`/tasks/${data.id}`);
        } else {
            post('/tasks');
        }

        setOpen(false);
        reset();
    }

    function edit(t) {
        setData({ project_id: t.project_id, title: t.title, description: t.description ?? '', priority: t.priority ?? 'medium', id: t.id });
        setOpen(true);
    }

    function confirmDelete(id) {
        setToDelete(id);
        setConfirmOpen(true);
    }

    function remove() {
        Inertia.delete(`/tasks/${toDelete}`);
        setConfirmOpen(false);
    }

    function toggle(id) {
        post(`/tasks/${id}/toggle-status`);
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Tasks</h2>}>
            <div className="max-w-7xl mx-auto p-4">
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h5">Tasks</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                        New Task
                    </Button>
                </Stack>

                <Grid container spacing={2}>
                    {tasks.map((t) => (
                        <Grid item key={t.id} xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Typography variant="h6">{t.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{t.description}</Typography>
                                            <div className="mt-2">
                                                <Chip label={t.priority} size="small" sx={{ mr: 1 }} />
                                                <Chip label={t.status} color={t.status === 'done' ? 'success' : 'default'} size="small" />
                                            </div>
                                            <Typography variant="caption" color="text.secondary">Project: {t.project?.title ?? t.project_id}</Typography>
                                        </div>
                                        <div>
                                            <Button variant="outlined" onClick={() => toggle(t.id)} sx={{ mr: 1 }}>{t.status === 'done' ? 'Reopen' : 'Complete'}</Button>
                                            <IconButton onClick={() => edit(t)} aria-label="edit"><EditIcon /></IconButton>
                                            <IconButton onClick={() => confirmDelete(t.id)} aria-label="delete"><DeleteIcon /></IconButton>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{data.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
                    <form onSubmit={submit}>
                        <DialogContent>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="project-select-label">Project</InputLabel>
                                <Select
                                    labelId="project-select-label"
                                    value={data.project_id}
                                    label="Project"
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    required
                                >
                                    {projects.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="priority-select-label">Priority</InputLabel>
                                <Select
                                    labelId="priority-select-label"
                                    value={data.priority}
                                    label="Priority"
                                    onChange={(e) => setData('priority', e.target.value)}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained">{data.id ? 'Update' : 'Create'}</Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm delete</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this task?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button color="error" startIcon={<DeleteForeverIcon />} onClick={remove}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
