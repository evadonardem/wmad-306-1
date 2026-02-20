import GuestLayout from '@/Layouts/GuestLayout';
import { useTheme } from '@/Context/ThemeContext';
import { Head, useForm } from '@inertiajs/react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { theme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        width: '100%',
                        backgroundColor: theme.bg.paper,
                        border: `1px solid ${theme.border}`,
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={3} sx={{ fontWeight: 600, color: '#d4af37' }}>
                        Reset Password
                    </Typography>

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="email" sx={{ color: theme.text.primary, mb: 1, display: 'block' }}>
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
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password" sx={{ color: theme.text.primary, mb: 1, display: 'block' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                autoFocus
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
                                                sx={{ color: '#d4af37' }}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box mb={3}>
                            <Typography component="label" htmlFor="password_confirmation" sx={{ color: theme.text.primary, mb: 1, display: 'block' }}>
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
                                                sx={{ color: '#d4af37' }}
                                            >
                                                {showPasswordConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    '&:hover': { backgroundColor: '#c9995d' },
                                    textTransform: 'none',
                                    px: 4,
                                }}
                            >
                                Reset Password
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
