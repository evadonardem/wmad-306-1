import GuestLayout from '@/Components/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Button, Stack, TextField } from '@mui/material';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/reset-password');
    };

    return (
        <GuestLayout title="Reset Password" subtitle="Set a new password for your account.">
            <Stack component="form" spacing={2} onSubmit={submit}>
                <TextField
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                />
                <TextField
                    label="New Password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={Boolean(errors.password_confirmation)}
                    helperText={errors.password_confirmation}
                />
                <Button type="submit" variant="contained" disabled={processing}>
                    Save New Password
                </Button>
                <Button component={Link} href="/login" variant="text">
                    Back to Login
                </Button>
            </Stack>
        </GuestLayout>
    );
}
