import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
import StudentLayout from '../Shared/Layouts/StudentLayout';
import { createDashboardTheme, COLORS, DARK_COLORS } from './DashboardSections/dashboardTheme';

const InfoRow = ({ label, value, icon }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
            {icon && (
                <Box sx={{ color: isDark ? DARK_COLORS.textSecondary : 'text.secondary', display: 'flex', minWidth: 24 }}>
                    {icon}
                </Box>
            )}
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mb: 0.25,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {value || '—'}
                </Typography>
            </Box>
        </Stack>
    );
};

// Saved Article Item
const SavedArticleItem = ({ article, onUnsave, onRead }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.1),
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                    transform: 'translateY(-2px)',
                    boxShadow: isDark
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)',
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
                            bgcolor: isDark ? alpha(DARK_COLORS.royalPurple, 0.2) : alpha(COLORS.royalPurple, 0.1),
                            color: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                        }}
                    />
                    <Tooltip title="Remove from saved">
                        <IconButton
                            size="small"
                            onClick={() => onUnsave(article.id)}
                            sx={{
                                color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                '&:hover': {
                                    bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
                                },
                            }}
                        >
                            <Bookmark fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
                    {article.title}
                </Typography>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {article.readMins} min read
                    </Typography>
                    <Button
                        size="small"
                        endIcon={<ArrowForward fontSize="small" />}
                        onClick={() => onRead(article.id)}
                        sx={{
                            color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                                bgcolor: 'transparent',
                                textDecoration: 'underline',
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
    const [mode, setMode] = useState(() => localStorage.getItem('dashboardTheme') || 'light');
    const profileData = {
        fullName: profile?.fullName || auth?.user?.name || 'Student User',
        email: profile?.email || auth?.user?.email || 'student@university.edu',
        avatar: profile?.avatar || null,
        joinedDate: profile?.joinedDate || 'January 2024',
    };
    const [savedArticles, setSavedArticles] = useState(() => (
        Array.isArray(initialSavedArticles) ? initialSavedArticles : []
    ));

    useEffect(() => {
        localStorage.setItem('dashboardTheme', mode);
    }, [mode]);

    const theme = useMemo(() => createDashboardTheme(mode), [mode]);
    const isDark = mode === 'dark';

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
        if (!articleId) return;

        try {
            await axios.post(route('student.articles.save.toggle', articleId));
            setSavedArticles((previous) => previous.filter((article) => article.id !== articleId));
        } catch {
            // keep current UI state if unsave fails
        }
    };

    const handleReadArticle = (articleId) => {
        router.visit(route('student.dashboard'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StudentLayout>
                <Head title="Student Profile" />

                <Box sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    py: 4,
                    px: { xs: 2, md: 4 },
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
                                    borderBottom: '1px solid',
                                    borderColor: isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12),
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <IconButton
                                        onClick={() => router.visit(route('student.dashboard'))}
                                        sx={{
                                            color: 'text.secondary',
                                            bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.8) : alpha(COLORS.gray100, 0.8),
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid',
                                            borderColor: isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12),
                                            '&:hover': {
                                                bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
                                                color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                            },
                                        }}
                                    >
                                        <ArrowBack />
                                    </IconButton>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 800,
                                        letterSpacing: '-0.5px',
                                        background: `linear-gradient(90deg, ${COLORS.deepPurple} 0%, ${COLORS.softPink} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        Student Profile
                                    </Typography>
                                </Stack>

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
                                                color: isDark ? DARK_COLORS.softPink : COLORS.royalPurple,
                                                bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.08) : alpha(COLORS.softPink, 0.08),
                                                border: '1px solid',
                                                borderColor: isDark ? alpha(DARK_COLORS.softPink, 0.4) : alpha(COLORS.softPink, 0.4),
                                                '&:hover': {
                                                    borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                                    bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.15) : alpha(COLORS.softPink, 0.15),
                                                },
                                            }}
                                        >
                                            Settings
                                        </Button>
                                    </Tooltip>

                                    {/* Theme Toggle */}
                                    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                                        <IconButton
                                            onClick={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
                                            sx={{
                                                color: isDark ? DARK_COLORS.softPink : COLORS.royalPurple,
                                                bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : 'transparent',
                                                border: '1px solid',
                                                borderColor: isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12),
                                                '&:hover': {
                                                    bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.2) : alpha(COLORS.softPink, 0.1),
                                                },
                                            }}
                                        >
                                            {isDark ? <LightModeRounded /> : <DarkModeRounded />}
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            {/* Profile Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: isDark ? alpha(DARK_COLORS.border, 0.6) : alpha(COLORS.mediumPurple, 0.12),
                                    bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.8) : alpha('#FFFFFF', 0.9),
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
                                                            bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                                            border: '2px solid',
                                                            borderColor: isDark ? DARK_COLORS.cardBg : '#FFF',
                                                            '&:hover': {
                                                                bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
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
                                                    bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                                    border: `4px solid ${isDark ? alpha(DARK_COLORS.softPink, 0.3) : alpha(COLORS.softPink, 0.3)}`,
                                                    boxShadow: isDark
                                                        ? '0 8px 20px -8px rgba(0,0,0,0.4)'
                                                        : '0 8px 20px -8px rgba(0,0,0,0.15)',
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
                                    borderColor: isDark ? alpha(DARK_COLORS.border, 0.6) : alpha(COLORS.mediumPurple, 0.12),
                                    bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.8) : alpha('#FFFFFF', 0.9),
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                    <Box sx={{
                                        color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                        display: 'flex',
                                        bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
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
                                        <BookmarkBorder sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                                            No saved articles yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                                            Articles you save will appear here for easy access
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => router.visit(route('student.dashboard'))}
                                            sx={{
                                                bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                                                '&:hover': {
                                                    bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
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
