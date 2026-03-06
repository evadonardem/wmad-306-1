import WriterLayout from '../Shared/Layouts/WriterLayout';
import ArticleForm from './Components/ArticleForm';

export default function CreateArticle({ categories = [] }) {
    return (
        <WriterLayout>
            <h2>Create Article</h2>
            <ArticleForm categories={categories} />
        </WriterLayout>
    );
}
