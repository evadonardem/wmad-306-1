import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'student',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
                <p className="mt-1 text-sm text-slate-500">Choose your role and start publishing or reading.</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Choose Role" />
                    <div className="mt-2 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setData('role', 'student')}
                            className={`rounded-lg border px-3 py-3 text-left transition ${
                                data.role === 'student'
                                    ? 'border-emerald-400 bg-emerald-50 shadow'
                                    : 'border-slate-200 bg-white hover:border-emerald-300'
                            }`}
                        >
                            <p className="font-semibold text-slate-800">Student</p>
                            <p className="text-xs text-slate-500">Instant access, no approval needed.</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('role', 'writer')}
                            className={`rounded-lg border px-3 py-3 text-left transition ${
                                data.role === 'writer'
                                    ? 'border-amber-400 bg-amber-50 shadow'
                                    : 'border-slate-200 bg-white hover:border-amber-300'
                            }`}
                        >
                            <p className="font-semibold text-slate-800">Writer</p>
                            <p className="text-xs text-slate-500">Needs admin approval before posting.</p>
                        </button>
                    </div>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-slate-600 underline hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4 bg-slate-900 hover:bg-slate-700" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
