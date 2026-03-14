import { router, usePage } from '@inertiajs/react';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    ArticleRounded,
    ContactPageRounded,
    DarkModeRounded,
    LightModeRounded,
    LogoutRounded,
    ManageAccountsRounded,
    PaletteRounded,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', action: () => router.visit(route('writer.dashboard')) },
    { key: 'view-articles', label: 'View Articles', action: () => router.visit('/articles') },
];

export default function WriterTopBar({ active }) {
    const { auth } = usePage().props;
    const { theme, setTheme, isDarkMode, setIsDarkMode, availableThemes, colors } = useTheme();

    const roles = useMemo(() => {
        const userRoles = Array.isArray(auth?.user?.roles) ? auth.user.roles : [];
        const propRoles = Array.isArray(auth?.roles) ? auth.roles : [];
        return [...new Set([...userRoles, ...propRoles])];
    }, [auth?.roles, auth?.user?.roles]);

    const canSwitchToEditor = roles.includes('editor');
    const canSwitchToWriter = roles.includes('writer');
    const activeRole = auth?.active_role || 'writer';

    const [themeAnchor, setThemeAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [roleAnchor, setRoleAnchor] = useState(null);

    const resolvedActive = useMemo(() => {
        if (active) return active;
        if (route().current('public.articles.index') || route().current('public.articles.show')) return 'view-articles';
        return 'dashboard';
    }, [active]);

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
                borderColor: colors.border,
                bgcolor: alpha(colors.surface, 0.92),
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
                            bgcolor: alpha(colors.accent, 0.12),
                            color: colors.accent,
                        }}
                    >
                        <ArticleRounded fontSize="small" />
                    </Box>
                    <Box>
                        <Typography fontWeight={900} sx={{ color: colors.text, letterSpacing: '-0.02em' }}>
                            FYI Writer Desk
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            Drafts, submissions, and deadlines
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    {NAV_ITEMS.map((item) => (
                        <Button
                            key={item.key}
                            size="small"
                            variant={resolvedActive === item.key ? 'contained' : 'outlined'}
                            onClick={item.action}
                            sx={{
                                bgcolor: resolvedActive === item.key ? colors.primary : 'transparent',
                                borderColor: colors.primary,
                                color: resolvedActive === item.key ? colors.background : colors.primary,
                                '&:hover': {
                                    bgcolor:
                                        resolvedActive === item.key
                                            ? colors.accent
                                            : alpha(colors.primary, 0.08),
                                    borderColor: colors.primary,
                                },
                            }}
                            startIcon={item.key === 'view-articles' ? <ArticleRounded fontSize="small" /> : null}
                        >
                            {item.label}
                        </Button>
                    ))}

                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 0.25 }}>
                        {(canSwitchToEditor || canSwitchToWriter) ? (
                            <Tooltip title="Switch Role">
                                <IconButton
                                    onClick={(e) => setRoleAnchor(e.currentTarget)}
                                    sx={{
                                        color: colors.textSecondary,
                                        borderBottom: roleAnchor ? '2px solid' : '2px solid transparent',
                                        borderColor: roleAnchor ? colors.border : 'transparent',
                                        borderRadius: 0,
                                        '&:hover': { bgcolor: alpha(colors.hover, 0.8) },
                                    }}
                                >
                                    <ContactPageRounded />
                                </IconButton>
                            </Tooltip>
                        ) : null}

                        <Tooltip title="Theme Picker">
                            <IconButton onClick={(e) => setThemeAnchor(e.currentTarget)}>
                                <PaletteRounded />
                            </IconButton>
                        </Tooltip>

                        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                            <Avatar sx={{ width: 34, height: 34, bgcolor: colors.accent, color: colors.background }}>
                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'W'}
                            </Avatar>
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>

            <Menu
                anchorEl={roleAnchor}
                open={Boolean(roleAnchor)}
                onClose={() => setRoleAnchor(null)}
            >
                <MenuItem
                    selected={activeRole === 'writer'}
                    disabled={!canSwitchToWriter}
                    onClick={() => {
                        setRoleAnchor(null);
                        if (canSwitchToWriter) {
                            router.post(route('role.switch'), { role: 'writer' });
                        }
                    }}
                >
                    Switch Role: Writer
                </MenuItem>
                <MenuItem
                    selected={activeRole === 'editor'}
                    disabled={!canSwitchToEditor}
                    onClick={() => {
                        setRoleAnchor(null);
                        if (canSwitchToEditor) {
                            router.post(route('role.switch'), { role: 'editor' });
                        }
                    }}
                >
                    Switch Role: Editor
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={themeAnchor}
                open={Boolean(themeAnchor)}
                onClose={() => setThemeAnchor(null)}
                PaperProps={{
                    sx: {
                        minWidth: 260,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: colors.border,
                        bgcolor: colors.surface,
                    },
                }}
            >
                <MenuItem
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    sx={{
                        color: colors.text,
                        '&:hover': { bgcolor: colors.hover },
                    }}
                >
                    {isDarkMode ? (
                        <DarkModeRounded fontSize="small" style={{ marginRight: 10 }} />
                    ) : (
                        <LightModeRounded fontSize="small" style={{ marginRight: 10 }} />
                    )}
                    <ListItemText
                        primary="Dark Mode"
                        secondary={isDarkMode ? 'On' : 'Off'}
                        primaryTypographyProps={{ sx: { fontWeight: 700, color: colors.text } }}
                        secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                    />
                </MenuItem>

                <Divider sx={{ borderColor: colors.border }} />

                {Object.entries(availableThemes).map(([key, themeData]) => (
                    (() => {
                        const previewColors = themeData[isDarkMode ? 'dark' : 'light'];
                        return (
                    <MenuItem
                        key={key}
                        selected={theme === key}
                        onClick={() => {
                            setTheme(key);
                            setThemeAnchor(null);
                        }}
                        sx={{
                            color: colors.text,
                            '&.Mui-selected': { bgcolor: alpha(colors.accent, 0.14) },
                            '&.Mui-selected:hover': { bgcolor: alpha(colors.accent, 0.18) },
                            '&:hover': { bgcolor: colors.hover },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: previewColors.primary,
                                        border: '1px solid',
                                        borderColor: previewColors.border,
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: previewColors.secondary,
                                        border: '1px solid',
                                        borderColor: previewColors.border,
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 99,
                                        bgcolor: previewColors.accent,
                                        border: '1px solid',
                                        borderColor: previewColors.border,
                                    }}
                                />
                            </Stack>
                            <Typography sx={{ fontWeight: 600 }}>{themeData.name}</Typography>
                            {theme === key && <Typography sx={{ ml: 'auto', color: colors.accent }}>✓</Typography>}
                        </Stack>
                    </MenuItem>
                        );
                    })()
                ))}
            </Menu>

            <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: colors.border,
                        bgcolor: colors.surface,
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                        {auth?.user?.name || 'Writer'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {auth?.user?.email || ''}
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: colors.border }} />
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        router.visit('/profile');
                    }}
                    sx={{ '&:hover': { bgcolor: colors.hover }, color: colors.text }}
                >
                    <ManageAccountsRounded fontSize="small" sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        router.post('/logout');
                    }}
                    sx={{ color: colors.error, '&:hover': { bgcolor: colors.hover } }}
                >
                    <LogoutRounded fontSize="small" sx={{ mr: 1 }} /> Sign Out
                </MenuItem>
            </Menu>
        </Paper>
    );
}
