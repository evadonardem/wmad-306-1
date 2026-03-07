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
    ArticleRounded,
    AssessmentRounded,
    LogoutRounded,
    ManageAccountsRounded,
    PaletteRounded,
    SettingsRounded,
} from '@mui/icons-material';
import { useState } from 'react';
import { NEWSPAPER_THEMES, getThemeColors, useThemeContext } from '@/Components/ThemeContext';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', action: () => router.visit('/admin/dashboard') },
    { key: 'users', label: 'Users', action: () => router.visit('/admin/users') },
    { key: 'articles', label: 'Articles', action: () => router.visit('/articles') },
    { key: 'reports', label: 'Reports', action: () => router.visit('/admin/dashboard#live-reports') },
    { key: 'settings', label: 'Settings', action: () => router.visit('/profile') },
];

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
                            FYI Admin Panel
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.byline }}>
                            Operations, moderation, and user control
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    {NAV_ITEMS.map((item) => (
                        <Button
                            key={item.key}
                            size="small"
                            variant={active === item.key ? 'contained' : 'outlined'}
                            onClick={item.action}
                            sx={{
                                bgcolor: active === item.key ? colors.newsprint : 'transparent',
                                borderColor: colors.newsprint,
                                color: active === item.key ? colors.paper : colors.newsprint,
                                '&:hover': {
                                    bgcolor: active === item.key ? colors.accent : alpha(colors.newsprint, 0.08),
                                    borderColor: colors.newsprint,
                                },
                            }}
                            startIcon={item.key === 'articles' ? <ArticleRounded fontSize="small" /> : item.key === 'reports' ? <AssessmentRounded fontSize="small" /> : item.key === 'settings' ? <SettingsRounded fontSize="small" /> : null}
                        >
                            {item.label}
                        </Button>
                    ))}

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
                    (() => {
                        const themeColors = getThemeColors(key);
                        return (
                    <MenuItem
                        key={key}
                        selected={currentTheme === key}
                        onClick={() => {
                            setCurrentTheme(key);
                            setThemeAnchor(null);
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 180 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: themeColors.accent,
                                        border: '1px solid',
                                        borderColor: themeColors.border,
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: themeColors.newsprint,
                                        border: '1px solid',
                                        borderColor: themeColors.border,
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: themeColors.paper,
                                        border: '1px solid',
                                        borderColor: themeColors.border,
                                    }}
                                />
                            </Stack>
                            <Typography>{theme.name}</Typography>
                            {currentTheme === key && <Typography sx={{ ml: 'auto' }}>OK</Typography>}
                        </Stack>
                    </MenuItem>
                        );
                    })()
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
