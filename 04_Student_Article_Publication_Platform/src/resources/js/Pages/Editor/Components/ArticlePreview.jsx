export default function ArticlePreview({ article }) {
    return (
        <article>
            <h3>{article?.title}</h3>
            <p>{article?.content}</p>
        </article>
    );
}
