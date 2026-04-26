import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function ArticleShow({ article }) {
    const { auth } = usePage().props;
    const roles = auth.roles || [];
    const isAdmin = roles.includes('admin');
    const isWriter = roles.includes('writer');

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
    });

    const submitComment = (e) => {
        e.preventDefault();
        post(route('articles.comments.store', article.id), {
            preserveScroll: true,
            onSuccess: () => reset('content'),
        });
    };

    const deleteComment = (commentId) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        router.delete(route('comments.destroy', commentId), {
            preserveScroll: true,
        });
    };

    const deleteArticle = () => {
        if (!window.confirm('Delete this article? This cannot be undone.')) {
            return;
        }

        router.delete(route('articles.destroy', article.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-100">Article Details</h2>}>
            <Head title={article.title} />
            <div className="py-10">
                <div className="mx-auto max-w-6xl rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <section className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-slate-100">{article.title}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">
                                        {article.status}
                                    </span>
                                    {(isAdmin || article.user_id === auth.user?.id) && (
                                        <button
                                            type="button"
                                            onClick={deleteArticle}
                                            className="rounded bg-rose-500 px-3 py-1 text-xs font-semibold text-white"
                                        >
                                            Delete Article
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 px-3 py-1 text-sm text-slate-200">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-200">
                                    {(article.user?.name || 'U').charAt(0).toUpperCase()}
                                </span>
                                <span>Author: {article.user?.name || 'Unknown author'}</span>
                            </div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                Category: {article.category || 'General'}
                            </p>

                            <article
                                className="leading-7 text-slate-100"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Comment
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10 px-3 py-1 text-sm font-semibold text-fuchsia-200 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-500/20"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h9a2 2 0 002-2v-6a2 2 0 00-2-2h-3l.6-2.4.1-.6a1.6 1.6 0 00-1.6-1.6 2 2 0 00-1.8 1.2l-2.6 5.2H5a2 2 0 00-2 2v5a2 2 0 002 2h2z" />
                                    </svg>
                                    Like
                                </button>
                            </div>
                        </section>

                        <aside className="border-t border-slate-800 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                            <h3 className="text-lg font-semibold text-slate-100">Comments ({article.comments?.length || 0})</h3>
                            <form onSubmit={submitComment} className="mt-4 space-y-2">
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-slate-700 bg-slate-950/70 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-cyan-300"
                                    placeholder="Write a comment..."
                                />
                                {errors.content && <p className="text-xs text-rose-300">{errors.content}</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
                                >
                                    {processing ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>

                            <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                                {(article.comments || []).length === 0 && <p className="text-sm text-slate-400">No comments yet.</p>}
                                {(article.comments || []).map((comment) => (
                                    <div key={comment.id} className="rounded-md border border-slate-800/80 bg-slate-900/60 p-3 text-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-100">{comment.user?.name || 'User'}</p>
                                                <p className="mt-1 text-slate-300">{comment.content}</p>
                                            </div>
                                            {(isAdmin ||
                                                comment.user_id === auth.user?.id ||
                                                (isWriter && article.user_id === auth.user?.id)) && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="text-xs font-medium text-rose-300"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
