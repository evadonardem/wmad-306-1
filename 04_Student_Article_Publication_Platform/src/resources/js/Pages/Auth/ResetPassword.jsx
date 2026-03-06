import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="space-y-5">
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        Password Reset
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Create a new password
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        Use a strong password you have not used before.
                    </p>
                </div>

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
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="password" value="New Password" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="space-y-1">
                        <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-serif font-bold"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="flex items-center justify-end border-t pt-4" style={{ borderColor: colors.border }}>
                    <Link href={route('login')} className="text-xs font-mono uppercase tracking-[0.16em] underline" style={{ color: colors.byline }}>
                        Back to sign in
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
