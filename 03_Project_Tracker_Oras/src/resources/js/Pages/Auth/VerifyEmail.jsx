import GuestLayout from '@/Layouts/GuestLayout';
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
                        backgroundColor: '#ffffff',
                        border: '1px solid #a5d6a7',
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={1} sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Verify Email
                    </Typography>

                    <Typography textAlign="center" mb={3} sx={{ color: '#666', lineHeight: 1.6 }}>
                        Thanks for signing up! Before getting started, please verify your email address
                        by clicking on the link we just sent to you. If you didn't receive the email,
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
                                    backgroundColor: '#2e7d32',
                                    '&:hover': { backgroundColor: '#1b5e20' },
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
                                    color: '#2e7d32',
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
