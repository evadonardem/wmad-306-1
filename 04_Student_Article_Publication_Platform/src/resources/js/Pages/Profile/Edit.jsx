import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">
                    Account Settings
                </h2>
            }
        >
            <Head title="Profile" />

            {/* Changed eclipse:bg-rose-950 to eclipse:bg-transparent to show the Cid background */}
            <div className="py-12 bg-white dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Ghost Card 1: Information */}
                    <div className="bg-white dark:bg-slate-900 eclipse:bg-rose-900/60 eclipse:backdrop-blur-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 eclipse:border-red-900/50 sm:rounded-3xl sm:p-8 transition-colors duration-500">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Ghost Card 2: Security */}
                    <div className="bg-white dark:bg-slate-900 eclipse:bg-rose-900/60 eclipse:backdrop-blur-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 eclipse:border-red-900/50 sm:rounded-3xl sm:p-8 transition-colors duration-500">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Ghost Card 3: Danger Zone */}
                    <div className="bg-white dark:bg-slate-900 eclipse:bg-rose-900/60 eclipse:backdrop-blur-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 eclipse:border-red-900/50 sm:rounded-3xl sm:p-8 transition-colors duration-500">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
