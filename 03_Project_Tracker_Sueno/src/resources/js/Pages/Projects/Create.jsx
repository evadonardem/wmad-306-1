import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 600, color: '#d4af37' }}>
                    Create Project
                </Typography>
            }
        >
            <Head title="Create Project" />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Project Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={4}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Link href={route('projects.index')}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        borderColor: 'rgba(212, 175, 55, 0.2)',
                                        color: '#d4af37',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#d4af37',
                                            backgroundColor: 'rgba(46,125,50,0.04)',
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                }}
                            >
                                Create Project
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
