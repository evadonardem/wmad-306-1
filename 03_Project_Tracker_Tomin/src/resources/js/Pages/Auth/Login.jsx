import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
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
        <GuestLayout>
            <Head title="Log in" />

            {/* Title */}
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold protrack-gradient-text">Welcome Back</h2>
                <p className="text-gray-500 text-sm mt-2">Sign in to your ProTrack account</p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        isFocused={true}
                        placeholder="you@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-700">
                            Remember me
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Sign In Button */}
                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    {processing ? 'Signing in...' : 'Sign In'}
                </PrimaryButton>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>

            {/* Forgot Password Section */}
            {canResetPassword && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-3">Having trouble logging in?</p>
                        <Link
                            href={route('password.request')}
                            className="inline-flex items-center justify-center px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                        >
                            Reset Password
                        </Link>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
