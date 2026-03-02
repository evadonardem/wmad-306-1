import EditorLayout from '../Shared/Layouts/EditorLayout';
import ArticlePreview from './Components/ArticlePreview';
import RevisionForm from './Components/RevisionForm';

export default function ReviewArticle({ article }) {
    return (
        <EditorLayout>
            <h2>Review Article</h2>
            <ArticlePreview article={article} />
            <RevisionForm article={article} />
        </EditorLayout>
    );
}
