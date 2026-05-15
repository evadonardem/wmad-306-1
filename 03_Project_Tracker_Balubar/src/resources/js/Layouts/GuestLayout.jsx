import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-12 w-12" textClassName="text-3xl font-bold text-blue-900" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-xl bg-white px-6 py-8 shadow-xl sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
