import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    // Shared classes applied to strip away solid backgrounds and replace with frosted translucent glass
    const cardStyle = "p-4 sm:p-8 bg-white/60 dark:bg-slate-900/60 eclipse:bg-rose-900/60 lunar:bg-pink-950/40 lunar:backdrop-blur-xl shadow-lg sm:rounded-[2rem] border border-white/20 dark:border-slate-800 eclipse:border-red-900/50 lunar:border-rose-700/50 transition-all duration-500";

    // Forces text coloring strictly for Lunar mode
    const textFix = "[&_h2]:lunar:text-white [&_p]:lunar:text-pink-100 [&_label]:lunar:text-pink-50 [&_input]:lunar:bg-pink-950/40 [&_input]:lunar:text-white [&_input]:lunar:border-rose-700/50";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white eclipse:text-rose-50 lunar:text-white leading-tight transition-colors">Account Settings</h2>}
        >
            <Head title="Profile" />

            <div className="py-12 transition-all duration-500 z-10 relative">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    <div className={`${cardStyle} ${textFix}`}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className={`${cardStyle} ${textFix}`}>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className={`${cardStyle} ${textFix}`}>
                        <DeleteUserForm className="max-w-xl" />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
