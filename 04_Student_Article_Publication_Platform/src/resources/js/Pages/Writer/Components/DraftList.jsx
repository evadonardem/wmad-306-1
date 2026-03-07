import { Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function DraftList({ articles = [] }) {
    const { colors } = useTheme();
    const drafts = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug === 'draft';
        // Fallback for legacy records with missing status relation.
        return !article.submitted_at && !article.published_at;
    });

    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                    Drafts
                </h3>
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {drafts.length}
                </span>
            </div>

            {drafts.length === 0 ? (
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    No drafts yet.
                </p>
            ) : (
                <ul className="text-sm" style={{ color: colors.text }}>
                    {drafts.map((article) => (
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
                                Updated: {article.updated_at ? new Date(article.updated_at).toLocaleString() : 'N/A'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
