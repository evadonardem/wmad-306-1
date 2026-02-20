import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
} from '@mui/material';

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
                    <Typography variant="h4" textAlign="center" mb={3} sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Reset Password
                    </Typography>

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
                                autoComplete="new-password"
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                size="small"
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password_confirmation" sx={{ fontWeight: 500, color: '#333', mb: 1, display: 'block' }}>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={Boolean(errors.password_confirmation)}
                                helperText={errors.password_confirmation}
                                size="small"
                            />
                        </Box>

                        <Box display="flex" justifyContent="center" mt={4}>
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
                                Reset Password
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
