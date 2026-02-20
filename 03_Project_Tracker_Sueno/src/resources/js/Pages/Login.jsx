import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(46, 125, 50, 0.2)',
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={1} sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Sign In
                    </Typography>
                    <Typography textAlign="center" mb={3} sx={{ color: '#666666' }}>
                        Welcome back to DS
                    </Typography>

                    {status && (
                        <Typography variant="body2" color="success.main" mb={2}>
                            {status}
                        </Typography>
                    )}

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="email" sx={{ fontWeight: 500, color: '#2d2d2d', mb: 1, display: 'block' }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#2d2d2d',
                                        '& fieldset': { borderColor: 'rgba(46, 125, 50, 0.2)' },
                                        '&:hover fieldset': { borderColor: '#2e7d32' },
                                    },
                                }}
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password" sx={{ fontWeight: 500, color: '#2d2d2d', mb: 1, display: 'block' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#2e7d32' }}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#2d2d2d',
                                        '& fieldset': { borderColor: 'rgba(46, 125, 50, 0.2)' },
                                        '&:hover fieldset': { borderColor: '#2e7d32' },
                                    },
                                }}
                            />
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <Typography variant="body2" sx={{ color: '#999999', ml: 1 }}>
                                Remember me
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ fontSize: '0.875rem', color: '#2e7d32', textDecoration: 'underline' }}
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    color: '#e8f5e9',
                                    '&:hover': { backgroundColor: '#388e3c' },
                                    textTransform: 'none',
                                    px: 4,
                                    fontWeight: 600,
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
