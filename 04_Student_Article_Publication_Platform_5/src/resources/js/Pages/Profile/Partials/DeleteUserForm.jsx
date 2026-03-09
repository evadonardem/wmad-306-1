import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

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
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white eclipse:text-rose-50 transition-colors">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 eclipse:text-rose-300 transition-colors">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="eclipse:!bg-red-900 hover:eclipse:!bg-red-800 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                {/* Apply dark/eclipse styles directly to the form inside the modal */}
                <form onSubmit={deleteUser} className="p-6 dark:bg-slate-900 eclipse:bg-rose-950 transition-colors duration-500">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white eclipse:text-rose-50 transition-colors">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 eclipse:text-rose-300 transition-colors">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4 dark:bg-slate-800 eclipse:!bg-rose-900/50 eclipse:!border-red-800/50 eclipse:!text-rose-100 eclipse:focus:!border-red-500 eclipse:focus:!ring-red-500 transition-colors"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className="dark:!bg-slate-800 dark:!text-slate-300 eclipse:!bg-rose-900 eclipse:!text-rose-200 eclipse:!border-red-900/50 hover:eclipse:!bg-rose-800 transition-all">
                            Cancel
                        </SecondaryButton>

                        <DangerButton className="ms-3 eclipse:!bg-red-800 hover:eclipse:!bg-red-700 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all" disabled={processing}>
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
