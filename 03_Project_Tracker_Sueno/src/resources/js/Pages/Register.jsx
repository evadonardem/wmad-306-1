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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
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
                        Create Account
                    </Typography>
                    <Typography textAlign="center" mb={3} sx={{ color: '#666666' }}>
                        Join the DS platform
                    </Typography>

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="name" sx={{ fontWeight: 500, color: '#2d2d2d', mb: 1, display: 'block' }}>
                                Name
                            </Typography>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
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
                                autoComplete="new-password"
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

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password_confirmation" sx={{ fontWeight: 500, color: '#2d2d2d', mb: 1, display: 'block' }}>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password_confirmation"
                                type={showPasswordConfirm ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={Boolean(errors.password_confirmation)}
                                helperText={errors.password_confirmation}
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#2e7d32' }}
                                            >
                                                {showPasswordConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                        <Divider sx={{ my: 3 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Link
                                href={route('login')}
                                style={{ fontSize: '0.875rem', color: '#2e7d32', textDecoration: 'underline' }}
                            >
                                Already have an account?
                            </Link>

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
                                Create Account
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
