import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import CreateProjectModal from '@/Components/CreateProjectModal';
import ProjectNotesModal from '@/Components/ProjectNotesModal';

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
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
    indigo: 'from-indigo-500 to-purple-500',
};

const statusDotMap = {
    planning: 'bg-slate-400',
    'in-progress': 'bg-blue-500 animate-pulse',
    paused: 'bg-amber-500',
    completed: 'bg-emerald-500',
};

export default function Projects() {
    const [hoveredId, setHoveredId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);
    const [activeProject, setActiveProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        setProjects(loadProjects());
    }, []);

    useEffect(() => {
        saveProjects(projects);
    }, [projects]);

    const handleCreate = (project) => {
        const withTasks = { ...project, tasks: project.tasks || [] };
        setProjects((p) => [withTasks, ...p]);
    };

    const handleDelete = (id) => {
        if (!confirm('Delete project?')) return;
        setProjects((p) => p.filter((x) => x.id !== id));
    };
    const handleSaveNote = (projectId, note) => {
        setProjects((p) => p.map(pr => pr.id === projectId ? { ...pr, notes: [ ...(pr.notes||[]), note ] } : pr));
        setNotesOpen(false);
    };

    const handleUpdate = (id, updated) => {
        setProjects((p) => p.map(pr => pr.id === id ? updated : pr));
        setEditingProject(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="protrack-gradient-text text-4xl font-bold">Projects</h2>
                        <p className="text-gray-600 mt-2">{projects.length} active projects</p>
                    </div>
                    <button onClick={() => { setEditingProject(null); setShowCreate(true); }} className="protrack-btn-primary">+ New Project</button>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div key={project.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                                <div
                                    onMouseEnter={() => setHoveredId(project.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`protrack-card p-6 relative overflow-hidden flex flex-col h-full ${hoveredId === project.id ? 'scale-105 shadow-2xl' : 'shadow-lg'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[project.color] || colorMap.blue} opacity-0 transition-opacity duration-300 ${hoveredId === project.id ? 'opacity-5' : ''}`} />

                                    <Link href={`/projects/${project.id}`} className="relative z-10 block flex-1">
                                        <div className="space-y-4 cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className={`text-xl font-bold text-gray-900 transition-all duration-300 ${hoveredId === project.id ? 'translate-x-1' : ''}`}>{project.name}</h3>
                                                    {project.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>}
                                                </div>
                                                <span className="status-badge" style={{ backgroundColor: project.status === 'planning' ? '#f1f5f9' : project.status === 'in-progress' ? '#dbeafe' : project.status === 'paused' ? '#fef3c7' : '#d1fae5', color: project.status === 'planning' ? '#475569' : project.status === 'in-progress' ? '#1e40af' : project.status === 'paused' ? '#92400e' : '#065f46' }}>
                                                    <span className={`w-2 h-2 rounded-full ${statusDotMap[project.status] || 'bg-slate-400'}`} />
                                                    {project.status}
                                                </span>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-gray-700">Progress</span>
                                                    <span className="text-sm font-bold text-gray-900">{project.progress || 0}%</span>
                                                </div>
                                                <div className="progress-bar bg-gray-200 rounded-full">
                                                    <div className={`progress-fill bg-gradient-to-r ${colorMap[project.color] || colorMap.blue} rounded-full`} style={{ width: `${project.progress || 0}%` }} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <span>📋</span>
                                                <span>{(project.tasks || []).length} task{(project.tasks || []).length !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="mt-4 relative z-10 flex gap-2">
                                        <button onClick={(e) => { e.preventDefault(); setActiveProject(project); setNotesOpen(true); }} className="text-sm bg-white/80 px-3 py-1 rounded hover:bg-white">Notes</button>
                                        <button onClick={(e) => { e.preventDefault(); setEditingProject(project); setShowCreate(true); }} className="text-sm bg-white/80 px-3 py-1 rounded hover:bg-white">Edit</button>
                                        <button onClick={(e) => { e.preventDefault(); handleDelete(project.id); }} className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className={`text-center py-20 px-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 animate-fadeInScale`}>
                            <div className="space-y-4">
                                <div className="text-6xl">📋</div>
                                <h3 className="text-2xl font-bold text-gray-700">No Projects Yet</h3>
                                <p className="text-gray-600 max-w-md mx-auto">Get started by creating your first project. Let's build something amazing!</p>
                                <button onClick={() => { setEditingProject(null); setShowCreate(true); }} className="protrack-btn-primary inline-block">Create Your First Project</button>
                            </div>
                        </div>
                    )}

                    <CreateProjectModal open={showCreate} onClose={() => { setShowCreate(false); setEditingProject(null); }} onCreate={handleCreate} initial={editingProject} onUpdate={handleUpdate} />
                    <ProjectNotesModal open={notesOpen} onClose={() => setNotesOpen(false)} project={activeProject} onSave={handleSaveNote} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
