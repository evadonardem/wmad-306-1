import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Container,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function Show({ project }) {
    return (
        <AuthenticatedLayout>
            <Head title={project.title} />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Link href={route('projects.index')}>
                        <Button startIcon={<ArrowBackIcon />}>
                            Back to Projects
                        </Button>
                    </Link>
                    <Link href={route('projects.edit', project.id)}>
                        <Button startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Link>
                </Box>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {project.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {project.description || 'No description provided'}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Tasks ({project.tasks?.length || 0})
                        </Typography>
                        {project.tasks && project.tasks.length > 0 ? (
                            <List>
                                {project.tasks.map((task) => (
                                    <ListItem key={task.id}>
                                        <ListItemText
                                            primary={task.title}
                                            secondary={`Priority: ${task.priority} | Status: ${task.status}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No tasks yet
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
