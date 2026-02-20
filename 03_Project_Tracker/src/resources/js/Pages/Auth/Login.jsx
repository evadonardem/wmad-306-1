import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-16 flex-col justify-between">
                    
                    <div>
                        <h1 className="text-4xl font-bold mb-6">
                            Project Tracker
                        </h1>

                        <p className="text-lg opacity-90">
                            Organize your projects. Track your tasks. 
                            Stay productive.
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
                            Welcome Back 👋
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Please login to your account
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">

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
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
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
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                    <span className="ms-2 text-slate-600 dark:text-slate-300">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Button */}
                            <PrimaryButton
                                className="w-full justify-center rounded-lg py-3 text-base bg-indigo-600 hover:bg-indigo-500 transition"
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Log in'}
                            </PrimaryButton>

                        </form>

                        <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
                            Don’t have an account?{' '}
                            <Link
                                href={route('register')}
                                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
                            >
                                Register
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}