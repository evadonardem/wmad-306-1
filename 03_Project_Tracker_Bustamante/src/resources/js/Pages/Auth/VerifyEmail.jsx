import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight, LogOut, MailCheck } from 'lucide-react';

// Displays verification instructions and resend status
export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    // Resend verification email
    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Stack spacing={2} alignItems="center">
                <Box
                    sx={(theme) => ({
                        width: 84,
                        height: 84,
                        borderRadius: 999,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.14),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    })}
                >
                    <MailCheck size={34} />
                </Box>
                <Typography variant="h5" fontWeight={950}>
                    Verify your email
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Check your inbox for the verification link. If you didn’t receive it, we can send another.
                </Typography>

                {status === 'verification-link-sent' ? (
                    <Alert severity="success" sx={{ width: '100%' }}>
                        A new verification link has been sent to your email.
                    </Alert>
                ) : null}

                <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                    <Stack spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            fullWidth
                            endIcon={<ArrowRight size={18} />}
                        >
                            Resend verification email
                        </Button>
                        <Button
                            component={Link}
                            href={route('logout')}
                            method="post"
                            as="button"
                            variant="outlined"
                            fullWidth
                            endIcon={<LogOut size={18} />}
                        >
                            Log out
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
