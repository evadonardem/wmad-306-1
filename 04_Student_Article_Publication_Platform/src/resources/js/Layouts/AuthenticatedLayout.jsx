import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';

export default function AuthenticatedLayout({ user, header, children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('eclipse');
        else setTheme('light');
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark', 'eclipse');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const isAdmin = user?.role === 'admin' || user?.roles?.some(r => r.name === 'admin');
    const isWriter = user?.roles?.some(r => r.name === 'writer');
    const isEditor = user?.roles?.some(r => r.name === 'editor');
    const isStudent = user?.roles?.some(r => r.name === 'student');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 eclipse:bg-zinc-950/90 eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')] eclipse:bg-cover eclipse:bg-center eclipse:bg-fixed eclipse:bg-blend-overlay transition-colors duration-500">
            <nav className="bg-white dark:bg-slate-900 eclipse:bg-rose-950/90 eclipse:backdrop-blur-lg border-b border-gray-200 dark:border-slate-800 eclipse:border-red-900/50 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="shrink-0 flex items-center mr-10">
                                <Link href="/" className="group flex items-center space-x-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-500
                                        ${theme === 'dark' ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : ''}
                                        ${theme === 'eclipse' ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.7)]' : ''}
                                        ${theme === 'light' ? 'bg-slate-900' : ''}`}
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10M7 16h10" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white eclipse:text-rose-100 tracking-tight">
                                        Student<span className="text-cyan-600 dark:text-cyan-400 eclipse:text-red-500 transition-colors">Article</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:flex h-16">
                                {/* FIXED NAVIGATION COLOR LOGIC */}
                                {isAdmin && (
                                    <NavLink
                                        href={route('articles.admin')}
                                        active={route().current('articles.admin')}
                                        className="eclipse:!text-rose-100 eclipse:!border-red-500"
                                    >
                                        <span className="eclipse:text-rose-100">Admin Dashboard</span>
                                    </NavLink>
                                )}
                                {isWriter && (
                                    <NavLink
                                        href={route('writer.dashboard')}
                                        active={route().current('writer.dashboard')}
                                        className="eclipse:!text-rose-100 eclipse:!border-red-500"
                                    >
                                        <span className="eclipse:text-rose-100">Writer Dashboard</span>
                                    </NavLink>
                                )}
                                {isEditor && (
                                    <NavLink
                                        href={route('editor.dashboard')}
                                        active={route().current('editor.dashboard')}
                                        className="eclipse:!text-rose-100 eclipse:!border-red-500"
                                    >
                                        <span className="eclipse:text-rose-100">Editor Dashboard</span>
                                    </NavLink>
                                )}
                                {isStudent && (
                                    <NavLink
                                        href={route('student.dashboard')}
                                        active={route().current('student.dashboard')}
                                        className="eclipse:!text-rose-100 eclipse:!border-red-500"
                                    >
                                        <span className="eclipse:text-rose-100">Student Dashboard</span>
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6 space-x-4">
                            <button
                                onClick={cycleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 eclipse:bg-rose-900/50 text-gray-500 dark:text-cyan-400 eclipse:text-red-500 hover:ring-2 hover:ring-cyan-400 eclipse:hover:ring-red-500 transition-all duration-300 relative"
                            >
                                {theme === 'light' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                                {theme === 'dark' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                                {theme === 'eclipse' && <svg className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" className="text-red-900/50" /><path d="M12 2a10 10 0 000 20 10.5 10.5 0 010-20z" className="text-red-500" /></svg>}
                            </button>

                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-slate-500 dark:text-slate-400 eclipse:!text-rose-100 bg-transparent hover:text-slate-900 dark:hover:text-white eclipse:hover:!text-red-400 transition-colors">
                                                {user?.name || 'User'}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-slate-900 eclipse:bg-rose-950/80 border-b border-gray-100 dark:border-slate-800 eclipse:border-red-900/30 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                        <div className="text-slate-900 dark:text-white eclipse:text-rose-100 font-semibold text-lg transition-colors">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
