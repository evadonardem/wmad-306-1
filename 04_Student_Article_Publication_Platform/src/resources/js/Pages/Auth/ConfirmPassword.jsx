import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="space-y-5">
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border, backgroundColor: `${colors.aged}66` }}>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: colors.byline }}>
                        Security Verification
                    </p>
                    <h1 className="mt-2 font-serif text-3xl font-black leading-tight" style={{ color: colors.newsprint }}>
                        Confirm your password
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: colors.byline }}>
                        This action requires a quick password confirmation.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <InputLabel htmlFor="password" value="Password" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-lg border px-3 py-2.5 text-sm"
                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm font-serif font-bold"
                        style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                    >
                        {processing ? 'Confirming...' : 'Confirm Password'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
