import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FolderKanban, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProjectsIndex({ projects }) {
    const [editingProject, setEditingProject] = useState(null);

    const createForm = useForm({
        title: '',
        description: '',
    });

    const editForm = useForm({
        title: '',
        description: '',
    });

    const sortedProjects = useMemo(() => {
        return [...(projects ?? [])].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }, [projects]);

    const openEdit = (project) => {
        setEditingProject(project);
        editForm.setData({
            title: project.title ?? '',
            description: project.description ?? '',
        });
    };

    const closeEdit = () => {
        setEditingProject(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('projects.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingProject) return;

        editForm.put(route('projects.update', editingProject.id), {
            onSuccess: () => closeEdit(),
        });
    };

    const deleteProject = (projectId) => {
        router.delete(route('projects.destroy', projectId));
    };

    const headerCellSx = {
        fontSize: 13,
        fontWeight: 950,
        letterSpacing: 0.12,
        textTransform: 'uppercase',
        color: 'text.secondary',
        py: 1.75,
    };

    return (
        <AuthenticatedLayout
            header={
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={(theme) => ({
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.14),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                        })}
                    >
                        <FolderKanban size={18} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={900}>
                            Projects
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create projects and manage tasks inside each one.
                        </Typography>
                    </Box>
                </Stack>
            }
        >
            <Head title="Projects" />

            <Stack spacing={3}>
                <Paper
                    component="form"
                    onSubmit={submitCreate}
                    sx={{ p: 2 }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                    >
                        <TextField
                            fullWidth
                            label="Title"
                            value={createForm.data.title}
                            onChange={(e) => createForm.setData('title', e.target.value)}
                            error={Boolean(createForm.errors.title)}
                            helperText={createForm.errors.title}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={createForm.data.description}
                            onChange={(e) => createForm.setData('description', e.target.value)}
                            error={Boolean(createForm.errors.description)}
                            helperText={createForm.errors.description}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={createForm.processing}
                            sx={{
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                minHeight: 56,
                                px: 2.25,
                                lineHeight: 1.2,
                                '& .MuiButton-startIcon svg': {
                                    display: 'block',
                                },
                            }}
                            startIcon={<Plus size={18} />}
                        >
                            Add Project
                        </Button>
                    </Stack>
                </Paper>

                <Paper sx={{ overflow: 'hidden' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headerCellSx}>TITLE</TableCell>
                                <TableCell sx={headerCellSx}>DESCRIPTION</TableCell>
                                <TableCell align="right" sx={headerCellSx}>
                                    TASKS
                                </TableCell>
                                <TableCell align="right" sx={headerCellSx}>
                                    ACTIONS
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography variant="body2">
                                            No projects yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedProjects.map((project) => (
                                    <TableRow key={project.id} hover>
                                        <TableCell>
                                            <Typography fontWeight={700}>
                                                {project.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{project.description ?? ''}</TableCell>
                                        <TableCell align="right">
                                            {project.tasks_count ?? 0}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    component={Link}
                                                    size="small"
                                                    variant="outlined"
                                                    href={route('projects.tasks.index', project.id)}
                                                    startIcon={<ListChecks size={16} />}
                                                >
                                                    Tasks
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => openEdit(project)}
                                                    startIcon={<Pencil size={16} />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => deleteProject(project.id)}
                                                    startIcon={<Trash2 size={16} />}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>

            <Dialog open={Boolean(editingProject)} onClose={closeEdit} fullWidth>
                <DialogTitle>Edit Project</DialogTitle>
                <Box component="form" onSubmit={submitEdit}>
                    <DialogContent>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData('title', e.target.value)
                                }
                                error={Boolean(editForm.errors.title)}
                                helperText={editForm.errors.title}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                error={Boolean(editForm.errors.description)}
                                helperText={editForm.errors.description}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEdit}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={editForm.processing}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </AuthenticatedLayout>
    );
}
