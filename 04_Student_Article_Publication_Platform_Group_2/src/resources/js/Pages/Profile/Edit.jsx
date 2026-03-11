import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage, router } from '@inertiajs/react'

import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }) {

    const { auth } = usePage().props

    // safer role detection
    const role = auth?.user?.roles?.length
        ? auth.user.roles[0].name
        : null

    const dashboardRoute = role === 'writer'
        ? 'writer.dashboard'
        : role === 'editor'
        ? 'editor.dashboard'
        : role === 'student'
        ? 'student.dashboard'
        : null

    const dashboardLabel = role === 'writer'
        ? 'Writer Dashboard'
        : role === 'editor'
        ? 'Editor Dashboard'
        : role === 'student'
        ? 'Student Dashboard'
        : 'Home'

    const goBack = () => {

        if (dashboardRoute) {

            router.visit(route(dashboardRoute))

        } else {

            router.visit('/')

        }

    }

    const roles = auth?.user?.roles?.map((r) => r.name) ?? []
    const demoUser = roles.includes('writer') && roles.includes('editor') && roles.includes('student')

    return (

        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-3xl font-serif">
                        Profile
                    </h2>

                    {demoUser && (
                        <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Demo account: can switch roles quickly
                        </p>
                    )}
                </>
            }
        >

            <Head title="Profile" />

            <div className="max-w-7xl mx-auto px-10 pb-20">

                {roles.includes('student') && (
                    <div className="mb-6">
                        <button
                            onClick={() => router.visit(route('student.favorites'))}
                            className="px-4 py-2 bg-[#0F172A] text-white rounded-md hover:bg-[#1E293B] text-sm"
                        >
                            Saved Articles
                        </button>
                    </div>
                )}

                <div className="space-y-10">

                    {/* DEMO ROLE NAV (test@gmail.com only) */}

                    {demoUser && (
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="text-lg font-semibold mb-4">Quick role navigation</h3>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-[#0F172A] text-white rounded-md hover:bg-[#1E293B]"
                                    onClick={() => router.visit(route('writer.dashboard'))}
                                >
                                    Writer Dashboard
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                    onClick={() => router.visit(route('editor.dashboard'))}
                                >
                                    Editor Dashboard
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => router.visit(route('student.dashboard'))}
                                >
                                    Student Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PROFILE INFO */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <UpdatePasswordForm
                            className="max-w-xl"
                        />

                    </div>


                    {/* DELETE ACCOUNT */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <DeleteUserForm
                            className="max-w-xl"
                        />

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}
