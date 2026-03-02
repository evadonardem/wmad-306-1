export default function DraftList({ articles = [] }) {
    const drafts = articles.filter((article) => !article.submitted_at);

    return (
        <section>
            <h3>Drafts</h3>
            <ul>
                {drafts.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>
        </section>
    );
}
