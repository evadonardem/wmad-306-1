import { Head, Link } from '@inertiajs/react';
import ProTrackLogo from '@/Components/ProTrackLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="ProTrack - Project Management" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
                {/* Navigation */}
                <nav className="fixed top-0 w-full protrack-header border-b border-blue-100 backdrop-blur-md z-50">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
                        <ProTrackLogo />
                        <div className="flex gap-3 items-center">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="protrack-btn-primary text-sm px-4 py-2"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="protrack-btn-secondary text-sm px-4 py-2"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="protrack-btn-primary text-sm px-4 py-2"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-40 pb-20 px-6 mx-auto max-w-7xl">
                    {/* Decorative elements */}
                    <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
                    <div className="absolute -bottom-8 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

                    <div className="relative space-y-8 text-center">
                        {/* Main heading */}
                        <div className="space-y-4 animate-fadeInUp">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                <span className="protrack-gradient-text">
                                    ProTrack
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                ProTrack is a streamlined project management tool that helps you organize projects, manage tasks, and track progress in one simple workspace. Stay focused, meet deadlines, and keep everything moving forward.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="protrack-btn-primary text-lg px-10 py-4 shadow-2xl hover:shadow-3xl"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="protrack-btn-primary text-lg px-10 py-4 shadow-2xl hover:shadow-3xl"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="protrack-btn-secondary text-lg px-10 py-4 shadow-lg hover:shadow-xl"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Feature showcase */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideInRight" style={{ animationDelay: '400ms' }}>
                        {[
                            {
                                icon: '🧭',
                                title: 'Minimal by Design',
                                description: "Everything you need. Nothing you don’t.",
                            },
                            {
                                icon: '⚡',
                                title: 'Built for Speed',
                                description: 'Fast interactions that keep up with your workflow.',
                            },
                            {
                                icon: '📈',
                                title: 'Progress, Visualized',
                                description: 'Track milestones and momentum with clarity.',
                            },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="protrack-card p-8 text-center"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-blue-100 py-8 px-6">
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-gray-600">
                            © 2026 ProTrack. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
