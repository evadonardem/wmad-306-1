import GuestLayout from '@/Components/GuestLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Alert, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

export default function Login() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout title="Login" subtitle="Access your projects and tasks.">
            <Stack component="form" spacing={2} onSubmit={submit}>
                {flash?.status ? <Alert severity="success">{flash.status}</Alert> : null}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                    }
                    label="Remember me"
                />
                <Button type="submit" variant="contained" disabled={processing}>
                    Login
                </Button>
                <Button component={Link} href="/forgot-password" variant="text">
                    Forgot password?
                </Button>
                <Button component={Link} href="/register" variant="outlined">
                    Create account
                </Button>
            </Stack>
        </GuestLayout>
    );
}
