import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight, KeyRound, Lock, Mail } from 'lucide-react';

// Accepts reset token and prefilled email from backend
export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // Submit new password to password.store route
    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                    <KeyRound size={34} />
                </Box>
                <Typography variant="h5" fontWeight={950}>
                    Choose a new password
                </Typography>

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
                            label="New password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            autoComplete="new-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Confirm password"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            error={Boolean(errors.password_confirmation)}
                            helperText={errors.password_confirmation}
                            autoComplete="new-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            fullWidth
                            endIcon={<ArrowRight size={18} />}
                        >
                            Reset password
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
