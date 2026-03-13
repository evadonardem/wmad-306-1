import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Container, Paper, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Dashboard</Typography>}
        >
            <Head title="Dashboard" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Typography color="text.secondary">
                        You're logged in!
                    </Typography>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
