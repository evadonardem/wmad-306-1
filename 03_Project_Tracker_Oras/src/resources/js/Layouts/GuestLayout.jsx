import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0"
            style={{ backgroundColor: '#e8f5e9' }}
        >
            <div style={{
                padding: '16px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #a5d6a7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-800" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden px-6 py-4 sm:max-w-md"
                style={{ backgroundColor: 'transparent' }}
            >
                {children}
            </div>
        </div>
    );
}
