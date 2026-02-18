import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Paper, Stack, Typography } from '@mui/material';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight={900}>
                    Profile
                </Typography>
            }
        >
            <Head title="Profile" />

            <Stack spacing={2}>
                <Paper sx={{ p: 3 }}>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <UpdatePasswordForm />
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <DeleteUserForm />
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
