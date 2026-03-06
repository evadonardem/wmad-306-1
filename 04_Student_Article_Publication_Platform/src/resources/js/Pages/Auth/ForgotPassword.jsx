import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="space-y-5">
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        Recovery Center
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Forgot your password?
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        We will email you a secure reset link to regain access to your account.
                    </p>
                </div>

                {status && (
                    <div className="rounded-md border p-3 text-sm font-medium" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', color: '#166534' }}>
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium" style={{ color: colors.newsprint }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            placeholder="you@school.edu"
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-serif font-bold"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Sending link...' : 'Email Reset Link'}
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
