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
    DarkModeRounded,
    LightModeRounded,
    LogoutRounded,
    ManageAccountsRounded,
    PaletteRounded,
    RuleRounded,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function EditorTopBar() {
    const { auth } = usePage().props;
    const { theme, setTheme, isDarkMode, setIsDarkMode, availableThemes, colors } = useTheme();

    const [themeAnchor, setThemeAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);

    const roles = useMemo(() => {
        if (Array.isArray(auth?.roles)) return auth.roles;
        return [];
    }, [auth?.roles]);

    const canSwitchToWriter = roles.includes('writer');

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
                        <RuleRounded fontSize="small" />
                    </Box>
                    <Box>
                        <Typography fontWeight={900} sx={{ color: colors.text, letterSpacing: '-0.02em' }}>
                            FYI Editor Desk
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            Review, revisions, and publication
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Button
                        size="small"
                        variant={route().current('editor.*') ? 'contained' : 'outlined'}
                        onClick={() => router.visit(route('editor.dashboard'))}
                        sx={{
                            bgcolor: route().current('editor.*') ? colors.primary : 'transparent',
                            borderColor: colors.primary,
                            color: route().current('editor.*') ? colors.background : colors.primary,
                            '&:hover': {
                                bgcolor: route().current('editor.*') ? colors.accent : alpha(colors.primary, 0.08),
                                borderColor: colors.primary,
                            },
                        }}
                    >
                        Editor
                    </Button>

                    {canSwitchToWriter ? (
                        <Button
                            size="small"
                            variant={route().current('writer.*') ? 'contained' : 'outlined'}
                            onClick={() => router.visit(route('writer.dashboard'))}
                            sx={{
                                bgcolor: route().current('writer.*') ? colors.primary : 'transparent',
                                borderColor: colors.primary,
                                color: route().current('writer.*') ? colors.background : colors.primary,
                                '&:hover': {
                                    bgcolor: route().current('writer.*') ? colors.accent : alpha(colors.primary, 0.08),
                                    borderColor: colors.primary,
                                },
                            }}
                        >
                            Writer
                        </Button>
                    ) : null}

                    <Tooltip title="Theme Picker">
                        <IconButton onClick={(e) => setThemeAnchor(e.currentTarget)}>
                            <PaletteRounded />
                        </IconButton>
                    </Tooltip>

                    <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: colors.accent, color: colors.background }}>
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'E'}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Stack>

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

                {Object.entries(availableThemes).map(([key, themeData]) => {
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
                })}
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
                        {auth?.user?.name || 'Editor'}
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
