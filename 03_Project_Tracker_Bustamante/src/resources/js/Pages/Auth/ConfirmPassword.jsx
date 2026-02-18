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
import { ArrowRight, LockKeyhole } from 'lucide-react';

// Requires current password confirmation before proceeding
export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    // Confirm password via password.confirm route
    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

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
                    <LockKeyhole size={34} />
                </Box>
                <Typography variant="h5" fontWeight={950}>
                    Confirm your password
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    This is a secure area. Please confirm your password to continue.
                </Typography>

                <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                    <Stack spacing={2}>
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
                                        <LockKeyhole size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            fullWidth
                            endIcon={<ArrowRight size={18} />}
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
