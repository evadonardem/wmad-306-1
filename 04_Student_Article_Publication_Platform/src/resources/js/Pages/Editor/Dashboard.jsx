import EditorLayout from '../Shared/Layouts/EditorLayout';
import ReviewPanel from './Components/ReviewPanel';

export default function Dashboard({ pendingArticles = [], publishedArticles = [] }) {
    return (
        <EditorLayout>
            <h2>Editor Dashboard</h2>
            {/* Pass separate lists so the panel can show review and public-approval queues. */}
            <ReviewPanel pendingArticles={pendingArticles} publishedArticles={publishedArticles} />
        </EditorLayout>
    );
}
