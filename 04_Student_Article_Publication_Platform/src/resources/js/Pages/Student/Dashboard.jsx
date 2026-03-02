import StudentLayout from '../Shared/Layouts/StudentLayout';
import RecommendedList from './Components/RecommendedList';

export default function Dashboard({ publishedCount = 0, articles = [] }) {
    return (
        <StudentLayout>
            <h2>Student Dashboard</h2>
            <p>Published articles: {publishedCount}</p>
            <RecommendedList articles={articles} />
        </StudentLayout>
    );
}
