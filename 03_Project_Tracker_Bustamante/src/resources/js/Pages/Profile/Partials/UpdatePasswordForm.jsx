import { useForm } from '@inertiajs/react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { KeyRound } from 'lucide-react';
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
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Box component="section">
            <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <KeyRound size={18} />
                    <Typography variant="h6" fontWeight={900}>
                        Update Password
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Ensure your account is using a long, random password.
                </Typography>
            </Stack>

            <Box component="form" onSubmit={updatePassword} sx={{ mt: 3 }}>
                <Stack spacing={2}>
                    <TextField
                        id="current_password"
                        label="Current Password"
                        type="password"
                        autoComplete="current-password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        error={Boolean(errors.current_password)}
                        helperText={errors.current_password}
                        inputRef={currentPasswordInput}
                        fullWidth
                    />

                    <TextField
                        id="password"
                        label="New Password"
                        type="password"
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        inputRef={passwordInput}
                        fullWidth
                    />

                    <TextField
                        id="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={Boolean(errors.password_confirmation)}
                        helperText={errors.password_confirmation}
                        fullWidth
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="submit" variant="contained" disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful ? (
                            <Typography variant="body2" color="text.secondary">
                                Saved.
                            </Typography>
                        ) : null}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
