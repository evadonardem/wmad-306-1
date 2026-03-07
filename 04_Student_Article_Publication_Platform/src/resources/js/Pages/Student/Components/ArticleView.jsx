// ArticleView.jsx - Fixed dark mode readability
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Stack,
    Button,
    Modal,
    Fade,
    Backdrop,
} from '@mui/material';
import {
    Close,
    StarBorder,
    Star,
    Schedule,
    Visibility,
    ArrowBack,
    ArrowForward,
} from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';
import CommentSection from './CommentSection';
import RecommendedList from './RecommendedList';
import { estimateReadingTime } from '../DashboardSections/dashboardTheme';

export default function ArticleView({
    article,
    open = false,
    onClose,
    onToggleStar,
    isStarred = false,
    starCount = 0,
    isTogglingStar = false,
    onNext,
    onPrevious,
    onSubmitComment,
    isSubmittingComment = false,
    commentError = '',
    currentUserName = 'You',
}) {
    const { colors, isDarkMode } = useTheme();
    const [readingProgress, setReadingProgress] = useState(0);
    const [articleScrollRef, setArticleScrollRef] = useState(null);

    useEffect(() => {
        if (!open) return;

        const element = articleScrollRef;
        if (!element) return;

        const handleScroll = () => {
            const scrollTop = element.scrollTop;
            const scrollHeight = element.scrollHeight - element.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [open, articleScrollRef]);

    if (!article) return null;

    const readingTime = article.readMins || estimateReadingTime(article.content || article.excerpt || '');

    // Force high contrast colors for dark mode
    const textColor = isDarkMode ? '#FFFFFF' : colors.text;
    const textSecondaryColor = isDarkMode ? '#E0E0E0' : colors.textSecondary;
    const backgroundColor = isDarkMode ? '#1A1A1A' : colors.background;
    const paperColor = isDarkMode ? '#2A2A2A' : colors.surface;
    const borderColor = isDarkMode ? '#444444' : colors.border;
    const accentColor = colors.accent;

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                sx: {
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                }
            }}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        width: '95%',
                        maxWidth: 1400,
                        height: '90vh',
                        bgcolor: backgroundColor,
                        border: `1px solid ${borderColor}`,
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Reading Progress Bar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            zIndex: 20,
                        }}
                    >
                        <Box
                            sx={{
                                width: `${readingProgress}%`,
                                height: '100%',
                                bgcolor: accentColor,
                                transition: 'width 0.1s ease',
                            }}
                        />
                    </Box>

                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${borderColor}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: backgroundColor,
                            position: 'sticky',
                            top: 0,
                            zIndex: 15,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: textColor,
                                fontWeight: 600,
                                fontSize: 16,
                                fontFamily: '"Times New Roman", Times, serif',
                            }}
                        >
                            {article.title.substring(0, 60)}{article.title.length > 60 ? '...' : ''}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={() => onToggleStar?.(article.id)}
                                disabled={isTogglingStar}
                                sx={{
                                    color: isStarred ? accentColor : textSecondaryColor,
                                    '&:hover': {
                                        color: accentColor,
                                    }
                                }}
                            >
                                {isStarred ? <Star /> : <StarBorder />}
                            </IconButton>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: textSecondaryColor,
                                    alignSelf: 'center',
                                    minWidth: 20,
                                    fontFamily: '"Courier New", monospace',
                                }}
                            >
                                {starCount}
                            </Typography>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    color: textSecondaryColor,
                                    '&:hover': {
                                        color: textColor,
                                    }
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Content */}
                    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        <Box
                            ref={setArticleScrollRef}
                            sx={{
                                flex: '0 0 70%',
                                overflowY: 'auto',
                                p: 3,
                                borderRight: `1px solid ${borderColor}`,
                                bgcolor: backgroundColor,
                                '&::-webkit-scrollbar': {
                                    width: 8,
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: accentColor,
                                    borderRadius: 0,
                                },
                            }}
                        >
                            <ArticleContent
                                article={article}
                                readingTime={readingTime}
                                textColor={textColor}
                                textSecondaryColor={textSecondaryColor}
                                accentColor={accentColor}
                                backgroundColor={backgroundColor}
                                borderColor={borderColor}
                                isDarkMode={isDarkMode}
                            />

                            <Box sx={{ mt: 4 }}>
                                <RecommendedList
                                    articles={article.recommendations || []}
                                    textColor={textColor}
                                    textSecondaryColor={textSecondaryColor}
                                    accentColor={accentColor}
                                    borderColor={borderColor}
                                    isDarkMode={isDarkMode}
                                    onArticleClick={onNext}
                                />
                            </Box>
                        </Box>

                        {/* Comments Section */}
                        <Box
                            sx={{
                                flex: '0 0 30%',
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: isDarkMode ? '#222222' : 'rgba(0,0,0,0.02)',
                                borderLeft: `1px solid ${borderColor}`,
                                '&::-webkit-scrollbar': {
                                    width: 8,
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: accentColor,
                                    borderRadius: 0,
                                },
                            }}
                        >
                            <CommentSection
                                comments={article.comments || []}
                                onSubmitComment={onSubmitComment}
                                isSubmitting={isSubmittingComment}
                                currentUserName={currentUserName}
                                errorMessage={commentError}
                                textColor={textColor}
                                textSecondaryColor={textSecondaryColor}
                                accentColor={accentColor}
                                backgroundColor={paperColor}
                                borderColor={borderColor}
                                isDarkMode={isDarkMode}
                            />
                        </Box>
                    </Box>

                    {/* Navigation */}
                    {(onPrevious || onNext) && (
                        <Box
                            sx={{
                                p: 2,
                                borderTop: `1px solid ${borderColor}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: backgroundColor,
                            }}
                        >
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={onPrevious}
                                disabled={!onPrevious}
                                sx={{
                                    color: textSecondaryColor,
                                    textTransform: 'none',
                                    fontFamily: '"Times New Roman", Times, serif',
                                    '&:hover:not(:disabled)': {
                                        color: accentColor,
                                    },
                                    '&.Mui-disabled': {
                                        color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                Previous Article
                            </Button>
                            <Button
                                endIcon={<ArrowForward />}
                                onClick={onNext}
                                disabled={!onNext}
                                sx={{
                                    color: textSecondaryColor,
                                    textTransform: 'none',
                                    fontFamily: '"Times New Roman", Times, serif',
                                    '&:hover:not(:disabled)': {
                                        color: accentColor,
                                    },
                                    '&.Mui-disabled': {
                                        color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                Next Article
                            </Button>
                        </Box>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
}

function ArticleContent({
    article,
    readingTime,
    textColor,
    textSecondaryColor,
    accentColor,
    backgroundColor,
    borderColor,
    isDarkMode
}) {
    const liveViews =
        typeof article.views === 'number'
            ? article.views
            : typeof article.viewCount === 'number'
              ? article.viewCount
              : typeof article.view_count === 'number'
                ? article.view_count
                : null;

    return (
        <Stack spacing={3}>
            {/* Title */}
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: 28, md: 36 },
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.2,
                    fontFamily: '"Times New Roman", Times, serif',
                    letterSpacing: '-0.02em',
                }}
            >
                {article.title}
            </Typography>

            {/* Byline */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ flexWrap: 'wrap' }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: accentColor,
                            color: '#FFFFFF',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: '"Times New Roman", Times, serif',
                        }}
                    >
                        {article.author?.charAt(0) || 'A'}
                    </Avatar>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: textColor,
                            fontFamily: '"Times New Roman", Times, serif',
                        }}
                    >
                        {article.author || 'Journal Editorial Board'}
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1.5}
                    divider={<Divider orientation="vertical" flexItem sx={{ borderColor: borderColor }} />}
                    sx={{ flexWrap: 'wrap', rowGap: 1 }}
                >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Schedule sx={{ fontSize: 16, color: textSecondaryColor }} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: textSecondaryColor,
                                fontFamily: '"Courier New", monospace',
                                fontSize: '0.75rem',
                            }}
                        >
                            {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })
                                : 'Unpublished'}
                        </Typography>
                    </Stack>

                    {liveViews !== null && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Visibility sx={{ fontSize: 16, color: textSecondaryColor }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: textSecondaryColor,
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {liveViews.toLocaleString()} views
                            </Typography>
                        </Stack>
                    )}

                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography
                            variant="caption"
                            sx={{
                                color: textSecondaryColor,
                                fontFamily: '"Courier New", monospace',
                                fontSize: '0.75rem',
                            }}
                        >
                            {readingTime} min read
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            {/* Featured Image */}
            {article.featured_image && (
                <Box
                    component="img"
                    src={article.featured_image}
                    alt={article.title}
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 400,
                        objectFit: 'cover',
                        border: `1px solid ${borderColor}`,
                        my: 2,
                    }}
                />
            )}

            {/* Content */}
            <Box
                sx={{
                    '& p, & span, & div, & section': {
                        fontSize: '1.15rem',
                        lineHeight: 1.8,
                        color: `${textColor} !important`,
                        mb: 2,
                        fontFamily: '"Times New Roman", Times, serif',
                    },
                    // This targets EVERYTHING inside the injected HTML to ensure no hidden black text
                    '& *': {
                        backgroundColor: 'transparent !important',
                        borderColor: `${borderColor} !important`,
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                        color: `${textColor} !important`,
                        fontWeight: 700,
                        fontFamily: '"Times New Roman", Times, serif',
                        mt: 4,
                        mb: 2,
                    },
                    '& h2': { fontSize: '1.8rem' },
                    '& h3': { fontSize: '1.4rem' },
                    '& blockquote': {
                        borderLeft: `4px solid ${accentColor} !important`,
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        py: 2,
                        px: 3,
                        my: 3,
                        fontStyle: 'italic',
                        '& p': { color: `${textSecondaryColor} !important` },
                    },
                    '& strong': {
                        color: `${textColor} !important`,
                        fontWeight: 800,
                    },
                    '& a': {
                        color: `${accentColor} !important`,
                        textDecoration: 'underline',
                    }
                }}
            >
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <Typography
                        sx={{
                            color: textSecondaryColor,
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '1.1rem',
                            fontStyle: 'italic',
                        }}
                    >
                        {article.excerpt || 'No content available.'}
                    </Typography>
                )}
            </Box>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.8rem',
                            color: textSecondaryColor,
                            mr: 1,
                            alignSelf: 'center',
                        }}
                    >
                        TAGS:
                    </Typography>
                    {article.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                                bgcolor: 'transparent',
                                border: `1px solid ${borderColor}`,
                                color: textSecondaryColor,
                                fontFamily: '"Courier New", monospace',
                                borderRadius: 0,
                                '&:hover': {
                                    borderColor: accentColor,
                                    color: accentColor,
                                },
                            }}
                        />
                    ))}
                </Stack>
            )}

            {/* Article Footer */}
            <Box
                sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: `2px solid ${borderColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '0.7rem',
                        color: textSecondaryColor,
                    }}
                >
                    © {new Date().getFullYear()} FYI Student Journal. All rights reserved.
                </Typography>
                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '0.7rem',
                        color: accentColor,
                    }}
                >
                    ARTICLE ID: {article.id ? article.id.toString().substring(0, 8) : 'N/A'}
                </Typography>
            </Box>
        </Stack>
    );
}
