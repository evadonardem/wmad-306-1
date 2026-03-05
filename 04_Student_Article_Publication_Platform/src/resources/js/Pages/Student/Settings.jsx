import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Container,
    Stack,
    Typography,
    Paper,
    Divider,
    IconButton,
    Avatar,
    TextField,
    Button,
    alpha,
    useTheme,
    Alert,
    Snackbar,
    Collapse,
    ThemeProvider,
    CssBaseline,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Save,
    Cancel,
    ExpandLess,
    ExpandMore,
    Lock,
    Warning,
} from '@mui/icons-material';
import StudentLayout from '../Shared/Layouts/StudentLayout';
import { createDashboardTheme } from './DashboardSections/dashboardTheme';

const COLORS = {
    mediumPurple: '#6D5B98',
    softPink: '#E8A2B0',
    success: '#4CAF50',
    error: '#F44336',
};

const DARK_COLORS = {
    cardBg: '#151528',
    border: '#2A2A45',
    softPink: '#F0B5C0',
    royalPurple: '#9F93C0',
};

const SettingsSection = ({ title, icon, children, expanded = true }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isExpanded, setIsExpanded] = useState(expanded);

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: isDark ? alpha(DARK_COLORS.border, 0.6) : alpha(COLORS.mediumPurple, 0.12),
                bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.8) : alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{ p: 2.5, cursor: 'pointer' }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                            bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
                            p: 1,
                            borderRadius: 2,
                            display: 'flex',
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                </Stack>
                <IconButton size="small">{isExpanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
            </Stack>

            <Collapse in={isExpanded}>
                <Divider sx={{ borderColor: isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.12) }} />
                <Box sx={{ p: 3 }}>{children}</Box>
            </Collapse>
        </Paper>
    );
};

const SettingRow = ({ label, description, children, divider = true }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ py: 1.5 }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {label}
                    </Typography>
                    {description && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {description}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ minWidth: { sm: 220 }, width: { xs: '100%', sm: 'auto' } }}>{children}</Box>
            </Stack>
            {divider && <Divider sx={{ borderColor: isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.12) }} />}
        </>
    );
};

export default function Settings({ user }) {
    const { auth, errors } = usePage().props;
    const [mode, setMode] = useState(() => localStorage.getItem('dashboardTheme') || 'light');

    useEffect(() => {
        localStorage.setItem('dashboardTheme', mode);
    }, [mode]);

    const theme = useMemo(() => createDashboardTheme(mode), [mode]);
    const isDark = mode === 'dark';
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const accountForm = useForm({
        name: user?.name || auth?.user?.name || '',
        email: user?.email || auth?.user?.email || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const deleteForm = useForm({
        password: '',
    });

    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEditStart = (field, value) => {
        setEditing(field);
        setEditValue(value || '');
    };

    const handleEditSave = (field) => {
        const updatedData = {
            ...accountForm.data,
            [field]: editValue,
        };

        accountForm.setData(updatedData);

        router.put(route('student.settings.update'), updatedData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                setSnackbar({ open: true, message: 'Account information updated successfully!', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Please fix the highlighted account fields.', severity: 'error' });
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Please check your password fields.', severity: 'error' });
            },
        });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();

        deleteForm.delete(route('profile.destroy'), {
            preserveScroll: true,
            data: {
                password: deleteForm.data.password,
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Please provide your correct password to delete account.', severity: 'error' });
            },
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StudentLayout>
                <Head title="Settings" />
                <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
                    <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
                        <Stack spacing={4}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 2, borderBottom: '1px solid', borderColor: isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12) }}>
                                <IconButton onClick={() => router.visit(route('student.profile'))}>
                                    <ArrowBack />
                                </IconButton>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>Settings</Typography>
                            </Stack>

                            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar sx={{ width: 44, height: 44, bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink, color: '#fff' }}>
                                        {(accountForm.data.name || 'U').charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Personalize your account</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Update your account information and manage your password.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Stack spacing={3}>
                                <SettingsSection title="Account Information" icon={<Edit />}>
                                    <Stack spacing={2}>
                                        {['name', 'email'].map((field, idx, arr) => (
                                            <SettingRow
                                                key={field}
                                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                description={`Your ${field} information`}
                                                divider={idx !== arr.length - 1}
                                            >
                                                {editing === field ? (
                                                    <Stack direction="row" spacing={1}>
                                                        <TextField
                                                            size="small"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            fullWidth
                                                            type={field === 'email' ? 'email' : 'text'}
                                                        />
                                                        <IconButton size="small" onClick={() => handleEditSave(field)} sx={{ color: COLORS.success }}><Save /></IconButton>
                                                        <IconButton size="small" onClick={() => setEditing(null)} sx={{ color: COLORS.error }}><Cancel /></IconButton>
                                                    </Stack>
                                                ) : (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{accountForm.data[field] || `Add ${field}`}</Typography>
                                                        <IconButton size="small" onClick={() => handleEditStart(field, accountForm.data[field])}><Edit fontSize="small" /></IconButton>
                                                    </Stack>
                                                )}
                                            </SettingRow>
                                        ))}

                                        {(errors?.name || errors?.email) && (
                                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                                {errors?.name || errors?.email}
                                            </Alert>
                                        )}

                                    </Stack>
                                </SettingsSection>

                                <SettingsSection title="Change Password" icon={<Lock />}>
                                    <Stack component="form" spacing={2} onSubmit={handlePasswordSubmit}>
                                        <TextField
                                            label="Current Password"
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            error={Boolean(errors?.current_password)}
                                            helperText={errors?.current_password}
                                            fullWidth
                                        />
                                        <TextField
                                            label="New Password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            error={Boolean(errors?.password)}
                                            helperText={errors?.password}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Confirm New Password"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            error={Boolean(errors?.password_confirmation)}
                                            helperText={errors?.password_confirmation}
                                            fullWidth
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={passwordForm.processing}
                                            sx={{
                                                alignSelf: 'flex-start',
                                                bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                                '&:hover': { bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.mediumPurple },
                                            }}
                                        >
                                            Update Password
                                        </Button>
                                    </Stack>
                                </SettingsSection>

                                <SettingsSection title="Delete Account" icon={<Warning />}>
                                    <Stack component="form" spacing={2} onSubmit={handleDeleteAccount}>
                                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                            Deleting your account is permanent and cannot be undone.
                                        </Alert>

                                        <TextField
                                            label="Confirm your password"
                                            type="password"
                                            value={deleteForm.data.password}
                                            onChange={(e) => deleteForm.setData('password', e.target.value)}
                                            error={Boolean(errors?.password)}
                                            helperText={errors?.password}
                                            fullWidth
                                        />

                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            color="error"
                                            disabled={deleteForm.processing}
                                            sx={{ alignSelf: 'flex-start' }}
                                        >
                                            Delete My Account
                                        </Button>
                                    </Stack>
                                </SettingsSection>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </StudentLayout>
        </ThemeProvider>
    );
}
