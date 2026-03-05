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
    DarkModeRounded,
    LightModeRounded,
    SearchRounded,
    NotificationsNoneRounded,
    ManageAccountsRounded,
    Settings,
    LogoutRounded,
    ChevronLeft,
    ChevronRight,
    NotificationsActiveRounded,
    MarkEmailReadRounded,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { COLORS, DARK_COLORS } from './dashboardTheme';
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
    notificationCount = 0,
}) {
    const isDark = mode === 'dark';
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [localCategory, setLocalCategory] = useState(activeCategory || CATEGORIES[0].id);
    const open = Boolean(menuAnchor);
    const avatarLetter = useMemo(() => (userName ? userName[0]?.toUpperCase() : 'U'), [userName]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(notificationCount);
    const [popup, setPopup] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const visibleCategories = CATEGORIES.slice(categoryIndex, categoryIndex + 3);
    const showLeftArrow = categoryIndex > 0;
    const showRightArrow = categoryIndex < CATEGORIES.length - 3;

    const handleNextCategories = () => {
        if (categoryIndex < CATEGORIES.length - 3) setCategoryIndex(categoryIndex + 1);
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

    useEffect(() => {
        if (!userId) return;
        initEcho(userId);
        const handleNewArticle = (e) => {
            setNotifications((prev) => [{ type: 'article', ...e.detail }, ...prev]);
            setUnreadCount((c) => c + 1);
            setPopup({
                message: `New article published: ${e.detail.title}`,
                type: 'article',
            });
        };
        const handleReply = (e) => {
            setNotifications((prev) => [{ type: 'reply', ...e.detail }, ...prev]);
            setUnreadCount((c) => c + 1);
            setPopup({
                message: `Your comment received a reply!`,
                type: 'reply',
            });
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

    // Shared styles for nav buttons
    const navBtnStyle = (isActive) => ({
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.875rem',
        letterSpacing: '0.01em',
        transition: 'all 0.2s ease-in-out',
        color: isActive
            ? (isDark ? DARK_COLORS.softPink : COLORS.deepPurple)
            : (isDark ? alpha('#FFF', 0.6) : alpha(COLORS.royalPurple, 0.7)),
        px: 1.5,
        py: 0.5,
        borderRadius: '8px',
        bgcolor: isActive ? (isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.08)) : 'transparent',
        '&:hover': {
            bgcolor: isDark ? alpha('#FFF', 0.05) : alpha(COLORS.softPink, 0.05),
            color: isDark ? '#FFF' : COLORS.deepPurple,
        },
    });

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1200,
                px: { xs: 2, md: 4 },
                borderRadius: 0,
                borderBottom: '1px solid',
                borderColor: isDark ? alpha(DARK_COLORS.border, 0.6) : alpha(COLORS.mediumPurple, 0.12),
                bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.9) : alpha('#FFFFFF', 0.9),
                backdropFilter: 'blur(12px)',
                boxShadow: trigger ? '0 4px 20px -5px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                height: 70,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>

                {/* Brand Logo */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        background: `linear-gradient(90deg, ${COLORS.deepPurple} 0%, ${COLORS.softPink} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mr: 4,
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                >
                    FYI
                </Typography>

                {/* Navigation Center */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                    <Button
                        onClick={() => onViewChange?.('feed')}
                        sx={navBtnStyle(activeView === 'feed')}
                    >
                        Feed
                    </Button>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, my: 'auto', opacity: 0.5 }} />

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton
                            onClick={handlePrevCategories}
                            disabled={!showLeftArrow}
                            size="small"
                            sx={{ opacity: showLeftArrow ? 1 : 0.3 }}
                        >
                            <ChevronLeft fontSize="small" />
                        </IconButton>

                        <Stack direction="row" spacing={0.5}>
                            {visibleCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    sx={navBtnStyle((activeCategory || localCategory) === category.id)}
                                >
                                    {category.label}
                                </Button>
                            ))}
                        </Stack>

                        <IconButton
                            onClick={handleNextCategories}
                            disabled={!showRightArrow}
                            size="small"
                            sx={{ opacity: showRightArrow ? 1 : 0.3 }}
                        >
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Right Utilities */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Search Field */}
                    <TextField
                        size="small"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search..."
                        sx={{
                            width: searchFocused ? { xs: 180, md: 280 } : { xs: 140, md: 220 },
                            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& .MuiOutlinedInput-root': {
                                height: 38,
                                borderRadius: '10px',
                                bgcolor: isDark ? alpha('#000', 0.2) : alpha(COLORS.gray100, 0.5),
                                border: '1px solid',
                                borderColor: searchFocused
                                    ? (isDark ? DARK_COLORS.softPink : COLORS.softPink)
                                    : 'transparent',
                                '& fieldset': { border: 'none' },
                                fontSize: '0.85rem',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded sx={{
                                        color: searchFocused ? COLORS.softPink : 'text.disabled',
                                        fontSize: 20,
                                        ml: 0.5
                                    }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleNotifClick}>
                            <Badge
                                badgeContent={unreadCount}
                                color="error"
                                sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
                            >
                                <NotificationsNoneRounded />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notifAnchor}
                            open={Boolean(notifAnchor)}
                            onClose={handleNotifClose}
                            PaperProps={{
                                sx: {
                                    minWidth: 320,
                                    maxWidth: 380,
                                    borderRadius: 2,
                                    p: 0,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Notifications
                                </Typography>
                                <Button size="small" onClick={handleMarkAllRead} sx={{ textTransform: 'none', fontSize: 12 }}>
                                    Mark all read
                                </Button>
                            </Box>
                            <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
                                {notifications.length === 0 && (
                                    <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, py: 3, textAlign: 'center' }}>
                                        No notifications yet.
                                    </Typography>
                                )}
                                {notifications.map((notif, idx) => (
                                    <Box key={idx} sx={{
                                        px: 2, py: 1.5, borderBottom: idx !== notifications.length - 1 ? '1px solid #f3f3f3' : 'none',
                                        bgcolor: notif.read ? 'background.paper' : (isDark ? alpha(DARK_COLORS.softPink, 0.08) : alpha(COLORS.softPink, 0.08)),
                                        display: 'flex', alignItems: 'flex-start', gap: 1.5
                                    }}>
                                        {notif.type === 'article' ? (
                                            <NotificationsActiveRounded sx={{ color: COLORS.softPink, fontSize: 22, mt: 0.5 }} />
                                        ) : (
                                            <MarkEmailReadRounded sx={{ color: COLORS.royalPurple, fontSize: 22, mt: 0.5 }} />
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                {notif.type === 'article' ? `New article published: ${notif.title}` : 'Your comment received a reply!'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {notif.type === 'article' && notif.category ? `Category: ${notif.category}` : ''}
                                                {notif.type === 'reply' && notif.reply ? `Reply: ${notif.reply.body}` : ''}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
                                                {notif.published_at ? new Date(notif.published_at).toLocaleString() : ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            {notifications.length > 0 && (
                                <Box sx={{ px: 2, py: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button size="small" color="error" onClick={handleClearAll} sx={{ textTransform: 'none', fontSize: 12 }}>
                                        Clear all
                                    </Button>
                                </Box>
                            )}
                        </Menu>
                        <IconButton onClick={onToggleMode} size="small" sx={{ color: 'text.secondary' }}>
                            {isDark ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
                        </IconButton>
                    </Stack>

                    <IconButton
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{
                            p: '2px',
                            border: '2px solid',
                            borderColor: open ? COLORS.softPink : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.2) : COLORS.softPink,
                                color: isDark ? DARK_COLORS.softPink : '#FFF',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                            }}
                        >
                            {avatarLetter}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Stack>

            {/* Menu Styling */}
            <Menu
                anchorEl={menuAnchor}
                open={open}
                onClose={() => setMenuAnchor(null)}
                elevation={0}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: isDark ? alpha(DARK_COLORS.border, 0.8) : alpha(COLORS.mediumPurple, 0.1),
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderLeft: '1px solid',
                            borderTop: '1px solid',
                            borderColor: isDark ? alpha(DARK_COLORS.border, 0.8) : alpha(COLORS.mediumPurple, 0.1),
                        },
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {userName || 'Student Account'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {userName ? `${userName.toLowerCase().replace(/\s+/g, '.')}@university.edu` : 'student@university.edu'}
                    </Typography>
                </Box>
                <Divider sx={{ opacity: 0.6 }} />
                <MenuItem onClick={() => router.visit(route('student.profile'))} sx={{ py: 1.2, gap: 1.5, fontSize: '0.875rem' }}>
                    <ManageAccountsRounded fontSize="small" sx={{ opacity: 0.7 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => router.visit(route('profile.edit'))} sx={{ py: 1.2, gap: 1.5, fontSize: '0.875rem' }}>
                    <Settings fontSize="small" sx={{ opacity: 0.7 }} /> Profile Settings
                </MenuItem>
                <Divider sx={{ opacity: 0.6 }} />
                <MenuItem onClick={() => router.post(route('logout'))} sx={{ py: 1.2, gap: 1.5, fontSize: '0.875rem', color: 'error.main' }}>
                    <LogoutRounded fontSize="small" /> Sign Out
                </MenuItem>
            </Menu>
        </Paper>
    );
}
