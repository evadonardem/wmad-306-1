import GuestLayout from '@/Layouts/GuestLayout';
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

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        width: '100%',
                        backgroundColor: '#e8e8e8',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                >
                    <Typography variant="h4" textAlign="center" mb={1} sx={{ fontWeight: 600, color: '#d4af37' }}>
                        Confirm Password
                    </Typography>

                    <Typography textAlign="center" mb={3} sx={{ color: '#1a1a1a', lineHeight: 1.6 }}>
                        This is a secure area of the application. Please confirm your password before continuing.
                    </Typography>

                    <form onSubmit={submit}>
                        <Box mb={3}>
                            <Typography component="label" htmlFor="password" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 1, display: 'block' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
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

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    '&:hover': { backgroundColor: '#1b5e20' },
                                    textTransform: 'none',
                                    px: 4,
                                }}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
