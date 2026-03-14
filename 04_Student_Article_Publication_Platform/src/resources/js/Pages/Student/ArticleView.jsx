import StudentLayout from '@/Layouts/StudentLayout';
import CommentSection from './Components/CommentSection';

export default function ArticleView({ article }) {
    return (
        <StudentLayout>
            <h2>{article?.title}</h2>
            <p>{article?.content}</p>
            <CommentSection comments={article?.comments ?? []} />
        </StudentLayout>
    );
}

