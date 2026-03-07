import { Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function SubmittedList({ articles = [] }) {
    const { colors } = useTheme();
    const submitted = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug !== 'draft';
        // Fallback for legacy records with missing status relation.
        return Boolean(article.submitted_at || article.published_at);
    });

    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                    Submitted
                </h3>
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {submitted.length}
                </span>
            </div>

            {submitted.length === 0 ? (
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No submissions yet.
                </p>
            ) : (
                <ul className="text-sm" style={{ color: colors.text }}>
                    {submitted.map((article) => (
                        <li
                            key={article.id}
                            className="py-2"
                            style={{ borderBottom: `1px solid ${colors.border}` }}
                        >
                            <div className="flex items-baseline gap-3">
                                <Link
                                    href={route('writer.articles.edit', article.id)}
                                    className="font-medium hover:underline"
                                    style={{ color: colors.primary }}
                                >
                                    {article.title}
                                </Link>
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
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
