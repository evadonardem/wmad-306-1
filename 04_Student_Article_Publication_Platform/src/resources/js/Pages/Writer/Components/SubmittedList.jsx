import { Link } from '@inertiajs/react';

export default function SubmittedList({ articles = [] }) {
    const submitted = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug !== 'draft';
        // Fallback for legacy records with missing status relation.
        return Boolean(article.submitted_at || article.published_at);
    });

    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Submitted</h3>
                <span className="text-sm text-gray-600">{submitted.length}</span>
            </div>

            {submitted.length === 0 ? (
                <p className="text-sm text-gray-600">No submissions yet.</p>
            ) : (
                <ul className="divide-y divide-gray-100 text-sm text-gray-800">
                    {submitted.map((article) => (
                        <li key={article.id} className="py-2">
                            <div className="flex items-baseline justify-between gap-3">
                                <Link
                                    href={route('writer.articles.edit', article.id)}
                                    className="font-medium hover:underline"
                                >
                                    {article.title}
                                </Link>
                                <span className="text-xs text-gray-500">ID: {article.id}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                                Status: {article?.status?.name ?? article?.status?.slug ?? 'N/A'}
                                {article.submitted_at ? (
                                    <span> — Submitted: {new Date(article.submitted_at).toLocaleString()}</span>
                                ) : null}
                                {article.published_at ? (
                                    <span> — Published: {new Date(article.published_at).toLocaleString()}</span>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
