import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, task, projects }) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: task.project_id || '',
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'pending',
        due_date: task.due_date || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Edit Task
                </h2>
            }
        >
            <Head title="Edit Task" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('tasks.index')}
                            className="inline-flex items-center gap-2 text-blue-600 transition hover:text-blue-800"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Tasks
                        </Link>
                    </div>

                    {/* Current Status */}
                    <div className="mb-6 rounded-xl bg-blue-50 p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-blue-700">Current Status:</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <form onSubmit={submit}>
                            {/* Project Selection */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Project <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.project_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.project_id}</p>
                                )}
                            </div>

                            {/* Task Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Task Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter task name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your task..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.due_date && (
                                    <p className="mt-1 text-sm text-red-500">{errors.due_date}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <Link
                                    href={route('tasks.index')}
                                    className="flex-1 rounded-lg border border-blue-200 px-6 py-3 text-center font-medium text-blue-700 transition hover:bg-blue-50"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Delete Task */}
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                        <p className="mt-2 text-sm text-blue-600">
                            Once you delete a task, there is no going back. Please be certain.
                        </p>
                        <Link
                            href={route('tasks.destroy', task.id)}
                            method="delete"
                            as="button"
                            className="mt-4 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete Task
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
