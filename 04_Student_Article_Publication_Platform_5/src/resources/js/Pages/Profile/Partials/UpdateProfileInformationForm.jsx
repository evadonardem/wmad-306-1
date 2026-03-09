import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white eclipse:text-rose-50 transition-colors">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 eclipse:text-rose-300 font-light transition-colors">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="dark:text-cyan-500/60 eclipse:!text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full dark:bg-slate-900 eclipse:!bg-rose-950/50 eclipse:!border-red-800/50 eclipse:!text-rose-100 eclipse:focus:!border-red-500 eclipse:focus:!ring-red-500 transition-colors"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="dark:text-cyan-500/60 eclipse:!text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full dark:bg-slate-900 eclipse:!bg-rose-950/50 eclipse:!border-red-800/50 eclipse:!text-rose-100 eclipse:focus:!border-red-500 eclipse:focus:!ring-red-500 transition-colors"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="dark:bg-cyan-600 dark:hover:bg-cyan-500 eclipse:!bg-red-700 hover:eclipse:!bg-red-600 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                        Save Changes
                    </PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-emerald-600 dark:text-cyan-400 eclipse:text-red-400 font-mono text-[10px] uppercase transition-colors">Verified & Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
