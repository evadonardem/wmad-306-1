import EditorLayout from '../Shared/Layouts/EditorLayout';

export default function RevisionQueue({ revisions = [] }) {
    return (
        <EditorLayout>
            <h2>Revision Queue</h2>
            <ul>
                {revisions.map((revision) => (
                    <li key={revision.id}>{revision.notes}</li>
                ))}
            </ul>
        </EditorLayout>
    );
}
