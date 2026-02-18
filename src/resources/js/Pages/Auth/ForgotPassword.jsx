import GuestLayout from '@/Components/GuestLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Alert, Button, Stack, TextField } from '@mui/material';

export default function ForgotPassword() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout title="Forgot Password" subtitle="Request a reset link and check the fake inbox.">
            <Stack component="form" spacing={2} onSubmit={submit}>
                {flash?.status ? <Alert severity="success">{flash.status}</Alert> : null}
                <TextField
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                />
                <Button type="submit" variant="contained" disabled={processing}>
                    Send Reset Link
                </Button>
                <Button href="http://localhost:8025" target="_blank" rel="noreferrer" variant="outlined">
                    Open Fake Inbox
                </Button>
                <Button component={Link} href="/login" variant="text">
                    Back to Login
                </Button>
            </Stack>
        </GuestLayout>
    );
}
