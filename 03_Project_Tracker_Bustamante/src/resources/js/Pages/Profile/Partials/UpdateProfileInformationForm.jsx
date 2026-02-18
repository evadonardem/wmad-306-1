import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Mail, UserCircle2 } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
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
        <Box component="section">
            <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <UserCircle2 size={18} />
                    <Typography variant="h6" fontWeight={900}>
                        Profile Information
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Update your account’s profile information and email address.
                </Typography>
            </Stack>

            <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
                <Stack spacing={2}>
                    <TextField
                        id="name"
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        required
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <UserCircle2 size={18} />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />

                    <TextField
                        id="email"
                        type="email"
                        label="Email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Mail size={18} />
                                </InputAdornment>
                            ),
                        }}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        required
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        fullWidth
                    />

                    {mustVerifyEmail && user.email_verified_at === null ? (
                        <Stack spacing={1}>
                            <Alert severity="warning">
                                Your email address is unverified.
                            </Alert>

                            <Box>
                                <Button
                                    component={Link}
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    variant="outlined"
                                    size="small"
                                >
                                    Re-send verification email
                                </Button>
                            </Box>

                            {status === 'verification-link-sent' ? (
                                <Alert severity="success">
                                    A new verification link has been sent to your email address.
                                </Alert>
                            ) : null}
                        </Stack>
                    ) : null}

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="submit" variant="contained" disabled={processing}>
                            Save
                        </Button>

                        {recentlySuccessful ? (
                            <Typography variant="body2" color="text.secondary">
                                Saved.
                            </Typography>
                        ) : null}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
