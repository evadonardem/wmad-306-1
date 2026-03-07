// Profile.jsx - Using same ArticleView as feed section
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
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
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    ArrowBack,
    Edit,
    BookmarkBorder,
    Bookmark,
    CalendarToday,
    Settings,
    PhotoCamera,
    LocationOn,
    School,
    Email,
    Link as LinkIcon,
    Twitter,
    Instagram,
    GitHub,
    Article,
    Comment,
    Star,
    Visibility,
    Logout,
} from '@mui/icons-material';
import StudentLayout from '@/Layouts/StudentLayout';
import ArticleView from './Components/ArticleView';
import { createDashboardTheme } from './DashboardSections/dashboardTheme';
import { useTheme } from '@/Contexts/ThemeContext';
import ThemePicker from '@/Components/ThemePicker';

// Profile Header Component
const ProfileHeader = ({ profile, stats, onEditProfile, onAvatarChange }) => {
    const { colors } = useTheme();
    const joinedDate = new Date(profile.joinedDate || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: `1px solid ${colors.border}`,
                bgcolor: colors.background,
                mb: 3,
            }}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
                {/* Avatar Section */}
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={profile.avatar}
                        sx={{
                            width: 120,
                            height: 120,
                            border: `4px solid ${colors.accent}`,
                            bgcolor: colors.accent,
                            color: colors.background,
                            fontSize: 48,
                            fontWeight: 700,
                        }}
                    >
                        {profile.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Tooltip title="Change photo">
                        <IconButton
                            component="label"
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: colors.accent,
                                border: `2px solid ${colors.background}`,
                                '&:hover': {
                                    bgcolor: colors.primary,
                                },
                            }}
                        >
                            <PhotoCamera sx={{ color: colors.background, fontSize: 16 }} />
                            <input type="file" hidden accept="image/*" onChange={onAvatarChange} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Profile Info */}
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            fontWeight: 700,
                            color: colors.text,
                            mb: 1,
                        }}
                    >
                        {profile.fullName}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.9rem',
                            color: colors.accent,
                            mb: 2,
                        }}
                    >
                        @{profile.username || profile.email?.split('@')[0] || 'student'}
                    </Typography>

                    {/* Bio */}
                    {profile.bio && (
                        <Typography
                            sx={{
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.textSecondary,
                                mb: 2,
                                maxWidth: 600,
                            }}
                        >
                            {profile.bio}
                        </Typography>
                    )}

                    {/* Details Grid */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <School sx={{ fontSize: 16, color: colors.accent }} />
                                <Typography
                                    sx={{
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: '0.8rem',
                                        color: colors.textSecondary,
                                    }}
                                >
                                    {profile.major || 'Undeclared Major'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarToday sx={{ fontSize: 16, color: colors.accent }} />
                                <Typography
                                    sx={{
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: '0.8rem',
                                        color: colors.textSecondary,
                                    }}
                                >
                                    Joined {joinedDate}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn sx={{ fontSize: 16, color: colors.accent }} />
                                <Typography
                                    sx={{
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: '0.8rem',
                                        color: colors.textSecondary,
                                    }}
                                >
                                    {profile.location || 'Campus'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Email sx={{ fontSize: 16, color: colors.accent }} />
                                <Typography
                                    sx={{
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: '0.8rem',
                                        color: colors.textSecondary,
                                    }}
                                >
                                    {profile.email}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Social Links */}
                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                        {profile.twitter && (
                            <IconButton
                                href={profile.twitter}
                                target="_blank"
                                size="small"
                                sx={{
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    '&:hover': {
                                        color: colors.accent,
                                        borderColor: colors.accent,
                                    },
                                }}
                            >
                                <Twitter fontSize="small" />
                            </IconButton>
                        )}
                        {profile.instagram && (
                            <IconButton
                                href={profile.instagram}
                                target="_blank"
                                size="small"
                                sx={{
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    '&:hover': {
                                        color: colors.accent,
                                        borderColor: colors.accent,
                                    },
                                }}
                            >
                                <Instagram fontSize="small" />
                            </IconButton>
                        )}
                        {profile.github && (
                            <IconButton
                                href={profile.github}
                                target="_blank"
                                size="small"
                                sx={{
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    '&:hover': {
                                        color: colors.accent,
                                        borderColor: colors.accent,
                                    },
                                }}
                            >
                                <GitHub fontSize="small" />
                            </IconButton>
                        )}
                        {profile.website && (
                            <IconButton
                                href={profile.website}
                                target="_blank"
                                size="small"
                                sx={{
                                    color: colors.textSecondary,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    '&:hover': {
                                        color: colors.accent,
                                        borderColor: colors.accent,
                                    },
                                }}
                            >
                                <LinkIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>
                </Box>

                {/* Edit Button */}
                <Tooltip title="Edit Profile">
                    <IconButton
                        onClick={onEditProfile}
                        sx={{
                            color: colors.textSecondary,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 0,
                            alignSelf: 'flex-start',
                            '&:hover': {
                                color: colors.accent,
                                borderColor: colors.accent,
                            },
                        }}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Paper>
    );
};

// Stats Cards Component
const StatsCards = ({ stats }) => {
    const { colors } = useTheme();

    const statItems = [
        { label: 'Articles Written', value: stats.totalArticles || 0, icon: <Article /> },
        { label: 'Comments Posted', value: stats.totalComments || 0, icon: <Comment /> },
        { label: 'Articles Saved', value: stats.savedArticles || 0, icon: <BookmarkBorder /> },
        { label: 'Total Views', value: stats.totalViews?.toLocaleString() || '0', icon: <Visibility /> },
        { label: 'Stars Received', value: stats.totalStars || 0, icon: <Star /> },
        { label: 'Reading Streak', value: `${stats.readingStreak || 0} days`, icon: <CalendarToday /> },
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {statItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            border: `1px solid ${colors.border}`,
                            bgcolor: alpha(colors.surface, 0.3),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: alpha(colors.accent, 0.1),
                                color: colors.accent,
                            }}
                        >
                            {item.icon}
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontWeight: 700,
                                    color: colors.text,
                                    lineHeight: 1.2,
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: '0.7rem',
                                    color: colors.textSecondary,
                                    textTransform: 'uppercase',
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

// Article Card Component - Same as in FeedSection
const ArticleCard = ({ article, onRead, onUnsave, showSaveButton = true }) => {
    const { colors } = useTheme();

    return (
        <Paper
            elevation={0}
            onClick={() => onRead?.(article)}
            sx={{
                p: 2,
                border: `1px solid ${colors.border}`,
                bgcolor: colors.background,
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: colors.accent,
                    bgcolor: alpha(colors.surface, 0.5),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(colors.accent, 0.1)}`,
                },
            }}
        >
            <Stack spacing={1.5}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                        label={article.category || 'Article'}
                        size="small"
                        sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.6rem',
                            bgcolor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            color: colors.textSecondary,
                            borderRadius: 0,
                        }}
                    />
                    {showSaveButton && (
                        <Tooltip title="Remove from saved">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUnsave?.(article.id);
                                }}
                                sx={{
                                    color: colors.accent,
                                    '&:hover': {
                                        color: colors.error,
                                    },
                                }}
                            >
                                <Bookmark fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: '"Times New Roman", Times, serif',
                        fontWeight: 700,
                        color: colors.text,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                    }}
                >
                    {article.title}
                </Typography>

                {/* Excerpt */}
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: '"Times New Roman", Times, serif',
                        color: colors.textSecondary,
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {article.excerpt || article.content?.substring(0, 120) + '...'}
                </Typography>

                {/* Metadata */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.7rem',
                            color: colors.textSecondary,
                        }}
                    >
                        {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                            : 'Draft'}
                        {' • '}{article.readMins || '5'} min read
                    </Typography>

                    <Button
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRead?.(article);
                        }}
                        sx={{
                            color: colors.accent,
                            textTransform: 'none',
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '0.8rem',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Read Article →
                    </Button>
                </Stack>

                {/* Stats */}
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Visibility sx={{ fontSize: 14, color: colors.textSecondary }} />
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            {article.viewCount?.toLocaleString() || '0'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Comment sx={{ fontSize: 14, color: colors.textSecondary }} />
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            {article.commentCount || '0'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star sx={{ fontSize: 14, color: colors.textSecondary }} />
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                            {article.starCount || '0'}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

// Edit Profile Dialog
const EditProfileDialog = ({ open, onClose, profile, onSave }) => {
    const { colors } = useTheme();
    const [formData, setFormData] = useState({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        major: profile.major || '',
        location: profile.location || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        instagram: profile.instagram || '',
        github: profile.github || '',
    });

    const handleChange = (field) => (event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 0,
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 700,
                    color: colors.text,
                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                Edit Profile
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange('fullName')}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="Bio"
                        value={formData.bio}
                        onChange={handleChange('bio')}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="Major"
                        value={formData.major}
                        onChange={handleChange('major')}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="Location"
                        value={formData.location}
                        onChange={handleChange('location')}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />

                    <Divider sx={{ borderColor: colors.border }} />

                    <Typography
                        sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.8rem',
                            color: colors.accent,
                            textTransform: 'uppercase',
                        }}
                    >
                        Social Links
                    </Typography>

                    <TextField
                        label="Website"
                        value={formData.website}
                        onChange={handleChange('website')}
                        fullWidth
                        size="small"
                        placeholder="https://..."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="Twitter"
                        value={formData.twitter}
                        onChange={handleChange('twitter')}
                        fullWidth
                        size="small"
                        placeholder="@username"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="Instagram"
                        value={formData.instagram}
                        onChange={handleChange('instagram')}
                        fullWidth
                        size="small"
                        placeholder="@username"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                    <TextField
                        label="GitHub"
                        value={formData.github}
                        onChange={handleChange('github')}
                        fullWidth
                        size="small"
                        placeholder="username"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontFamily: '"Times New Roman", Times, serif',
                                color: colors.text,
                                '& fieldset': { borderColor: colors.border },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                            },
                            '& .MuiInputLabel-root': {
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                            },
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ borderTop: `1px solid ${colors.border}`, p: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: colors.textSecondary,
                        textTransform: 'none',
                        fontFamily: '"Times New Roman", Times, serif',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        bgcolor: colors.accent,
                        color: colors.background,
                        textTransform: 'none',
                        fontFamily: '"Times New Roman", Times, serif',
                        '&:hover': {
                            bgcolor: colors.primary,
                        },
                    }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default function Profile({
    profile: initialProfile,
    savedArticles = [],
    stats: initialStats = {},
}) {
    const { auth } = usePage().props;
    const { colors } = useTheme();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [isTogglingStar, setIsTogglingStar] = useState(false);
    const [profile, setProfile] = useState({
        fullName: initialProfile?.fullName || auth?.user?.name || 'Student User',
        email: initialProfile?.email || auth?.user?.email || 'student@university.edu',
        avatar: initialProfile?.avatar || null,
        joinedDate: initialProfile?.joinedDate || new Date().toISOString(),
        bio: initialProfile?.bio || 'Student writer and contributor to the FYI Student Journal.',
        major: initialProfile?.major || 'Journalism',
        location: initialProfile?.location || 'University Campus',
        username: initialProfile?.username || auth?.user?.username,
        twitter: initialProfile?.twitter || '',
        instagram: initialProfile?.instagram || '',
        github: initialProfile?.github || '',
        website: initialProfile?.website || '',
        ...initialProfile,
    });

    const [localSavedArticles, setLocalSavedArticles] = useState(savedArticles);
    const [stats, setStats] = useState({
        totalArticles: initialStats.totalArticles || 0,
        totalComments: initialStats.totalComments || 0,
        savedArticles: savedArticles.length || 0,
        totalViews: initialStats.totalViews || 0,
        totalStars: initialStats.totalStars || 0,
        readingStreak: initialStats.readingStreak || 0,
        ...initialStats,
    });

    // Update local state when props change
    useEffect(() => {
        setLocalSavedArticles(savedArticles);
        setStats(prev => ({
            ...prev,
            savedArticles: savedArticles.length || 0,
        }));
    }, [savedArticles]);

    const handleEditProfile = () => {
        setEditDialogOpen(true);
    };

    const handleSaveProfile = (newProfileData) => {
        setProfile(prev => ({ ...prev, ...newProfileData }));
        // API call would go here
    };

    const handleOpenArticle = (article) => {
        setSelectedArticle(article);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedArticle(null);
        setCommentError('');
    };

    const handleToggleStar = async (articleId) => {
        if (!articleId || isTogglingStar) return;

        setIsTogglingStar(true);
        try {
            const { data } = await axios.post(route('student.articles.star.toggle', articleId));
            // Update the article in local state
            if (selectedArticle && selectedArticle.id === articleId) {
                setSelectedArticle(prev => ({
                    ...prev,
                    isStarred: data.isStarred,
                    starCount: data.starCount,
                }));
            }
        } catch (error) {
            console.error('Failed to toggle star:', error);
        } finally {
            setIsTogglingStar(false);
        }
    };

    const handleSubmitComment = async (body, parentId = null) => {
        if (!selectedArticle?.id || !body?.trim()) return;

        setCommentError('');
        setIsSubmittingComment(true);

        try {
            await axios.post(route('student.articles.comment', selectedArticle.id), {
                body: body.trim(),
                parent_id: parentId,
            });

            // Refresh article data to get new comments
            const { data } = await axios.get(route('student.articles.show', selectedArticle.id));
            setSelectedArticle(prev => ({
                ...prev,
                comments: data.comments,
                commentCount: data.commentCount,
            }));
        } catch (error) {
            setCommentError(error.response?.data?.errors?.body || 'Unable to post comment right now.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleUnsaveArticle = async (articleId) => {
        try {
            await axios.post(route('student.articles.save.toggle', articleId));
            setLocalSavedArticles(prev => prev.filter(a => a.id !== articleId));
            setStats(prev => ({ ...prev, savedArticles: prev.savedArticles - 1 }));
        } catch (error) {
            console.error('Failed to unsave article:', error);
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(route('student.profile.avatar.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setProfile(prev => ({ ...prev, avatar: response.data.avatarUrl }));
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
        }
    };

    return (
        <StudentLayout>
            <Head title="Student Profile" />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: colors.background,
                    fontFamily: '"Times New Roman", Times, serif',
                }}
            >
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* Header with back button and theme picker */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 3 }}
                    >
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => router.visit(route('student.dashboard'))}
                            sx={{
                                color: colors.textSecondary,
                                textTransform: 'none',
                                fontFamily: '"Times New Roman", Times, serif',
                                border: `1px solid ${colors.border}`,
                                borderRadius: 0,
                                px: 2,
                                '&:hover': {
                                    color: colors.accent,
                                    borderColor: colors.accent,
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <ThemePicker />
                    </Stack>

                    {/* Date Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            mb: 3,
                            pb: 1,
                            borderBottom: `1px solid ${colors.border}`,
                            fontSize: '0.75rem',
                            fontFamily: '"Courier New", monospace',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: colors.textSecondary,
                        }}
                    >
                        <span>STUDENT PROFILE</span>
                        <span>{new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).toUpperCase()}</span>
                        <span>MEMBER SINCE {new Date(profile.joinedDate).getFullYear()}</span>
                    </Stack>

                    {/* Profile Header */}
                    <ProfileHeader
                        profile={profile}
                        stats={stats}
                        onEditProfile={handleEditProfile}
                        onAvatarChange={handleAvatarChange}
                    />

                    {/* Stats Cards */}
                    <StatsCards stats={stats} />

                    {/* Saved Articles Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            border: `1px solid ${colors.border}`,
                            bgcolor: colors.background,
                            mb: 3,
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                p: 2,
                                borderBottom: `1px solid ${colors.border}`,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontWeight: 700,
                                    color: colors.text,
                                }}
                            >
                                Saved Articles
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: '0.8rem',
                                    color: colors.textSecondary,
                                }}
                            >
                                {localSavedArticles.length} articles
                            </Typography>
                        </Stack>
                        <Box sx={{ p: 2 }}>
                            {localSavedArticles.length > 0 ? (
                                <Grid container spacing={2}>
                                    {localSavedArticles.map((article) => (
                                        <Grid item xs={12} md={6} key={article.id}>
                                            <ArticleCard
                                                article={article}
                                                onRead={handleOpenArticle}
                                                onUnsave={handleUnsaveArticle}
                                                showSaveButton={true}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        border: `1px solid ${colors.border}`,
                                        bgcolor: alpha(colors.surface, 0.5),
                                    }}
                                >
                                    <BookmarkBorder sx={{ fontSize: 48, color: colors.textSecondary, mb: 2 }} />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: '"Times New Roman", Times, serif',
                                            color: colors.text,
                                            mb: 1,
                                        }}
                                    >
                                        No saved articles
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: '"Times New Roman", Times, serif',
                                            color: colors.textSecondary,
                                            mb: 3,
                                        }}
                                    >
                                        Bookmark articles you want to read later
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.visit(route('student.dashboard'))}
                                        sx={{
                                            borderColor: colors.accent,
                                            color: colors.accent,
                                            textTransform: 'none',
                                            fontFamily: '"Times New Roman", Times, serif',
                                            '&:hover': {
                                                borderColor: colors.accent,
                                                backgroundColor: alpha(colors.accent, 0.1),
                                            },
                                        }}
                                    >
                                        Browse Articles
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    </Paper>

                    {/* Edit Profile Dialog */}
                    <EditProfileDialog
                        open={editDialogOpen}
                        onClose={() => setEditDialogOpen(false)}
                        profile={profile}
                        onSave={handleSaveProfile}
                    />

                    {/* Article View Modal - Using existing ArticleView and CommentSection components */}
                    <ArticleView
                        article={selectedArticle}
                        open={modalOpen}
                        onClose={handleCloseModal}
                        onToggleStar={handleToggleStar}
                        isStarred={selectedArticle?.isStarred || false}
                        starCount={selectedArticle?.starCount || 0}
                        isTogglingStar={isTogglingStar}
                        onNext={undefined}
                        onPrevious={undefined}
                        onSubmitComment={handleSubmitComment}
                        isSubmittingComment={isSubmittingComment}
                        commentError={commentError}
                        currentUserName={auth?.user?.name || 'You'}
                    />
                </Container>
            </Box>
        </StudentLayout>
    );
}
