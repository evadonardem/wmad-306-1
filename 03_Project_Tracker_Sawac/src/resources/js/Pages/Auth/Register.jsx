import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Alert,
    Link as MuiLink,
    Typography,
    CircularProgress,
    Stack,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

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
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    py: 12,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: '#1976d2',
                            borderRadius: '50%',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <PersonAddOutlinedIcon sx={{ color: 'white', fontSize: 40 }} />
                    </Box>

                    <Head title="Register" />

                    <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                        Create Account
                    </Typography>

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Stack spacing={2.5}>
                            <TextField
                                id="name"
                                label="Full Name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                fullWidth
                                variant="outlined"
                                autoComplete="name"
                                autoFocus
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />

                            <TextField
                                id="email"
                                label="Email Address"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                fullWidth
                                variant="outlined"
                                autoComplete="username"
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />

                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                fullWidth
                                variant="outlined"
                                autoComplete="new-password"
                                required
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />

                            <TextField
                                id="password_confirmation"
                                label="Confirm Password"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                autoComplete="new-password"
                                required
                                error={!!errors.password_confirmation}
                                helperText={errors.password_confirmation}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={processing}
                                sx={{
                                    py: 1.5,
                                    mt: 1,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                }}
                            >
                                {processing ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Already have an account?{' '}
                                    <Link href={route('login')}>
                                        <MuiLink
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Sign in here
                                        </MuiLink>
                                    </Link>
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
