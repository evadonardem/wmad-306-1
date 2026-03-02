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

    // Theme Toggle Logic
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-500 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-slate-900 relative">
            <Head title="Register" />

            {/* THEME TOGGLE BUTTON */}
            <button
                onClick={() => setIsDark(!isDark)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-cyan-400 shadow-md hover:ring-2 hover:ring-cyan-400 transition-all duration-300 z-50"
                title="Toggle Theme"
            >
                {isDark ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            {/* Main Glassmorphism Container (Flipped layout for variety) */}
            <div className="flex w-full max-w-4xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(0,238,255,0.1)] overflow-hidden transition-colors duration-500 flex-row-reverse">

                {/* Right Side: The Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[100px] -z-10 hidden dark:block"></div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">Create Account</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Join the Student Article Publication Platform.</p>
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
                            InputLabelProps={{ className: 'dark:text-slate-300' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20' }}
                        />

                        {/* EMAIL FIELD (Test accounts dropdown removed) */}
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
                            InputLabelProps={{ className: 'dark:text-slate-300' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20' }}
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
                            InputLabelProps={{ className: 'dark:text-slate-300' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20' }}
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
                            InputLabelProps={{ className: 'dark:text-slate-300' }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20' }}
                        />

                        <Button
                            type="submit"
                            disabled={processing}
                            variant="contained"
                            fullWidth
                            size="large"
                            className="!bg-cyan-600 dark:!bg-cyan-500 hover:dark:!bg-cyan-400 !text-white dark:!text-slate-900 !font-bold !text-sm !uppercase !tracking-wider !py-4 !rounded-xl dark:shadow-[0_0_15px_rgba(0,238,255,0.4)] hover:dark:shadow-[0_0_25px_rgba(0,238,255,0.6)] transition-all duration-300 !mt-4"
                        >
                            Register
                        </Button>
                    </form>
                </div>

                {/* Left Side: Gradient Panel */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-blue-600 to-cyan-500 p-12 flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl"></div>

                    <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg z-10">Welcome Back!</h2>
                    <p className="text-cyan-50 text-lg mb-10 leading-relaxed max-w-sm z-10">
                        Already have an account? Sign in to continue your journey and manage your publications.
                    </p>

                    <Link
                        href={route('login')}
                        className="z-10 px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-lg"
                    >
                        Log In
                    </Link>
                </div>

            </div>
        </div>
    );
}
