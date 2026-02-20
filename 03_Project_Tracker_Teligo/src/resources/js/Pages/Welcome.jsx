import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Project Tracker" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

                {/* 🔥 NAVBAR */}
                <nav className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold tracking-tight">
                        🚀 ProjectTracker
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hover:text-gray-300 transition"
                                >
                                    Log In
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* 🔥 HERO SECTION */}
                <section className="flex flex-col items-center justify-center text-center px-6 py-32">

                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Organize Your Work.
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Track Progress Smarter.
                        </span>
                    </h1>

                    <p className="text-lg text-gray-300 max-w-2xl mb-10">
                        A clean and modern project management dashboard built for
                        developers and teams who want clarity, speed, and focus.
                    </p>

                    {!auth.user && (
                        <div className="flex gap-6">
                            <Link
                                href={route('register')}
                                className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition font-semibold text-lg shadow-lg"
                            >
                                Get Started Free
                            </Link>

                            <Link
                                href={route('login')}
                                className="px-8 py-4 rounded-full border border-gray-500 hover:border-white transition font-semibold text-lg"
                            >
                                Log In
                            </Link>
                        </div>
                    )}
                </section>

                {/* 🔥 FEATURES SECTION */}
                <section className="max-w-6xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-10 text-center">

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-3">
                            📋 Project Management
                        </h3>
                        <p className="text-gray-400">
                            Create and organize projects with a clean visual layout.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-3">
                            ✅ Task Tracking
                        </h3>
                        <p className="text-gray-400">
                            Mark tasks complete and monitor progress instantly.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-3">
                            📊 Progress Insights
                        </h3>
                        <p className="text-gray-400">
                            Visual progress bars help you stay motivated and focused.
                        </p>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="text-center text-gray-500 pb-8">
                    © {new Date().getFullYear()} ProjectTracker. All rights reserved.
                </footer>

            </div>
        </>
    );
}