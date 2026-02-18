import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Create account
                    </Typography>
                    <Typography color="text.secondary">
                        Start tracking projects and tasks in minutes.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="name"
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            required
                            fullWidth
                        />

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
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Confirm password"
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
                            startIcon={<UserPlus size={18} />}
                            disabled={processing}
                            fullWidth
                        >
                            Register
                        </Button>

                        <Button
                            component={Link}
                            href={route('login')}
                            variant="text"
                            size="small"
                        >
                            Already have an account? Sign in
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
