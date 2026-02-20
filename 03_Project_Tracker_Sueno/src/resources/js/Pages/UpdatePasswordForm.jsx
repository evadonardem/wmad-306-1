import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Button,
} from '@mui/material';
import { useRef, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function UpdatePasswordForm({ className = '' }) {
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

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
        <section className={className}>
            <div style={{ marginBottom: '2rem' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4af37', marginBottom: '0.5rem' }}>
                    Update Password
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                    Ensure your account is using a long, random password to stay secure.
                </Typography>
            </div>

            <form onSubmit={updatePassword} style={{ marginTop: '1.5rem' }}>
                <Box mb={3}>
                    <Typography component="label" htmlFor="current_password" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 1, display: 'block' }}>
                        Current Password
                    </Typography>
                    <TextField
                        fullWidth
                        id="current_password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        size="small"
                        error={Boolean(errors.current_password)}
                        helperText={errors.current_password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{ color: '#d4af37' }}
                                    >
                                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#1a1a1a',
                                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.2)' },
                                '&:hover fieldset': { borderColor: '#d4af37' },
                            },
                        }}
                    />
                </Box>

                <Box mb={3}>
                    <Typography component="label" htmlFor="password" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 1, display: 'block' }}>
                        New Password
                    </Typography>
                    <TextField
                        fullWidth
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        size="small"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#1a1a1a',
                                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.2)' },
                                '&:hover fieldset': { borderColor: '#d4af37' },
                            },
                        }}
                    />
                </Box>

                <Box mb={3}>
                    <Typography component="label" htmlFor="password_confirmation" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 1, display: 'block' }}>
                        Confirm Password
                    </Typography>
                    <TextField
                        fullWidth
                        id="password_confirmation"
                        type={showPasswordConfirm ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        size="small"
                        error={Boolean(errors.password_confirmation)}
                        helperText={errors.password_confirmation}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#1a1a1a',
                                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.2)' },
                                '&:hover fieldset': { borderColor: '#d4af37' },
                            },
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        sx={{
                            backgroundColor: '#d4af37',
                            color: '#1a1a1a',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: '#e6c550' },
                            '&:disabled': { backgroundColor: '#ccc', color: '#999' },
                        }}
                    >
                        Save
                    </Button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Typography sx={{ fontSize: '0.875rem', color: '#2e7d32' }}>Saved.</Typography>
                    </Transition>
                </Box>
            </form>
        </section>
    );
}
