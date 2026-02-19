import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="text-center mb-6">
                <ApplicationLogo className="h-16 w-16 mx-auto bg-white rounded-full p-2" />
                <h2 className="mt-4 text-2xl font-bold">Create your account</h2>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-white" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={data.name}
                        className="mt-1 block w-full bg-gray-800 text-white placeholder-gray-400 border-none rounded-md px-3 py-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-white"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        placeholder="••••••••"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-gray-800 text-white placeholder-gray-400 border-none rounded-md px-3 py-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="terms"
                        checked={data.terms}
                        onChange={(e) => setData('terms', e.target.checked)}
                    />
                    <span className="ml-2 text-gray-300 text-sm">
                        I agree to the{' '}
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-red-400 hover:underline"
                        >
                            Terms and Conditions
                        </a>
                    </span>
                </div>

                <PrimaryButton
                    className="w-full bg-red-600 hover:bg-red-500 focus:ring-red-600 rounded-md py-2 transition-colors duration-150"
                    type="submit"
                    disabled={processing}
                >
                    Register
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-300">
                Already registered?{' '}
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/login';
                    }}
                    className="text-red-400 hover:underline"
                >
                    Log in
                </Link>
            </div>
        </GuestLayout>
    );
}
