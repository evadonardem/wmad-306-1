import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  BookmarkBorder,
  Bookmark,
  Visibility,
  ChatBubbleOutline,
  Star,
  TrendingUp,
  Schedule,
  ArrowForward,
  Search as SearchIcon,
  Whatshot,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS, SORT_OPTIONS } from './dashboardTheme';

// Metric Badge Component - Original style
const MetricBadge = ({ icon, value, color, tooltip }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ color: isDark ? DARK_COLORS.textSecondary : color, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? DARK_COLORS.textSecondary : 'text.primary' }}>
          {value}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

// Category Chip Component - Original style
const CategoryChip = ({ label, color, isDark }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        fontSize: '0.75rem',
        fontWeight: 600,
        bgcolor: isDarkMode ? alpha(DARK_COLORS.royalPurple, 0.2) : alpha(COLORS.royalPurple, 0.1),
        color: isDarkMode ? DARK_COLORS.royalPurple : COLORS.royalPurple,
        borderRadius: 1,
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  );
};

// Empty State Component - Original style
const EmptyState = ({ icon, title, description, actionLabel, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          border: `1px dashed ${isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.2)}`,
          bgcolor: isDark ? alpha(DARK_COLORS.cardBg, 0.5) : 'background.paper',
        }}
      >
        <Box sx={{
          color: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
          mb: 2,
          transform: 'scale(1.5)',
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 300, mx: 'auto' }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          onClick={onClick}
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
            },
          }}
        >
          {actionLabel}
        </Button>
      </Paper>
    </Fade>
  );
};

// Loading indicator component - Original style
const LoadingIndicator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          gap: 2,
        }}
      >
        <CircularProgress
          size={32}
          sx={{
            color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
  textPrimary,
  textSecondary,
  borderColor,
  onOpenArticle,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: `1px solid ${isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12)}`,
        bgcolor: 'background.paper',
      }}
    >
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {activeNav === 'saved' ? 'Saved Articles' : 'Your Feed'}
          </Typography>
          {filteredArticles.length > 0 && (
            <Chip
              label={filteredArticles.length}
              size="small"
              sx={{
                bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
                color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                fontWeight: 600,
                borderRadius: 1.5,
              }}
            />
          )}
        </Stack>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            sx={{
              borderRadius: 2,
              color: 'text.primary',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.2),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value || option} value={option.value || option}>
                {option.label || option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Empty States */}
      {activeNav === 'saved' && filteredArticles.length === 0 && (
        <EmptyState
          icon={<Bookmark sx={{ fontSize: 48 }} />}
          title="No bookmarks yet"
          description="Articles you save will appear right here for easy access"
          actionLabel="Browse Articles"
          onClick={() => {}}
        />
      )}

      {search.trim() && filteredArticles.length === 0 && (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 48 }} />}
          title="No matches found"
          description="Try different keywords or browse our trending section"
          actionLabel="View Trending"
          onClick={() => {}}
        />
      )}

      {/* Articles List */}
      <Stack spacing={2}>
        {displayedArticles.map((article, index) => {
          const bookmarked = bookmarkedIds.has(article.id);
          const isHot = article.hot;
          const isNew = index < 2;

          return (
            <Fade in timeout={300 + index * 100} key={article.id || index}>
              <Paper
                elevation={0}
                onClick={() => onOpenArticle(article.id)}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${isDark ? alpha(DARK_COLORS.border, 0.5) : alpha(COLORS.mediumPurple, 0.12)}`,
                  transition: 'all 250ms ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                    boxShadow: isDark
                      ? `0 8px 24px ${alpha(DARK_COLORS.softPink, 0.15)}`
                      : `0 8px 24px ${alpha(COLORS.softPink, 0.15)}`,
                  },
                  // Progress bar on top edge
                  '&::after': article.progress > 0 ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${article.progress}%`,
                    height: '3px',
                    background: `linear-gradient(90deg, ${isDark ? DARK_COLORS.softPink : COLORS.softPink}, ${isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple})`,
                    transition: 'width 300ms ease',
                  } : {},
                  '&::before': isHot ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 30px 30px 0',
                    borderColor: `transparent ${COLORS.warning} transparent transparent`,
                    opacity: 0.8,
                  } : {},
                }}
              >
                <Stack spacing={2}>
                  {/* Top Row - Categories & Metadata */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          bgcolor: isDark ? alpha(DARK_COLORS.royalPurple, 0.2) : alpha(COLORS.royalPurple, 0.1),
                          color: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                          fontWeight: 600,
                          borderRadius: 1,
                          height: 24,
                          fontSize: '0.75rem',
                        }}
                      />
                      {/* Reading time removed */}
                      {/* Progress chip removed - nothing rendered here */}
                    </Stack>

                    <Tooltip title={bookmarked ? "Remove bookmark" : "Save article"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(article.id);
                        }}
                        sx={{
                          color: bookmarked ? (isDark ? DARK_COLORS.softPink : COLORS.softPink) : 'text.disabled',
                          '&:hover': {
                            bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
                          },
                        }}
                      >
                        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  {/* Title & Excerpt */}
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                        color: 'text.primary',
                        fontSize: '1.1rem',
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                  </Box>

                  {/* Metrics Row */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Visibility sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {(article.viewCount || 0).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutline sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {article.commentCount || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {article.starCount || 0}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Button
                      variant="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenArticle(article.id);
                      }}
                      endIcon={<ArrowForward />}
                      sx={{
                        color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'transparent',
                          gap: '4px',
                        },
                      }}
                    >
                      Read
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Fade>
          );
        })}
      </Stack>

      {/* Infinite scroll sentinel */}
      {hasMore && filteredArticles.length > 0 && (
        <Box ref={loadingRef} sx={{ mt: 2 }}>
          {loading ? <LoadingIndicator /> : null}
        </Box>
      )}
    </Paper>
  );
}
