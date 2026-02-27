import ProTrackLogo from '@/Components/ProTrackLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 overflow-hidden">
            {/* Decorative blurred circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

            {/* Logo */}
            <div className="mb-8 relative z-10">
                <Link href="/" className="inline-block transform hover:scale-110 transition-transform duration-300">
                    <ProTrackLogo />
                </Link>
            </div>

            {/* Form Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-8 border border-white/20">
                    <div className="animate-fadeInUp">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
