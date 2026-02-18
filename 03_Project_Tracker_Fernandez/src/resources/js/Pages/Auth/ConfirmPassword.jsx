import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Confirm it’s you
                    </Typography>
                    <Typography color="text.secondary">
                        This area is protected. Please re-enter your password.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoFocus
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<ShieldCheck size={18} />}
                            disabled={processing}
                            fullWidth
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
