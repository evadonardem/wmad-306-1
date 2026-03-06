import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => onClose(),
            onFinish: () => loginForm.reset('password'),
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onSuccess: () => onClose(),
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    aria-label="Close authentication modal"
                />

                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-lg rounded-xl border shadow-2xl"
                    style={{
                        backgroundColor: colors.paper,
                        borderColor: colors.border,
                        color: colors.newsprint,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-3 top-2 text-2xl leading-none"
                        style={{ color: colors.byline }}
                        aria-label="Close"
                    >
                        x
                    </button>

                    <div className="border-b px-6 pt-6 pb-4" style={{ borderColor: colors.border }}>
                        <p className="font-mono text-xs tracking-[0.2em]" style={{ color: colors.byline }}>
                            WELCOME BACK!
                        </p>
                        <h2 className="mt-1 font-serif text-3xl font-black">
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </h2>
                    </div>

                    <div className="px-6 py-5">
                        {mode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={loginForm.data.email}
                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    />
                                    {loginForm.errors.email && <p className="mt-1 text-xs text-red-700">{loginForm.errors.email}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={loginForm.data.password}
                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    />
                                    {loginForm.errors.password && <p className="mt-1 text-xs text-red-700">{loginForm.errors.password}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-xs" style={{ color: colors.byline }}>
                                        <input
                                            type="checkbox"
                                            checked={loginForm.data.remember}
                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                            style={{ accentColor: colors.accent }}
                                        />
                                        Remember me
                                    </label>
                                    <Link href={route('password.request')} className="text-xs underline" style={{ color: colors.byline }}>
                                        Forgot password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginForm.processing}
                                    className="w-full rounded border px-4 py-2 text-sm font-serif font-bold"
                                    style={{
                                        borderColor: colors.newsprint,
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper,
                                    }}
                                >
                                    {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                </button>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode('register')}
                                        className="text-xs font-mono uppercase tracking-wider underline"
                                        style={{ color: colors.byline }}
                                    >
                                        No Account? Register
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    />
                                    {registerForm.errors.name && <p className="mt-1 text-xs text-red-700">{registerForm.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    />
                                    {registerForm.errors.email && <p className="mt-1 text-xs text-red-700">{registerForm.errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={registerForm.data.password}
                                            onChange={(e) => registerForm.setData('password', e.target.value)}
                                            className="w-full rounded border px-3 py-2 text-sm"
                                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                                            Confirm
                                        </label>
                                        <input
                                            type="password"
                                            value={registerForm.data.password_confirmation}
                                            onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                            className="w-full rounded border px-3 py-2 text-sm"
                                            style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                        />
                                    </div>
                                </div>

                                {(registerForm.errors.password || registerForm.errors.password_confirmation) && (
                                    <p className="mt-1 text-xs text-red-700">
                                        {registerForm.errors.password || registerForm.errors.password_confirmation}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={registerForm.processing}
                                    className="w-full rounded border px-4 py-2 text-sm font-serif font-bold"
                                    style={{
                                        borderColor: colors.newsprint,
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper,
                                    }}
                                >
                                    {registerForm.processing ? 'Creating account...' : 'Create Account'}
                                </button>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-xs font-mono uppercase tracking-wider underline"
                                        style={{ color: colors.byline }}
                                    >
                                       Do you have an account? Sign In
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
