export default function SubmittedList({ articles = [] }) {
    const submitted = articles.filter((article) => article.submitted_at);

    return (
        <section>
            <h3>Submitted</h3>
            <ul>
                {submitted.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>
        </section>
    );
}
