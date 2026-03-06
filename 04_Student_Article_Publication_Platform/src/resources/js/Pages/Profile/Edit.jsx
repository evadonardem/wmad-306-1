import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);
    const accountState = mustVerifyEmail && status !== 'verification-link-sent' ? 'Verification Required' : 'Active';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                            Account Center
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-black leading-tight sm:text-3xl" style={{ color: colors.newsprint }}>
                            Profile Settings
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: colors.byline }}>
                            Manage account details, security credentials, and privacy-sensitive actions.
                        </p>
                    </div>
                    <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-wider"
                        style={{
                            borderColor: colors.border,
                            color: colors.newsprint,
                            backgroundColor: `${colors.aged}90`,
                        }}
                    >
                        {accountState}
                    </span>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-10 sm:py-12">
                <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <section
                        className="rounded-2xl border shadow-sm"
                        style={{ backgroundColor: colors.paper, borderColor: colors.border }}
                    >
                        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: colors.accent }} />
                        <div className="p-6 sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-3xl"
                            />
                        </div>
                    </section>

                    <section
                        className="rounded-2xl border shadow-sm"
                        style={{ backgroundColor: colors.paper, borderColor: colors.border }}
                    >
                        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: colors.newsprint }} />
                        <div className="p-6 sm:p-8">
                            <UpdatePasswordForm className="max-w-3xl" />
                        </div>
                    </section>

                    <section
                        className="rounded-2xl border shadow-sm"
                        style={{ backgroundColor: colors.paper, borderColor: '#fecaca' }}
                    >
                        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: '#b91c1c' }} />
                        <div className="p-6 sm:p-8">
                            <DeleteUserForm className="max-w-3xl" />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
