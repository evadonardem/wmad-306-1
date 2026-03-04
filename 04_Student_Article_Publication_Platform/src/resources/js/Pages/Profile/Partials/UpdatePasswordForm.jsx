import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
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
                if (errors.password) { reset('password', 'password_confirmation'); passwordInput.current.focus(); }
                if (errors.current_password) { reset('current_password'); currentPasswordInput.current.focus(); }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white eclipse:text-rose-50 transition-colors">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 eclipse:text-rose-300 font-light transition-colors">
                    Ensure your account is using a long, random password.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" className="dark:text-cyan-500/60 eclipse:!text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full dark:bg-slate-900 eclipse:!bg-rose-950/50 eclipse:!border-red-800/50 eclipse:!text-rose-100 eclipse:focus:!border-red-500 eclipse:focus:!ring-red-500 transition-colors"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" className="dark:text-cyan-500/60 eclipse:!text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full dark:bg-slate-900 eclipse:!bg-rose-950/50 eclipse:!border-red-800/50 eclipse:!text-rose-100 eclipse:focus:!border-red-500 eclipse:focus:!ring-red-500 transition-colors"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="dark:bg-cyan-600 dark:hover:bg-cyan-500 eclipse:!bg-red-700 hover:eclipse:!bg-red-600 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                        Update Key
                    </PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-emerald-600 dark:text-cyan-400 eclipse:text-red-400 font-mono text-[10px] uppercase transition-colors">Success // Encrypted.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
