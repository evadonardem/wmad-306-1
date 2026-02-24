import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthLayout from '@/components/auth/AuthLayout';

/**
 * @returns {JSX.Element}
 */
const Login = () => {
  const { errors } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const {
    data,
    setData,
    post,
    processing,
    setError,
    reset,
    clearErrors,
  } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    setData(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    setClientErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    clearErrors(e.target.name);
  };

  const validate = () => {
    const errs = {};
    if (!data.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email address';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 8) errs.password = 'Password must be at least 8 characters';
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    post(route('login'), {
      onError: (serverErrors) => {
        setClientErrors({});
      },
    });
  };

  return (
    <>
      <Head title="Login - Project Tracker" />
      <AuthLayout
        leftContent={
          <>
            <Typography variant="h4" color="#fff" fontWeight={700} mb={1} sx={{ letterSpacing: '-0.02em' }}>
              Track. Collaborate. Succeed.
            </Typography>
            <Typography variant="body1" color="#fff" sx={{ opacity: 0.8, maxWidth: 260 }}>
              Organize your projects and teams with clarity and style.
            </Typography>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          {/* App mark */}
          <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true" style={{ marginBottom: 8 }}>
            <circle cx="19" cy="19" r="19" fill="#6E2F7A" />
            <rect x="10" y="10" width="18" height="18" rx="6" fill="#00AFA0" />
            <circle cx="19" cy="19" r="5" fill="#FFB000" />
          </svg>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sign in to your workspace
          </Typography>
        </Box>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {errors.general}
          </Alert>
        )}
        <form noValidate onSubmit={handleSubmit} autoComplete="off">
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={handleChange}
            error={!!(clientErrors.email || errors.email)}
            helperText={clientErrors.email || errors.email}
            aria-describedby="email-error"
            inputProps={{ 'aria-invalid': !!(clientErrors.email || errors.email) }}
            size="medium"
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={data.password}
            onChange={handleChange}
            error={!!(clientErrors.password || errors.password)}
            helperText={clientErrors.password || errors.password}
            aria-describedby="password-error"
            inputProps={{ 'aria-invalid': !!(clientErrors.password || errors.password) }}
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.remember}
                  onChange={handleChange}
                  name="remember"
                  color="secondary"
                  sx={{ borderRadius: 2 }}
                />
              }
              label={<Typography variant="body2">Remember me</Typography>}
            />
            {/* Future: Forgot password link */}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 1, fontWeight: 700 }}
            disabled={processing}
            size="medium"
          >
            {processing ? 'Signing in…' : 'Sign in'}
          </Button>
          <Divider sx={{ my: 3, fontSize: 14 }}>or</Divider>
          {/* SSO buttons could go here */}
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <MuiLink
            component={Link}
            href={route('register')}
            color="secondary"
            underline="hover"
            sx={{ fontWeight: 600, fontSize: 15 }}
          >
            Don&apos;t have an account? Sign up
          </MuiLink>
        </Box>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            <MuiLink href="#" color="inherit" underline="hover" sx={{ mx: 0.5 }}>
              Privacy
            </MuiLink>
            &bull;
            <MuiLink href="#" color="inherit" underline="hover" sx={{ mx: 0.5 }}>
              Terms
            </MuiLink>
            &bull;
            <MuiLink href="#" color="inherit" underline="hover" sx={{ mx: 0.5 }}>
              Contact
            </MuiLink>
          </Typography>
        </Box>
      </AuthLayout>
    </>
  );
};

export default Login;
