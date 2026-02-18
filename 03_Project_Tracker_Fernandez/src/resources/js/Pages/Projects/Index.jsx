import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Container,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';

export default function Index({ projects }) {
    const theme = useTheme();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        title: '',
        description: '',
    });

    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editing, setEditing] = useState({ title: '', description: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => reset(),
        });
    };

    const startEdit = (project) => {
        setEditingProjectId(project.id);
        setEditing({
            title: project.title ?? '',
            description: project.description ?? '',
        });
    };

    const cancelEdit = () => {
        setEditingProjectId(null);
        setEditing({ title: '', description: '' });
    };

    const updateProject = (projectId) => {
        router.patch(route('projects.update', projectId), editing, {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteProject = (projectId) => {
        if (!confirm('Delete this project?')) return;

        router.delete(route('projects.destroy', projectId), {
            preserveScroll: true,
        });
    };

    const scrollToCreateProjectForm = () => {
        const target = document.getElementById('new-project-form');
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const input = document.getElementById('new-project-title');
        if (input) {
            requestAnimationFrame(() => input.focus());
        }
    };

    const unfinishedProjects = useMemo(
        () =>
            projects.filter((project) => {
                const total = project.tasks_count ?? 0;
                const done = project.tasks_completed_count ?? 0;
                return !(total > 0 && total === done);
            }),
        [projects],
    );

    const finishedProjects = useMemo(
        () =>
            projects.filter((project) => {
                const total = project.tasks_count ?? 0;
                const done = project.tasks_completed_count ?? 0;
                return total > 0 && total === done;
            }),
        [projects],
    );

    const renderProjectCard = (project) => {
        const isEditing = editingProjectId === project.id;

        return (
            <Card key={project.id} variant="outlined">
                {isEditing ? (
                    <CardContent>
                        <Stack spacing={1.5}>
                            <TextField
                                label="Title"
                                value={editing.title}
                                onChange={(e) =>
                                    setEditing((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={editing.description}
                                onChange={(e) =>
                                    setEditing((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                fullWidth
                                multiline
                                minRows={3}
                            />
                        </Stack>
                    </CardContent>
                ) : (
                    <Box sx={{ position: 'relative' }}>
                        <CardActionArea
                            sx={{
                                borderRadius: 1,
                                '&:hover .open-project-overlay': {
                                    opacity: 1,
                                    transform: 'translate(-50%, -50%)',
                                },
                            }}
                            onClick={() => router.visit(route('projects.show', project.id))}
                        >
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Typography variant="h6">
                                        {project.title}
                                    </Typography>
                                    {project.description ? (
                                        <Typography color="text.secondary">
                                            {project.description}
                                        </Typography>
                                    ) : null}
                                    <Typography variant="body2" color="text.secondary">
                                        Tasks: {project.tasks_count}
                                    </Typography>
                                </Stack>
                            </CardContent>

                            <Box
                                className="open-project-overlay"
                                sx={(theme) => ({
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, calc(-50% + 6px))',
                                    width: 34,
                                    height: 34,
                                    borderRadius: '50%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                    opacity: 0,
                                    transition: 'all 180ms ease',
                                    pointerEvents: 'none',
                                })}
                            >
                                <Pencil size={16} />
                            </Box>
                        </CardActionArea>
                    </Box>
                )}

                <CardActions sx={{ px: 2, pb: 2 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ width: '100%' }}
                        justifyContent="flex-end"
                    >
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={cancelEdit}
                                    variant="text"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        updateProject(project.id)
                                    }
                                    variant="contained"
                                    startIcon={<Pencil size={18} />}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Tooltip title="Delete project">
                                <IconButton
                                    onClick={() =>
                                        deleteProject(project.id)
                                    }
                                    color="error"
                                    aria-label="Delete project"
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </CardActions>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout
            header="Projects"
        >
            <Head title="Projects" />

            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        opacity: 0.45,
                        backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(
                            theme.palette.primary.main,
                            0.22,
                        )} 0%, transparent 35%), radial-gradient(circle at 90% 30%, ${alpha(
                            theme.palette.secondary.main,
                            0.18,
                        )} 0%, transparent 40%), radial-gradient(circle at 35% 90%, ${alpha(
                            theme.palette.primary.main,
                            0.14,
                        )} 0%, transparent 45%)`,
                    }}
                />

                <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                <Stack spacing={3}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={scrollToCreateProjectForm}
                        >
                            New Project
                        </Button>
                    </Stack>

                    <Stack spacing={2}>
                        {projects.length === 0 ? (
                            <Typography color="text.secondary">
                                No projects yet.
                            </Typography>
                        ) : (
                            <>
                                {unfinishedProjects.length > 0 ? (
                                    <>
                                        <Divider textAlign="left">
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                Unfinished
                                            </Typography>
                                        </Divider>
                                        {unfinishedProjects.map(renderProjectCard)}
                                    </>
                                ) : null}

                                {finishedProjects.length > 0 ? (
                                    <>
                                        <Divider textAlign="left">
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                Finished
                                            </Typography>
                                        </Divider>
                                        {finishedProjects.map(renderProjectCard)}
                                    </>
                                ) : null}
                            </>
                        )}
                    </Stack>

                    <Divider />

                    <Card id="new-project-form">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                New project
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Create a new project from here.
                            </Typography>

                            <Box component="form" onSubmit={submit}>
                                <Stack spacing={2}>
                                    <TextField
                                        id="new-project-title"
                                        label="Title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        error={Boolean(errors.title)}
                                        helperText={errors.title}
                                        required
                                        fullWidth
                                    />

                                    <TextField
                                        label="Description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                    />

                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Plus size={18} />}
                                            disabled={processing}
                                        >
                                            Create Project
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
