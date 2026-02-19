import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="text-4xl font-bold text-blue-600">BizHub</span>
                    </Link>
                    <p className="text-gray-600 mt-2">Business Management & Team Collaboration</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    {children}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>© 2026 BizHub. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
