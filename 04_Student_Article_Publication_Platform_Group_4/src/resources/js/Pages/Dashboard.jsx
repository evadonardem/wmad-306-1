import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Dashboard({ role, stats, recentArticles }) {
    const safeStats = stats || {};
    const safeArticles = recentArticles || [];
    const { auth } = usePage().props;
    const user = auth.user;
    const hasPendingWriterApplication = Boolean(user?.writer_application_submitted_at);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const displayedStats = Object.entries(safeStats).filter(([label]) => {
        if (role !== 'student') {
            return true;
        }

        return ['publishedArticles', 'myComments'].includes(label);
    });

    const commentForm = useForm({
        content: '',
    });
    const writerApplicationForm = useForm({
        reason: '',
    });

    const roleTheme = {
        admin: {
            label: 'Admin Command Center',
            chip: 'bg-rose-500/10 text-rose-200 border-rose-400/40',
            box: 'from-rose-500 via-red-500 to-orange-400',
            accent: 'text-rose-200',
            statCard: 'border-rose-400/30 bg-rose-500/10',
        },
        writer: {
            label: 'Writer Studio',
            chip: 'bg-amber-500/10 text-amber-200 border-amber-400/40',
            box: 'from-amber-500 via-yellow-500 to-amber-300',
            accent: 'text-amber-200',
            statCard: 'border-amber-400/30 bg-amber-500/10',
        },
        student: {
            label: 'Student Reader Hub',
            chip: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/40',
            box: 'from-emerald-500 via-cyan-500 to-sky-400',
            accent: 'text-emerald-200',
            statCard: 'border-emerald-400/30 bg-emerald-500/10',
        },
    };

    const theme = roleTheme[role] || roleTheme.student;
    const roleCopy = {
        admin: {
            headline: 'Keep quality high and access secure',
            subtext: 'Review submissions, approve writers, and manage roles from one place.',
        },
        writer: {
            headline: 'Publish sharper stories, faster',
            subtext: 'Track article status and keep your content pipeline active.',
        },
        student: {
            headline: 'Discover trusted articles and join discussions',
            subtext: 'Browse approved posts and leave meaningful comments.',
        },
    };
    const copy = roleCopy[role] || roleCopy.student;

    const formatStatLabel = (label) =>
        label
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (char) => char.toUpperCase())
            .trim();

    const functionalTips = useMemo(() => {
        if (role === 'admin') {
            return [
                'Review pending writers daily to keep submissions flowing.',
                'Approve or reject pending articles based on quality guidelines.',
                'Manage user accounts and remove inactive users when needed.',
            ];
        }

        if (role === 'writer') {
            return [
                'Draft articles with clear headings and practical examples.',
                'Track pending submissions and revise rejected pieces quickly.',
                'Reply to comments to build engagement with readers.',
            ];
        }

        return [
            'Open article previews and explore different categories.',
            'Leave useful comments to discuss ideas with writers.',
            'Follow author names to discover more related posts.',
        ];
    }, [role]);

    const openArticle = (article) => {
        setSelectedArticle(article);
        commentForm.reset('content');
    };

    const submitComment = (e) => {
        e.preventDefault();

        if (!selectedArticle) {
            return;
        }

        commentForm.post(route('articles.comments.store', selectedArticle.id), {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset('content');
            },
        });
    };

    const submitWriterApplication = (e) => {
        e.preventDefault();

        writerApplicationForm.post(route('dashboard.request-writer-access'));
    };

    const deleteComment = (commentId) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        router.delete(route('comments.destroy', commentId), {
            preserveScroll: true,
        });
    };

    const deleteArticle = (articleId) => {
        if (!window.confirm('Delete this article? This cannot be undone.')) {
            return;
        }

        router.delete(route('articles.destroy', articleId), {
            preserveScroll: true,
            onSuccess: () => setSelectedArticle(null),
        });
    };

    const stripHtml = (html) =>
        html
            ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            : '';

    const articlePreview = (content) => {
        const safeContent = stripHtml(content);
        if (!safeContent) {
            return 'No preview available.';
        }

        return safeContent.length > 180 ? `${safeContent.slice(0, 180)}...` : safeContent;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-100">{theme.label}</h2>}
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-transparent py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-slate-950/40">
                        <div className={`bg-gradient-to-r ${theme.box} px-6 py-6 text-white`}>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.15em] text-white/80">Campus Quill</p>
                                    <h3 className="mt-1 text-2xl font-black">{theme.label}</h3>
                                    <p className="mt-2 text-sm text-white/90">{copy.headline}</p>
                                    <p className="mt-1 text-xs text-white/80">{copy.subtext}</p>
                                </div>
                                <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${theme.chip}`}>
                                    Logged in as: {auth.user?.name}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5">
                            {displayedStats.map(([label, value]) => (
                                <div key={label} className={`rounded-xl border p-4 ${theme.statCard}`}>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">{formatStatLabel(label)}</p>
                                    <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-100">Recent Articles</h3>
                                <div className="flex items-center gap-3">
                                    {(role === 'writer' || role === 'admin') && (
                                        <Link
                                            href={route('articles.create')}
                                            className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-110"
                                        >
                                            Create Article
                                        </Link>
                                    )}
                                    {role === 'admin' && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            className="rounded-md border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 shadow-sm transition hover:border-rose-300"
                                        >
                                            Open Admin Panel
                                        </Link>
                                    )}
                                    <Link href={route('articles.index')} className="text-sm font-semibold text-cyan-300">
                                        View all
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {safeArticles.length === 0 && <p className="text-slate-400">No articles yet.</p>}
                                {safeArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-900/20"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-slate-100">{article.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-200">
                                                    {article.category || 'General'}
                                                </span>
                                                {role !== 'student' && (
                                                    <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">
                                                        {article.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 px-3 py-1 text-xs text-slate-200">
                                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-200">
                                                    {(article.user?.name || 'U').charAt(0).toUpperCase()}
                                                </span>
                                                <span>Author: {article.user?.name || 'Unknown author'}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => openArticle(article)}
                                                className="text-sm font-semibold text-cyan-300"
                                            >
                                                View
                                            </button>
                                        </div>
                                        <p className="mt-3 text-sm text-slate-300">
                                            {articlePreview(article.content)}
                                        </p>
                                        {(role === 'admin' || article.user_id === user?.id) && (
                                            <div className="mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteArticle(article.id)}
                                                    className="text-xs font-semibold text-rose-300"
                                                >
                                                    Delete Article
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
                            {role === 'student' ? (
                                <>
                                    <h3 className={`text-lg font-semibold ${theme.accent}`}>Recent Published Articles</h3>
                                    <ul className="mt-3 space-y-3 text-sm text-slate-300">
                                        {safeArticles.length === 0 && (
                                            <li className="rounded-md border border-slate-800/80 bg-slate-900/60 p-3">
                                                No published articles yet.
                                            </li>
                                        )}
                                        {safeArticles.map((article) => (
                                            <li key={article.id} className="rounded-md border border-slate-800/80 bg-slate-900/60 p-3">
                                                <p className="font-semibold text-slate-100">{article.title}</p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    By {article.user?.name || 'Unknown author'}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-300">
                                                    {articlePreview(article.content)}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4">
                                        <h4 className="text-sm font-semibold text-emerald-200">Want to become a writer?</h4>
                                        <p className="mt-1 text-xs text-emerald-100/80">
                                            {hasPendingWriterApplication
                                                ? 'Your application is pending admin approval. You can continue using your student account.'
                                                : 'Submit your reason below. Admin approval is required before you can publish.'}
                                        </p>
                                        <form onSubmit={submitWriterApplication} className="mt-3 space-y-2">
                                            <textarea
                                                value={writerApplicationForm.data.reason}
                                                onChange={(e) => writerApplicationForm.setData('reason', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-md border border-emerald-400/60 bg-slate-950/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-300 focus:ring-emerald-300"
                                                placeholder="Why do you want to be a writer?"
                                                disabled={hasPendingWriterApplication}
                                            />
                                            {writerApplicationForm.errors.reason && (
                                                <p className="text-xs text-rose-300">{writerApplicationForm.errors.reason}</p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={writerApplicationForm.processing || hasPendingWriterApplication}
                                                className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
                                            >
                                                {hasPendingWriterApplication
                                                    ? 'Application Pending'
                                                    : writerApplicationForm.processing
                                                      ? 'Submitting...'
                                                      : 'Apply as Writer'}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className={`text-lg font-semibold ${theme.accent}`}>What You Can Do</h3>
                                    <ul className="mt-3 space-y-3 text-sm text-slate-300">
                                        {functionalTips.map((tip) => (
                                            <li key={tip} className="rounded-md border border-slate-800/80 bg-slate-900/60 p-3">
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Modal show={!!selectedArticle} maxWidth="4xl" onClose={() => setSelectedArticle(null)}>
                {selectedArticle && (
                    <div className="p-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            <section className="lg:col-span-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100">{selectedArticle.title}</h3>
                                        <p className="text-sm text-slate-400">
                                            Author: {selectedArticle.user?.name || 'Unknown author'}
                                        </p>
                                    </div>
                                    <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">
                                        {selectedArticle.status}
                                    </span>
                                </div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                    Category: {selectedArticle.category || 'General'}
                                </p>
                                {(role === 'admin' || selectedArticle.user_id === user?.id) && (
                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            onClick={() => deleteArticle(selectedArticle.id)}
                                            className="rounded bg-rose-500 px-3 py-1 text-xs font-semibold text-white"
                                        >
                                            Delete Article
                                        </button>
                                    </div>
                                )}

                                <article
                                    className="max-h-[55vh] overflow-y-auto text-sm leading-7 text-slate-200"
                                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                                />
                            </section>

                            <aside className="border-t border-slate-800 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                <h4 className="text-sm font-semibold text-slate-100">
                                    Comments ({selectedArticle.comments?.length || 0})
                                </h4>
                                <form onSubmit={submitComment} className="mt-4 space-y-2">
                                    <textarea
                                        value={commentForm.data.content}
                                        onChange={(e) => commentForm.setData('content', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-md border border-slate-700 bg-slate-950/70 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-cyan-300"
                                        placeholder="Write a comment..."
                                    />
                                    {commentForm.errors.content && (
                                        <p className="text-xs text-rose-300">{commentForm.errors.content}</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={commentForm.processing}
                                        className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
                                    >
                                        {commentForm.processing ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>

                                <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                                    {(selectedArticle.comments || []).length === 0 && (
                                        <p className="text-sm text-slate-400">No comments yet.</p>
                                    )}
                                    {(selectedArticle.comments || []).map((comment) => (
                                        <div key={comment.id} className="rounded-md border border-slate-800/80 bg-slate-900/50 p-3 text-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-100">{comment.user?.name || 'User'}</p>
                                                    <p className="mt-1 text-slate-300">{comment.content}</p>
                                                </div>
                                                {(role === 'admin' ||
                                                    comment.user_id === user?.id ||
                                                    (role === 'writer' && selectedArticle.user_id === user?.id)) && (
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
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
