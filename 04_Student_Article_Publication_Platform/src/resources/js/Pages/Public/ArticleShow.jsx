import { Head, Link } from '@inertiajs/react';

export default function ArticleShow({ article }) {
    return (
        <>
            <Head title={article?.title ?? 'Article'} />

            <main className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto max-w-4xl px-6 py-12">
                    <Link href={route('public.articles.index')} className="text-sm text-pink-300 hover:text-pink-200">
                        View All Articles
                    </Link>

                    <article className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
                        <p className="text-xs text-slate-400">{article?.category?.name ?? 'General'}</p>
                        <h1 className="mt-2 text-3xl font-bold">{article?.title}</h1>
                        <p className="mt-2 text-sm text-slate-300">By {article?.author?.name ?? 'Unknown'}</p>

                        <div className="mt-6 whitespace-pre-wrap text-slate-200">
                            {article?.content}
                        </div>
                    </article>
                </div>
            </main>
        </>
    );
}
