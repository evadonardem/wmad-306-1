import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

const PRIORITY_COLORS = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
};

const STATUS_COLORS = {
    pending: '#9c27b0',
    'in-progress': '#2196f3',
    completed: '#4caf50',
};

export default function Show({ project, task }) {
    return (
        <AuthenticatedLayout>
            <Head title={task.title} />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Link href={route('tasks.index', project.id)}>
                        <Button startIcon={<ArrowBackIcon />}>
                            Back to Tasks
                        </Button>
                    </Link>
                    <Link href={route('tasks.edit', [project.id, task.id])}>
                        <Button startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Link>
                </Box>

                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {task.title}
                        </Typography>

                        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                            <Chip
                                label={`Priority: ${task.priority}`}
                                sx={{ backgroundColor: PRIORITY_COLORS[task.priority], color: 'white' }}
                            />
                            <Chip
                                label={`Status: ${task.status}`}
                                sx={{ backgroundColor: STATUS_COLORS[task.status], color: 'white' }}
                            />
                        </Box>

                        <Typography variant="body1" paragraph>
                            {task.description || 'No description provided'}
                        </Typography>

                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                            <Typography variant="caption" color="textSecondary">
                                Created: {new Date(task.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
