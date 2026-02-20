import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  DeleteOutline as DeleteIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AccountSummary from './Partials/AccountSummary';

export default function Edit({ mustVerifyEmail, status, auth, completedProjects = [] }) {
  const { colors, isDarkMode, getGradient } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const user = auth?.user;

  const glassCardStyle = {
    background: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease',
  };

  const tabs = [
    { label: 'Overview', icon: <DashboardIcon />, value: 0 },
    { label: 'Profile', icon: <PersonIcon />, value: 1 },
    { label: 'Security', icon: <SecurityIcon />, value: 2 },
  ];

  return (
    <AuthenticatedLayout
      auth={auth}
      header={
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: '-0.5px',
            }}
          >
            Profile
          </Typography>
        </Box>
      }
    >
      <Head title="Profile" />

      <Box sx={{ py: 0 }}>
        {/* User Header Card */}
        <Paper sx={{ ...glassCardStyle, p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Avatar
              src={user?.avatar_url}
              sx={{
                width: 90,
                height: 90,
                border: `3px solid ${colors.primary}`,
                boxShadow: `0 4px 12px ${colors.primary}40`,
                bgcolor: colors.primary,
                fontSize: '2rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                {user?.email || 'user@example.com'}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                    Member since
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    }) : 'N/A'}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border }} />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Navigation Tabs */}
        <Paper sx={{ ...glassCardStyle, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              minHeight: 'auto',
              '& .MuiTab-root': {
                color: colors.textSecondary,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9rem',
                minHeight: '48px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: colors.primary,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                },
                '&.Mui-selected': {
                  color: colors.primary,
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primary,
                height: 3,
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <AccountSummary user={user} completedProjects={completedProjects} />}

          {tabValue === 1 && (
            <Stack spacing={3}>
              <Paper sx={{ ...glassCardStyle, p: 3 }}>
                <UpdateProfileInformationForm
                  mustVerifyEmail={mustVerifyEmail}
                  status={status}
                  auth={auth}
                />
              </Paper>

              <Paper sx={{ ...glassCardStyle, p: 3, border: `1px solid ${colors.danger}40` }}>
                <DeleteUserForm />
              </Paper>
            </Stack>
          )}

          {tabValue === 2 && (
            <Paper sx={{ ...glassCardStyle, p: 3 }}>
              <UpdatePasswordForm />
            </Paper>
          )}
        </Box>
      </Box>
    </AuthenticatedLayout>
  );
}
