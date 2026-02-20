import { useState, useEffect } from 'react';

export default function ProjectNotesModal({ open, onClose, project, onSave }) {
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        setNoteText('');
    }, [open]);

    if (!open || !project) return null;

    const addNote = (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        const note = {
            id: `n_${Date.now()}`,
            text: noteText.trim(),
            created_at: new Date().toISOString(),
        };
        onSave(project.id, note);
        setNoteText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold mb-3">Notes for {project.name}</h3>

                <div className="space-y-3 max-h-48 overflow-auto mb-4">
                    {project.notes && project.notes.length > 0 ? (
                        project.notes.map((n) => (
                            <div key={n.id} className="p-3 border rounded bg-gray-50">
                                <div className="text-sm text-gray-700">{n.text}</div>
                                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500">No notes yet.</div>
                    )}
                </div>

                <form onSubmit={addNote} className="flex gap-2">
                    <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note for client changes or wants" className="flex-1 px-3 py-2 border rounded" />
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Add</button>
                </form>

                <div className="mt-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Close</button>
                </div>
            </div>
        </div>
    );
}
