import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
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

            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                Create Account
            </Typography>

            <Box component="form" onSubmit={submit}>
                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        autoFocus
                        autoComplete="name"
                        required
                    />

                    <TextField
                        label="Email Address"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        autoComplete="username"
                        required
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        autoComplete="new-password"
                        required
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
                        required
                    />

                    <FormControl fullWidth error={!!errors.role} required>
                        <InputLabel>Register as</InputLabel>
                        <Select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            label="Register as"
                        >
                            <MenuItem value="student">Student (read &amp; comment)</MenuItem>
                            <MenuItem value="writer">Writer (write &amp; submit articles)</MenuItem>
                            <MenuItem value="editor">Editor (review &amp; publish articles)</MenuItem>
                        </Select>
                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={processing}
                        size="large"
                    >
                        Register
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link href={route('login')} style={{ fontSize: 14, color: '#064E3B' }}>
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </GuestLayout>
    );
}

