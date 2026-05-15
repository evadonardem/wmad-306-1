import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, tasks, projects, filters }) {
    const [selectedProject, setSelectedProject] = useState(filters.project_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleFilter = (key, value) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        window.location.href = `${route('tasks.index')}?${params.toString()}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Tasks
                </h2>
            }
        >
            <Head title="Tasks" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            {/* Project Filter */}
                            <select
                                value={selectedProject}
                                onChange={(e) => {
                                    setSelectedProject(e.target.value);
                                    handleFilter('project_id', e.target.value);
                                }}
                                className="rounded-lg border border-blue-200 px-4 py-2 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Projects</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleFilter('status', e.target.value);
                                }}
                                className="rounded-lg border border-blue-200 px-4 py-2 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <Link
                            href={route('tasks.create')}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium transition hover:bg-blue-700"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Task
                        </Link>
                    </div>

                    {/* Tasks List */}
                    <div className="rounded-xl bg-white shadow-md">
                        {tasks.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="mx-auto h-16 w-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <h3 className="mt-4 text-lg font-semibold text-blue-900">No tasks found</h3>
                                <p className="mt-2 text-blue-600">
                                    {selectedProject || selectedStatus
                                        ? 'Try adjusting your filters'
                                        : 'Create your first task to get started'}
                                </p>
                                <Link
                                    href={route('tasks.create')}
                                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white font-medium transition hover:bg-blue-700"
                                >
                                    Create Task
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-blue-50">
                                {tasks.data.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-5 hover:bg-blue-50">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                task.status === 'completed'
                                                    ? 'border-green-500 bg-green-500'
                                                    : task.status === 'in_progress'
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {task.status === 'completed' && (
                                                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className={`font-medium ${task.status === 'completed' ? 'text-blue-400 line-through' : 'text-blue-900'}`}>
                                                    {task.name}
                                                </p>
                                                {task.description && (
                                                    <p className="text-sm text-blue-600 line-clamp-1">{task.description}</p>
                                                )}
                                                <Link
                                                    href={route('projects.show', task.project.id)}
                                                    className="text-xs text-blue-500 hover:underline"
                                                >
                                                    {task.project.name}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.due_date && (
                                                <span className="text-sm text-blue-500">
                                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            <Link
                                                href={route('tasks.edit', task.id)}
                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {tasks.data.length > 0 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {tasks.links.map((link, index) => (
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
