import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            {/* header with logo */}
            <header className="flex justify-center py-6">
                <Link href="/" className="inline-flex items-center">
                    <ApplicationLogo className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-xl font-semibold text-gray-800">
                        ProjectTracker
                    </span>
                </Link>
            </header>

            <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Verify Your Email
                    </h2>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we just
                        emailed to you? If you didn't receive the email, we will
                        gladly send you another.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-700">
                                A new verification link has been sent to the email
                                address you provided during registration.
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <PrimaryButton
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Resend Verification Email
                        </PrimaryButton>

                        <SecondaryButton
                            as={Link}
                            href={route('logout')}
                            method="post"
                            className="w-full"
                        >
                            Log Out
                        </SecondaryButton>
                    </form>
                </div>
            </main>
        </GuestLayout>
    );
}
