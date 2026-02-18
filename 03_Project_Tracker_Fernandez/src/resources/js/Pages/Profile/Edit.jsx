import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Grow, Stack } from '@mui/material';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <Stack spacing={3} sx={{ maxWidth: 860 }}>
                <Grow in timeout={420}>
                    <div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </Grow>

                <Grow in timeout={560}>
                    <div>
                        <UpdatePasswordForm />
                    </div>
                </Grow>

                <Grow in timeout={700}>
                    <div>
                        <DeleteUserForm />
                    </div>
                </Grow>
            </Stack>
        </AuthenticatedLayout>
    );
}
