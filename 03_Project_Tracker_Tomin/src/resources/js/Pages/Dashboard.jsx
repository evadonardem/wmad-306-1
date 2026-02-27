import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const STORAGE_KEY = 'protrack_projects_v1';

function loadProjects() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
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

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        setProjects(loadProjects());
    }, []);

    const ongoing = projects.filter(p => p.status !== 'completed');
    const completed = projects.filter(p => p.status === 'completed');

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <h2 className="protrack-gradient-text text-4xl font-bold">Welcome Back! 👋</h2>
                    <p className="text-gray-600">Manage your projects with ease and track your progress</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Ongoing Projects */}
                        <div className="protrack-card p-6 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">📋 Ongoing Projects</h3>
                            {ongoing.length === 0 ? (
                                <div className="text-sm text-gray-500 py-8 text-center">
                                    <p>No ongoing projects.</p>
                                    <p className="mt-2">Create one in <Link href="/projects" className="text-blue-500 hover:underline">Projects</Link>.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {ongoing.map(p => (
                                        <Link
                                            key={p.id}
                                            href={`/projects/${p.id}`}
                                            className="block p-4 rounded-lg transition-all duration-300 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:shadow-md cursor-pointer"
                                            onMouseEnter={() => setHoveredId(p.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 hover:translate-x-0.5 transition">{p.name}</h4>
                                                    {p.description && <p className="text-xs mt-1 text-gray-600 line-clamp-1">{p.description}</p>}
                                                </div>
                                                <span className="ml-2 text-xs px-2 py-1 rounded-full whitespace-nowrap bg-gray-200 text-gray-700">
                                                    {(p.tasks || []).length} tasks
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-semibold text-gray-700">Progress</span>
                                                    <span className="text-sm font-bold text-gray-900">{p.progress || 0}%</span>
                                                </div>
                                                <div className="h-2 rounded-full overflow-hidden bg-gray-300">
                                                    <div className={`h-full bg-gradient-to-r ${colorMap[p.color] || colorMap.blue}`} style={{ width: `${p.progress || 0}%` }} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Completed Projects */}
                        <div className="protrack-card p-6 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">✅ Completed Projects</h3>
                            {completed.length === 0 ? (
                                <div className="text-sm text-gray-500 py-8 text-center">
                                    <p>No completed projects yet.</p>
                                    <p className="mt-2">Keep working on your projects to complete them!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {completed.map(p => (
                                        <Link
                                            key={p.id}
                                            href={`/projects/${p.id}`}
                                            className="block p-4 rounded-lg transition-all duration-300 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:shadow-md cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold flex items-center gap-2 text-gray-900">
                                                        <span className="text-lg">🎉</span>
                                                        {p.name}
                                                    </h4>
                                                    {p.description && <p className="text-xs mt-1 text-gray-600 line-clamp-1">{p.description}</p>}
                                                </div>
                                                <span className="ml-2 text-xs px-2 py-1 rounded-full whitespace-nowrap bg-emerald-200 text-emerald-800">
                                                    100%
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
