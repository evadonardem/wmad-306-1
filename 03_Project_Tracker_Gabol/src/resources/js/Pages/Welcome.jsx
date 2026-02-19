import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to BizHub" />
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                {/* Navigation */}
                <nav className="flex justify-between items-center p-4 sm:p-6 lg:p-8">
                    <div className="text-3xl font-bold text-white">BizHub</div>
                    <div className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2 text-white font-semibold hover:text-gray-200 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
                    <div className="text-center max-w-3xl">
                        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                            Manage Your Business Like Never Before
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            A modern business management system combining the best of team collaboration, project tracking, and communication in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition text-lg border border-white"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Features */}
                        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                                <div className="text-4xl mb-3">👥</div>
                                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                                <p className="text-blue-100">Connect with your team members and work together seamlessly.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                                <div className="text-4xl mb-3">📊</div>
                                <h3 className="text-xl font-bold mb-2">Project Management</h3>
                                <p className="text-blue-100">Track projects, tasks, and deadlines with ease.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                                <div className="text-4xl mb-3">💬</div>
                                <h3 className="text-xl font-bold mb-2">Real-time Communication</h3>
                                <p className="text-blue-100">Stay connected with instant messaging and notifications.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-black/20 text-white text-center py-6 mt-20">
                    <p>&copy; 2026 BizHub. Your Business, Simplified.</p>
                </footer>
            </div>
        </>
    );
}
