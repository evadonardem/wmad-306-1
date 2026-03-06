import InputError from '@/Components/InputError';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-7 rounded-xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}88` }}>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                    Personal Information
                </p>
                <h3 className="mt-1 font-serif text-2xl font-black" style={{ color: colors.newsprint }}>
                    Update Profile Information
                </h3>
                <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                    Keep your account name and email address up to date.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                        Full Name
                    </label>
                    <input
                        id="name"
                        className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <p className="text-xs" style={{ color: colors.byline }}>
                        This is the name shown across your profile and content.
                    </p>
                    <InputError className="mt-1" message={errors.name} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <p className="text-xs" style={{ color: colors.byline }}>
                        We use this email for sign-in, alerts, and security notifications.
                    </p>
                    <InputError className="mt-1" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}55` }}>
                        <p className="text-sm" style={{ color: colors.newsprint }}>
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline underline-offset-2"
                                style={{ color: colors.accent }}
                            >
                                Click here to re-send verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium" style={{ color: '#166534' }}>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: colors.border }}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl border px-5 py-2.5 text-sm font-serif font-bold transition hover:opacity-95"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>

                    {recentlySuccessful && (
                        <p className="text-sm font-medium" style={{ color: colors.byline }}>
                            Saved.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
