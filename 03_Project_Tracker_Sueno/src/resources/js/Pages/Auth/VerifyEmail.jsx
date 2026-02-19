import GuestLayout from '@/Layouts/GuestLayout';
import { useTheme } from '@/Context/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Alert,
} from '@mui/material';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const { theme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

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
                        Verify Email
                    </Typography>

                    <Typography textAlign="center" mb={3} sx={{ color: theme.text.primary, lineHeight: 1.6 }}>
                        Thanks for registering! Please verify your email address to complete your registration and log in.
                        Click on the link we just sent to you. If you didn't receive the email,
                        we will gladly send you another.
                    </Typography>

                    {status === 'verification-link-sent' && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            A new verification link has been sent to the email address you provided during registration.
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                }}
                            >
                                Resend Verification Email
                            </Button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#d4af37',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '0.875rem',
                                }}
                            >
                                Log Out
                            </Link>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
