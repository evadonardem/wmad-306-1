import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminDashboard({ pendingUsers, pendingArticles, allUsers, availableRoles }) {
    const { auth } = usePage().props;
    const [selectedRoles, setSelectedRoles] = useState(() =>
        allUsers.reduce((acc, user) => {
            const currentRole = user.roles[0]?.name;
            if (currentRole) {
                acc[user.id] = currentRole;
            }
            return acc;
        }, {}),
    );

    const approveUser = (userId) => {
        router.patch(route('admin.users.approve', userId));
    };

    const updateUserRole = (user) => {
        if (user.roles.some((role) => ['super admin', 'super-admin', 'super_admin'].includes(role.name))) {
            return;
        }

        if (user.id === auth.user.id) {
            return;
        }

        const role = selectedRoles[user.id] ?? user.roles[0]?.name;
        const currentRole = user.roles[0]?.name;

        if (!role) {
            return;
        }

        if (currentRole === 'admin' && role !== 'admin') {
            const confirmRevoke = window.confirm(
                `Revoke admin role from ${user.name}? They will lose admin dashboard access.`,
            );
            if (!confirmRevoke) {
                return;
            }
        }

        router.patch(route('admin.users.role', user.id), { role });
    };

    const deleteUser = (userId) => {
        if (!window.confirm('Delete this user account? This cannot be undone.')) {
            return;
        }
        router.delete(route('admin.users.destroy', userId));
    };

    const reviewArticle = (articleId, status) => {
        router.patch(route('admin.articles.status', articleId), { status });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-100">Admin Operations</h2>}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-transparent py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-slate-950/40">
                        <div className="bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 px-6 py-6 text-white">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/80">Admin Workspace</p>
                            <h3 className="mt-2 text-2xl font-black">Moderation, Approvals, and User Access</h3>
                        </div>
                        <div className="grid gap-4 p-6 sm:grid-cols-3">
                            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-5">
                                <p className="text-xs uppercase tracking-widest text-rose-200">Pending Writers</p>
                                <p className="mt-1 text-3xl font-black text-rose-100">{pendingUsers.length}</p>
                            </div>
                            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-5">
                                <p className="text-xs uppercase tracking-widest text-amber-200">Pending Articles</p>
                                <p className="mt-1 text-3xl font-black text-amber-100">{pendingArticles.length}</p>
                            </div>
                            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-5">
                                <p className="text-xs uppercase tracking-widest text-cyan-200">Total Users</p>
                                <p className="mt-1 text-3xl font-black text-cyan-100">{allUsers.length}</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
                        <h3 className="text-lg font-semibold text-slate-100">Pending User Approvals</h3>
                        <div className="mt-4 space-y-3">
                            {pendingUsers.length === 0 && <p className="text-slate-400">No pending users.</p>}
                            {pendingUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-100">{user.name}</p>
                                        <p className="text-sm text-slate-400">
                                            {user.email} | {user.roles.map((role) => role.name).join(', ')}
                                        </p>
                                        {user.writer_application_reason && (
                                            <p className="mt-2 rounded-md border border-slate-800/80 bg-slate-900/60 p-2 text-sm text-slate-200">
                                                Reason: {user.writer_application_reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => approveUser(user.id)}
                                            className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-900"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
                        <h3 className="text-lg font-semibold text-slate-100">Pending Article Reviews</h3>
                        <div className="mt-4 space-y-3">
                            {pendingArticles.length === 0 && <p className="text-slate-400">No pending articles.</p>}
                            {pendingArticles.map((article) => (
                                <div key={article.id} className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
                                    <p className="font-medium text-slate-100">{article.title}</p>
                                    <p className="text-sm text-slate-400">By {article.user?.name}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => reviewArticle(article.id, 'approved')}
                                            className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-900"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => reviewArticle(article.id, 'rejected')}
                                            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
                        <h3 className="text-lg font-semibold text-slate-100">All Users and Role Access</h3>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800 text-left text-slate-400">
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Email</th>
                                        <th className="py-2">Role Access</th>
                                        <th className="py-2">Approval</th>
                                        <th className="py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-800">
                                            <td className="py-2 text-slate-100">{user.name}</td>
                                            <td className="py-2 text-slate-300">{user.email}</td>
                                            <td className="py-2">
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const isSuperAdmin = user.roles.some((role) =>
                                                            ['super admin', 'super-admin', 'super_admin'].includes(
                                                                role.name,
                                                            ),
                                                        );
                                                        const isSelf = user.id === auth.user.id;

                                                        if (isSuperAdmin) {
                                                            return (
                                                                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                                                                    Protected (super admin)
                                                                </span>
                                                            );
                                                        }

                                                        if (isSelf) {
                                                            return (
                                                                <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-xs text-cyan-200">
                                                                    Your account (role locked)
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <>
                                                                <select
                                                                    value={selectedRoles[user.id] ?? user.roles[0]?.name ?? ''}
                                                                    onChange={(event) =>
                                                                        setSelectedRoles((prev) => ({
                                                                            ...prev,
                                                                            [user.id]: event.target.value,
                                                                        }))
                                                                    }
                                                                    className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200"
                                                                >
                                                                    {availableRoles.map((role) => (
                                                                        <option key={role} value={role}>
                                                                            {role}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    onClick={() => updateUserRole(user)}
                                                                    className="rounded bg-cyan-400 px-2 py-1 text-xs font-semibold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700"
                                                                >
                                                                    Update Role
                                                                </button>
                                                                {user.roles.some((role) => role.name === 'admin') && (
                                                                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-200">
                                                                        Admin can be revoked
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${
                                                        user.is_approved
                                                            ? 'bg-emerald-500/15 text-emerald-200'
                                                            : 'bg-amber-500/15 text-amber-200'
                                                    }`}
                                                >
                                                    {user.is_approved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                {!user.roles.some((role) => role.name === 'admin') &&
                                                    user.id !== auth.user.id && (
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="rounded bg-rose-500 px-2 py-1 text-xs font-semibold text-white"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
