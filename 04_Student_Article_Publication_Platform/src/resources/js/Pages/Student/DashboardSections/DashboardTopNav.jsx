// DashboardTopNav.jsx (updated with ThemePicker beside notifications)
import { useMemo, useState, useEffect } from 'react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider,
    alpha,
    useScrollTrigger,
} from '@mui/material';
import {
    SearchRounded,
    NotificationsNoneRounded,
    ManageAccountsRounded,
    LogoutRounded,
    ChevronLeft,
    ChevronRight,
    NotificationsActiveRounded,
    MarkEmailReadRounded,
    BookmarkBorder,
    AutoStories,
    History,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import ThemePicker from '@/Components/ThemePicker';
import { initEcho } from '../../../notifications/NotificationListener';

export const CATEGORIES = [
    { id: 'technology', label: 'Technology' },
    { id: 'science', label: 'Science' },
    { id: 'campus', label: 'Campus Life' },
    { id: 'opinion', label: 'Opinion' },
    { id: 'arts', label: 'Arts' },
    { id: 'sports', label: 'Sports' },
    { id: 'academics', label: 'Academics' },
    { id: 'events', label: 'Events' },
];

const NAV_ITEMS = [
    { key: 'feed', label: 'Home', icon: <AutoStories fontSize="small" /> },
    { key: 'saved', label: 'Saved', icon: <BookmarkBorder fontSize="small" /> },
    { key: 'history', label: 'History', icon: <History fontSize="small" /> },
];

export default function DashboardTopNav({
    activeView,
    activeCategory,
    onViewChange,
    onCategoryChange,
    search,
    onSearchChange,
    mode,
    onToggleMode,
    userName,
    userId,
    userEmail,
    notificationCount = 0,
    onOpenMobileWidgets,
}) {
    const { colors, isDarkMode } = useTheme();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [localCategory, setLocalCategory] = useState(activeCategory || CATEGORIES[0].id);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const open = Boolean(menuAnchor);
    const avatarLetter = useMemo(() => (userName ? userName[0]?.toUpperCase() : 'U'), [userName]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(notificationCount);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const visibleCategories = CATEGORIES.slice(categoryIndex, categoryIndex + 4);
    const showLeftArrow = categoryIndex > 0;
    const showRightArrow = categoryIndex < CATEGORIES.length - 4;

    const handleNextCategories = () => {
        if (categoryIndex < CATEGORIES.length - 4) setCategoryIndex(categoryIndex + 1);
    };

    const handlePrevCategories = () => {
        if (categoryIndex > 0) setCategoryIndex(categoryIndex - 1);
    };

    useEffect(() => {
        if (activeCategory && activeCategory !== localCategory) {
            setLocalCategory(activeCategory);
        }
    }, [activeCategory, localCategory]);

    const handleCategorySelect = (categoryId) => {
        setLocalCategory(categoryId);
        onCategoryChange?.(categoryId);
    };

    // Notification listeners
    useEffect(() => {
        if (!userId) return;
        initEcho(userId);
        const handleNewArticle = (e) => {
            setNotifications((prev) => [{ type: 'article', ...e.detail }, ...prev]);
            setUnreadCount((c) => c + 1);
        };
        const handleReply = (e) => {
            setNotifications((prev) => [{
                type: 'reply',
                ...e.detail,
                reply: e.detail.reply || (e.detail.body ? { body: e.detail.body } : undefined)
            }, ...prev]);
            setUnreadCount((c) => c + 1);
        };
        window.addEventListener('notify:new-article', handleNewArticle);
        window.addEventListener('notify:comment-reply', handleReply);
        return () => {
            window.removeEventListener('notify:new-article', handleNewArticle);
            window.removeEventListener('notify:comment-reply', handleReply);
        };
    }, [userId]);

    const handleNotifClick = (e) => setNotifAnchor(e.currentTarget);
    const handleNotifClose = () => setNotifAnchor(null);
    const handleMarkAllRead = () => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    };
    const handleClearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    // Styles
    const navButtonStyle = (isActive) => ({
        color: isActive ? colors.accent : colors.textSecondary,
        fontWeight: isActive ? 700 : 500,
        fontFamily: '"Times New Roman", Times, serif',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        position: 'relative',
        '&:after': isActive ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 8,
            right: 8,
            height: 2,
            backgroundColor: colors.accent,
        } : {},
        '&:hover': {
            color: colors.accent,
            backgroundColor: 'transparent',
        },
    });

    const categoryButtonStyle = (isActive) => ({
        color: isActive ? colors.accent : colors.textSecondary,
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '0.8rem',
        fontWeight: isActive ? 700 : 400,
        textTransform: 'uppercase',
        minWidth: 'auto',
        px: 1.5,
        py: 0.5,
        border: isActive ? `1px solid ${colors.accent}` : `1px solid transparent`,
        borderRadius: 0,
        '&:hover': {
            color: colors.accent,
            backgroundColor: alpha(colors.accent, 0.05),
            borderColor: colors.accent,
        },
    });

    return (
        <>
            {/* Main Navigation Bar */}
            <Paper
                elevation={0}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1200,
                    border: `1px solid ${colors.border}`,
                    bgcolor: alpha(colors.background, 0.95),
                    backdropFilter: 'blur(8px)',
                    boxShadow: trigger ? `0 4px 20px ${alpha(colors.border, 0.2)}` : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                {/* Top Row - Logo, Search, Theme Picker, Notifications, User */}
                <Box sx={{ p: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {/* Left - Newspaper Name and Mobile Menu */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontWeight: 900,
                                    color: colors.text,
                                    letterSpacing: '-0.02em',
                                    borderRight: `2px solid ${colors.accent}`,
                                    pr: 2,
                                    mr: 1,
                                }}
                            >
                                FYI
                            </Typography>

                            {/* Mobile Menu Button */}
                            <IconButton
                                onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
                                sx={{ display: { xs: 'flex', md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Stack>

                        {/* Center - Search (desktop) */}
                        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, maxWidth: 500, mx: 2 }}>
                            <TextField
                                size="small"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Search the news..."
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontFamily: '"Times New Roman", Times, serif',
                                        borderRadius: 0,
                                        color: colors.text,
                                        backgroundColor: alpha(colors.surface, 0.3),
                                        '& fieldset': {
                                            borderColor: colors.border,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.accent,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: colors.accent,
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRounded sx={{ color: colors.textSecondary, fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Right - Notifications, Theme Picker, User */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {/* Notifications */}
                            <IconButton
                                onClick={handleNotifClick}
                                sx={{
                                    color: colors.textSecondary,
                                    '&:hover': { color: colors.accent }
                                }}
                            >
                                <Badge
                                    badgeContent={unreadCount}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: colors.accent,
                                            color: colors.background,
                                        }
                                    }}
                                >
                                    <NotificationsNoneRounded />
                                </Badge>
                            </IconButton>

                            {/* Theme Picker - placed directly beside notifications */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRight: `1px solid ${colors.border}`,
                                pr: 1.5,
                            }}>
                                <ThemePicker position="top-right" />
                            </Box>

                            {/* User Avatar */}
                            <IconButton
                                onClick={(e) => setMenuAnchor(e.currentTarget)}
                                sx={{
                                    p: 0.5,
                                    border: `2px solid ${colors.border}`,
                                    borderRadius: 0,
                                    '&:hover': {
                                        borderColor: colors.accent,
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: colors.accent,
                                        color: colors.background,
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {avatarLetter}
                                </Avatar>
                            </IconButton>
                        </Stack>
                    </Stack>

                    {/* Mobile Search - visible only on mobile */}
                    <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
                        <TextField
                            size="small"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search the news..."
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: '"Times New Roman", Times, serif',
                                    borderRadius: 0,
                                    color: colors.text,
                                    backgroundColor: alpha(colors.surface, 0.3),
                                    '& fieldset': {
                                        borderColor: colors.border,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRounded sx={{ color: colors.textSecondary, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                {/* Middle Row - Navigation Tabs */}
                <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${colors.border}` }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        {NAV_ITEMS.map((item) => (
                            <Button
                                key={item.key}
                                onClick={() => onViewChange(item.key)}
                                startIcon={item.icon}
                                sx={navButtonStyle(activeView === item.key)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>
                </Box>

                {/* Bottom Row - Categories with scroll arrows */}
                <Box sx={{ px: 2, py: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                            sx={{
                                fontFamily: '"Courier New", monospace',
                                fontSize: '0.7rem',
                                color: colors.textSecondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            SECTIONS:
                        </Typography>

                        <IconButton
                            onClick={handlePrevCategories}
                            disabled={!showLeftArrow}
                            size="small"
                            sx={{
                                opacity: showLeftArrow ? 1 : 0.3,
                                color: colors.textSecondary,
                            }}
                        >
                            <ChevronLeft fontSize="small" />
                        </IconButton>

                        <Stack direction="row" spacing={0.5} sx={{ overflow: 'hidden' }}>
                            {visibleCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    sx={categoryButtonStyle((activeCategory || localCategory) === category.id)}
                                >
                                    {category.label}
                                </Button>
                            ))}
                        </Stack>

                        <IconButton
                            onClick={handleNextCategories}
                            disabled={!showRightArrow}
                            size="small"
                            sx={{
                                opacity: showRightArrow ? 1 : 0.3,
                                color: colors.textSecondary,
                            }}
                        >
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </Paper>

            {/* Mobile Navigation Menu */}
            <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={() => setMobileMenuAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 0,
                        bgcolor: colors.background,
                    }
                }}
            >
                {NAV_ITEMS.map((item) => (
                    <MenuItem
                        key={item.key}
                        onClick={() => {
                            onViewChange(item.key);
                            setMobileMenuAnchor(null);
                        }}
                        selected={activeView === item.key}
                        sx={{
                            gap: 1.5,
                            color: activeView === item.key ? colors.accent : colors.text,
                            '&.Mui-selected': {
                                backgroundColor: alpha(colors.accent, 0.1),
                            },
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
                <Divider sx={{ borderColor: colors.border }} />
                <MenuItem>
                    <ThemePicker />
                </MenuItem>
            </Menu>

            {/* Profile Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={open}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 220,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 0,
                        bgcolor: colors.background,
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        {userName || 'Student Account'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: '"Courier New", monospace', color: colors.textSecondary }}>
                        {userEmail || 'student@fyi.edu'}
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: colors.border }} />
                <MenuItem onClick={() => router.visit(route('student.profile'))} sx={{ gap: 1.5, color: colors.text }}>
                    <ManageAccountsRounded fontSize="small" /> Profile
                </MenuItem>
                <MenuItem onClick={() => router.visit(route('student.settings'))} sx={{ gap: 1.5, color: colors.text }}>
                    <ManageAccountsRounded fontSize="small" /> Settings
                </MenuItem>
                <Divider sx={{ borderColor: colors.border }} />
                <MenuItem onClick={() => router.post(route('logout'))} sx={{ gap: 1.5, color: colors.error }}>
                    <LogoutRounded fontSize="small" /> Sign Out
                </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={handleNotifClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 320,
                        maxWidth: 380,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 0,
                        bgcolor: colors.background,
                    }
                }}
            >
                <Box sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        Notifications
                    </Typography>
                    <Button
                        size="small"
                        onClick={handleMarkAllRead}
                        sx={{
                            color: colors.accent,
                            textTransform: 'none',
                            fontFamily: '"Times New Roman", Times, serif',
                            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        Mark all read
                    </Button>
                </Box>

                <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Typography sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            color: colors.textSecondary,
                            px: 2,
                            py: 3,
                            textAlign: 'center'
                        }}>
                            No notifications yet.
                        </Typography>
                    ) : (
                        notifications.map((notif, idx) => (
                            <Box key={idx} sx={{
                                px: 2,
                                py: 1.5,
                                borderBottom: idx !== notifications.length - 1 ? `1px solid ${colors.border}` : 'none',
                                bgcolor: notif.read ? 'transparent' : alpha(colors.accent, 0.05),
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: alpha(colors.accent, 0.02),
                                }
                            }}>
                                {notif.type === 'article' ? (
                                    <NotificationsActiveRounded sx={{ color: colors.accent, fontSize: 22 }} />
                                ) : (
                                    <MarkEmailReadRounded sx={{ color: colors.primary, fontSize: 22 }} />
                                )}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                                        {notif.type === 'article' ? `New: ${notif.title}` : 'New reply to your comment'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                                        {notif.type === 'reply' && notif.reply ? `"${notif.reply.body?.substring(0, 50)}..."` : ''}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mt: 0.5 }}>
                                        {notif.published_at ? new Date(notif.published_at).toLocaleString() : 'Just now'}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>

                {notifications.length > 0 && (
                    <Box sx={{
                        px: 2,
                        py: 1,
                        borderTop: `1px solid ${colors.border}`,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Button
                            size="small"
                            color="error"
                            onClick={handleClearAll}
                            sx={{
                                textTransform: 'none',
                                fontFamily: '"Times New Roman", Times, serif',
                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                            }}
                        >
                            Clear all
                        </Button>
                    </Box>
                )}
            </Menu>
        </>
    );
}
