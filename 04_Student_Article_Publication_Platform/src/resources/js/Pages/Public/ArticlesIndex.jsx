import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
import AuthModal from '@/Components/AuthModal';

export default function ArticlesIndex({
    articles = [],
    auth = {},
    filters = {},
    categories = [],
    years = [],
    visibilityScope = 'public_only',
    backUrl = '/',
    backLabel = 'BACK TO HOME',
}) {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('register');
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [commentDrafts, setCommentDrafts] = useState({});
    const [showRegisterPrompt, setShowRegisterPrompt] = useState({});
    const [commentErrors, setCommentErrors] = useState({});
    const [search, setSearch] = useState(filters.search ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'date_newest');
    const [category, setCategory] = useState(filters.category ?? '');
    const [year, setYear] = useState(filters.year ?? '');
    const [visibility, setVisibility] = useState(filters.visibility ?? (visibilityScope === 'published_all' ? 'all' : 'public'));
    const yearChoices = Array.isArray(years) && years.length > 0
        ? years
        : Array.from(
            new Set(
                (Array.isArray(articles) ? articles : [])
                    .map((article) => article?.published_at ? new Date(article.published_at).getFullYear() : null)
                    .filter((value) => Number.isInteger(value))
            )
        ).sort((a, b) => b - a);

    const commentForm = useForm({
        body: '',
        parent_id: null,
    });

    const {
        theme: currentTheme,
        setTheme: setCurrentTheme,
        colors: themeColors,
        availableThemes: themes,
    } = useTheme();

    const colors = {
        newsprint: themeColors.text,
        paper: themeColors.background,
        aged: themeColors.surface,
        ink: themeColors.text,
        accent: themeColors.accent,
        byline: themeColors.textSecondary,
        border: themeColors.border,
    };

    const handleCommentInput = (articleId, value) => {
        setCommentDrafts((prev) => ({ ...prev, [articleId]: value }));
        setCommentErrors((prev) => ({ ...prev, [articleId]: null }));
    };

    const promptRegisterToComment = (articleId) => {
        if (auth.user) return;
        setShowRegisterPrompt((prev) => ({ ...prev, [articleId]: true }));
        setAuthMode('register');
        setShowAuth(true);
    };

    const handleCommentSubmit = (articleId) => {
        if (!auth.user) {
            promptRegisterToComment(articleId);
            return;
        }

        const body = (commentDrafts[articleId] ?? '').trim();
        if (!body) {
            setCommentErrors((prev) => ({ ...prev, [articleId]: 'Please enter a comment.' }));
            return;
        }

        commentForm
            .transform(() => ({ body, parent_id: null }))
            .post(`/articles/${articleId}/comments`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCommentDrafts((prev) => ({ ...prev, [articleId]: '' }));
                    setCommentErrors((prev) => ({ ...prev, [articleId]: null }));
                },
                onError: (errors) => {
                    setCommentErrors((prev) => ({
                        ...prev,
                        [articleId]: errors?.body ?? 'Unable to post comment right now.',
                    }));
                },
            });
    };

    const applyFilters = (next = {}) => {
        const payload = {
            search,
            sort,
            category,
            year,
            visibility,
            ...next,
        };

        router.get(route('public.articles.index'), payload, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Articles" />

            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: colors.accent, color: colors.paper }}
                >
                    Theme
                </motion.button>

                <AnimatePresence>
                    {showThemePicker && (
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.9 }}
                            className="absolute bottom-14 right-0 p-3 rounded-lg shadow-xl min-w-[200px]"
                            style={{ backgroundColor: colors.paper, border: `1px solid ${colors.border}` }}
                        >
                            <div className="font-serif text-sm font-bold mb-2" style={{ color: colors.newsprint }}>Newspaper Themes</div>
                            <div className="space-y-1">
                                {Object.entries(themes).map(([key, themeMeta]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            setCurrentTheme(key);
                                            setShowThemePicker(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-2 py-2 rounded text-left"
                                        style={{
                                            backgroundColor: currentTheme === key ? `${colors.accent}22` : 'transparent',
                                            color: colors.newsprint,
                                        }}
                                    >
                                        <span>{themeMeta.icon}</span>
                                        <span className="font-serif text-sm">{themeMeta.name}</span>
                                        {currentTheme === key && <span className="ml-auto">OK</span>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <main className="min-h-screen" style={{ backgroundColor: colors.paper, color: colors.newsprint }}>
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="border-b-2 pb-4 mb-8" style={{ borderColor: colors.border }}>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-mono text-xs tracking-[0.25em]" style={{ color: colors.byline }}>LATEST EDITION</p>
                                <h1 className="font-serif text-4xl font-black">
                                    {visibilityScope === 'published_all' ? 'All Published Articles' : 'All Public Articles'}
                                </h1>
                                <p className="font-serif text-sm mt-1" style={{ color: colors.byline }}>
                                    {visibilityScope === 'published_all'
                                        ? 'Viewing all published articles. Use search and title sorting to manage the list.'
                                        : 'Browsing public articles. Sign in to access the full published archive.'}
                                </p>
                            </div>
                            <Link href={backUrl} className="px-4 py-2 border-2 font-mono text-xs tracking-wider" style={{ borderColor: colors.newsprint, color: colors.newsprint }}>
                                {backLabel}
                            </Link>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_170px_170px_140px_160px_auto] items-end">
                        <label className="block">
                            <span className="font-mono text-xs tracking-wider" style={{ color: colors.byline }}>Search Title</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilters({ search: e.currentTarget.value, sort, category, year, visibility });
                                    }
                                }}
                                placeholder="Type article title..."
                                className="mt-1 w-full border rounded px-3 py-2 text-sm font-serif"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            />
                        </label>

                        <label className="block">
                            <span className="font-mono text-xs tracking-wider" style={{ color: colors.byline }}>Sort by Title</span>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    const nextSort = e.target.value;
                                    setSort(nextSort);
                                    applyFilters({ sort: nextSort });
                                }}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm font-serif"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            >
                                <option value="title_asc">A to Z</option>
                                <option value="title_desc">Z to A</option>
                                <option value="date_newest">Date (Newest)</option>
                                <option value="date_oldest">Date (Oldest)</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-mono text-xs tracking-wider" style={{ color: colors.byline }}>Filter Category</span>
                            <select
                                value={category}
                                onChange={(e) => {
                                    const nextCategory = e.target.value;
                                    setCategory(nextCategory);
                                    applyFilters({ category: nextCategory });
                                }}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm font-serif"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-mono text-xs tracking-wider" style={{ color: colors.byline }}>Filter Visibility</span>
                            <select
                                value={visibility}
                                onChange={(e) => {
                                    const nextVisibility = e.target.value;
                                    setVisibility(nextVisibility);
                                    applyFilters({ visibility: nextVisibility });
                                }}
                                disabled={visibilityScope !== 'published_all'}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm font-serif"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            >
                                <option value="all">All</option>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-mono text-xs tracking-wider" style={{ color: colors.byline }}>Filter Year</span>
                            <select
                                value={year}
                                onChange={(e) => {
                                    const nextYear = e.target.value;
                                    setYear(nextYear);
                                    applyFilters({ year: nextYear });
                                }}
                                className="mt-1 w-full border rounded px-3 py-2 text-sm font-serif"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            >
                                <option value="">All Years</option>
                                {yearChoices.map((y) => (
                                    <option key={String(y)} value={String(y)}>{String(y)}</option>
                                ))}
                            </select>
                        </label>

                        <button
                            type="button"
                            onClick={() => applyFilters()}
                            className="px-4 py-2 border-2 font-mono text-xs tracking-wider"
                            style={{ borderColor: colors.newsprint, color: colors.newsprint }}
                        >
                            APPLY
                        </button>
                    </div>

                    {articles.length === 0 && (
                        <div className="border p-6 font-serif italic" style={{ borderColor: colors.border, color: colors.byline, backgroundColor: colors.aged }}>
                            No articles found for the current filter.
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {articles.map((article) => {
                            const latestComment = Array.isArray(article.comments) ? article.comments[0] : null;

                            return (
                                <article key={article.id} className="border p-5" style={{ borderColor: colors.border, backgroundColor: colors.aged }}>
                                    <Link href={route('public.articles.show', article.id)} className="block">
                                        <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: colors.byline }}>
                                            {article.category?.name ?? 'General'}
                                        </div>
                                        <h2 className="font-serif text-2xl font-bold leading-tight mb-2" style={{ color: colors.newsprint }}>
                                            {article.title}
                                        </h2>
                                        <p className="font-serif text-sm line-clamp-3" style={{ color: colors.ink }}>
                                            {article.excerpt || article.content}
                                        </p>
                                        <div className="mt-3 font-mono text-xs" style={{ color: colors.byline }}>
                                            By {article.author?.name ?? 'Unknown'}
                                        </div>
                                    </Link>

                                    <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                                        <div className="font-serif font-bold text-sm mb-2" style={{ color: colors.newsprint }}>Comments</div>

                                        {latestComment ? (
                                            <div className="space-y-3 mb-3">
                                                <div className="border-l-2 pl-3" style={{ borderColor: colors.border }}>
                                                    <div className="font-serif text-sm font-bold">{latestComment.user?.name ?? 'Anonymous'}</div>
                                                    <div className="font-serif text-sm" style={{ color: colors.ink }}>{latestComment.body}</div>
                                                    <div className="font-mono text-xs" style={{ color: colors.byline }}>
                                                        {latestComment.created_at
                                                            ? new Date(latestComment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                            : 'Just now'}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="font-serif text-sm italic mb-3" style={{ color: colors.byline }}>No comments yet.</div>
                                        )}

                                        <div className="mt-2 mb-2">
                                            <a href={article.id ? `/articles/${article.id}#comments` : '/articles'} className="font-mono text-xs underline" style={{ color: colors.byline }}>
                                                View more comments
                                            </a>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded px-3 py-2 text-sm font-serif"
                                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                                placeholder="Add a comment..."
                                                value={commentDrafts[article.id] || ''}
                                                onChange={(e) => handleCommentInput(article.id, e.target.value)}
                                                onFocus={() => promptRegisterToComment(article.id)}
                                                onClick={() => promptRegisterToComment(article.id)}
                                                readOnly={!auth.user}
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded font-serif text-sm"
                                                style={{ backgroundColor: colors.newsprint, color: colors.paper }}
                                                onClick={() => handleCommentSubmit(article.id)}
                                                disabled={commentForm.processing}
                                            >
                                                {commentForm.processing ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>

                                        {commentErrors[article.id] && (
                                            <div className="mt-2 text-sm font-serif text-red-700">{commentErrors[article.id]}</div>
                                        )}

                                        {!auth.user && showRegisterPrompt[article.id] && (
                                            <div className="mt-2 p-2 rounded border font-serif text-sm" style={{ borderColor: '#f9a8d4', backgroundColor: '#fdf2f8', color: '#be185d' }}>
                                                Register an account to comment.
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
        </>
    );
}
