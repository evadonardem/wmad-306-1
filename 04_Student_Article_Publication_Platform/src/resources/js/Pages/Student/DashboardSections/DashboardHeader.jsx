import { useMemo, useState } from 'react';
import {
    Avatar,
    Badge,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { COLORS, DARK_COLORS } from './dashboardTheme';
import { Link, router } from '@inertiajs/react';

export default function DashboardHeader({
    isMobile,
    search,
    onSearchChange,
    mode,
    onToggleMode,
    onOpenMobileWidgets,
    userName,
}) {
    const isDark = mode === 'dark';
    const [menuAnchor, setMenuAnchor] = useState(null);
    const open = Boolean(menuAnchor);

    const avatarLetter = useMemo(() => (userName ? userName[0]?.toUpperCase() : 'U'), [userName]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: 2,
                border: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}20`}`,
                mb: 2,
                bgcolor: 'background.paper',
                position: 'sticky',
                top: 0,
                zIndex: 5,
                backdropFilter: 'blur(6px)',
                backgroundColor: isDark ? `${DARK_COLORS.cardBg}F2` : '#FFFFFFF2',
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                    {isMobile && (
                        <IconButton onClick={onOpenMobileWidgets} sx={{ color: COLORS.royalPurple }}>
                            <MenuRoundedIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            background: `linear-gradient(135deg, ${COLORS.deepPurple}, ${COLORS.softPink})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        FYI
                    </Typography>
                </Stack>

                <TextField
                    size="small"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search..."
                    sx={{
                        width: { xs: '100%', sm: 280, md: 320 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 6,
                            bgcolor: isDark ? '#1F1D30' : '#F5F7FA',
                            color: isDark ? DARK_COLORS.textPrimary : COLORS.deepPurple,
                            '&.Mui-focused': {
                                boxShadow: 'none',
                                outline: 'none',
                            },
                            '& fieldset': {
                                border: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}33`}`,
                            },
                            '& input::placeholder': {
                                color: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                opacity: 1,
                            },
                            '& input:focus': {
                                outline: 'none',
                            },
                            '&:hover': {
                                bgcolor: isDark ? DARK_COLORS.cardBg : '#FFFFFF',
                                boxShadow: `0 2px 8px ${COLORS.deepPurple}15`,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon
                                    sx={{
                                        color: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                        fontSize: 20,
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton sx={{ color: COLORS.royalPurple }}>
                        <Badge
                            badgeContent={3}
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: COLORS.softPink,
                                    color: '#fff',
                                    fontSize: 10,
                                    minWidth: 16,
                                    height: 16,
                                },
                            }}
                        >
                            <NotificationsNoneRoundedIcon fontSize="small" />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={onToggleMode}
                        sx={{
                            color: isDark ? DARK_COLORS.softPink : COLORS.royalPurple,
                            bgcolor: isDark ? `${DARK_COLORS.softPink}15` : 'transparent',
                        }}
                    >
                        {isDark ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
                    </IconButton>

                    <IconButton
                        onClick={(event) => setMenuAnchor(event.currentTarget)}
                        sx={{ p: 0 }}
                        aria-controls={open ? 'profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: COLORS.softPink,
                                border: `2px solid ${COLORS.mediumPurple}`,
                                fontWeight: 700,
                                color: '#fff',
                                fontSize: 14,
                            }}
                        >
                            {avatarLetter}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="profile-menu"
                        anchorEl={menuAnchor}
                        open={open}
                        onClose={() => setMenuAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem component={Link} href={route('profile.edit')} onClick={() => setMenuAnchor(null)}>
                            <ManageAccountsRoundedIcon fontSize="small" style={{ marginRight: 8 }} />
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                router.post(route('logout'));
                            }}
                        >
                            <LogoutRoundedIcon fontSize="small" style={{ marginRight: 8 }} />
                            Log Out
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>
        </Paper>
    );
}
