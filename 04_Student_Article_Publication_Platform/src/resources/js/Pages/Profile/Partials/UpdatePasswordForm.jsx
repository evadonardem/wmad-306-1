import InputError from '@/Components/InputError';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-7 rounded-xl border p-5" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}88` }}>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                    Security
                </p>
                <h3 className="mt-1 font-serif text-2xl font-black" style={{ color: colors.newsprint }}>
                    Change Password
                </h3>
                <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                    Use a long and unique password to improve account security.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="current_password" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                        New Password
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                        autoComplete="new-password"
                    />
                    <p className="text-xs" style={{ color: colors.byline }}>
                        Use at least 8 characters with a mix of letters, numbers, and symbols.
                    </p>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                        Confirm New Password
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: colors.border }}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl border px-5 py-2.5 text-sm font-serif font-bold transition hover:opacity-95"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Saving...' : 'Save Password'}
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
