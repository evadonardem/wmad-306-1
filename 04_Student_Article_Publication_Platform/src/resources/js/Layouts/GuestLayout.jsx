import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark', 'eclipse', 'lunar');
        root.classList.add(theme);
    }, [theme]);

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-slate-950 transition-all duration-500
            eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')]
            lunar:bg-[url('https://img.freepik.com/premium-photo/pink-moon-purple-sky-with-palm-tree_1153744-173071.jpg')]
            bg-cover bg-center bg-fixed">

            <div className="z-10">
                <Link href="/">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 eclipse:bg-red-600 lunar:bg-rose-500 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500">
                        <ApplicationLogo className="w-12 h-12 fill-current text-gray-500" />
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white dark:bg-slate-900 eclipse:bg-rose-950/80 lunar:bg-pink-950/40 lunar:backdrop-blur-2xl shadow-md overflow-hidden sm:rounded-3xl border border-transparent eclipse:border-red-900/50 lunar:border-rose-700/50 transition-all duration-500 z-10">
                {children}
            </div>
        </div>
    );
}
