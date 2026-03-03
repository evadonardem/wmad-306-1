import EditorLayout from '../Shared/Layouts/EditorLayout';
import ReviewPanel from './Components/ReviewPanel';

export default function Dashboard({ pendingArticles = [], publishedArticles = [] }) {
    return (
        <EditorLayout>
            <h2>Editor Dashboard</h2>
            <ReviewPanel pendingArticles={pendingArticles} publishedArticles={publishedArticles} />
        </EditorLayout>
    );
}
