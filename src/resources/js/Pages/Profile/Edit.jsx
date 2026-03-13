import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Container, Paper, Stack, Typography } from '@mui/material';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Profile</Typography>}
        >
            <Head title="Profile" />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Stack spacing={3}>
                    <Paper elevation={2} sx={{ p: 4 }}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 4 }}>
                        <UpdatePasswordForm />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 4 }}>
                        <DeleteUserForm />
                    </Paper>
                </Stack>
            </Container>
        </AuthenticatedLayout>
    );
}
