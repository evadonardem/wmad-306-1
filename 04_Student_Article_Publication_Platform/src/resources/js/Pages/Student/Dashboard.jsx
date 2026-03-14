// Dashboard.jsx (updated to work with redesigned TopNav)
import { useMemo, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Box,
    CssBaseline,
    Stack,
    useMediaQuery,
    Fade,
    Container,
    Divider,
    Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import StudentLayout from '@/Layouts/StudentLayout';
import DashboardTopNav from './DashboardSections/DashboardTopNav';
import FeedSection from './DashboardSections/FeedSection';
import RightWidgets from './DashboardSections/RightWidgets';
import MobileBottomNav from './DashboardSections/MobileBottomNav';
import MobileWidgetsDrawer from './DashboardSections/MobileWidgetsDrawer';
import ArticleView from './Components/ArticleView';
import { useTheme } from '@/Contexts/ThemeContext';
import {
    createDashboardTheme,
    estimateReadingTime,
} from './DashboardSections/dashboardTheme';

// Simple date header
const DateHeader = ({ date }) => {
    const { colors } = useTheme();
    return (
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
            <span>VOL. CXXIII • NO. 42</span>
            <span>{date}</span>
            <span>MORNING EDITION</span>
        </Stack>
    );
};

export default function Dashboard({ articles = [], categories = [] }) {
        // State for reloading articles
        const [localArticles, setLocalArticles] = useState(articles);
        const [localCategories, setLocalCategories] = useState(categories);
    const { auth } = usePage().props;
    const { colors, isDarkMode } = useTheme();
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('dashboardTheme');
        return savedMode || (isDarkMode ? 'dark' : 'light');
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
    const [articleEngagementState, setArticleEngagementState] = useState({});
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [isTogglingStar, setIsTogglingStar] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        setCurrentDate(date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).toUpperCase());
    }, []);

    useEffect(() => {
        localStorage.setItem('dashboardTheme', mode);
    }, [mode]);

    const theme = useMemo(() => createDashboardTheme(mode), [mode]);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const sourceArticles = useMemo(() => (
        Array.isArray(localArticles) ? localArticles : []
    ), [localArticles]);

    useEffect(() => {
        const savedIds = new Set(
            sourceArticles
                .filter((article) => Boolean(article.isSaved))
                .map((article) => article.id)
        );
        setBookmarkedIds(savedIds);
    }, [sourceArticles]);

    const preparedArticles = useMemo(() => {
        return sourceArticles.map((article, index) => {
            const excerpt = article.excerpt || '';
            const override = articleCommentState[article.id] || {};
            const engagementOverride = articleEngagementState[article.id] || {};
            // Always coerce comments to array
            const comments = Array.isArray(override.comments)
                ? override.comments
                : Array.isArray(article.comments)
                    ? article.comments
                    : [];
            return {
                ...article,
                ...engagementOverride,
                ...override,
                comments,
                excerpt,
                readMins: estimateReadingTime(excerpt || article.title),
                hot: index < 3,
                progress: index % 2 === 0 ? 70 : 30,
                trending: index < 5 ? Math.floor(Math.random() * 100) + 50 : undefined,
            };
        });
    }, [articleCommentState, articleEngagementState, sourceArticles]);


    // Handler to reload articles and categories from backend
    const handleReloadArticles = () => {
        setActiveCategory(null);
        setSearch('');
        setSortBy('Newest');
        router.reload({
            only: ['articles', 'categories'],
            onSuccess: (page) => {
                setLocalArticles(page.props.articles || []);
                setLocalCategories(page.props.categories || []);
            },
        });
    };

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
            const selectedCategory = localCategories.find(
                (cat) => String(cat.id) === String(activeCategory)
            );
            if (selectedCategory) {
                list = list.filter((article) =>
                    (article.category?.toLowerCase?.() || '') === selectedCategory.name.toLowerCase()
                );
            }
        }

        switch (sortBy) {
            case 'Popular':
                list = [...list].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                break;
            case 'Most Discussed':
                list = [...list].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
                break;
            case 'Trending':
                list = [...list].sort((a, b) => (b.trending || 0) - (a.trending || 0));
                break;
            default:
                list = [...list].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        }

        return list;
    }, [activeNav, activeCategory, bookmarkedIds, preparedArticles, search, sortBy, localCategories]);

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

    const toggleBookmark = async (id) => {
        if (!id) return;

        let nextSavedState = false;

        setBookmarkedIds((previous) => {
            const next = new Set(previous);
            if (next.has(id)) {
                next.delete(id);
                nextSavedState = false;
            } else {
                next.add(id);
                nextSavedState = true;
            }
            return next;
        });

        try {
            const { data } = await axios.post(route('student.articles.save.toggle', id));
            if (typeof data?.isSaved === 'boolean' && data.isSaved !== nextSavedState) {
                setBookmarkedIds((previous) => {
                    const next = new Set(previous);
                    if (data.isSaved) {
                        next.add(id);
                    } else {
                        next.delete(id);
                    }
                    return next;
                });
            }
        } catch {
            setBookmarkedIds((previous) => {
                const next = new Set(previous);
                if (nextSavedState) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        }
    };

    const handleOpenArticle = (articleId) => {
        const article = preparedArticles.find((item) => item.id === articleId);
        if (article) {
            setSelectedArticle(article);
            setModalOpen(true);
            void recordView(article.id);
        }
    };

    const syncEngagementState = (articleId, payload = {}) => {
        const nextEngagement = {
            viewCount: Number(payload.viewCount ?? 0),
            starCount: Number(payload.starCount ?? 0),
            isStarred: Boolean(payload.isStarred),
        };

        setArticleEngagementState((previous) => ({
            ...previous,
            [articleId]: {
                ...(previous[articleId] || {}),
                ...nextEngagement,
            },
        }));

        setSelectedArticle((previous) => {
            if (!previous || previous.id !== articleId) return previous;
            return {
                ...previous,
                ...nextEngagement,
            };
        });
    };

    const recordView = async (articleId) => {
        try {
            const { data } = await axios.post(route('student.articles.view', articleId));
            syncEngagementState(articleId, data);
        } catch {
            // Fail silently
        }
    };

    const handleToggleStar = async (articleId) => {
        if (!articleId || isTogglingStar) return;

        setIsTogglingStar(true);
        try {
            const { data } = await axios.post(route('student.articles.star.toggle', articleId));
            syncEngagementState(articleId, data);
        } catch {
            // Keep UI stable
        } finally {
            setIsTogglingStar(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedArticle(null);
        setCommentError('');
    };

    const appendLocalComment = (articleId, body, parentId = null) => {
        const authorName = auth?.user?.name || 'You';
        const baseArticle = preparedArticles.find((item) => item.id === articleId);
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
            // Always treat comments as array
            const previousComments = Array.isArray(previousState.comments)
                ? previousState.comments
                : Array.isArray(baseArticle?.comments)
                    ? baseArticle.comments
                    : [];
            const previousCount = Number(previousState.commentCount ?? baseArticle?.commentCount ?? 0);
            let updatedComments;
            if (parentId) {
                updatedComments = previousComments.map((c) =>
                    c.id === parentId
                        ? { ...c, replies: Array.isArray(c.replies) ? [...c.replies, newComment] : [newComment] }
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
            // Always treat comments as array
            const previousComments = Array.isArray(previous.comments)
                ? previous.comments
                : Array.isArray(baseArticle?.comments)
                    ? baseArticle.comments
                    : [];
            const previousCount = Number(previous.commentCount ?? baseArticle?.commentCount ?? 0);
            let updatedComments;
            if (parentId) {
                updatedComments = previousComments.map((c) =>
                    c.id === parentId
                        ? { ...c, replies: Array.isArray(c.replies) ? [...c.replies, newComment] : [newComment] }
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

    useEffect(() => {
        if (!selectedArticle?.id) return;
        const refreshed = preparedArticles.find((article) => article.id === selectedArticle.id);
        if (refreshed) {
            setSelectedArticle((previous) => ({ ...previous, ...refreshed }));
        }
    }, [preparedArticles, selectedArticle?.id]);

    useEffect(() => {
        if (!modalOpen || !selectedArticle?.id) return;
        void recordView(selectedArticle.id);
    }, [modalOpen, selectedArticle?.id]);

    const handleNextArticle = selectedArticleIndex >= 0 && selectedArticleIndex < preparedArticles.length - 1
        ? () => setSelectedArticle(preparedArticles[selectedArticleIndex + 1])
        : undefined;

    const handlePreviousArticle = selectedArticleIndex > 0
        ? () => setSelectedArticle(preparedArticles[selectedArticleIndex - 1])
        : undefined;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <StudentLayout>
                <Box
                    sx={{
                        minHeight: '100vh',
                        bgcolor: colors.background,
                        fontFamily: '"Times New Roman", Times, serif',
                        pb: { xs: 8, md: 0 },
                    }}
                >
                    <Container maxWidth="xl" className="fyi-page-shell" sx={{ py: 4 }}>
                        {/* Date Header */}
                        <DateHeader date={currentDate} />

                        {/* Main Navigation - TopNav */}
                        <DashboardTopNav
                            categories={localCategories}
                            activeView={activeNav}
                            onViewChange={setActiveNav}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                            search={search}
                            onSearchChange={setSearch}
                            mode={mode}
                            onToggleMode={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                            userName={auth?.user?.name}
                            userId={auth?.user?.id}
                            userEmail={auth?.user?.email}
                            onOpenMobileWidgets={() => setMobileWidgetsOpen(true)}
                            onReloadArticles={handleReloadArticles}
                        />

                        {/* Main Content Grid */}
                        <Fade in timeout={600}>
                            <Box sx={{ mt: 4 }} className="fyi-fade-up">
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gap: 4,
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            md: 'minmax(0, 2fr) minmax(0, 1fr)',
                                        },
                                    }}
                                >
                                    {/* Main Feed - Left Column */}
                                    <Box>
                                        <FeedSection
                                            activeNav={activeNav}
                                            filteredArticles={filteredArticles}
                                            search={search}
                                            sortBy={sortBy}
                                            onSortChange={setSortBy}
                                            bookmarkedIds={bookmarkedIds}
                                            onToggleBookmark={toggleBookmark}
                                            onOpenArticle={handleOpenArticle}
                                        />
                                    </Box>

                                    {/* Sidebar - Right Column */}
                                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                        <RightWidgets
                                            trendingItems={trendingItems}
                                            continueReading={continueReading}
                                            onArticleClick={handleOpenArticle}
                                            stats={stats}
                                            showWeather={true}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>

                        {/* Newspaper colophon */}
                        <Box
                            sx={{
                                mt: 6,
                                pt: 2,
                                borderTop: `2px solid ${colors.border}`,
                                fontFamily: '"Courier New", monospace',
                                fontSize: '0.7rem',
                                textAlign: 'center',
                                color: colors.textSecondary,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                                divider={<Divider orientation="vertical" flexItem sx={{ borderColor: colors.border }} />}
                                sx={{ flexWrap: 'wrap', gap: 1 }}
                            >
                                <span>PUBLISHED DAILY BY THE STUDENTS OF FYI</span>
                                <span>EST. 2024</span>
                                <span>MEMBER OF THE STUDENT PRESS ASSOCIATION</span>
                            </Stack>
                        </Box>
                    </Container>

                    {/* Mobile Navigation */}
                    {isMobile && <MobileBottomNav activeNav={activeNav} onSelect={setActiveNav} />}

                    {/* Mobile Widgets Drawer */}
                    <MobileWidgetsDrawer
                        open={mobileWidgetsOpen}
                        onClose={() => setMobileWidgetsOpen(false)}
                        trendingItems={trendingItems}
                    />

                    {/* Article Modal */}
                    <ArticleView
                        article={selectedArticle}
                        open={modalOpen}
                        onClose={handleCloseModal}
                        onToggleStar={handleToggleStar}
                        isStarred={Boolean(selectedArticle?.isStarred)}
                        starCount={Number(selectedArticle?.starCount || 0)}
                        isTogglingStar={isTogglingStar}
                        mode={mode}
                        onNext={handleNextArticle}
                        onPrevious={handlePreviousArticle}
                        onSubmitComment={handleSubmitComment}
                        isSubmittingComment={isSubmittingComment}
                        commentError={commentError}
                        currentUserName={auth?.user?.name || 'You'}
                    />
                </Box>
            </StudentLayout>
        </ThemeProvider>
    );
}
