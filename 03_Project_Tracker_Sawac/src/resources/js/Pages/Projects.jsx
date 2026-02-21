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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

export default function Projects({ projects }) {
    const { data, setData, post, put, reset } = useForm({ title: '', description: '', id: null });
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
            put(`/projects/${data.id}`);
        } else {
            post('/projects');
        }

        setOpen(false);
        reset();
    }

    function edit(p) {
        setData({ title: p.title, description: p.description ?? '', id: p.id });
        setOpen(true);
    }

    function confirmDelete(id) {
        setToDelete(id);
        setConfirmOpen(true);
    }

    function remove() {
        Inertia.delete(`/projects/${toDelete}`);
        setConfirmOpen(false);
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Projects</h2>}>
            <div className="max-w-7xl mx-auto p-4">
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h5">Your Projects</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                        New Project
                    </Button>
                </Stack>

                <Grid container spacing={2}>
                    {projects.map((p) => (
                        <Grid item key={p.id} xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Typography variant="h6">{p.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{p.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">{p.tasks_count} tasks</Typography>
                                        </div>
                                        <div>
                                            <IconButton onClick={() => edit(p)} aria-label="edit"><EditIcon /></IconButton>
                                            <IconButton onClick={() => confirmDelete(p.id)} aria-label="delete"><DeleteIcon /></IconButton>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{data.id ? 'Edit Project' : 'Create Project'}</DialogTitle>
                    <form onSubmit={submit}>
                        <DialogContent>
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
                            />
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
                        <Typography>Are you sure you want to delete this project? This will remove all tasks.</Typography>
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
