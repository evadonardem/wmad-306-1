import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut, MailCheck, RefreshCw } from 'lucide-react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Verify your email
                    </Typography>
                    <Typography color="text.secondary">
                        We sent you a verification email. Click the link inside
                        to activate your account.
                    </Typography>
                </Box>

                {status === 'verification-link-sent' && (
                    <Alert severity="success">
                        A new verification link has been sent.
                    </Alert>
                )}

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={1.5}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                processing ? (
                                    <RefreshCw size={18} />
                                ) : (
                                    <MailCheck size={18} />
                                )
                            }
                            disabled={processing}
                            fullWidth
                        >
                            Resend verification email
                        </Button>

                        <Button
                            component={Link}
                            href={route('logout')}
                            method="post"
                            as="button"
                            variant="text"
                            startIcon={<LogOut size={18} />}
                            fullWidth
                        >
                            Log out
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
