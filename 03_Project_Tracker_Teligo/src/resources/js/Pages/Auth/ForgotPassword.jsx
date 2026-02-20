import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-16 flex-col justify-between">
                    
                    <div>
                        <h1 className="text-4xl font-bold mb-6">
                            Reset Your Password
                        </h1>

                        <p className="text-lg opacity-90">
                            Don’t worry. It happens. 
                            We’ll help you get back into your account.
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
                            Forgot Password?
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Enter your email and we’ll send you a reset link.
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">

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
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <PrimaryButton
                                className="w-full justify-center rounded-lg py-3 text-base bg-indigo-600 hover:bg-indigo-500 transition"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Sending Reset Link...'
                                    : 'Email Password Reset Link'}
                            </PrimaryButton>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}