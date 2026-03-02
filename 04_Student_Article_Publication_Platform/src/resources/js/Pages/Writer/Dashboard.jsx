import WriterLayout from '../Shared/Layouts/WriterLayout';
import DraftList from './Components/DraftList';
import SubmittedList from './Components/SubmittedList';

export default function Dashboard({ articles = [] }) {
    return (
        <WriterLayout>
            <h2>Writer Dashboard</h2>
            <DraftList articles={articles} />
            <SubmittedList articles={articles} />
        </WriterLayout>
    );
}
