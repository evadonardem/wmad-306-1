import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Reset your password
                    </Typography>
                    <Typography color="text.secondary">
                        Enter your email and we’ll send a reset link.
                    </Typography>
                </Box>

                {status && <Alert severity="success">{status}</Alert>}

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            autoFocus
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Mail size={18} />}
                            disabled={processing}
                            fullWidth
                        >
                            Email reset link
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
