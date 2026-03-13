import { Link, useForm, usePage } from '@inertiajs/react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your account's profile information and email address.
            </Typography>

            <Box component="form" onSubmit={submit}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        required
                        autoFocus
                        autoComplete="name"
                    />

                    <TextField
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        required
                        autoComplete="username"
                    />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Your email address is unverified.{' '}
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    style={{ color: '#064E3B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </Typography>
                            {status === 'verification-link-sent' && (
                                <Alert severity="success" sx={{ mt: 1 }}>
                                    A new verification link has been sent to your email address.
                                </Alert>
                            )}
                        </Box>
                    )}

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="submit" variant="contained" disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful && (
                            <Typography variant="body2" color="text.secondary">Saved.</Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
