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
} from '@mui/material';
import {
  BookmarkBorder,
  Bookmark,
  Visibility,
  ChatBubbleOutline,
  Share,
  Star,
  TrendingUp,
  Schedule,
  ArrowForward,
  Search as SearchIcon,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS, SORT_OPTIONS } from './dashboardTheme';

function EmptyState({ icon, title, description, actionLabel, onClick, isDark }) {
  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          border: `1px dashed ${isDark ? DARK_COLORS.border : COLORS.gray300}`,
          bgcolor: isDark ? `${DARK_COLORS.cardBg}80` : 'background.paper',
        }}
      >
        <Box sx={{
          color: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
          mb: 2,
          transform: 'scale(1.5)',
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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
}

// Loading indicator component
const LoadingIndicator = ({ isDark }) => (
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
  const isDark = false; // This should come from theme context
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

    // Simulate network delay for smooth loading
    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * ARTICLES_PER_PAGE;
      const end = nextPage * ARTICLES_PER_PAGE;
      const newArticles = filteredArticles.slice(0, end);

      setDisplayedArticles(newArticles);
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
        border: `1px solid ${borderColor}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {activeNav === 'saved' ? 'Saved Articles' : 'Your Feed'}
          </Typography>
          {filteredArticles.length > 0 && (
            <Chip
              label={filteredArticles.length}
              size="small"
              sx={{
                bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                color: '#fff',
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: borderColor,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {activeNav === 'saved' && filteredArticles.length === 0 && (
        <EmptyState
          icon={<Bookmark sx={{ fontSize: 48 }} />}
          title="No bookmarks yet"
          description="Articles you save will appear right here for easy access"
          actionLabel="Browse Articles"
          onClick={() => {}}
          isDark={isDark}
        />
      )}

      {search.trim() && filteredArticles.length === 0 && (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 48 }} />}
          title="No matches found"
          description="Try different keywords or browse our trending section"
          actionLabel="View Trending"
          onClick={() => {}}
          isDark={isDark}
        />
      )}

      <Stack spacing={2}>
        {displayedArticles.map((article, index) => {
          const bookmarked = bookmarkedIds.has(article.id);
          const isHot = article.hot;
          const isNew = index < 2;

          return (
            <Fade in timeout={300 + index * 100} key={article.id || index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${borderColor}`,
                  transition: 'all 250ms ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                    boxShadow: `0 8px 24px ${isDark ? DARK_COLORS.softPink : COLORS.softPink}20`,
                  },
                  // Progress bar on top edge
                  '&::after': article.progress > 0 ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${article.progress}%`,
                    height: '3px',
                    background: `linear-gradient(90deg, ${COLORS.softPink}, ${COLORS.royalPurple})`,
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
                onClick={() => onOpenArticle(article.id)}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: 1,
                          height: 24,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Schedule sx={{ fontSize: 14, color: textSecondary }} />
                        <Typography variant="caption" sx={{ color: textSecondary }}>
                          {article.readMins} min read
                        </Typography>
                      </Stack>
                      {isNew && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 1,
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                      {article.progress > 0 && (
                        <Chip
                          label={`${article.progress}%`}
                          size="small"
                          sx={{
                            bgcolor: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 1,
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Stack>

                    <Tooltip title={bookmarked ? "Remove bookmark" : "Save article"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(article.id);
                        }}
                        sx={{
                          color: bookmarked ? (isDark ? DARK_COLORS.softPink : COLORS.softPink) : textSecondary,
                          '&:hover': {
                            bgcolor: isDark ? `${DARK_COLORS.softPink}20` : `${COLORS.softPink}10`,
                          },
                        }}
                      >
                        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                  </Box>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Visibility sx={{ fontSize: 16, color: textSecondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {(article.views / 1000).toFixed(1)}k
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutline sx={{ fontSize: 16, color: textSecondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {article.commentCount || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Share sx={{ fontSize: 16, color: textSecondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {article.shares}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star sx={{ fontSize: 16, color: textSecondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {article.stars}
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
      {hasMore && (
        <Box ref={loadingRef} sx={{ mt: 2 }}>
          {loading ? <LoadingIndicator isDark={isDark} /> : null}
        </Box>
      )}
    </Paper>
  );
}
