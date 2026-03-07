import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="space-y-5">
                <div className="border p-4 fyi-surface fyi-fade-up" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        Student Portal Access
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        Sign in to continue to your dashboard, writing tools, and account settings.
                    </p>
                </div>

                {status && (
                    <div className="border p-3 text-sm font-medium" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', color: '#166534' }}>
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            className="block w-full border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            placeholder="you@school.edu"
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="password" value="Password" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            placeholder="Enter password"
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: colors.byline }}>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{ accentColor: colors.accent }}
                            />
                            Keep me signed in
                        </label>
                        {canResetPassword ? (
                            <Link href={route('password.request')} className="underline" style={{ color: colors.byline }}>
                                Forgot password?
                            </Link>
                        ) : (
                            <span />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full border px-4 py-2.5 text-sm font-serif font-bold transition"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center justify-end border-t pt-4" style={{ borderColor: colors.border }}>
                    <Link
                        href={route('register')}
                        className="text-xs font-mono uppercase tracking-[0.16em] underline"
                        style={{ color: colors.byline }}
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}

