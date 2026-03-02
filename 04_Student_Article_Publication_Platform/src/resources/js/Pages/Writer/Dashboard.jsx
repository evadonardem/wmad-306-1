import { useState } from 'react';
import WriterLayout from '../Shared/Layouts/WriterLayout';
import JoditEditor from '../Shared/JoditEditor';
import DraftList from './Components/DraftList';
import SubmittedList from './Components/SubmittedList';

export default function Dashboard({ articles = [] }) {
    const [testContent, setTestContent] = useState('');

    return (
        <WriterLayout>
            <h2>Writer Dashboard</h2>
            <DraftList articles={articles} />
            <SubmittedList articles={articles} />

            <section style={{ marginTop: '2rem' }}>
                <h3>Jodit Editor Test</h3>
                <JoditEditor
                    value={testContent}
                    onChange={setTestContent}
                    placeholder="Type here to test Jodit on the dashboard..."
                />
            </section>
        </WriterLayout>
    );
}
