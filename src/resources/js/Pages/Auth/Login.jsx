import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                Sign In
            </Typography>

            {status && (
                <Alert severity="success" sx={{ mb: 2 }}>{status}</Alert>
            )}

            <Box component="form" onSubmit={submit}>
                <Stack spacing={2}>
                    <TextField
                        label="Email Address"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        autoFocus
                        autoComplete="username"
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        autoComplete="current-password"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                size="small"
                            />
                        }
                        label={<Typography variant="body2">Remember me</Typography>}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={processing}
                        size="large"
                    >
                        Log In
                    </Button>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        {canResetPassword && (
                            <Link href={route('password.request')} style={{ fontSize: 14, color: '#064E3B' }}>
                                Forgot your password?
                            </Link>
                        )}
                        <Link href={route('register')} style={{ fontSize: 14, color: '#064E3B' }}>
                            Don't have an account? Register
                        </Link>
                    </Stack>
                </Stack>
            </Box>
        </GuestLayout>
    );
}

