import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Button,
    TextField,
    Box,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Edit({ project }) {
    const { data, setData, put, errors, processing } = useForm({
        title: project.title,
        description: project.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${project.title}`} />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Link href={route('projects.index')}>
                        <Button startIcon={<ArrowBackIcon />}>
                            Back to Projects
                        </Button>
                    </Link>
                </Box>

                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Edit Project
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Project Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                                margin="normal"
                                multiline
                                rows={4}
                            />

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Update Project
                                </Button>
                                <Link href={route('projects.index')}>
                                    <Button variant="outlined">
                                        Cancel
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
