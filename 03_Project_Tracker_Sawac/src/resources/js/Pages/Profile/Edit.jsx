import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Box, Stack, Paper, Typography } from '@mui/material';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Stack spacing={2}>
                    {/* Profile Information */}
                    <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                            Profile Information
                        </Typography>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </Paper>

                    {/* Update Password */}
                    <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                            Update Password
                        </Typography>
                        <UpdatePasswordForm />
                    </Paper>

                    {/* Delete Account */}
                    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderTop: '4px solid', borderColor: 'error.main' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                            Delete Account
                        </Typography>
                        <DeleteUserForm />
                    </Paper>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
