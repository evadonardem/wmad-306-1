import Checkbox from '@/Components/Checkbox';
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
    FormControlLabel,
    Checkbox as MuiCheckbox,
    Alert,
    Link as MuiLink,
    Typography,
    CircularProgress,
    Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
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
                        <LockOutlinedIcon sx={{ color: 'white', fontSize: 40 }} />
                    </Box>

                    <Head title="Log in" />

                    <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                        Sign In
                    </Typography>

                    {status && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {status}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Stack spacing={2.5}>
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
                                autoFocus
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
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <MuiCheckbox
                                        name="remember"
                                        color="primary"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                }
                                label="Remember me"
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
                                    'Sign In'
                                )}
                            </Button>

                            {canResetPassword && (
                                <Box sx={{ textAlign: 'right' }}>
                                    <Link href={route('password.request')}>
                                        <MuiLink
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Forgot your password?
                                        </MuiLink>
                                    </Link>
                                </Box>
                            )}

                            <Box sx={{ textAlign: 'center', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mt: 1 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Don't have an account?{' '}
                                    <Link href={route('register')}>
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
                                            Sign up here
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

/*
// ORIGINAL CODE (COMMENTED OUT)
// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (

//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }*/
