import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
  const { colors, isDarkMode, getGradient } = useTheme();
  const user = usePage().props.auth.user;
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  return (
    <Box component="form" onSubmit={submit} className={className}>
      <Stack spacing={3}>
        {/* Name Field */}
        <TextField
          label="Full Name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: colors.textPrimary,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '10px',
              '& fieldset': { borderColor: colors.border },
              '&:hover fieldset': { borderColor: colors.primary },
              '&.Mui-focused fieldset': { borderColor: colors.primary },
            },
            '& .MuiInputLabel-root': { color: colors.textSecondary },
            '& .MuiFormHelperText-root': { color: colors.danger },
          }}
        />

        {/* Email Field */}
        <TextField
          label="Email Address"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: colors.textPrimary,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '10px',
              '& fieldset': { borderColor: colors.border },
              '&:hover fieldset': { borderColor: colors.primary },
              '&.Mui-focused fieldset': { borderColor: colors.primary },
            },
            '& .MuiInputLabel-root': { color: colors.textSecondary },
            '& .MuiFormHelperText-root': { color: colors.danger },
          }}
        />

        {/* Email Verification Notice */}
        {mustVerifyEmail && user.email_verified_at === null && (
          <Alert severity="warning" sx={{ borderRadius: '10px' }}>
            <Typography variant="body2">
              Your email address is unverified.{' '}
              <Button
                variant="text"
                size="small"
                sx={{ color: colors.primary, textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                Click here to resend the verification email.
              </Button>
            </Typography>
          </Alert>
        )}

        {/* Status Message */}
        {status === 'verification-link-sent' && (
          <Alert severity="success" sx={{ borderRadius: '10px' }}>
            A new verification link has been sent to your email address.
          </Alert>
        )}

        {/* Success Message */}
        {showSuccess && (
          <Alert severity="success" sx={{ borderRadius: '10px' }}>
            Profile updated successfully.
          </Alert>
        )}

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={processing}
            startIcon={<SaveIcon />}
            sx={{
              background: getGradient(),
              color: '#fff',
              borderRadius: '10px',
              px: 4,
              py: 1,
              fontWeight: 600,
              boxShadow: `0 4px 12px ${colors.primary}40`,
              '&:hover': {
                opacity: 0.9,
                boxShadow: `0 6px 16px ${colors.primary}60`,
              },
              '&.Mui-disabled': {
                background: colors.border,
                color: colors.textSecondary,
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
