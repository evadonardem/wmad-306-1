import { useForm } from '@inertiajs/react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Update Password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ensure your account is using a long, random password to stay secure.
            </Typography>

            <Box component="form" onSubmit={updatePassword}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Current Password"
                        type="password"
                        inputRef={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        error={!!errors.current_password}
                        helperText={errors.current_password}
                        fullWidth
                        autoComplete="current-password"
                    />

                    <TextField
                        label="New Password"
                        type="password"
                        inputRef={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        autoComplete="new-password"
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                        fullWidth
                        autoComplete="new-password"
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="submit" variant="contained" disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful && (
                            <Typography variant="body2" color="text.secondary">Saved.</Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
