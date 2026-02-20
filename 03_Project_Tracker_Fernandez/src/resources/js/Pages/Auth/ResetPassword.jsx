import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Set a new password
                    </Typography>
                    <Typography color="text.secondary">
                        Choose a strong password you don’t use elsewhere.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            required
                            fullWidth
                        />

                        <TextField
                            label="New password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            autoFocus
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Confirm new password"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            autoComplete="new-password"
                            error={Boolean(errors.password_confirmation)}
                            helperText={errors.password_confirmation}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<RotateCcw size={18} />}
                            disabled={processing}
                            fullWidth
                        >
                            Reset password
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
