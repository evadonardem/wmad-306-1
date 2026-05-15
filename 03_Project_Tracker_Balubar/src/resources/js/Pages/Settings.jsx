import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Settings({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                Account Settings
                            </h3>

                            <div className="space-y-6">
                                <div className="border-b border-blue-100 pb-6">
                                    <h4 className="text-md font-medium text-blue-800 mb-2">
                                        Profile Information
                                    </h4>
                                    <p className="text-sm text-blue-600">
                                        Update your account's profile information and email address.
                                    </p>
                                    <a
                                        href={route('profile.edit')}
                                        className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </a>
                                </div>

                                <div className="border-b border-blue-100 pb-6">
                                    <h4 className="text-md font-medium text-blue-800 mb-2">
                                        Security
                                    </h4>
                                    <p className="text-sm text-blue-600">
                                        Ensure your account is using a long, random password to stay secure.
                                    </p>
                                    <a
                                        href={route('profile.edit')}
                                        className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        Change Password
                                    </a>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-blue-800 mb-2">
                                        Danger Zone
                                    </h4>
                                    <p className="text-sm text-blue-600">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                Application Settings
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-md font-medium text-blue-800">
                                            Email Notifications
                                        </h4>
                                        <p className="text-sm text-blue-600">
                                            Receive email updates about your projects
                                        </p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-md font-medium text-blue-800">
                                            Task Reminders
                                        </h4>
                                        <p className="text-sm text-blue-600">
                                            Get reminded about upcoming task deadlines
                                        </p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-md font-medium text-blue-800">
                                            Weekly Summary
                                        </h4>
                                        <p className="text-sm text-blue-600">
                                            Receive weekly project progress summaries
                                        </p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
