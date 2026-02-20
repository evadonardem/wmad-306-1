import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    Chip,
    Stack,
} from '@mui/material';

import ProjectChromaGrid from "@/Components/ProjectChromaGrid";

export default function Dashboard({ projects }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('projects.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const deleteProject = (projectId) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        router.delete(route('projects.destroy', projectId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight="bold">
                    Projects Dashboard
                </Typography>
            }
        >
            <Head title="Projects" />

            <Box
                sx={{
                    py: 6,
                    minHeight: "100vh",
                    background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
                }}
            >
                <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>

                    {/* Page Title */}
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            mb: 1,
                            letterSpacing: "-1px",
                        }}
                    >
                        🚀 Your Projects
                    </Typography>

                    <Typography
                        sx={{
                            mb: 2,
                            color: "text.secondary",
                            fontSize: "1.05rem",
                        }}
                    >
                        Manage your projects and track tasks in a clean modern dashboard.
                    </Typography>

                    {/* Quick Stats */}
                    <Stack direction="row" spacing={2} sx={{ mb: 4 }} flexWrap="wrap">
                        <Chip
                            label={`Total Projects: ${projects.length}`}
                            sx={{
                                fontWeight: "bold",
                                borderRadius: 3,
                                background: "#e0f2fe",
                                color: "#0369a1",
                            }}
                        />
                    </Stack>

                    {/* Add Project Form */}
                    <Card
                        sx={{
                            mb: 6,
                            borderRadius: 4,
                            boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Add New Project
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Box component="form" onSubmit={submit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
                                            label="Project Title"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            error={!!errors.description}
                                            helperText={errors.description}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                            sx={{
                                                height: "100%",
                                                borderRadius: 3,
                                                fontWeight: "bold",
                                                textTransform: "none",
                                                background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Projects List */}
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Projects List
                    </Typography>

                    {projects.length === 0 ? (
                        <Typography color="text.secondary">
                            No projects found. Add your first project above.
                        </Typography>
                    ) : (
                        <ProjectChromaGrid
                            projects={projects}
                            onView={(id) =>
                                router.visit(route("projects.tasks.index", id), {
                                    preserveScroll: true,
                                })
                            }
                            onDelete={(id) => deleteProject(id)}
                        />
                    )}
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
