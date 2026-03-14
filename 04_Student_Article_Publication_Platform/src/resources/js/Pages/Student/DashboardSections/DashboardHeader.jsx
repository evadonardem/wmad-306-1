// DashboardHeader.jsx (updated with theme integration and dark mode fixes)
import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Divider,
    alpha,
    Badge,
    Avatar,
    Paper,
} from '@mui/material';
import {
    Search,
    BookmarkBorder,
    AutoStories,
    History,
    Settings,
    Person,
    Logout,
    NotificationsNone,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import ThemePicker from '@/Components/ThemePicker';

export const CATEGORIES = [
    { id: 'news', label: 'News' },
    { id: 'opinion', label: 'Opinion' },
    { id: 'features', label: 'Features' },
    { id: 'arts', label: 'Arts' },
    { id: 'sports', label: 'Sports' },
    { id: 'science', label: 'Science' },
    { id: 'campus', label: 'Campus' },
    { id: 'alumni', label: 'Alumni' },
];

const NAV_ITEMS = [
    { key: 'feed', label: 'Home', icon: <AutoStories fontSize="small" /> },
    { key: 'saved', label: 'Saved', icon: <BookmarkBorder fontSize="small" /> },
    { key: 'history', label: 'History', icon: <History fontSize="small" /> },
];

export default function DashboardHeader({
    activeView,
    onViewChange,
    activeCategory,
    onCategoryChange,
    search,
    onSearchChange,
    userName,
    userId,
    userEmail,
    onOpenMobileWidgets,
}) {
    const { colors, isDarkMode } = useTheme();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const [notifAnchor, setNotifAnchor] = useState(null);

    const avatarLetter = useMemo(() =>
        userName ? userName[0]?.toUpperCase() : 'U', [userName]
    );

    return (
        <Box sx={{ mb: 4 }}>
            {/* Theme Picker for mobile - visible only on mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                <ThemePicker />
            </Box>

            {/* Section Tabs - Newspaper section headers */}
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    borderBottom: '3px solid',
                    borderColor: colors.border,
                    pb: 1,
                    mb: 2,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {NAV_ITEMS.map((item) => (
                    <Button
                        key={item.key}
                        onClick={() => onViewChange(item.key)}
                        startIcon={item.icon}
                        sx={{
                            color: activeView === item.key ? colors.accent : colors.textSecondary,
                            fontWeight: 700,
                            fontFamily: '"Times New Roman", Times, serif',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            letterSpacing: '0.05em',
                            borderBottom: activeView === item.key ? '2px solid' : 'none',
                            borderColor: colors.accent,
                            borderRadius: 0,
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: colors.accent,
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Stack>

            {/* Category Navigation - Newspaper category headers */}
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '0.7rem',
                        color: colors.textSecondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        alignSelf: 'center',
                    }}
                >
                    SECTIONS:
                </Typography>
                {CATEGORIES.map((category) => (
                    <Button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        sx={{
                            color: activeCategory === category.id ? colors.accent : colors.textSecondary,
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '0.8rem',
                            fontWeight: activeCategory === category.id ? 700 : 400,
                            textTransform: 'uppercase',
                            minWidth: 'auto',
                            p: 0,
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: colors.accent,
                            },
                        }}
                    >
                        {category.label}
                    </Button>
                ))}
            </Stack>

            {/* Search and User Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: alpha(colors.surface, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2,
                }}
            >
                <TextField
                    size="small"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search the news..."
                    sx={{
                        width: { xs: '100%', sm: searchFocused ? 400 : 300 },
                        transition: 'width 0.3s',
                        '& .MuiOutlinedInput-root': {
                            fontFamily: '"Times New Roman", Times, serif',
                            borderRadius: 0,
                            color: colors.text,
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
                        '& .MuiInputBase-input': {
                            color: colors.text,
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: colors.textSecondary,
                            opacity: 1,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: colors.textSecondary, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
                    <IconButton
                        onClick={(e) => setNotifAnchor(e.currentTarget)}
                        sx={{ color: colors.textSecondary }}
                    >
                        <Badge badgeContent={3} color="error">
                            <NotificationsNone />
                        </Badge>
                    </IconButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: colors.border }} />

                    <IconButton
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{
                            p: 0.5,
                            border: '2px solid',
                            borderColor: colors.border,
                            borderRadius: 0,
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
            </Paper>

            {/* Profile Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 220,
                        border: '1px solid',
                        borderColor: colors.border,
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
                    <Person fontSize="small" /> Profile
                </MenuItem>
                <MenuItem onClick={() => router.visit(route('student.settings'))} sx={{ gap: 1.5, color: colors.text }}>
                    <Settings fontSize="small" /> Settings
                </MenuItem>
                <Divider sx={{ borderColor: colors.border }} />
                <MenuItem onClick={() => router.post(route('logout'))} sx={{ gap: 1.5, color: colors.error }}>
                    <Logout fontSize="small" /> Sign Out
                </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={() => setNotifAnchor(null)}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 320,
                        border: '1px solid',
                        borderColor: colors.border,
                        borderRadius: 0,
                        bgcolor: colors.background,
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: colors.border }}>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        Notifications
                    </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: colors.textSecondary }}>
                        No new notifications
                    </Typography>
                </Box>
            </Menu>
        </Box>
    );
}
