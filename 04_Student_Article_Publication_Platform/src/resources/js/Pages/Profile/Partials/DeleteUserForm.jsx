import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="rounded-xl border p-5" style={{ borderColor: '#fecaca', backgroundColor: '#fff7f7' }}>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: '#b91c1c' }}>
                    Danger Zone
                </p>
                <h3 className="mt-1 font-serif text-2xl font-black" style={{ color: '#7f1d1d' }}>
                    Delete Account
                </h3>
                <p className="mt-1 text-sm" style={{ color: '#991b1b' }}>
                    This action is irreversible. All account data and related records will be permanently removed.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="rounded-xl border px-5 py-2.5 text-sm font-serif font-bold transition hover:opacity-95"
                style={{ borderColor: '#b91c1c', backgroundColor: '#b91c1c', color: '#ffffff' }}
            >
                Delete Account
            </button>

            {confirmingUserDeletion && (
                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="p-6 sm:p-8" style={{ backgroundColor: colors.paper }}>
                        <h4 className="font-serif text-xl font-black" style={{ color: colors.newsprint }}>
                            Confirm Account Deletion
                        </h4>

                        <p className="mt-2 text-sm" style={{ color: colors.byline }}>
                            Enter your password to confirm permanent account deletion.
                        </p>

                        <div className="mt-6 space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold tracking-wide" style={{ color: colors.newsprint }}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                placeholder="Password"
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t pt-4" style={{ borderColor: colors.border }}>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl border px-4 py-2.5 text-sm font-medium"
                                style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl border px-5 py-2.5 text-sm font-serif font-bold transition hover:opacity-95"
                                style={{ borderColor: '#b91c1c', backgroundColor: '#b91c1c', color: '#ffffff' }}
                            >
                                {processing ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </section>
    );
}
