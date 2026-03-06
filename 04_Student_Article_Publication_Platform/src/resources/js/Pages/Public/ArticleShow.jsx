import AuthModal from '@/Components/AuthModal';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ArticleShow({ article }) {
    const { auth = {} } = usePage().props;
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('register');
    const [commentDraft, setCommentDraft] = useState('');
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [commentError, setCommentError] = useState('');

    const commentForm = useForm({
        body: '',
        parent_id: null,
    });

    const promptRegisterToComment = () => {
        if (auth.user) return;
        setShowRegisterPrompt(true);
        setAuthMode('register');
        setShowAuth(true);
    };

    const submitComment = (e) => {
        e.preventDefault();

        if (!auth.user) {
            promptRegisterToComment();
            return;
        }

        const body = commentDraft.trim();
        if (!body) {
            setCommentError('Please enter a comment.');
            return;
        }

        commentForm
            .transform(() => ({ body, parent_id: null }))
            .post(`/articles/${article.id}/comments`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCommentDraft('');
                    setCommentError('');
                },
                onError: (errors) => {
                    setCommentError(errors?.body ?? 'Unable to post comment right now.');
                },
            });
    };

    return (
        <>
            <Head title={article?.title ?? 'Article'} />

            <main className="min-h-screen" style={{ backgroundColor: colors.paper, color: colors.newsprint }}>
                <div className="mx-auto max-w-4xl px-6 py-12">
                    <Link href={route('public.articles.index')} className="font-mono text-xs underline" style={{ color: colors.byline }}>
                        View All Articles
                    </Link>

                    <article className="mt-6 rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.aged }}>
                        <p className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                            {article?.category?.name ?? 'General'}
                        </p>
                        <h1 className="mt-2 font-serif text-4xl font-black" style={{ color: colors.newsprint }}>
                            {article?.title}
                        </h1>
                        <p className="mt-2 text-sm font-serif" style={{ color: colors.byline }}>
                            By {article?.author?.name ?? 'Unknown'}
                        </p>

                        <div className="mt-6 whitespace-pre-wrap font-serif" style={{ color: colors.ink }}>
                            {article?.content}
                        </div>
                    </article>

                    <section id="comments" className="mt-8 rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.paper }}>
                        <h2 className="font-serif text-2xl font-bold" style={{ color: colors.newsprint }}>Comments</h2>

                        <form className="mt-4" onSubmit={submitComment}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2 text-sm font-serif"
                                    style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    placeholder="Leave a comment..."
                                    value={commentDraft}
                                    onChange={(e) => {
                                        setCommentDraft(e.target.value);
                                        setCommentError('');
                                    }}
                                    onFocus={promptRegisterToComment}
                                    onClick={promptRegisterToComment}
                                    readOnly={!auth.user}
                                />
                                <button
                                    type="submit"
                                    disabled={commentForm.processing}
                                    className="rounded px-4 py-2 text-sm font-serif"
                                    style={{ backgroundColor: colors.newsprint, color: colors.paper }}
                                >
                                    {commentForm.processing ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                            {commentError && <div className="mt-2 text-sm text-red-700">{commentError}</div>}
                            {!auth.user && showRegisterPrompt && (
                                <div className="mt-2 p-2 rounded border font-serif text-sm" style={{ borderColor: '#f9a8d4', backgroundColor: '#fdf2f8', color: '#be185d' }}>
                                    Register an account to comment.
                                </div>
                            )}
                        </form>

                        <div className="mt-6 space-y-4">
                            {Array.isArray(article?.comments) && article.comments.length > 0 ? (
                                article.comments.map((comment) => (
                                    <div key={comment.id} className="border-l-2 pl-3" style={{ borderColor: colors.border }}>
                                        <div className="font-serif text-sm font-bold" style={{ color: colors.newsprint }}>
                                            {comment.user?.name ?? 'Anonymous'}
                                        </div>
                                        <div className="font-serif text-sm mt-1" style={{ color: colors.ink }}>
                                            {comment.body}
                                        </div>
                                        <div className="font-mono text-xs mt-1" style={{ color: colors.byline }}>
                                            {comment.created_at
                                                ? new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : 'Just now'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="font-serif text-sm italic" style={{ color: colors.byline }}>
                                    No comments yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
        </>
    );
}
