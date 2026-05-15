import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, project }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Edit Project
                </h2>
            }
        >
            <Head title="Edit Project" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-xl bg-blue-50 p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-blue-700">Current Status:</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <form onSubmit={submit}>
                            {/* Project Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-blue-900">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project name"
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
                                    placeholder="Describe your project..."
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
                                    <option value="active">Active</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>

                            {/* Dates */}
                            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-blue-900">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-blue-900">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.end_date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
                                    )}
                                </div>
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
                                    href={route('projects.index')}
                                    className="flex-1 rounded-lg border border-blue-200 px-6 py-3 text-center font-medium text-blue-700 transition hover:bg-blue-50"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Delete Project */}
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                        <p className="mt-2 text-sm text-blue-600">
                            Once you delete a project, there is no going back. Please be certain.
                        </p>
                        <Link
                            href={route('projects.destroy', project.id)}
                            method="delete"
                            as="button"
                            className="mt-4 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete Project
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
