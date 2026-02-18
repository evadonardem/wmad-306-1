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
    Chip,
    Stack,
    Divider,
} from '@mui/material';

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

            <Box sx={{ py: 5, backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
                <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>

                    {/* Page Title */}
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        🚀 Your Projects
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Manage your projects and track tasks easily.
                    </Typography>

                    {/* Add Project Form */}
                    <Card
                        sx={{
                            mb: 4,
                            borderRadius: 3,
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                        }}
                    >
                        <CardContent>
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
                                            onChange={(e) => setData('title', e.target.value)}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
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
                                                borderRadius: 2,
                                                fontWeight: "bold",
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
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Projects List
                    </Typography>

                    {projects.length === 0 ? (
                        <Typography color="text.secondary">
                            No projects found. Add your first project above.
                        </Typography>
                    ) : (
                        <Grid container spacing={3}> 
                            {projects.map((project) => (
                                <Grid item xs={12} sm={6} md={4} key={project.id}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 4,
                                            background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
                                            boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                                            border: "1px solid rgba(0,0,0,0.05)",
                                            transition: "0.25s ease",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{ mb: 1 }}
                                            >
                                                {project.title}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: "text.secondary",
                                                    fontSize: "0.95rem",
                                                    mb: 2,
                                                    minHeight: "45px",
                                                }}
                                            >
                                                {project.description || "No description provided."}
                                            </Typography>

                                            <Chip
                                                label="Active Project"
                                                sx={{
                                                    mb: 3,
                                                    fontWeight: "bold",
                                                    borderRadius: 2,
                                                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                                                    color: "white",
                                                }}
                                            />

                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{
                                                        borderRadius: 3,
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        py: 1.2,
                                                        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                                                    }}
                                                    href={`/projects/${project.id}/tasks`}
                                                >
                                                    View
                                                </Button>

                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        borderRadius: 3,
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        py: 1.2,
                                                    }}
                                                    onClick={() => deleteProject(project.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
