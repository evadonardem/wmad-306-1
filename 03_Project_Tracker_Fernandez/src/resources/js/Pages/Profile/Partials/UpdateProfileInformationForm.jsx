import { Link, useForm, usePage } from '@inertiajs/react';
import { Save, Send } from 'lucide-react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Fade,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

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
        <Card>
            <CardContent>
                <Stack spacing={2.5}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            Profile information
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Update your name and email address.
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
                                autoFocus
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

                            {mustVerifyEmail && user.email_verified_at === null ? (
                                <Alert
                                    severity="warning"
                                    action={
                                        <Button
                                            component={Link}
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            size="small"
                                            variant="outlined"
                                            startIcon={<Send size={16} />}
                                        >
                                            Resend
                                        </Button>
                                    }
                                >
                                    Your email address is unverified.
                                </Alert>
                            ) : null}

                            {status === 'verification-link-sent' ? (
                                <Alert severity="success">
                                    A new verification link has been sent.
                                </Alert>
                            ) : null}

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Save size={18} />}
                                    disabled={processing}
                                >
                                    Save changes
                                </Button>

                                <Fade in={recentlySuccessful} timeout={260}>
                                    <Typography variant="body2" color="text.secondary">
                                        Saved.
                                    </Typography>
                                </Fade>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
