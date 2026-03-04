import { router } from '@inertiajs/react';

export default function ReviewPanel({ pendingArticles = [], publishedArticles = [] }) {
    return (
        <section>
            <h3>Pending Review</h3>
            <ul>
                {/* Articles still waiting for review/publish actions. */}
                {pendingArticles.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>

            <h3 style={{ marginTop: '1rem' }}>Published (Awaiting Public Approval)</h3>
            <ul>
                {/* Published articles that are not yet exposed on public pages. */}
                {publishedArticles.map((article) => (
                    <li key={article.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>{article.title}</span>
                        <button
                            type="button"
                            // Triggers editor route that marks the article as publicly visible.
                            onClick={() => router.post(route('editor.articles.approvePublic', article.id))}
                        >
                            Approve for Landing Page
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
