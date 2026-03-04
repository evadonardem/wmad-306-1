import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextField, Button } from '@mui/material';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // 1. Initialize 3-way theme (light, dark, eclipse)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    // 2. Cycle through the 3 themes
    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('eclipse');
        else setTheme('light');
    };

    // 3. Apply the specific class to the HTML document
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark', 'eclipse');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 eclipse:bg-zinc-950/90 eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')] eclipse:bg-cover eclipse:bg-center eclipse:bg-fixed eclipse:bg-blend-overlay transition-colors duration-500 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 eclipse:selection:bg-red-500 selection:text-white relative">
            <Head title="Register" />

            {/* THEME TOGGLE BUTTON (3-WAY ROTATION) */}
            <button
                onClick={cycleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg bg-white dark:bg-slate-800 eclipse:bg-rose-900/50 text-slate-500 dark:text-cyan-400 eclipse:text-red-500 shadow-md hover:ring-2 hover:ring-cyan-400 eclipse:hover:ring-red-500 transition-all duration-300 z-50"
                title={`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
                {theme === 'light' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
                {theme === 'dark' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
                {theme === 'eclipse' && (
                    <svg className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" className="text-red-900/50" />
                        <path d="M12 2a10 10 0 000 20 10.5 10.5 0 010-20z" className="text-red-500" />
                    </svg>
                )}
            </button>

            {/* Main Glassmorphism Container (Flipped layout) */}
            <div className="flex w-full max-w-4xl bg-white/80 dark:bg-white/5 eclipse:bg-rose-900/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 eclipse:border-red-900/30 rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(0,238,255,0.1)] eclipse:shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden transition-colors duration-500 flex-row-reverse">

                {/* Right Side: The Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 eclipse:bg-red-500/10 blur-[100px] -z-10 hidden dark:block"></div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white eclipse:text-rose-50 mb-2 tracking-tight transition-colors">Create Account</h2>
                        <p className="text-slate-600 dark:text-slate-400 eclipse:text-rose-300 text-sm transition-colors">Join the Student Article Publication Platform.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <TextField
                            label="Full Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 transition-colors' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 transition-colors' }}
                        />

                        <TextField
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="email"
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 transition-colors' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 transition-colors' }}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 transition-colors' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 transition-colors' }}
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 transition-colors' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 transition-colors' }}
                        />

                        <Button
                            type="submit"
                            disabled={processing}
                            variant="contained"
                            fullWidth
                            size="large"
                            className="!bg-cyan-600 dark:!bg-cyan-500 eclipse:!bg-red-700 hover:dark:!bg-cyan-400 hover:eclipse:!bg-red-600 !text-white dark:!text-slate-900 eclipse:!text-white !font-bold !text-sm !uppercase !tracking-wider !py-4 !rounded-xl dark:shadow-[0_0_15px_rgba(0,238,255,0.4)] eclipse:shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:dark:shadow-[0_0_25px_rgba(0,238,255,0.6)] hover:eclipse:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all duration-300 !mt-4"
                        >
                            Register
                        </Button>
                    </form>
                </div>

                {/* Left Side: Gradient Panel */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-blue-600 to-cyan-500 eclipse:from-red-950 eclipse:via-rose-800 eclipse:to-red-600 p-12 flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 eclipse:bg-red-500/20 rounded-full blur-2xl transition-colors"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-300/30 eclipse:bg-rose-500/30 rounded-full blur-3xl transition-colors"></div>

                    <h2 className="text-4xl font-extrabold text-white eclipse:text-rose-50 mb-6 drop-shadow-lg z-10 transition-colors">Welcome Back!</h2>
                    <p className="text-cyan-50 eclipse:text-rose-200 text-lg mb-10 leading-relaxed max-w-sm z-10 transition-colors">
                        Already have an account? Sign in to continue your journey and manage your publications.
                    </p>

                    <Link
                        href={route('login')}
                        className="z-10 px-8 py-3 border-2 border-white eclipse:border-rose-200 text-white eclipse:text-rose-100 font-bold rounded-xl hover:bg-white hover:text-blue-900 eclipse:hover:bg-rose-200 eclipse:hover:text-red-900 transition-all duration-300 shadow-lg"
                    >
                        Log In
                    </Link>
                </div>

            </div>
        </div>
    );
}
