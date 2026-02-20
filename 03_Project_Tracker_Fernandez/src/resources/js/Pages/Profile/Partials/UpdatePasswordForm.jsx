import { useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Fade,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
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
        <Card>
            <CardContent>
                <Stack spacing={2.5}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            Update password
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Use a long, unique password to keep your account secure.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={updatePassword}>
                        <Stack spacing={2}>
                            <TextField
                                label="Current password"
                                type="password"
                                name="current_password"
                                inputRef={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) =>
                                    setData('current_password', e.target.value)
                                }
                                autoComplete="current-password"
                                error={Boolean(errors.current_password)}
                                helperText={errors.current_password}
                                fullWidth
                            />

                            <TextField
                                label="New password"
                                type="password"
                                name="password"
                                inputRef={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                fullWidth
                            />

                            <TextField
                                label="Confirm new password"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                autoComplete="new-password"
                                error={Boolean(errors.password_confirmation)}
                                helperText={errors.password_confirmation}
                                fullWidth
                            />

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<KeyRound size={18} />}
                                    disabled={processing}
                                >
                                    Update password
                                </Button>

                                <Fade in={recentlySuccessful} timeout={260}>
                                    <Typography variant="body2" color="text.secondary">
                                        Saved.
                                    </Typography>
                                </Fade>
                            </Stack>

                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
