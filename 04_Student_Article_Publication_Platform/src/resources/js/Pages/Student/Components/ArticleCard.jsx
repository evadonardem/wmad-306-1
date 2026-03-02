export default function ArticleCard({ article }) {
    return (
        <article>
            <h3>{article.title}</h3>
            <p>{article.content?.slice(0, 120)}...</p>
        </article>
    );
}
