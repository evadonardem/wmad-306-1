import TaskMoLayout from '@/Layouts/TaskMoLayout';
import useCountUp from '@/Hooks/useCountUp';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, stats }) {
    const user = usePage().props.auth.user;

    const projectsCount = useCountUp(stats?.projects ?? 0);
    const tasksCount = useCountUp(stats?.tasks ?? 0);
    const completedCount = useCountUp(stats?.completed ?? 0);
    const streakDays = useCountUp(stats?.streakDays ?? 0);

    const initials = (user?.name ?? 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase();

    return (
        <TaskMoLayout title={null}>
            <Head title="Profile" />

            <div className="mx-auto max-w-4xl space-y-8 text-center">
                <div className="p-2 text-center sm:p-4">
                    <div className="mx-auto w-fit">
                        <div className="animate-taskmo-float [transform-style:preserve-3d]">
                            <div className="relative grid h-28 w-28 place-items-center rounded-full border-2 border-white/85 bg-gradient-to-br from-indigo-500 to-pink-500 shadow-2xl dark:border-white/45">
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
                                <div className="relative text-3xl font-extrabold text-white">
                                    {initials}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="taskmo-heading-3d taskmo-heading-glow mt-6 text-5xl font-black tracking-tight text-blue-700 dark:text-blue-200 sm:text-6xl">
                        {user?.name}
                    </div>
                    <div className="taskmo-heading-3d mt-1 text-sm font-semibold text-gray-600/90 dark:text-gray-200/85">
                        {user?.email}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="taskmo-card p-6 text-center">
                        <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            Streak
                        </div>
                        <div className="mt-2 text-4xl font-extrabold">
                            {streakDays}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            days
                        </div>
                    </div>
                    <div className="taskmo-card p-6 text-center">
                        <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            Projects
                        </div>
                        <div className="mt-2 text-4xl font-extrabold">
                            {projectsCount}
                        </div>
                    </div>
                    <div className="taskmo-card p-6 text-center">
                        <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            Tasks
                        </div>
                        <div className="mt-2 text-4xl font-extrabold">
                            {tasksCount}
                        </div>
                    </div>
                    <div className="taskmo-card p-6 text-center">
                        <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            Completed
                        </div>
                        <div className="mt-2 text-4xl font-extrabold">
                            {completedCount}
                        </div>
                    </div>
                </div>

                <div className="taskmo-card flex justify-center p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="mx-auto w-full max-w-xl"
                    />
                </div>

                <div className="taskmo-card flex justify-center p-6">
                    <UpdatePasswordForm className="mx-auto w-full max-w-xl" />
                </div>

                <div className="taskmo-card flex justify-center p-6 border-red-500/40 dark:border-red-500/40">
                    <DeleteUserForm className="mx-auto w-full max-w-xl" />
                </div>
            </div>
        </TaskMoLayout>
    );
}
