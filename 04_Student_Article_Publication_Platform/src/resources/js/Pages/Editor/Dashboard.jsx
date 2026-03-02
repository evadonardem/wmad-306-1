import EditorLayout from '../Shared/Layouts/EditorLayout';
import ReviewPanel from './Components/ReviewPanel';

export default function Dashboard({ pendingArticles = [] }) {
    return (
        <EditorLayout>
            <h2>Editor Dashboard</h2>
            <ReviewPanel articles={pendingArticles} />
        </EditorLayout>
    );
}
