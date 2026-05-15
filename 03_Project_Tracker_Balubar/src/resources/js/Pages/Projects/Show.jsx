import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, project }) {
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

    const getTaskStatusColor = (status) => {
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

    const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    {project.name}
                </h2>
            }
        >
            <Head title={project.name} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href={route('projects.index')}
                            className="inline-flex items-center gap-2 text-blue-600 transition hover:text-blue-800"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Projects
                        </Link>
                    </div>

                    {/* Project Header */}
                    <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold">{project.name}</h1>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="mt-3 text-blue-100">{project.description}</p>
                                )}
                                <div className="mt-4 flex gap-6 text-sm text-blue-100">
                                    {project.start_date && (
                                        <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                                    )}
                                    {project.end_date && (
                                        <span>Due: {new Date(project.end_date).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <Link
                                href={route('projects.edit', project.id)}
                                className="rounded-lg bg-white/20 px-4 py-2 text-white transition hover:bg-white/30"
                            >
                                Edit Project
                            </Link>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-blue-900">Progress</h3>
                            <span className="text-lg font-bold text-blue-600">{progress}%</span>
                        </div>
                        <div className="h-4 overflow-hidden rounded-full bg-blue-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-blue-600">
                            {completedTasks} of {totalTasks} tasks completed
                        </p>
                    </div>

                    {/* Tasks Section */}
                    <div className="rounded-xl bg-white shadow-md">
                        <div className="flex items-center justify-between border-b border-blue-100 p-5">
                            <h3 className="text-lg font-semibold text-blue-900">Tasks</h3>
                            <Link
                                href={route('tasks.create', { project_id: project.id })}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white text-sm transition hover:bg-blue-700"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Task
                            </Link>
                        </div>

                        {project.tasks.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="mx-auto h-16 w-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <h3 className="mt-4 text-lg font-semibold text-blue-900">No tasks yet</h3>
                                <p className="mt-2 text-blue-600">Add your first task to get started</p>
                                <Link
                                    href={route('tasks.create', { project_id: project.id })}
                                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white font-medium transition hover:bg-blue-700"
                                >
                                    Add Task
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-blue-50">
                                {project.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-5 hover:bg-blue-50">
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={route('tasks.edit', task.id)}
                                                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-300 hover:border-blue-600"
                                            >
                                                {task.status === 'completed' && (
                                                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </Link>
                                            <div>
                                                <p className={`font-medium ${task.status === 'completed' ? 'text-blue-400 line-through' : 'text-blue-900'}`}>
                                                    {task.name}
                                                </p>
                                                {task.description && (
                                                    <p className="text-sm text-blue-600">{task.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.due_date && (
                                                <span className="text-sm text-blue-500">
                                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusColor(task.status)}`}>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
