import { Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const { theme } = useThemeContext();
    const colors = getThemeColors(theme);

    useEffect(() => {
        if (isOpen) setMode(initialMode);
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

    if (!isOpen) return null;

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
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    className="relative w-full max-w-md rounded-xl border shadow-2xl"
                    style={{ backgroundColor: colors.paper, borderColor: colors.border, color: colors.newsprint }}
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

                    <div className="border-b px-5 py-4" style={{ borderColor: colors.border }}>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="rounded px-3 py-1 text-xs font-mono uppercase tracking-wider"
                                style={{
                                    backgroundColor: mode === 'login' ? `${colors.accent}22` : 'transparent',
                                    color: colors.newsprint,
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('register')}
                                className="rounded px-3 py-1 text-xs font-mono uppercase tracking-wider"
                                style={{
                                    backgroundColor: mode === 'register' ? `${colors.accent}22` : 'transparent',
                                    color: colors.newsprint,
                                }}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    <div className="px-5 py-4">
                        {mode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-3">
                                <input
                                    type="email"
                                    value={loginForm.data.email}
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                    style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    placeholder="Email"
                                    required
                                />
                                {loginForm.errors.email && <p className="text-xs text-red-700">{loginForm.errors.email}</p>}

                                <input
                                    type="password"
                                    value={loginForm.data.password}
                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                    style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    placeholder="Password"
                                    required
                                />
                                {loginForm.errors.password && <p className="text-xs text-red-700">{loginForm.errors.password}</p>}

                                <div className="flex items-center justify-between text-xs" style={{ color: colors.byline }}>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={loginForm.data.remember}
                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                            style={{ accentColor: colors.accent }}
                                        />
                                        Remember me
                                    </label>
                                    <Link href={route('password.request')} className="underline" style={{ color: colors.byline }}>
                                        Forgot?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loginForm.processing}
                                    className="w-full rounded-lg border px-4 py-2 text-sm font-serif font-bold"
                                    style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                                >
                                    {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-3">
                                <input
                                    type="text"
                                    value={registerForm.data.name}
                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                    style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    placeholder="Full name"
                                    required
                                />
                                {registerForm.errors.name && <p className="text-xs text-red-700">{registerForm.errors.name}</p>}

                                <input
                                    type="email"
                                    value={registerForm.data.email}
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                    style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                    placeholder="Email"
                                    required
                                />
                                {registerForm.errors.email && <p className="text-xs text-red-700">{registerForm.errors.email}</p>}

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <input
                                        type="password"
                                        value={registerForm.data.password}
                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                        placeholder="Password"
                                        required
                                    />
                                    <input
                                        type="password"
                                        value={registerForm.data.password_confirmation}
                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                        style={{ borderColor: colors.border, backgroundColor: colors.paper, color: colors.newsprint }}
                                        placeholder="Confirm"
                                        required
                                    />
                                </div>

                                {(registerForm.errors.password || registerForm.errors.password_confirmation) && (
                                    <p className="text-xs text-red-700">{registerForm.errors.password || registerForm.errors.password_confirmation}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={registerForm.processing}
                                    className="w-full rounded-lg border px-4 py-2 text-sm font-serif font-bold"
                                    style={{ borderColor: colors.newsprint, backgroundColor: colors.newsprint, color: colors.paper }}
                                >
                                    {registerForm.processing ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
