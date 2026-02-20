import GuestLayout from '@/Layouts/GuestLayout';
import { useTheme } from '@/Context/ThemeContext';
import { Head, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Alert,
} from '@mui/material';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const { theme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        width: '100%',
                        backgroundColor: theme.bg.paper,
                        border: `1px solid ${theme.border}`,
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={1} sx={{ fontWeight: 600, color: '#d4af37' }}>
                        Forgot Password
                    </Typography>

                    <Typography textAlign="center" mb={3} sx={{ color: theme.text.primary, lineHeight: 1.6 }}>
                        Enter your email address and we will send you a password reset link.
                    </Typography>

                    {status && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {status}
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="email" sx={{ color: theme.text.primary, mb: 1, display: 'block' }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                size="small"
                            />
                        </Box>

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                    px: 4,
                                }}
                            >
                                Send Reset Link
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
