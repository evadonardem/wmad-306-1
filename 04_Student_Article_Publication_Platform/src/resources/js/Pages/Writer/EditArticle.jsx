import WriterLayout from '../Shared/Layouts/WriterLayout';
import ArticleForm from './Components/ArticleForm';

export default function EditArticle({ article }) {
    return (
        <WriterLayout>
            <h2>Edit Article</h2>
            <ArticleForm article={article} />
        </WriterLayout>
    );
}
