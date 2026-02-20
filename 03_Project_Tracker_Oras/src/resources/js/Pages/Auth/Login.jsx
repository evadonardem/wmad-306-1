import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    TextField,
} from '@mui/material';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #a5d6a7',
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={1} sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Login
                    </Typography>
                    <Typography textAlign="center" mb={3} sx={{ color: '#666' }}>
                        Sign in to your account
                    </Typography>

                    {status && (
                        <Typography variant="body2" color="success.main" mb={2}>
                            {status}
                        </Typography>
                    )}

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="email" sx={{ fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                size="small"
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password" sx={{ fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                size="small"
                            />
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <Typography variant="body2" sx={{ color: '#555', ml: 1 }}>
                                Remember me
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ fontSize: '0.875rem', color: '#2e7d32', textDecoration: 'underline' }}
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    '&:hover': { backgroundColor: '#1b5e20' },
                                    textTransform: 'none',
                                    px: 4,
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
