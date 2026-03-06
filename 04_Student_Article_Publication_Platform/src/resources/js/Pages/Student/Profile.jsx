import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import axios from 'axios';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    IconButton,
    Paper,
    Stack,
    Typography,
    Chip,
    Grid,
    alpha,
    Tooltip,
    useTheme,
    Badge,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    ArrowBack,
    DarkModeRounded,
    LightModeRounded,
    BookmarkBorder,
    Bookmark,
    CalendarToday,
    Settings as SettingsIcon,
    ArrowForward,
    PhotoCamera,
} from '@mui/icons-material';
import StudentLayout from '@/Layouts/StudentLayout';
import { createDashboardTheme, COLORS, DARK_COLORS } from './DashboardSections/dashboardTheme';
import { useTheme as useGlobalTheme } from '@/Contexts/ThemeContext';

const InfoRow = ({ label, value, icon }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
            {icon && (
                <Box sx={{ color: theme.palette.text.secondary, display: 'flex', minWidth: 24 }}>
                    {icon}
                </Box>
            )}
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{
                    color: theme.palette.text.secondary,
                    display: 'block',
                    mb: 0.25,
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    fontFamily: theme.typography.fontFamily,
                }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 900, color: theme.palette.text.primary, fontFamily: theme.typography.fontFamily }}>
                    {value || '\u2014'}
                </Typography>
            </Box>
        </Stack>
    );
}

// Saved Article Item
const SavedArticleItem = ({ article, onUnsave, onRead }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 0,
                border: `1.5px solid ${theme.palette.divider}`,
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: theme.typography.fontFamily,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
                background: theme.palette.background.paper,
                '&:hover': {
                    borderColor: theme.palette.text.primary,
                    background: theme.palette.action.hover,
                },
            }}
        >
            <Stack spacing={1} sx={{ height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                        label={article.category}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            bgcolor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.divider}`,
                            fontFamily: theme.typography.fontFamily,
                        }}
                    />
                    <Tooltip title="Remove from saved">
                        <IconButton
                            size="small"
                            onClick={() => onUnsave(article.id)}
                            sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <Bookmark fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.text.primary, flex: 1, fontFamily: theme.typography.fontFamily }}>
                    {article.title}
                </Typography>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
                        {article.readMins} min read
                    </Typography>
                    <Button
                        size="small"
                        endIcon={<ArrowForward fontSize="small" />}
                        onClick={() => onRead(article.id)}
                        sx={{
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.text.primary,
                            borderRadius: 0,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            p: 0,
                            minWidth: 'auto',
                            fontFamily: theme.typography.fontFamily,
                            border: `1px solid ${theme.palette.text.primary}`,
                            px: 2,
                            py: 0.5,
                            '&:hover': {
                                bgcolor: theme.palette.text.primary,
                                color: theme.palette.background.paper,
                            },
                        }}
                    >
                        Read
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default function Profile({
    profile,
    savedArticles: initialSavedArticles = [],
}) {
    const { auth } = usePage().props;
    const profileData = {
        fullName: profile?.fullName || auth?.user?.name || 'Student User',
        email: profile?.email || auth?.user?.email || 'student@university.edu',
        avatar: profile?.avatar || null,
        joinedDate: profile?.joinedDate || 'January 2024',
    };
    const [savedArticles, setSavedArticles] = useState(() => (
        Array.isArray(initialSavedArticles) ? initialSavedArticles : []
    ));

    const { isDarkMode, setIsDarkMode } = useGlobalTheme();
    const theme = useMemo(() => createDashboardTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);
    const isDark = isDarkMode;

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            router.post(route('profile.avatar'), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (response) => {
                    // Page props refresh will pick up updated avatar if configured.
                },
            });
        }
    };

    const handleUnsave = async (articleId) => {
        // Unsave logic here
    };

    const handleReadArticle = (articleId) => {
        // Read article logic here
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StudentLayout>
                <Head title="Student Profile" />
                <Box sx={{
                    minHeight: '100vh',
                    bgcolor: theme.palette.background.default,
                    py: 4,
                    px: { xs: 2, md: 4 },
                    fontFamily: theme.typography.fontFamily,
                }}>
                    <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
                        <Stack spacing={4}>
                            {/* Header with Back Button, Theme Toggle, and Settings */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    pb: 2,
                                    borderBottom: `4px double ${theme.palette.divider}`,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <IconButton
                                        onClick={() => router.visit(route('student.dashboard'))}
                                        sx={{
                                            color: theme.palette.text.primary,
                                            bgcolor: theme.palette.action.hover,
                                            border: `1.5px solid ${theme.palette.text.primary}`,
                                            borderRadius: 0,
                                            fontFamily: theme.typography.fontFamily,
                                            fontWeight: 900,
                                            mr: 1,
                                        }}
                                    >
                                        <ArrowBack />
                                    </IconButton>
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: theme.palette.text.primary, fontSize: 32, fontFamily: theme.typography.fontFamily, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                        {profileData.fullName}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                                        <IconButton onClick={() => setIsDarkMode(!isDarkMode)} sx={{ color: theme.palette.text.primary, border: `1.5px solid ${theme.palette.text.primary}`, borderRadius: 0, bgcolor: theme.palette.background.default, fontFamily: theme.typography.fontFamily }}>
                                            {isDarkMode ? <LightModeRounded /> : <DarkModeRounded />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Profile settings">
                                        <IconButton onClick={() => router.visit(route('profile.edit'))} sx={{ color: theme.palette.text.primary, border: `1.5px solid ${theme.palette.text.primary}`, borderRadius: 0, bgcolor: theme.palette.background.default, fontFamily: theme.typography.fontFamily }}>
                                            <SettingsIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                            <Typography variant="h4" sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.5px',
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Student Profile
                            </Typography>
                            <Stack direction="row" spacing={1.5}>
                                {/* Settings Button */}
                                <Tooltip title="Open full profile settings">
                                    <Button
                                        onClick={() => router.visit(route('student.settings'))}
                                        startIcon={<SettingsIcon />}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 999,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            px: 2,
                                            color: theme.palette.primary.main,
                                            bgcolor: theme.palette.action.selected,
                                            border: '1px solid',
                                            borderColor: theme.palette.divider,
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                bgcolor: theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        Settings
                                    </Button>
                                </Tooltip>
                                {/* Theme Toggle */}
                                <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                                    <IconButton
                                        onClick={() => setIsDarkMode((prev) => !prev)}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            bgcolor: theme.palette.action.selected,
                                            border: '1px solid',
                                            borderColor: theme.palette.divider,
                                            '&:hover': {
                                                bgcolor: theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        {isDark ? <LightModeRounded /> : <DarkModeRounded />}
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            {/* Profile Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    bgcolor: theme.palette.background.paper,
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                                    {/* Avatar */}
                                    <Stack alignItems="center" spacing={2} sx={{ minWidth: 200 }}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <Tooltip title="Change photo">
                                                    <IconButton
                                                        component="label"
                                                        sx={{
                                                            bgcolor: theme.palette.primary.main,
                                                            border: '2px solid',
                                                            borderColor: theme.palette.background.paper,
                                                            '&:hover': {
                                                                bgcolor: theme.palette.secondary.main,
                                                                transform: 'scale(1.1)',
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                        size="small"
                                                    >
                                                        <PhotoCamera sx={{ color: '#fff', fontSize: 16 }} />
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        >
                                            <Avatar
                                                src={profileData.avatar}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    fontSize: 48,
                                                    fontWeight: 700,
                                                    bgcolor: theme.palette.primary.main,
                                                    border: `4px solid ${theme.palette.divider}`,
                                                    boxShadow: theme.shadows[4],
                                                }}
                                            >
                                                {profileData.fullName?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </Stack>
                                    {/* Profile Details (read-only here; editable in Settings) */}
                                    <Box sx={{ flex: 1 }}>
                                        <InfoRow
                                            label="Full Name"
                                            value={profileData.fullName}
                                        />
                                        <InfoRow
                                            label="Email"
                                            value={profileData.email}
                                        />
                                        <InfoRow
                                            label="Member Since"
                                            value={profileData.joinedDate}
                                            icon={<CalendarToday fontSize="small" />}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                            {/* Saved Articles Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    bgcolor: theme.palette.background.paper,
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                    <Box sx={{
                                        color: theme.palette.primary.main,
                                        display: 'flex',
                                        bgcolor: theme.palette.action.selected,
                                        p: 1,
                                        borderRadius: 2,
                                    }}>
                                        <BookmarkBorder />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                                        Saved Articles ({savedArticles.length})
                                    </Typography>
                                </Stack>
                                {savedArticles.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {savedArticles.map((article) => (
                                            <Grid item xs={12} sm={6} md={4} key={article.id}>
                                                <SavedArticleItem
                                                    article={article}
                                                    onUnsave={handleUnsave}
                                                    onRead={handleReadArticle}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 6 }}>
                                        <BookmarkBorder sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                            No saved articles yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 3 }}>
                                            Articles you save will appear here for easy access
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => router.visit(route('student.dashboard'))}
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                '&:hover': {
                                                    bgcolor: theme.palette.secondary.main,
                                                },
                                            }}
                                        >
                                            Browse Articles
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </Stack>
                    </Container>
                </Box>
            </StudentLayout>
        </ThemeProvider>
    );

}


