import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useThemeContext } from '@/Components/ThemeContext';
import AuthModal from '@/Components/AuthModal';
import { Avatar, TextField, Button } from '@mui/material';

export default function ArticlesIndex({ articles = [], auth = {} }) {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('register');
    const [commentDrafts, setCommentDrafts] = useState({});
    const [showRegisterPrompt, setShowRegisterPrompt] = useState({});

    const handleCommentInput = (articleId, value) => {
        setCommentDrafts((prev) => ({ ...prev, [articleId]: value }));
    };

    const handleCommentSubmit = (articleId) => {
        if (!auth.user) {
            setShowRegisterPrompt((prev) => ({ ...prev, [articleId]: true }));
            setAuthMode('register');
            setShowAuth(true);
            return;
        }
        // Authenticated comment logic would go here
    };

    // Minimal color palette for consistency
    const { theme: currentTheme } = useThemeContext();
    const themes = {
        classic: {
            newsprint: '#1a1a1a', paper: '#f8f8f8', accent: '#4a4a4a', byline: '#666666', border: '#d4d4d4',
        },
        vintage: {
            newsprint: '#5c4b3c', paper: '#f4ecd8', accent: '#8b7a66', byline: '#7f6e5a', border: '#cbb99f',
        },
        modern: {
            newsprint: '#0a0a0a', paper: '#ffffff', accent: '#757575', byline: '#9e9e9e', border: '#e0e0e0',
        },
        financial: {
            newsprint: '#2c2c2c', paper: '#fff1e0', accent: '#ff8c69', byline: '#ff6b4a', border: '#ffb399',
        },
        broadsheet: {
            newsprint: '#1e2b3c', paper: '#f0f4fa', accent: '#3498db', byline: '#5d7a9a', border: '#bdd8f0',
        },
        berliner: {
            newsprint: '#2d1f24', paper: '#f5ece9', accent: '#9e4a5c', byline: '#b28b95', border: '#ddc5c0',
        },
        guardian: {
            newsprint: '#1f3a3a', paper: '#f0f7f0', accent: '#2e8b57', byline: '#4f7a4f', border: '#b8d9b8',
        },
        sunset: {
            newsprint: '#3a2618', paper: '#fff1e6', accent: '#ff9966', byline: '#cc8866', border: '#ffccbb',
        },
    };
    const colors = themes[currentTheme] || themes.classic;

    const renderCommentsSection = (article) => {
        const articleId = article.id;
        return (
            <div className="mt-4 mb-2">
                <div className="rounded-lg border border-gray-200 bg-white/80 p-3" style={{ color: colors.newsprint, background: colors.paper }}>
                    <div className="font-serif font-bold text-base mb-2" style={{ color: colors.newsprint }}>Comments</div>
                    {Array.isArray(article.comments) && article.comments.length > 0 ? (
                        <div className="space-y-2 mb-2">
                            {article.comments.map((c) => (
                                <div key={c.id} className="flex items-start gap-2">
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: colors.accent }}>{c.author?.charAt(0) || 'U'}</Avatar>
                                    <div>
                                        <div className="font-serif font-semibold text-xs" style={{ color: colors.newsprint }}>{c.author || 'Anonymous'}</div>
                                        <div className="text-xs" style={{ color: colors.byline }}>{c.created_at ? new Date(c.created_at).toLocaleString() : 'just now'}</div>
                                        <div className="font-serif text-xs mt-1" style={{ color: colors.newsprint }}>{c.body}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs italic mb-2" style={{ color: colors.byline }}>No comments yet.</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Add a comment..."
                            value={commentDrafts[articleId] || ''}
                            onChange={e => handleCommentInput(articleId, e.target.value)}
                            disabled={!!auth.user === false}
                            sx={{
                                fontFamily: 'Georgia, Times, "Times New Roman", serif',
                                background: colors.paper,
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    fontFamily: 'Georgia, Times, "Times New Roman", serif',
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: colors.newsprint,
                                color: colors.paper,
                                borderRadius: 1,
                                fontFamily: 'Georgia, Times, "Times New Roman", serif',
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: colors.accent, color: colors.paper },
                            }}
                            onClick={() => handleCommentSubmit(articleId)}
                        >
                            Post
                        </Button>
                    </div>
                    {!auth.user && showRegisterPrompt[articleId] && (
                        <div className="mt-2 p-2 rounded bg-pink-50 border border-pink-200 text-pink-800 font-serif text-xs flex items-center gap-2">
                            <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                            <span>Register an account to comment.</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Public Articles" />
            <main className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Public Articles</h1>
                        <Link href="/" className="text-sm text-pink-300 hover:text-pink-200">
                            Back to Home
                        </Link>
                    </div>
                    {articles.length === 0 && (
                        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-slate-300">
                            No public articles are available yet.
                        </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                        {articles.map((article) => (
                            <div key={article.id} className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-pink-400/40">
                                <Link
                                    href={route('public.articles.show', article.id)}
                                    className="block hover:underline"
                                >
                                    <p className="text-xs text-slate-400">
                                        {article.category?.name ?? 'General'}
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold">{article.title}</h2>
                                    <p className="mt-2 text-sm text-slate-300 line-clamp-3">
                                        {article.content}
                                    </p>
                                    <p className="mt-3 text-xs text-slate-400">
                                        By {article.author?.name ?? 'Unknown'}
                                    </p>
                                </Link>
                                {renderCommentsSection(article)}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />
        </>
    );
}
