import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ProjectNotesModal from '@/Components/ProjectNotesModal';
import CreateProjectModal from '@/Components/CreateProjectModal';

const STORAGE_KEY = 'protrack_projects_v1';

function loadProjects() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function saveProjects(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const colorMap = {
    blue: 'from-blue-500 via-cyan-500 to-teal-600',
    purple: 'from-purple-500 via-violet-500 to-indigo-600',
    green: 'from-emerald-500 via-teal-500 to-cyan-600',
    rose: 'from-rose-500 via-pink-500 to-red-600',
    amber: 'from-amber-500 via-orange-500 to-red-600',
    indigo: 'from-indigo-500 via-purple-500 to-violet-600',
};

const statusColors = {
    planning: 'text-slate-600 bg-slate-100',
    'in-progress': 'text-blue-600 bg-blue-100',
    paused: 'text-amber-600 bg-amber-100',
    completed: 'text-emerald-600 bg-emerald-100',
};

const priorityColors = {
    low: 'border-l-4 border-blue-500',
    medium: 'border-l-4 border-amber-500',
    high: 'border-l-4 border-red-500',
};

export default function ProjectDetail({ projectId }) {
    const [project, setProject] = useState(null);
    const [notesOpen, setNotesOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [allProjects, setAllProjects] = useState([]);

    useEffect(() => {
        const all = loadProjects();
        setAllProjects(all);
        const p = all.find((x) => String(x.id) === String(projectId));
        if (p) setProject(p);
    }, [projectId]);

    useEffect(() => {
        if (!project) return;
        const all = loadProjects();
        const rest = all.filter((x) => String(x.id) !== String(project.id));
        const updatedAll = [project, ...rest];
        saveProjects(updatedAll);
        setAllProjects(updatedAll);
    }, [project]);

    function toggleTaskStatus(taskId) {
        if (!project) return;
        const tasks = (project.tasks || []).map(t => t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t);
        const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter(x => x.status === 'done').length / tasks.length) * 100);
        setProject({ ...project, tasks, progress });
    }

    function deleteTask(taskId) {
        if (!project) return;
        const tasks = (project.tasks || []).filter(t => t.id !== taskId);
        const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter(x => x.status === 'done').length / tasks.length) * 100);
        setProject({ ...project, tasks, progress });
    }

    function AddTaskForm({ onAdd }) {
        const [name, setName] = useState('');
        const [desc, setDesc] = useState('');
        const [priority, setPriority] = useState('medium');
        const [due, setDue] = useState('');

        const submit = (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const t = { id: `t_${Date.now()}`, name: name.trim(), description: desc.trim(), priority, due_date: due || null, status: 'todo' };
            onAdd(t);
            setName(''); setDesc(''); setPriority('medium'); setDue('');
        };

        return (
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end mb-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Task name" className="col-span-2 px-3 py-2 border rounded" />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3 py-2 border rounded">
                    <option value="low">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="high">Hard</option>
                </select>
                <input value={due} onChange={(e) => setDue(e.target.value)} type="date" className="px-3 py-2 border rounded" />
                <div className="md:col-span-4">
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Description (optional)" />
                    <div className="mt-2 text-right"><button className="protrack-btn-primary">Add Task</button></div>
                </div>
            </form>
        );
    }

    if (!project) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                            ← Back to Projects
                        </Link>
                    </div>
                }
            >
                <Head title="Project" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="protrack-card p-8 text-center">Loading project…</div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const gradient = colorMap[(project.color) || 'blue'];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        ← Back to Projects
                    </Link>
                    <div className="flex gap-2">
                        <button onClick={() => setEditOpen(true)} className="protrack-btn-secondary text-sm">Edit</button>
                        <button onClick={() => setNotesOpen(true)} className="protrack-btn-ghost text-sm">Notes</button>
                    </div>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Hero Section */}
                    <div
                        className={`
                            bg-gradient-to-br ${gradient}
                            rounded-2xl shadow-2xl p-8 md:p-12
                            text-white overflow-hidden relative
                            animate-fadeInScale
                        `}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32" />

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h1 className="text-5xl font-bold mb-4">{project.name}</h1>
                                <p className="text-lg opacity-90 max-w-2xl">{project.description}</p>
                            </div>

                            {project && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 backdrop-blur-md`}>{(project.status || '').replace('-', ' ')}</span>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 backdrop-blur-md`}>{(project.tasks||[]).length} tasks</span>
                                    </div>

                                    <div className="max-w-md">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-semibold opacity-90">Overall Progress</span>
                                            <span className="text-lg font-bold">{project.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-white bg-opacity-20 rounded-full overflow-hidden backdrop-blur-xs">
                                            <div className="h-full bg-white transition-all duration-500" style={{ width: `${project.progress || 0}%` }} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                label: 'Total Tasks',
                                value: project.tasks_count,
                                icon: '📋',
                                color: 'blue',
                            },
                            {
                                label: 'In Progress',
                                value: project.tasks.filter(t => t.status === 'in-progress').length,
                                icon: '⚙️',
                                color: 'amber',
                            },
                            {
                                label: 'Completed',
                                value: project.tasks.filter(t => t.status === 'done').length,
                                icon: '✅',
                                color: 'green',
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`
                                    bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100
                                    rounded-2xl p-6 border-2 border-${stat.color}-200
                                    protrack-card
                                    animate-fadeInUp
                                `}
                                style={{
                                    backgroundColor: stat.color === 'blue' ? '#f0f9ff' : stat.color === 'amber' ? '#fffbeb' : '#f0fdf4',
                                    borderColor: stat.color === 'blue' ? '#bfdbfe' : stat.color === 'amber' ? '#fde68a' : '#bbf7d0',
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div className="space-y-2">
                                    <div className="text-4xl">{stat.icon}</div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline/Tasks Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-bold text-gray-900">Tasks</h3>
                        </div>

                        {/* Add Task Form */}
                        <AddTaskForm onAdd={(t) => {
                            const newTasks = [t, ...(project.tasks||[])];
                            const progress = newTasks.length === 0 ? 0 : Math.round((newTasks.filter(x => x.status === 'done').length / newTasks.length) * 100);
                            setProject({ ...project, tasks: newTasks, progress });
                        }} />

                        {/* Task List */}
                        <div className="grid gap-4">
                            {(project.tasks||[]).map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`
                                        protrack-card p-6
                                        hover:shadow-xl transition-all duration-300
                                        hover:scale-102 hover:-translate-y-1
                                        animate-fadeInUp
                                        ${priorityColors[task.priority]}
                                    `}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-gray-900">{task.name}</h4>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => toggleTaskStatus(task.id)} className="text-sm px-3 py-1 rounded bg-white/80">{task.status === 'done' ? 'Undo' : 'Done'}</button>
                                                <button onClick={() => deleteTask(task.id)} className="text-sm px-3 py-1 rounded bg-red-50 text-red-600">Delete</button>
                                            </div>
                                        </div>

                                        {task.due_date && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>📅</span>
                                                <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <CreateProjectModal open={editOpen} onClose={() => setEditOpen(false)} initial={project} onUpdate={(id, updated) => {
                    setProject(updated);
                    const all = loadProjects();
                    setAllProjects(all.map(p => p.id === id ? updated : p));
                    saveProjects(all.map(p => p.id === id ? updated : p));
                    setEditOpen(false);
                }} />

                <ProjectNotesModal open={notesOpen} onClose={() => setNotesOpen(false)} project={project} onSave={(notes) => {
                    const updated = { ...project, notes };
                    setProject(updated);
                    const all = loadProjects();
                    setAllProjects(all.map(p => p.id === project.id ? updated : p));
                    saveProjects(all.map(p => p.id === project.id ? updated : p));
                    setNotesOpen(false);
                }} />
            </div>
        </AuthenticatedLayout>
    );
}
