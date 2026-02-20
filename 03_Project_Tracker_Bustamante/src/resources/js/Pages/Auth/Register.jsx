import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowRight, Lock, Mail, UserPlus, UserRound } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

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
                    <UserPlus size={34} />
                </Box>
                <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5" fontWeight={950}>
                        Create your account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Start tracking projects and tasks in minutes.
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            autoComplete="name"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <UserRound size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            required
                            autoFocus
                        />

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
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
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
                            required
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
                            required
                        />

                        <Divider />

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            <Link
                                href={route('login')}
                                className="text-sm text-gray-300 underline"
                            >
                                Already registered?
                            </Link>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                endIcon={<ArrowRight size={18} />}
                            >
                                Register
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </GuestLayout>
    );
}
