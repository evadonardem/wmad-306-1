import { Link } from '@inertiajs/react';

export default function SubmittedList({ articles = [] }) {
    const submitted = articles.filter((article) => article.submitted_at);

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
                                Submitted: {article.submitted_at ? new Date(article.submitted_at).toLocaleString() : 'N/A'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
