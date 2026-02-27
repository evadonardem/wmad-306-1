import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const firstName = auth.user.name.split(' ')[0];
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">
                    Overview
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-16 sm:py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    {/* Welcome Section */}
                    <div className="mb-12 border-b border-gray-100 dark:border-slate-800 pb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                            Welcome back, {firstName}.
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
                            {isAdmin
                                ? "Your administrative hub for overseeing student submissions, maintaining quality standards, and managing the publication platform."
                                : "Your central hub for drafting, managing, and publishing your articles. What would you like to share with the world today?"}
                        </p>
                    </div>

                    {/* Action Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {isAdmin ? (
                            <div className="md:col-span-2 group relative p-8 md:p-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Administration</h3>
                                    <span className="font-mono text-[10px] text-gray-400 dark:text-cyan-400 uppercase tracking-widest border border-gray-200 dark:border-cyan-900/50 px-3 py-1.5 rounded bg-gray-50 dark:bg-slate-800/50">
                                        SYS // 00
                                    </span>
                                </div>
                                <p className="text-gray-500 dark:text-slate-400 mb-10 text-lg font-light leading-relaxed max-w-3xl">
                                    Evaluate the queue of newly submitted student articles, and browse the complete archive of previously accepted and rejected content.
                                </p>
                                <div>
                                    <Link href={route('articles.admin')} className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-all duration-300">
                                        Open Admin Board
                                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="group relative p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Write an Article</h3>
                                        <p className="text-gray-500 dark:text-slate-400 mb-8 font-light leading-relaxed">Start with a blank canvas. Draft your thoughts and format them beautifully.</p>
                                    </div>
                                    <div>
                                        <Link href={route('articles.create')} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-all">
                                            Start Writing
                                        </Link>
                                    </div>
                                </div>
                                <div className="group p-8 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-3xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">My Publications</h3>
                                            <span className="font-mono text-[10px] text-gray-400 dark:text-cyan-400 uppercase tracking-widest border border-gray-200 dark:border-slate-700 px-2 py-1 rounded">LOG // 01</span>
                                        </div>
                                        <p className="text-gray-500 dark:text-slate-400 mb-8 font-light leading-relaxed">Track the status of your submitted articles and view your published work.</p>
                                    </div>
                                    <div>
                                        <Link href={route('articles.index')} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 shadow-sm transition-all">
                                            View Library
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
