import { useMemo, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Box, CssBaseline, Stack, ThemeProvider, useMediaQuery, Fade } from '@mui/material';
import StudentLayout from '../Shared/Layouts/StudentLayout';
import DashboardTopNav, { CATEGORIES } from './DashboardSections/DashboardTopNav';
import FeedSection from './DashboardSections/FeedSection';
import RightWidgets from './DashboardSections/RightWidgets';
import MobileBottomNav from './DashboardSections/MobileBottomNav';
import MobileWidgetsDrawer from './DashboardSections/MobileWidgetsDrawer';
import ArticleView from './Components/ArticleView';
import {
  createDashboardTheme,
  estimateReadingTime,
  getSurfaceTokens,
} from './DashboardSections/dashboardTheme';

export default function Dashboard({ articles = [] }) {
  const { auth } = usePage().props;
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('dashboardTheme');
    return savedMode || 'light';
  });

  const [activeNav, setActiveNav] = useState('feed');
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set());
  const [mobileWidgetsOpen, setMobileWidgetsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleCommentState, setArticleCommentState] = useState({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    localStorage.setItem('dashboardTheme', mode);
  }, [mode]);

  const theme = useMemo(() => createDashboardTheme(mode), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const sourceArticles = useMemo(() => (
    Array.isArray(articles) ? articles : []
  ), [articles]);

  const preparedArticles = useMemo(() => {
    return sourceArticles.map((article, index) => {
      const excerpt = article.excerpt || '';
      const override = articleCommentState[article.id] || {};
      return {
        ...article,
        ...override,
        excerpt,
        readMins: estimateReadingTime(excerpt || article.title),
        views: 2300 - index * 117,
        shares: 8 + (index % 9),
        stars: 70 + index * 3,
        hot: index < 3,
        progress: index % 2 === 0 ? 70 : 30,
        trending: index < 5 ? Math.floor(Math.random() * 100) + 50 : undefined,
      };
    });
  }, [articleCommentState, sourceArticles]);

  const filteredArticles = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const source = activeNav === 'saved'
      ? preparedArticles.filter((article) => bookmarkedIds.has(article.id))
      : preparedArticles;

    let list = keyword
      ? source.filter((article) =>
          article.title.toLowerCase().includes(keyword) ||
          article.excerpt.toLowerCase().includes(keyword) ||
          article.category.toLowerCase().includes(keyword)
        )
      : source;

    if (activeCategory) {
      const categoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory;
      list = list.filter((article) =>
        article.category?.toLowerCase() === categoryLabel.toLowerCase()
      );
    }

    switch (sortBy) {
      case 'Popular':
        list = [...list].sort((a, b) => b.views - a.views);
        break;
      case 'Most Discussed':
        list = [...list].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      case 'Trending':
        list = [...list].sort((a, b) => (b.trending || 0) - (a.trending || 0));
        break;
      default: // Newest
        list = [...list].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    }

    return list;
  }, [activeNav, activeCategory, bookmarkedIds, preparedArticles, search, sortBy]);

  const trendingItems = useMemo(() =>
    [...preparedArticles]
      .sort((a, b) => (b.trending || 0) - (a.trending || 0))
      .slice(0, 5),
    [preparedArticles]
  );

  const continueReading = useMemo(() =>
    preparedArticles.filter((article) => article.progress > 0).slice(0, 3),
    [preparedArticles]
  );

  const stats = useMemo(() => ({
    totalArticles: preparedArticles.length,
    savedArticles: bookmarkedIds.size,
    completedReads: preparedArticles.filter(a => a.progress === 100).length,
    readingStreak: 7,
  }), [preparedArticles, bookmarkedIds]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOpenArticle = (articleId) => {
    const article = preparedArticles.find((item) => item.id === articleId);
    if (article) {
      setSelectedArticle(article);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
    setCommentError('');
  };

  const appendLocalComment = (articleId, body, parentId = null) => {
    const authorName = auth?.user?.name || 'You';
    const newComment = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      body,
      author: authorName,
      created_at: new Date().toISOString(),
      replies: [],
      parent_id: parentId,
    };

    setArticleCommentState((previous) => {
      const previousState = previous[articleId] || {};
      const previousComments = previousState.comments || [];
      const previousCount = Number(previousState.commentCount ?? selectedArticle?.commentCount ?? 0);
      let updatedComments;
      if (parentId) {
        updatedComments = previousComments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        );
      } else {
        updatedComments = [...previousComments, newComment];
      }
      return {
        ...previous,
        [articleId]: {
          ...previousState,
          comments: updatedComments,
          commentCount: previousCount + 1,
        },
      };
    });

    setSelectedArticle((previous) => {
      if (!previous || previous.id !== articleId) return previous;
      const previousComments = previous.comments || [];
      const previousCount = Number(previous.commentCount || 0);
      let updatedComments;
      if (parentId) {
        updatedComments = previousComments.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        );
      } else {
        updatedComments = [...previousComments, newComment];
      }
      return {
        ...previous,
        comments: updatedComments,
        commentCount: previousCount + 1,
      };
    });
  };

  const handleSubmitComment = (body, parentId = null) => {
    if (!selectedArticle?.id || !body?.trim()) return;

    setCommentError('');
    const articleId = selectedArticle.id;
    const normalizedBody = body.trim();

    setIsSubmittingComment(true);
    router.post(
      route('student.articles.comment', articleId),
      { body: normalizedBody, parent_id: parentId },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => appendLocalComment(articleId, normalizedBody, parentId),
        onError: (errors) => setCommentError(errors?.body || 'Unable to post comment right now.'),
        onFinish: () => setIsSubmittingComment(false),
      }
    );
  };

  const selectedArticleIndex = useMemo(() => {
    if (!selectedArticle) return -1;
    return preparedArticles.findIndex((article) => article.id === selectedArticle.id);
  }, [preparedArticles, selectedArticle]);

  const handleNextArticle = selectedArticleIndex >= 0 && selectedArticleIndex < preparedArticles.length - 1
    ? () => setSelectedArticle(preparedArticles[selectedArticleIndex + 1])
    : undefined;

  const handlePreviousArticle = selectedArticleIndex > 0
    ? () => setSelectedArticle(preparedArticles[selectedArticleIndex - 1])
    : undefined;

  const { textPrimary, textSecondary, borderColor } = getSurfaceTokens(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StudentLayout>
        <Box sx={{
          minHeight: '100vh',
          px: { xs: 2, md: 3, lg: 4 },
          py: { xs: 2, md: 3 },
          transition: 'all 300ms ease',
        }}>
          <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
            <DashboardTopNav
              activeView={activeNav}
              onViewChange={(view) => {
                setActiveNav(view);
                if (view === 'feed') setActiveCategory(null);
              }}
              activeCategory={activeCategory}
              onCategoryChange={(categoryId) => {
                setActiveCategory(categoryId);
                setActiveNav('feed');
              }}
              search={search}
              onSearchChange={setSearch}
              mode={mode}
              onToggleMode={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
              userName={auth?.user?.name}
              onOpenMobileWidgets={() => setMobileWidgetsOpen(true)}
            />

            <Fade in timeout={600}>
              <Box>
                <Box
                  sx={{
                    display: 'grid',
                    gap: { xs: 2, md: 3 },
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '1fr 300px',
                      lg: '1fr 340px',
                    },
                    alignItems: 'start',
                    position: 'relative',
                    pb: { xs: 8, md: 0 },
                  }}
                >
                  <Stack spacing={{ xs: 2, md: 3 }} sx={{ minWidth: 0, maxWidth: { md: 920, lg: 980 } }}>
                    <FeedSection
                      activeNav={activeNav}
                      filteredArticles={filteredArticles}
                      search={search}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      bookmarkedIds={bookmarkedIds}
                      onToggleBookmark={toggleBookmark}
                      textPrimary={textPrimary}
                      textSecondary={textSecondary}
                      borderColor={borderColor}
                      onOpenArticle={handleOpenArticle}
                    />
                  </Stack>

                  <Box sx={{
                    position: 'sticky',
                    top: 88,
                    alignSelf: 'flex-start',
                    display: { xs: 'none', md: 'block' }
                  }}>
                    <RightWidgets
                      trendingItems={trendingItems}
                      continueReading={continueReading}
                      textPrimary={textPrimary}
                      textSecondary={textSecondary}
                      borderColor={borderColor}
                      onArticleClick={handleOpenArticle}
                    />
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Box>

        <MobileWidgetsDrawer
          open={mobileWidgetsOpen}
          onClose={() => setMobileWidgetsOpen(false)}
          trendingItems={trendingItems}
        />

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileBottomNav activeNav={activeNav} onSelect={setActiveNav} />
        </Box>

        <ArticleView
          article={selectedArticle}
          open={modalOpen}
          onClose={handleCloseModal}
          onToggleBookmark={toggleBookmark}
          isBookmarked={selectedArticle ? bookmarkedIds.has(selectedArticle.id) : false}
          mode={mode}
          onNext={handleNextArticle}
          onPrevious={handlePreviousArticle}
          onSubmitComment={handleSubmitComment}
          isSubmittingComment={isSubmittingComment}
          commentError={commentError}
          currentUserName={auth?.user?.name || 'You'}
        />
      </StudentLayout>
    </ThemeProvider>
  );
}
