import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="space-y-5">
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        New Account Setup
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Join The FYI
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        Create your account to publish, comment, and collaborate across the platform.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <InputLabel htmlFor="name" value="Full Name" />
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            placeholder="Jane Doe"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            placeholder="you@school.edu"
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <InputLabel htmlFor="password" value="Password" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                placeholder="Create password"
                            />
                        </div>

                        <div className="space-y-1">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>

                    {(errors.password || errors.password_confirmation) && (
                        <InputError message={errors.password || errors.password_confirmation} className="mt-1" />
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-serif font-bold transition"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="flex items-center justify-end border-t pt-4" style={{ borderColor: colors.border }}>
                    <Link
                        href={route('login')}
                        className="text-xs font-mono uppercase tracking-[0.16em] underline"
                        style={{ color: colors.byline }}
                    >
                        Sign in instead
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
