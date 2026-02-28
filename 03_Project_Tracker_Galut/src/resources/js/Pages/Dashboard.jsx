import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
    Folder as FolderIcon,
    TaskAlt as TaskIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export default function Dashboard() {
    const { stats } = usePage().props;

    const statCards = [
        {
            title: 'Total Projects',
            value: stats?.totalProjects || 0,
            icon: <FolderIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#e3f2fd'
        },
        {
            title: 'Completed Projects',
            value: stats?.completedProjects || 0,
            icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#e8f5e9'
        },
        {
            title: 'Pending Projects',
            value: stats?.pendingProjects || 0,
            icon: <FolderIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
            color: '#fff3e0'
        },
        {
            title: 'Total Tasks',
            value: stats?.totalTasks || 0,
            icon: <TaskIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
            color: '#f3e5f5'
        },
        {
            title: 'Completed Tasks',
            value: stats?.completedTasks || 0,
            icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#e8f5e9'
        },
        {
            title: 'Pending Tasks',
            value: stats?.pendingTasks || 0,
            icon: <TaskIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
            color: '#fff3e0'
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={3}>
                    {statCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    backgroundColor: card.color,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography color="text.secondary" gutterBottom>
                                                {card.title}
                                            </Typography>
                                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                                {card.value}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            {card.icon}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Welcome to Project Tracker!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Track your projects and tasks efficiently. Use the navigation to access your projects.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
