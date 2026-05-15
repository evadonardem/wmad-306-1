import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, projects, stats }) {
    const user = auth.user;

    // Calculate progress percentage
    const calculateProgress = (project) => {
        if (project.tasks_count === 0) return 0;
        return Math.round((project.completed_tasks_count / project.tasks_count) * 100);
    };

    // Get status color
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

    // Quick actions
    const quickActions = [
        {
            label: 'New Project',
            icon: 'M12 4v16m8-8H4',
            href: route('projects.create'),
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            label: 'New Task',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            href: route('tasks.create'),
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            label: 'View Projects',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            href: route('projects.index'),
            color: 'bg-purple-600 hover:bg-purple-700'
        },
    ];

    // Calculate completion rate
    const completionRate = stats.total_tasks > 0
        ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Welcome back, {user.name}!
                                </h1>
                                <p className="mt-2 text-blue-100">
                                    Here's what's happening with your projects today.
                                </p>
                            </div>
                            <div className="hidden rounded-full bg-white/20 p-4 sm:block">
                                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Projects</p>
                                    <p className="mt-2 text-3xl font-bold text-blue-900">{stats.total_projects}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Total Tasks</p>
                                    <p className="mt-2 text-3xl font-bold text-green-900">{stats.total_tasks}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-600">Completed</p>
                                    <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.completed_tasks}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                                    <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>

                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600">Pending</p>
                                    <p className="mt-2 text-3xl font-bold text-amber-900">{stats.pending_tasks}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-semibold text-blue-900">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${action.color}`}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                                    </svg>
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-blue-900">Recent Projects</h3>
                            <Link
                                href={route('projects.index')}
                                className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                            >
                                View All →
                            </Link>
                        </div>

                        {projects.length === 0 ? (
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
                            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="border-b border-blue-100 p-5">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-semibold text-blue-900">
                                                    {project.name}
                                                </h4>
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            {project.description && (
                                                <p className="mt-2 text-sm text-blue-600 line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}
                                            <p className="mt-3 text-sm text-blue-500">
                                                {project.completed_tasks_count} of {project.tasks_count} tasks completed
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-5">
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="font-medium text-blue-700">Progress</span>
                                                <span className="font-bold text-blue-900">{calculateProgress(project)}%</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-blue-200">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                                    style={{ width: `${calculateProgress(project)}%` }}
                                                />
                                            </div>
                                            <div className="mt-3 flex justify-between">
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View Details →
                                                </Link>
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress Overview */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-blue-900">Progress Overview</h3>
                        <div className="overflow-hidden rounded-xl bg-white shadow-md">
                            <div className="grid grid-cols-1 divide-y divide-blue-100 md:grid-cols-3 md:divide-x md:divide-y-0">
                                <div className="p-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{completionRate}%</p>
                                    <p className="text-sm text-blue-600">Task Completion Rate</p>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{stats.total_projects}</p>
                                    <p className="text-sm text-blue-600">Active Projects</p>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">1</p>
                                    <p className="text-sm text-blue-600">Team Members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
