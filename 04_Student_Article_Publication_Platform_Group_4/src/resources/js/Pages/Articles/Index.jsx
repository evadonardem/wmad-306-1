import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ArticleIndex({ articles, categories = [], filters = {} }) {
    const { auth } = usePage().props;
    const permissions = auth.permissions || [];
    const user = auth.user;
    const roles = auth.roles || [];
    const isAdmin = roles.includes('admin');
    const isWriter = roles.includes('writer');
    const canCreate = isAdmin || (permissions.includes('article.create') && user?.is_approved);
    const selectedCategory = filters.category || 'all';
    const selectedSort = filters.sort || 'newest';

    const [selectedArticle, setSelectedArticle] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
    });

    const openArticle = (article) => {
        setSelectedArticle(article);
        reset('content');
    };

    const submitComment = (e) => {
        e.preventDefault();

        if (!selectedArticle) {
            return;
        }

        post(route('articles.comments.store', selectedArticle.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
                router.reload({ only: ['articles'] });
            },
        });
    };

    const deleteComment = (commentId) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        router.delete(route('comments.destroy', commentId), {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['articles'] }),
        });
    };

    const deleteArticle = (articleId) => {
        if (!window.confirm('Delete this article? This cannot be undone.')) {
            return;
        }

        router.delete(route('articles.destroy', articleId), {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['articles'] }),
        });
    };

    const applyFilter = (nextCategory, nextSort) => {
        router.get(
            route('articles.index'),
            {
                category: nextCategory,
                sort: nextSort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-100">Articles</h2>}>
            <Head title="Articles" />
            <div className="py-10">
                <div className="mx-auto max-w-6xl space-y-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => applyFilter(e.target.value, selectedSort)}
                                    className="mt-1 block rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-200 shadow-sm focus:border-cyan-300 focus:ring-cyan-300"
                                >
                                    <option value="all">All categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Sort
                                </label>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => applyFilter(selectedCategory, e.target.value)}
                                    className="mt-1 block rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-200 shadow-sm focus:border-cyan-300 focus:ring-cyan-300"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="title_asc">Title A-Z</option>
                                    <option value="title_desc">Title Z-A</option>
                                    <option value="category_asc">Category A-Z</option>
                                    <option value="category_desc">Category Z-A</option>
                                </select>
                            </div>
                        </div>
                        {canCreate && (
                            <Link
                                href={route('articles.create')}
                                className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5 hover:brightness-110"
                            >
                                New Article
                            </Link>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-slate-950/40">
                        <div className="divide-y divide-slate-800/80">
                            {articles.data.length === 0 && <p className="p-6 text-slate-400">No articles found.</p>}
                            {articles.data.map((article) => (
                                <div key={article.id} className="p-6 transition hover:-translate-y-0.5 hover:bg-slate-900/80">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-100">{article.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-200">
                                                {article.category || 'General'}
                                            </span>
                                            <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">
                                                {article.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-700/80 px-3 py-1 text-xs text-slate-200">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 font-bold text-cyan-200">
                                            {(article.user?.name || 'U').charAt(0).toUpperCase()}
                                        </span>
                                        <span>Author: {article.user?.name || 'Unknown author'}</span>
                                    </div>
                                    <div
                                        className="mt-3 max-h-20 overflow-hidden text-sm text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => openArticle(article)}
                                            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                            Comments
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10 px-3 py-1 text-sm font-semibold text-fuchsia-200 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-500/20"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7 20h9a2 2 0 002-2v-6a2 2 0 00-2-2h-3l.6-2.4.1-.6a1.6 1.6 0 00-1.6-1.6 2 2 0 00-1.8 1.2l-2.6 5.2H5a2 2 0 00-2 2v5a2 2 0 002 2h2z"
                                                />
                                            </svg>
                                            Like
                                        </button>
                                        {(isAdmin || article.user_id === user.id) && (
                                            <Link
                                                href={route('articles.edit', article.id)}
                                                className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-200 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/20"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.2 5.2l3.6 3.6M4 20l4.7-1.1 9.7-9.7-3.6-3.6-9.7 9.7L4 20z"
                                                    />
                                                </svg>
                                                Edit
                                            </Link>
                                        )}
                                        {(isAdmin || article.user_id === user.id) && (
                                            <button
                                                type="button"
                                                onClick={() => deleteArticle(article.id)}
                                                className="inline-flex items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-200 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-500/20"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 7h12M9 7V5h6v2m-7 3v7m4-7v7m4-7v7M7 7l1 12h8l1-12"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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

                                <article
                                    className="max-h-[55vh] overflow-y-auto text-sm leading-7 text-slate-100"
                                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                                />
                            </section>

                            <aside className="border-t border-slate-800 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                <h4 className="text-sm font-semibold text-slate-100">
                                    Comments ({selectedArticle.comments?.length || 0})
                                </h4>
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

                                <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                                    {(selectedArticle.comments || []).length === 0 && (
                                        <p className="text-sm text-slate-400">No comments yet.</p>
                                    )}
                                    {(selectedArticle.comments || []).map((comment) => (
                                        <div key={comment.id} className="rounded-md border border-slate-800/80 bg-slate-900/60 p-3 text-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-100">{comment.user?.name || 'User'}</p>
                                                    <p className="mt-1 text-slate-300">{comment.content}</p>
                                                </div>
                                                {(isAdmin ||
                                                    comment.user_id === user?.id ||
                                                    (isWriter && selectedArticle.user_id === user?.id)) && (
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
