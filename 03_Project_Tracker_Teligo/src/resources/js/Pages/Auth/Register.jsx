import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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
        <>
            <Head title="Register" />

            <div className="min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-16 flex-col justify-between">
                    
                    <div>
                        <h1 className="text-4xl font-bold mb-6">
                            Join Project Tracker
                        </h1>

                        <p className="text-lg opacity-90">
                            Create your account and start managing your
                            projects efficiently.
                        </p>
                    </div>

                    <div className="text-sm opacity-70">
                        © {new Date().getFullYear()} Project Tracker
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-100 dark:bg-slate-900 px-6">

                    <div className="w-full max-w-md">

                        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">
                            Create Account 🚀
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Fill in the details below
                        </p>

                        <form onSubmit={submit} className="space-y-6">

                            {/* Name */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Name"
                                    className="text-slate-700 dark:text-slate-200 font-semibold"
                                />

                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="text-slate-700 dark:text-slate-200 font-semibold"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-slate-700 dark:text-slate-200 font-semibold"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-slate-700 dark:text-slate-200 font-semibold"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit */}
                            <PrimaryButton
                                className="w-full justify-center rounded-lg py-3 text-base bg-indigo-600 hover:bg-indigo-500 transition"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Register'}
                            </PrimaryButton>

                        </form>

                        {/* Login Link */}
                        <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
                            >
                                Log in
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}