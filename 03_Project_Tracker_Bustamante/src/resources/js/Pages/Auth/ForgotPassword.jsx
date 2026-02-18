import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight, Mail, ShieldAlert } from 'lucide-react';

// Displays form to request password reset link
export default function ForgotPassword({ status }) {
    // Manage form state and submission via Inertia
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // Submit email to password.email route to send reset link
    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };


    return (
        <GuestLayout>
            <Head title="Forgot Password" />

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
                    <ShieldAlert size={34} />
                </Box>
                <Typography variant="h5" fontWeight={950}>
                    Reset your password
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Enter your email address and we’ll send a password reset link.
                </Typography>

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
                            required
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            fullWidth
                            endIcon={<ArrowRight size={18} />}
                        >
                            Email reset link
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
