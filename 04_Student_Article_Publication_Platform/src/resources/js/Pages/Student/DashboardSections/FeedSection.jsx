// FeedSection.jsx (updated with dark mode text fixes)
import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Button,
    Chip,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    Tooltip,
    Fade,
    CircularProgress,
    alpha,
    IconButton,
} from '@mui/material';
import {
    BookmarkBorder,
    Bookmark,
    Visibility,
    ChatBubbleOutline,
    Star,
    ArrowForward,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

const SORT_OPTIONS = [
    { value: 'Newest', label: 'Newest First' },
    { value: 'Popular', label: 'Most Popular' },
    { value: 'Most Discussed', label: 'Most Discussed' },
    { value: 'Trending', label: 'Trending' },
];

// Article byline component
const ArticleByline = ({ author, date, readTime }) => {
    const { colors } = useTheme();
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{
            fontFamily: '"Courier New", monospace',
            fontSize: '0.7rem',
            color: colors.textSecondary,
            flexWrap: 'wrap',
        }}>
            <span>By {author || 'Staff Writer'}</span>
            <span>•</span>
            <span>{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just in'}</span>
            {readTime && (
                <>
                    <span>•</span>
                    <span>{readTime} min read</span>
                </>
            )}
        </Stack>
    );
};

// Empty State Component
const EmptyState = ({ icon, title, description, actionLabel, onClick }) => {
    const { colors } = useTheme();
    return (
        <Fade in timeout={600}>
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: alpha(colors.surface, 0.5),
                }}
            >
                <Box sx={{ color: colors.textSecondary, mb: 2, fontSize: 48 }}>
                    {icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, mb: 1, color: colors.text }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3, maxWidth: 340, mx: 'auto' }}>
                    {description}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={onClick}
                    endIcon={<ArrowForward />}
                    sx={{
                        borderColor: colors.textSecondary,
                        color: colors.text,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontFamily: '"Times New Roman", Times, serif',
                        '&:hover': {
                            borderColor: colors.accent,
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    {actionLabel}
                </Button>
            </Paper>
        </Fade>
    );
};

// Loading indicator
const LoadingIndicator = () => {
    const { colors } = useTheme();
    return (
        <Fade in timeout={600}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
                <CircularProgress size={32} sx={{ color: colors.accent }} />
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Loading more articles...
                </Typography>
            </Box>
        </Fade>
    );
};

export default function FeedSection({
    activeNav,
    filteredArticles,
    search,
    sortBy,
    onSortChange,
    bookmarkedIds,
    onToggleBookmark,
    onOpenArticle,
}) {
    const { colors } = useTheme();
    const [displayedArticles, setDisplayedArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();
    const loadingRef = useRef();

    const ARTICLES_PER_PAGE = 5;

    // Reset pagination when filters change
    useEffect(() => {
        setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
        setPage(1);
        setHasMore(filteredArticles.length > ARTICLES_PER_PAGE);
    }, [filteredArticles]);

    // Load more articles
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;
        setLoading(true);
        setTimeout(() => {
            const nextPage = page + 1;
            const end = nextPage * ARTICLES_PER_PAGE;
            setDisplayedArticles(filteredArticles.slice(0, end));
            setPage(nextPage);
            setHasMore(end < filteredArticles.length);
            setLoading(false);
        }, 500);
    }, [loading, hasMore, page, filteredArticles]);

    // Set up intersection observer
    useEffect(() => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) loadMore();
            },
            { threshold: 0.1 }
        );

        if (loadingRef.current) observerRef.current.observe(loadingRef.current);
        return () => observerRef.current?.disconnect();
    }, [loading, hasMore, loadMore]);

    return (
        <Box>
            {/* Header with sort */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: '"Times New Roman", Times, serif',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        borderLeft: '4px solid',
                        borderColor: colors.accent,
                        pl: 2,
                        color: colors.text,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                >
                    {activeNav === 'saved' ? 'Saved Articles' : 'Today\'s Edition'}
                </Typography>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            borderRadius: 0,
                            color: colors.text,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.border,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.accent,
                            },
                            '& .MuiSvgIcon-root': {
                                color: colors.textSecondary,
                            },
                        }}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {/* Empty States */}
            {activeNav === 'saved' && filteredArticles.length === 0 && (
                <EmptyState
                    icon={<BookmarkBorder sx={{ fontSize: 48 }} />}
                    title="No saved articles"
                    description="Bookmark articles you want to read later. They'll appear here."
                    actionLabel="Browse Articles"
                    onClick={() => {}}
                />
            )}

            {search.trim() && filteredArticles.length === 0 && (
                <EmptyState
                    icon={<SearchIcon sx={{ fontSize: 48 }} />}
                    title="No matches found"
                    description="Try different keywords or browse our sections"
                    actionLabel="Clear Search"
                    onClick={() => onSearchChange('')}
                />
            )}

            {/* Articles List */}
            <Stack spacing={3}>
                {displayedArticles.map((article, index) => {
                    const bookmarked = bookmarkedIds.has(article.id);

                    return (
                        <Fade in timeout={300 + index * 100} key={article.id || index}>
                            <Paper
                                elevation={0}
                                onClick={() => onOpenArticle(article.id)}
                                sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: colors.border,
                                    bgcolor: colors.background,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: colors.accent,
                                        bgcolor: alpha(colors.surface, 0.5),
                                    },
                                }}
                            >
                                <Stack spacing={2}>
                                    {/* Category and bookmark */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Chip
                                            label={article.category || 'General'}
                                            size="small"
                                            sx={{
                                                fontFamily: '"Courier New", monospace',
                                                fontSize: '0.7rem',
                                                bgcolor: 'transparent',
                                                border: '1px solid',
                                                borderColor: colors.border,
                                                borderRadius: 0,
                                                color: colors.textSecondary,
                                            }}
                                        />
                                        <Tooltip title={bookmarked ? "Remove bookmark" : "Save article"}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleBookmark(article.id);
                                                }}
                                                sx={{
                                                    color: bookmarked ? colors.accent : colors.textSecondary,
                                                }}
                                            >
                                                {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>

                                    {/* Title */}
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: '"Times New Roman", Times, serif',
                                            fontWeight: 700,
                                            lineHeight: 1.3,
                                            fontSize: '1.5rem',
                                            color: colors.text,
                                        }}
                                    >
                                        {article.title}
                                    </Typography>

                                    {/* Excerpt */}
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: '"Times New Roman", Times, serif',
                                            color: colors.textSecondary,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {article.excerpt}
                                    </Typography>

                                    {/* Byline and metadata */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ flexWrap: 'wrap', gap: 2 }}
                                    >
                                        <ArticleByline
                                            author={article.author}
                                            date={article.publishedAt}
                                            readTime={article.readMins}
                                        />

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Tooltip title="Views">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Visibility sx={{ fontSize: 16, color: colors.textSecondary }} />
                                                    <Typography variant="caption" sx={{ fontFamily: '"Courier New", monospace', color: colors.textSecondary }}>
                                                        {(article.viewCount || 0).toLocaleString()}
                                                    </Typography>
                                                </Stack>
                                            </Tooltip>

                                            <Tooltip title="Comments">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <ChatBubbleOutline sx={{ fontSize: 16, color: colors.textSecondary }} />
                                                    <Typography variant="caption" sx={{ fontFamily: '"Courier New", monospace', color: colors.textSecondary }}>
                                                        {article.commentCount || 0}
                                                    </Typography>
                                                </Stack>
                                            </Tooltip>

                                            <Tooltip title="Stars">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Star sx={{ fontSize: 16, color: colors.textSecondary }} />
                                                    <Typography variant="caption" sx={{ fontFamily: '"Courier New", monospace', color: colors.textSecondary }}>
                                                        {article.starCount || 0}
                                                    </Typography>
                                                </Stack>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>

                                    {/* Read more button */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                fontFamily: '"Times New Roman", Times, serif',
                                                textTransform: 'none',
                                                color: colors.accent,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Continue Reading
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Fade>
                    );
                })}
            </Stack>

            {/* Infinite scroll sentinel */}
            {hasMore && filteredArticles.length > 0 && (
                <Box ref={loadingRef} sx={{ mt: 3 }}>
                    {loading && <LoadingIndicator />}
                </Box>
            )}
        </Box>
    );
}
