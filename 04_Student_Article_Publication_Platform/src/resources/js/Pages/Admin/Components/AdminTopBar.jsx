import { router, usePage } from '@inertiajs/react';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    AdminPanelSettingsRounded,
    LogoutRounded,
    ManageAccountsRounded,
    PaletteRounded,
} from '@mui/icons-material';
import { useState } from 'react';
import { NEWSPAPER_THEMES, getThemeColors, useThemeContext } from '@/Components/ThemeContext';

export default function AdminTopBar({ active = 'dashboard' }) {
    const { auth } = usePage().props;
    const { theme: currentTheme, setTheme: setCurrentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    const [themeAnchor, setThemeAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'sticky',
                top: 8,
                zIndex: 1200,
                px: { xs: 1.5, md: 2.5 },
                py: 1,
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(colors.border, 0.65),
                bgcolor: alpha(colors.paper, 0.92),
                backdropFilter: 'blur(14px)',
                mb: 2,
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: 2,
                            bgcolor: alpha(colors.newsprint, 0.1),
                            color: colors.newsprint,
                        }}
                    >
                        <AdminPanelSettingsRounded fontSize="small" />
                    </Box>
                    <Box>
                        <Typography fontWeight={800} sx={{ color: colors.newsprint }}>
                            FYI Admin Dashboard
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.byline }}>
                            Platform administration
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant={active === 'dashboard' ? 'contained' : 'outlined'}
                        onClick={() => router.visit('/admin/dashboard')}
                        sx={{
                            bgcolor: active === 'dashboard' ? colors.newsprint : 'transparent',
                            borderColor: colors.newsprint,
                            color: active === 'dashboard' ? colors.paper : colors.newsprint,
                            '&:hover': {
                                bgcolor: active === 'dashboard' ? colors.accent : alpha(colors.newsprint, 0.08),
                                borderColor: colors.newsprint,
                            },
                        }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant={active === 'users' ? 'contained' : 'outlined'}
                        onClick={() => router.visit('/admin/users')}
                        sx={{
                            bgcolor: active === 'users' ? colors.newsprint : 'transparent',
                            borderColor: colors.newsprint,
                            color: active === 'users' ? colors.paper : colors.newsprint,
                            '&:hover': {
                                bgcolor: active === 'users' ? colors.accent : alpha(colors.newsprint, 0.08),
                                borderColor: colors.newsprint,
                            },
                        }}
                    >
                        User Management
                    </Button>

                    <Tooltip title="Theme Picker">
                        <IconButton onClick={(e) => setThemeAnchor(e.currentTarget)}>
                            <PaletteRounded />
                        </IconButton>
                    </Tooltip>

                    <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: colors.accent, color: colors.paper }}>
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Stack>

            <Menu anchorEl={themeAnchor} open={Boolean(themeAnchor)} onClose={() => setThemeAnchor(null)}>
                {Object.entries(NEWSPAPER_THEMES).map(([key, theme]) => (
                    <MenuItem
                        key={key}
                        selected={currentTheme === key}
                        onClick={() => {
                            setCurrentTheme(key);
                            setThemeAnchor(null);
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 180 }}>
                            <Typography component="span">{theme.icon}</Typography>
                            <Typography>{theme.name}</Typography>
                            {currentTheme === key && <Typography sx={{ ml: 'auto' }}>?</Typography>}
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>

            <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{auth?.user?.name || 'Admin'}</Typography>
                    <Typography variant="caption" color="text.secondary">{auth?.user?.email || ''}</Typography>
                </Box>
                <Divider />
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        router.visit('/profile');
                    }}
                >
                    <ManageAccountsRounded fontSize="small" sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        router.post('/logout');
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <LogoutRounded fontSize="small" sx={{ mr: 1 }} /> Sign Out
                </MenuItem>
            </Menu>
        </Paper>
    );
}

