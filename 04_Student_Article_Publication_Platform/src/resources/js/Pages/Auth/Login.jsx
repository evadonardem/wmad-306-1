import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('eclipse');
        else if (theme === 'eclipse') setTheme('lunar');
        else setTheme('light');
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark', 'eclipse', 'lunar');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen transition-all duration-500 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 eclipse:selection:bg-red-500 lunar:selection:bg-rose-500 selection:text-white relative
            bg-slate-100 dark:bg-slate-950
            eclipse:bg-zinc-950/90 eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')]
            lunar:bg-zinc-950/90 lunar:bg-[url('https://img.freepik.com/premium-photo/pink-moon-purple-sky-with-palm-tree_1153744-173071.jpg')]
            bg-cover bg-center bg-fixed bg-blend-overlay">

            <Head title="Log in" />

            {/* THEME TOGGLE BUTTON */}
            <button
                onClick={cycleTheme}
                className="absolute top-6 right-6 p-2 rounded-lg shadow-md transition-all duration-300 z-50
                    bg-white dark:bg-slate-800 eclipse:bg-rose-900/50 lunar:bg-pink-900/40
                    text-slate-500 dark:text-cyan-400 eclipse:text-red-500 lunar:text-rose-400
                    hover:ring-2 hover:ring-cyan-400 eclipse:hover:ring-red-500 lunar:hover:ring-rose-500"
                title={`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
                {theme === 'light' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                {theme === 'dark' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                {theme === 'eclipse' && <svg className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" className="text-red-900/50" /><path d="M12 2a10 10 0 000 20 10.5 10.5 0 010-20z" className="text-red-500" /></svg>}
                {theme === 'lunar' && <svg className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" className="text-rose-200/20" /><path d="M12 2a10 10 0 000 20 10.5 10.5 0 010-20z" className="text-rose-400" /></svg>}
            </button>

            {/* Split Container */}
            <div className="flex w-full max-w-4xl bg-white/80 dark:bg-white/5 eclipse:bg-rose-900/20 lunar:bg-pink-950/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 eclipse:border-red-900/30 lunar:border-rose-700/50 rounded-3xl shadow-xl transition-all duration-500 overflow-hidden
                dark:shadow-[0_0_40px_rgba(0,238,255,0.1)] eclipse:shadow-[0_0_50px_rgba(220,38,38,0.15)] lunar:shadow-[0_0_50px_rgba(251,113,133,0.2)]">

                {/* Left Side: Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-0 right-0 w-full h-full bg-cyan-500/5 eclipse:bg-red-500/10 lunar:bg-rose-500/10 blur-[100px] -z-10 hidden dark:block"></div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white eclipse:text-rose-50 lunar:text-white mb-2 tracking-tight transition-colors">Welcome Back</h2>
                        <p className="text-slate-600 dark:text-slate-400 eclipse:text-rose-300 lunar:text-pink-100 text-sm transition-colors">Sign in to manage your publications.</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-4">
                        {/* 🚩 Optimized for browser autocomplete */}
                        <TextField
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="email"
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 lunar:!text-pink-100 transition-colors', shrink: !!data.email }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 lunar:!text-white lunar:!border-rose-700/50 transition-colors' }}
                        />

                        {/* 🚩 Optimized for browser autocomplete */}
                        <TextField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="current-password"
                            InputLabelProps={{ className: 'dark:text-slate-300 eclipse:!text-rose-300 lunar:!text-pink-100 transition-colors', shrink: !!data.password }}
                            InputProps={{ className: 'dark:text-white dark:border-white/20 eclipse:!text-rose-100 eclipse:!border-red-800/50 lunar:!text-white lunar:!border-rose-700/50 transition-colors' }}
                        />

                        <div className="flex items-center justify-between mt-4">
                            <FormControlLabel
                                control={<Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="dark:text-cyan-400 eclipse:text-red-500 lunar:text-rose-500" />}
                                label={<span className="text-sm text-slate-600 dark:text-slate-400 eclipse:text-rose-300 lunar:text-pink-100 transition-colors">Remember me</span>}
                            />
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-cyan-600 dark:text-cyan-400 eclipse:text-rose-400 lunar:text-pink-300 hover:underline transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            variant="contained"
                            fullWidth
                            size="large"
                            className="!font-bold !text-sm !uppercase !tracking-wider !py-4 !rounded-xl transition-all duration-300 !mt-6
                                !bg-cyan-600 dark:!bg-cyan-500 eclipse:!bg-red-700 lunar:!bg-rose-600
                                !text-white dark:!text-slate-900
                                shadow-lg dark:shadow-[0_0_15px_rgba(0,238,255,0.4)] eclipse:shadow-[0_0_20px_rgba(220,38,38,0.5)] lunar:shadow-[0_0_20px_rgba(251,113,133,0.6)]"
                        >
                            Log In
                        </Button>
                    </form>
                </div>

                {/* Right Side: Gradient Panel */}
                <div className="hidden md:flex w-1/2 p-12 flex-col justify-center items-center text-center relative overflow-hidden transition-all duration-500
                    bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900
                    eclipse:from-red-600 eclipse:via-rose-800 eclipse:to-red-950
                    lunar:from-pink-600 lunar:via-rose-900 lunar:to-pink-950">

                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 eclipse:bg-red-500/20 lunar:bg-rose-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-300/30 eclipse:bg-rose-500/30 lunar:bg-pink-300/30 rounded-full blur-3xl"></div>

                    <h2 className="text-4xl font-extrabold text-white eclipse:text-rose-50 lunar:text-white mb-6 drop-shadow-lg z-10">New Here?</h2>
                    <p className="text-cyan-50 eclipse:text-rose-200 lunar:text-pink-50 text-lg mb-10 leading-relaxed max-w-sm z-10">
                        Join our Student Article Publication Platform to share your ideas and read amazing work.
                    </p>

                    <Link
                        href={route('register')}
                        className="z-10 px-8 py-3 border-2 border-white eclipse:border-rose-200 lunar:border-pink-100 text-white eclipse:text-rose-100 lunar:text-pink-50 font-bold rounded-xl transition-all duration-300 shadow-lg
                            hover:bg-white hover:text-blue-900 eclipse:hover:bg-rose-200 eclipse:hover:text-red-900 lunar:hover:bg-pink-50 lunar:hover:text-pink-950"
                    >
                        Create an Account
                    </Link>
                </div>

            </div>
        </div>
    );
}
