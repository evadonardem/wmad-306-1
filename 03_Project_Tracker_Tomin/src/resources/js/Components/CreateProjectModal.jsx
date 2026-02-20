import { useState, useEffect } from 'react';

export default function CreateProjectModal({ open, onClose, onCreate, initial = null, onUpdate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium');
    const [taskDue, setTaskDue] = useState('');
    const [status, setStatus] = useState('in-progress');

    useEffect(() => {
        if (!open) {
            setName('');
            setDescription('');
            setTasks([]);
            setTaskName('');
            setTaskDesc('');
            setTaskPriority('medium');
            setTaskDue('');
            setStatus('in-progress');
            return;
        }

        // If initial project provided, populate fields for edit
        if (initial) {
            setName(initial.name || '');
            setDescription(initial.description || '');
            setTasks(initial.tasks || []);
            setStatus(initial.status || 'in-progress');
        }
    }, [open, initial]);

    const submit = (e) => {
        e.preventDefault();
        const computedProgress = tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100);
        if (initial && onUpdate) {
            const updated = {
                ...initial,
                name: name || initial.name || 'Untitled Project',
                description,
                progress: computedProgress,
                status,
                tasks,
            };
            onUpdate(initial.id, updated);
        } else {
            const project = {
                id: `p_${Date.now()}`,
                name: name || 'Untitled Project',
                description,
                progress: computedProgress,
                status: status,
                notes: [],
                tasks: tasks,
                created_at: new Date().toISOString(),
            };
            onCreate(project);
        }
        onClose();
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!taskName.trim()) return;
        const t = {
            id: `t_${Date.now()}`,
            name: taskName.trim(),
            description: taskDesc.trim(),
            priority: taskPriority,
            due_date: taskDue || null,
            status: 'todo',
        };
        setTasks((s) => [t, ...s]);
        setTaskName('');
        setTaskDesc('');
        setTaskPriority('medium');
        setTaskDue('');
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <form onSubmit={submit} className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">{initial ? 'Edit Project' : 'Create New Project'}</h3>

                <label className="block mb-3">
                    <div className="text-sm font-medium mb-1">Project Name</div>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g. Website Redesign" />
                </label>

                <label className="block mb-3">
                    <div className="text-sm font-medium mb-1">Description</div>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
                </label>

                <div className="mb-3">
                    <div className="text-sm font-medium mb-2">Add Tasks (optional)</div>
                    <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <div>
                            <input value={taskName} onChange={(e) => setTaskName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Task name" />
                        </div>
                        <div>
                            <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="w-full px-3 py-2 border rounded">
                                <option value="low">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="high">Hard</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <input value={taskDue} onChange={(e) => setTaskDue(e.target.value)} type="date" className="px-3 py-2 border rounded" />
                            <button className="px-4 py-2 rounded bg-blue-600 text-white">Add Task</button>
                        </div>
                        <div className="md:col-span-3 mt-2">
                            <input value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Task description (optional)" />
                        </div>
                    </form>

                    {tasks.length > 0 && (
                        <div className="mt-3 space-y-2 max-h-48 overflow-auto">
                            {tasks.map((t) => (
                                <div key={t.id} className="p-2 border rounded bg-gray-50 text-sm">
                                    <div className="flex justify-between">
                                        <div className="font-medium">{t.name}</div>
                                        <div className={`text-xs px-2 py-0.5 rounded ${t.priority === 'low' ? 'bg-blue-100 text-blue-700' : t.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                            {t.priority === 'low' ? 'Easy' : t.priority === 'medium' ? 'Medium' : 'Hard'}
                                        </div>
                                    </div>
                                    {t.description && <div className="text-xs text-gray-600">{t.description}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label className="block mb-4">
                    <div className="text-sm font-medium mb-1">Status</div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded">
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white">{initial ? 'Save Changes' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}
