import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Stack,
    Paper,
    Button,
    Modal,
    Fade,
    Backdrop,
    Grid,
} from '@mui/material';
import {
    Close,
    StarBorder,
    Star,
    Schedule,
    Visibility,
    Comment,
    ArrowBack,
    ArrowForward,
} from '@mui/icons-material';
import StudentLayout from '../../Shared/Layouts/StudentLayout';
import CommentSection from './CommentSection';
import RecommendedList from './RecommendedList';
import { COLORS, DARK_COLORS, estimateReadingTime } from '../DashboardSections/dashboardTheme';

export default function ArticleView({
    article,
    open = false,
    onClose,
    onToggleStar,
    isStarred = false,
    starCount = 0,
    isTogglingStar = false,
    mode = 'light',
    onNext,
    onPrevious,
    onSubmitComment,
    isSubmittingComment = false,
    commentError = '',
    currentUserName = 'You',
    standalone = false,
}) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [articleScrollRef, setArticleScrollRef] = useState(null);
    const [commentScrollRef, setCommentScrollRef] = useState(null);

    useEffect(() => {
        if (!open && !standalone) return;

        const element = standalone ? window : articleScrollRef;
        if (!element) return;

        const handleScroll = () => {
            if (standalone) {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight - windowHeight;
                const scrollTop = window.scrollY;
                const progress = (scrollTop / documentHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, progress)));
            } else {
                const scrollTop = element.scrollTop;
                const scrollHeight = element.scrollHeight - element.clientHeight;
                const progress = (scrollTop / scrollHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, progress)));
            }
        };

        if (standalone) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [open, standalone, articleScrollRef]);

    if (!article) return null;

    const isDark = mode === 'dark';
    const bgColor = isDark ? DARK_COLORS.cardBg : '#FFFFFF';
    const textColor = isDark ? DARK_COLORS.textPrimary : COLORS.deepPurple;
    const mutedColor = isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple;
    const readingTime = article.readMins || estimateReadingTime(article.content || article.excerpt || '');

    if (standalone) {
        return (
            <StudentLayout>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        bgcolor: `${COLORS.mediumPurple}30`,
                        zIndex: 1400,
                    }}
                >
                    <Box
                        sx={{
                            width: `${readingProgress}%`,
                            height: '100%',
                            bgcolor: COLORS.softPink,
                            transition: 'width 0.1s ease',
                        }}
                    />
                </Box>

                <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => router.visit(route('student.dashboard'))}
                            sx={{
                                color: mutedColor,
                                textTransform: 'none',
                                '&:hover': { color: COLORS.softPink },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={() => onToggleStar?.(article.id)}
                                disabled={isTogglingStar}
                                sx={{ color: isStarred ? COLORS.softPink : mutedColor }}
                            >
                                {isStarred ? <Star /> : <StarBorder />}
                            </IconButton>
                            <Typography variant="caption" sx={{ color: mutedColor, alignSelf: 'center', minWidth: 20 }}>
                                {starCount}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 2,
                                    bgcolor: bgColor,
                                    maxHeight: 'calc(100vh - 200px)',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': { width: 8 },
                                    '&::-webkit-scrollbar-track': {
                                        background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                        borderRadius: 4,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                        borderRadius: 4,
                                    },
                                }}
                                ref={setArticleScrollRef}
                            >
                                <ArticleContent
                                    article={article}
                                    readingTime={readingTime}
                                    textColor={textColor}
                                    mutedColor={mutedColor}
                                    isDark={isDark}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: bgColor,
                                    position: 'sticky',
                                    top: 20,
                                    maxHeight: 'calc(100vh - 120px)',
                                    overflowY: 'auto',
                                    border: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}20`}`,
                                    '&::-webkit-scrollbar': { width: 8 },
                                    '&::-webkit-scrollbar-track': {
                                        background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                        borderRadius: 4,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                        borderRadius: 4,
                                    },
                                }}
                                ref={setCommentScrollRef}
                            >
                                <Typography variant="h6" sx={{ color: textColor, mb: 2, fontWeight: 600 }}>
                                    Discussion ({article.commentCount || 0})
                                </Typography>
                                <CommentSection
                                    comments={article.comments || []}
                                    isDark={isDark}
                                    textColor={textColor}
                                    mutedColor={mutedColor}
                                    onSubmitComment={onSubmitComment}
                                    isSubmitting={isSubmittingComment}
                                    currentUserName={currentUserName}
                                    errorMessage={commentError}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </StudentLayout>
        );
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        width: '95%',
                        maxWidth: 1400,
                        height: '90vh',
                        bgcolor: bgColor,
                        borderRadius: 2,
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: `${COLORS.mediumPurple}30`,
                            zIndex: 20,
                        }}
                    >
                        <Box
                            sx={{
                                width: `${readingProgress}%`,
                                height: '100%',
                                bgcolor: COLORS.softPink,
                                transition: 'width 0.1s ease',
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}30`}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: bgColor,
                            position: 'sticky',
                            top: 0,
                            zIndex: 15,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, fontSize: 16 }}>
                            {article.title.substring(0, 60)}{article.title.length > 60 ? '...' : ''}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={() => onToggleStar?.(article.id)}
                                disabled={isTogglingStar}
                                sx={{ color: isStarred ? COLORS.softPink : mutedColor }}
                            >
                                {isStarred ? <Star /> : <StarBorder />}
                            </IconButton>
                            <Typography variant="caption" sx={{ color: mutedColor, alignSelf: 'center', minWidth: 20 }}>
                                {starCount}
                            </Typography>
                            <IconButton onClick={onClose} sx={{ color: mutedColor }}>
                                <Close />
                            </IconButton>
                        </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        <Box
                            ref={setArticleScrollRef}
                            sx={{
                                flex: '0 0 70%',
                                overflowY: 'auto',
                                p: 3,
                                borderRight: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}20`}`,
                                '&::-webkit-scrollbar': { width: 8 },
                                '&::-webkit-scrollbar-track': {
                                    background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <ArticleContent
                                article={article}
                                readingTime={readingTime}
                                textColor={textColor}
                                mutedColor={mutedColor}
                                isDark={isDark}
                            />

                            <Box sx={{ mt: 4 }}>
                                <RecommendedList
                                    articles={article.recommendations || []}
                                    isDark={isDark}
                                    textColor={textColor}
                                    mutedColor={mutedColor}
                                />
                            </Box>
                        </Box>

                        <Box
                            ref={setCommentScrollRef}
                            sx={{
                                flex: '0 0 30%',
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: isDark ? `${DARK_COLORS.cardBg}80` : '#F9F9FC',
                                '&::-webkit-scrollbar': { width: 8 },
                                '&::-webkit-scrollbar-track': {
                                    background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <CommentSection
                                comments={article.comments || []}
                                isDark={isDark}
                                textColor={textColor}
                                mutedColor={mutedColor}
                                onSubmitComment={onSubmitComment}
                                isSubmitting={isSubmittingComment}
                                currentUserName={currentUserName}
                                errorMessage={commentError}
                            />
                        </Box>
                    </Box>

                    {(onPrevious || onNext) && (
                        <Box
                            sx={{
                                p: 2,
                                borderTop: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}30`}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: bgColor,
                            }}
                        >
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={onPrevious}
                                disabled={!onPrevious}
                                sx={{
                                    color: mutedColor,
                                    textTransform: 'none',
                                    '&:hover:not(:disabled)': { color: COLORS.softPink },
                                }}
                            >
                                Previous Article
                            </Button>
                            <Button
                                endIcon={<ArrowForward />}
                                onClick={onNext}
                                disabled={!onNext}
                                sx={{
                                    color: mutedColor,
                                    textTransform: 'none',
                                    '&:hover:not(:disabled)': { color: COLORS.softPink },
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

function ArticleContent({ article, readingTime, textColor, mutedColor, isDark }) {
    const liveViews =
        typeof article.views === 'number'
            ? article.views
            : typeof article.viewCount === 'number'
              ? article.viewCount
              : typeof article.view_count === 'number'
                ? article.view_count
                : null;

    return (
        <Stack spacing={2}>
            <Stack spacing={2}>
                <Typography
                    variant="h1"
                    sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 700, color: textColor, lineHeight: 1.2 }}
                >
                    {article.title}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                            sx={{ width: 32, height: 32, bgcolor: COLORS.softPink, fontSize: 14, fontWeight: 600 }}
                        >
                            {article.author?.charAt(0) || 'A'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
                            {article.author || 'Journal Editorial Board'}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} divider={<Divider orientation="vertical" flexItem />}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Schedule sx={{ fontSize: 16, color: mutedColor }} />
                            <Typography variant="caption" sx={{ color: mutedColor }}>
                                {article.publishedAt
                                    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Unpublished'}
                            </Typography>
                        </Stack>
                        {liveViews !== null && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Visibility sx={{ fontSize: 16, color: mutedColor }} />
                                <Typography variant="caption" sx={{ color: mutedColor }}>
                                    {liveViews.toLocaleString()} views
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Stack>

            <Box
                sx={{
                    mt: 2,
                    '& p': { fontSize: 16, lineHeight: 1.7, color: textColor, mb: 2 },
                    '& h2': { fontSize: 24, fontWeight: 600, color: textColor, mt: 4, mb: 2 },
                    '& h3': {
                        fontSize: 20,
                        fontWeight: 600,
                        color: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                        mt: 3,
                        mb: 1.5,
                    },
                    '& blockquote': {
                        borderLeft: `4px solid ${COLORS.softPink}`,
                        bgcolor: isDark ? `${DARK_COLORS.royalPurple}20` : `${COLORS.royalPurple}08`,
                        py: 1,
                        px: 3,
                        my: 3,
                        borderRadius: 1,
                        fontStyle: 'italic',
                        color: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                    },
                }}
            >
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <p>{article.excerpt || 'No content available.'}</p>
                )}
            </Box>

            {article.tags && article.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                    {article.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                                bgcolor: isDark ? `${DARK_COLORS.royalPurple}30` : `${COLORS.mediumPurple}15`,
                                color: isDark ? DARK_COLORS.royalPurple : COLORS.mediumPurple,
                                borderRadius: 1.5,
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
