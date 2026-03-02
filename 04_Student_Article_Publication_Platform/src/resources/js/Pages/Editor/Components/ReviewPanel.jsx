export default function ReviewPanel({ articles = [] }) {
    return (
        <section>
            <h3>Pending Review</h3>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>
        </section>
    );
}
