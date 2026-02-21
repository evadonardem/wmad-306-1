import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useForm, Link as InertiaLink } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    LinearProgress,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';

export default function Projects({ projects }) {
    const { data, setData, post, put, reset, processing } = useForm({ title: '', description: '', id: null });
    const errors = usePage().props.errors || {};
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
            put(`/projects/${data.id}`, {
                onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Project updated' } })),
            });
        } else {
            post('/projects', {
                onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Project created' } })),
            });
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
        Inertia.delete(`/projects/${toDelete}`, {
            onSuccess: () => window.dispatchEvent(new CustomEvent('app:notify', { detail: { message: 'Project deleted' } })),
        });
        setConfirmOpen(false);
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Projects</h2>}>
            <div className="max-w-7xl mx-auto p-4">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="h5">Your Projects</Typography>
                        <Typography variant="body2" color="text.secondary">Organize work, track progress, and collaborate.</Typography>
                    </Box>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                        New Project
                    </Button>
                </Stack>

                {projects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <FolderIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>No projects yet</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>No projects yet — start by creating your first project!</Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Create project</Button>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {projects.map((p) => {
                            const total = p.tasks_count || 0;
                            const done = p.completed_tasks_count || 0;
                            const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                            return (
                                <Grid item key={p.id} xs={12} sm={6} md={4}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 200ms, box-shadow 200ms', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                        <CardHeader
                                            avatar={<FolderIcon color="primary" />}
                                            action={(
                                                <Box>
                                                    <IconButton onClick={() => edit(p)} aria-label="edit"><EditIcon sx={{ fontSize: 20 }} /></IconButton>
                                                    <IconButton onClick={() => confirmDelete(p.id)} aria-label="delete"><DeleteIcon sx={{ fontSize: 20 }} /></IconButton>
                                                </Box>
                                            )}
                                            title={p.title}
                                            subheader={`${total} tasks • ${percent}% complete`}
                                            titleTypographyProps={{ variant: 'subtitle2' }}
                                            subheaderTypographyProps={{ variant: 'caption' }}
                                        />
                                        <CardContent sx={{ flex: 1, gap: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{p.description}</Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress variant="determinate" value={percent} sx={{ height: 6, borderRadius: 2 }} />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                                                <Button component={InertiaLink} href={route('tasks.index') + `?project=${p.id}`} size="small">View Tasks</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" aria-labelledby="project-form-title">
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
                                    placeholder="Short, descriptive title"
                                    error={Boolean(errors.title)}
                                />
                                {errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
                            <TextField
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Optional: add context or goals"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} aria-label="cancel-project">Cancel</Button>
                            <Button type="submit" variant="contained" disabled={processing} aria-label="submit-project">
                                {processing ? <CircularProgress size={20} color="inherit" /> : (data.id ? 'Update' : 'Create')}
                            </Button>
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
