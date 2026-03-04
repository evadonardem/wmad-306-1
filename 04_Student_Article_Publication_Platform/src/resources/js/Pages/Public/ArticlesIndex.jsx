import { Head, Link } from '@inertiajs/react';

export default function ArticlesIndex({ articles = [] }) {
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
                        // Empty-state helps confirm there are currently no approved public items.
                        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-slate-300">
                            No public articles are available yet.
                        </p>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Cards link to each publicly approved article detail page. */}
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={route('public.articles.show', article.id)}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-pink-400/40"
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
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
