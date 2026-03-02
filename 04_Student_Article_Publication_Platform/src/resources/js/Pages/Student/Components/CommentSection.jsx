export default function CommentSection({ comments = [] }) {
    return (
        <section>
            <h3>Comments</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>{comment.body}</li>
                ))}
            </ul>
        </section>
    );
}
