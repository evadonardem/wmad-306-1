import { Link } from '@inertiajs/react';

export default function DraftList({ articles = [] }) {
    const drafts = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug === 'draft';
        // Fallback for legacy records with missing status relation.
        return !article.submitted_at && !article.published_at;
    });

    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Drafts</h3>
                <span className="text-sm text-gray-600">{drafts.length}</span>
            </div>

            {drafts.length === 0 ? (
                <p className="text-sm text-gray-600">No drafts yet.</p>
            ) : (
                <ul className="divide-y divide-gray-100 text-sm text-gray-800">
                    {drafts.map((article) => (
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
                                Updated: {article.updated_at ? new Date(article.updated_at).toLocaleString() : 'N/A'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
