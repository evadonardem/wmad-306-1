import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, projects, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-blue-100 text-blue-700';
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'on_hold':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = route('projects.index', { search });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Projects
                </h2>
            }
        >
            <Head title="Projects" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-blue-200 px-4 py-2 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                        <Link
                            href={route('projects.create')}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium transition hover:bg-blue-700"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Project
                        </Link>
                    </div>

                    {/* Projects List */}
                    <div className="grid gap-6">
                        {projects.data.length === 0 ? (
                            <div className="rounded-xl bg-white p-12 text-center shadow-md">
                                <svg className="mx-auto h-16 w-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-4 text-lg font-semibold text-blue-900">No projects yet</h3>
                                <p className="mt-2 text-blue-600">Create your first project to get started</p>
                                <Link
                                    href={route('projects.create')}
                                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white font-medium transition hover:bg-blue-700"
                                >
                                    Create Project
                                </Link>
                            </div>
                        ) : (
                            projects.data.map((project) => (
                                <div
                                    key={project.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="border-b border-blue-100 p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-blue-900">
                                                        {project.name}
                                                    </h3>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                                                        {project.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                {project.description && (
                                                    <p className="mt-2 text-sm text-blue-600 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-blue-700">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <span>{project.tasks_count} tasks</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{project.completed_tasks_count} completed</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-blue-500">
                                                {project.start_date && `Started: ${new Date(project.start_date).toLocaleDateString()}`}
                                                {project.end_date && ` • Due: ${new Date(project.end_date).toLocaleDateString()}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {projects.data.length > 0 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {projects.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-blue-600 hover:bg-blue-50'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
