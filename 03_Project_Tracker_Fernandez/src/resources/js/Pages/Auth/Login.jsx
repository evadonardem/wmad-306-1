import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
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

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Sign in
                    </Typography>
                    <Typography color="text.secondary">
                        Use your account to access your projects.
                    </Typography>
                </Box>

                {status ? <Alert severity="success">{status}</Alert> : null}

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2}>
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

                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            autoComplete="current-password"
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                            }
                            label="Remember me"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<LogIn size={18} />}
                            disabled={processing}
                            fullWidth
                        >
                            Log in
                        </Button>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {canResetPassword ? (
                                <Button
                                    component={Link}
                                    href={route('password.request')}
                                    variant="text"
                                    size="small"
                                >
                                    Forgot password?
                                </Button>
                            ) : (
                                <span />
                            )}

                            <Button
                                component={Link}
                                href={route('register')}
                                variant="text"
                                size="small"
                            >
                                Create account
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
