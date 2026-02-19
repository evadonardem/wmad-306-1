import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Login({ canResetPassword, status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="text-center mb-6">
                <ApplicationLogo className="h-16 w-16 mx-auto bg-white rounded-full p-2" />
                <h2 className="mt-4 text-2xl font-bold">Sign in to your account</h2>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {status && (
                    <div className="text-sm text-green-600">{status}</div>
                )}
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-white" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={data.email}
                        className="mt-1 block w-full bg-gray-800 text-white placeholder-gray-400 border-none rounded-md px-3 py-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-white" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        className="mt-1 block w-full bg-gray-800 text-white placeholder-gray-400 border-none rounded-md px-3 py-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-300">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2">Remember me</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-red-400 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <PrimaryButton
                    className="w-full bg-red-600 hover:bg-red-500 focus:ring-red-600 rounded-md py-2 transition-colors duration-150"
                    type="submit"
                    disabled={processing}
                >
                    Log In
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-300">
                Don’t have an account?{' '}
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/register';
                    }}
                    className="text-red-400 hover:underline"
                >
                    Register
                </Link>
            </div>
        </GuestLayout>
    );
}
