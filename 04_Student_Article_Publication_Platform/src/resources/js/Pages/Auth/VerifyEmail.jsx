import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="space-y-5">
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        Verification Required
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Verify your email
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        Check your inbox for the verification link. Need a new one? Send again below.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-md border p-3 text-sm font-medium" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4', color: '#166534' }}>
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-serif font-bold"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </form>

                <div className="flex items-center justify-end border-t pt-4" style={{ borderColor: colors.border }}>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs font-mono uppercase tracking-[0.16em] underline"
                        style={{ color: colors.byline }}
                    >
                        Log Out
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
