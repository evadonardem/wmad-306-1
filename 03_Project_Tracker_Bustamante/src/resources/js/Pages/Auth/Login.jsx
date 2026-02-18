import { Head, Link, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight, Lock, Mail, UserCircle2 } from 'lucide-react';

import GuestLayout from '@/Layouts/GuestLayout';

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
                    <UserCircle2 size={34} />
                </Box>
                <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5" fontWeight={950}>
                        Welcome back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Sign in to continue to Project Tracker.
                    </Typography>
                </Stack>

                {status ? (
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {status}
                    </Alert>
                ) : null}

                <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            autoComplete="username"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={18} />
                                    </InputAdornment>
                                ),
                            }}
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

                        <Divider />

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            {canResetPassword ? (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-gray-300 underline"
                                >
                                    Forgot your password?
                                </Link>
                            ) : (
                                <span />
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                endIcon={<ArrowRight size={18} />}
                            >
                                Log in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
