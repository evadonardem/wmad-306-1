export default function RecommendedList({ articles = [] }) {
    return (
        <section>
            <h3>Recommended</h3>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>
        </section>
    );
}
