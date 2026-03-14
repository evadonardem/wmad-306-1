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
    AssignmentTurnedInRounded,
    LogoutRounded,
    ManageAccountsRounded,
    PaletteRounded,
    PublishedWithChangesRounded,
    SwitchAccountRounded,
    TableViewRounded,
    ViewListRounded,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { NEWSPAPER_THEMES, getThemeColors, useThemeContext } from '@/Components/ThemeContext';

const NAV_ITEMS = [
    { key: 'queue', label: 'Review Queue', href: '/editor/dashboard', icon: <ViewListRounded fontSize="small" /> },
    { key: 'tracking', label: 'Tracking', href: '/editor/tracking', icon: <TableViewRounded fontSize="small" /> },
    { key: 'published', label: 'Published', href: '/editor/published', icon: <PublishedWithChangesRounded fontSize="small" /> },
];

export default function EditorTopBar({ active = 'queue', availableRoles = [] }) {
    const { auth } = usePage().props;
    const { theme: currentTheme, setTheme: setCurrentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);
    const [themeAnchor, setThemeAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [roleAnchor, setRoleAnchor] = useState(null);

    const roles = useMemo(() => {
        const fromProps = Array.isArray(availableRoles) ? availableRoles : [];
        const fromAuth = Array.isArray(auth?.user?.roles) ? auth.user.roles : [];
        return [...new Set([...fromProps, ...fromAuth])];
    }, [availableRoles, auth?.user?.roles]);

    const canSwitchToWriter = roles.includes('writer');
    const activeRole = auth?.active_role || 'editor';

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'sticky',
                top: 8,
                zIndex: 1200,
                px: { xs: 1.5, md: 2.5 },
                py: 1,
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
                        className="icon-shell"
                        data-icon-shell="true"
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
                        <AssignmentTurnedInRounded fontSize="small" />
                    </Box>
                    <Box>
                        <Typography fontWeight={800} sx={{ color: colors.newsprint }}>
                            FYI Editor Desk
                        </Typography>
                      
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    {NAV_ITEMS.map((item) => (
                        <Button
                            key={item.key}
                            size="small"
                            variant={active === item.key ? 'contained' : 'outlined'}
                            onClick={() => router.visit(item.href)}
                            sx={{
                                bgcolor: active === item.key ? colors.newsprint : 'transparent',
                                borderColor: colors.newsprint,
                                color: active === item.key ? colors.paper : colors.newsprint,
                                '&:hover': {
                                    bgcolor: active === item.key ? colors.accent : alpha(colors.newsprint, 0.08),
                                    borderColor: colors.newsprint,
                                },
                            }}
                            startIcon={item.icon}
                        >
                            {item.label}
                        </Button>
                    ))}

                    <Tooltip title="Switch Role">
                        <IconButton onClick={(e) => setRoleAnchor(e.currentTarget)}>
                            <SwitchAccountRounded />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Theme Picker">
                        <IconButton onClick={(e) => setThemeAnchor(e.currentTarget)}>
                            <PaletteRounded />
                        </IconButton>
                    </Tooltip>

                    <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: colors.accent, color: colors.paper }}>
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'E'}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Stack>

            <Menu anchorEl={roleAnchor} open={Boolean(roleAnchor)} onClose={() => setRoleAnchor(null)}>
                <MenuItem
                    selected={activeRole === 'editor'}
                    onClick={() => {
                        setRoleAnchor(null);
                        router.post(route('role.switch'), { role: 'editor' });
                    }}
                >
                    Switch Role: Editor
                </MenuItem>
                <MenuItem
                    disabled={!canSwitchToWriter}
                    selected={activeRole === 'writer'}
                    onClick={() => {
                        setRoleAnchor(null);
                        if (canSwitchToWriter) {
                            router.post(route('role.switch'), { role: 'writer' });
                        }
                    }}
                >
                    Switch Role: Writer
                </MenuItem>
            </Menu>

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
                            {currentTheme === key && <Typography sx={{ ml: 'auto' }}>OK</Typography>}
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>

            <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{auth?.user?.name || 'Editor'}</Typography>
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
