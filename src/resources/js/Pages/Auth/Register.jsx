import GuestLayout from '@/Components/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { Button, Stack, TextField } from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout title="Create Account" subtitle="Register to manage your project tracker.">
            <Stack component="form" spacing={2} onSubmit={submit}>
                <TextField
                    label="Name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={Boolean(errors.password_confirmation)}
                    helperText={errors.password_confirmation}
                />
                <Button type="submit" variant="contained" disabled={processing}>
                    Register
                </Button>
                <Button component={Link} href="/login" variant="outlined">
                    Already have an account? Login
                </Button>
            </Stack>
        </GuestLayout>
    );
}
