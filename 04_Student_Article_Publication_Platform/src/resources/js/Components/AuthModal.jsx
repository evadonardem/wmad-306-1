import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const [isFlipping, setIsFlipping] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setShowForgotPassword(false);
            setResetSent(false);
        }
    }, [isOpen, initialMode]);

    // Login form
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Register form
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Forgot password form
    const forgotPasswordForm = useForm({
        email: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                onClose();
                loginForm.reset();
            },
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onSuccess: () => {
                onClose();
                registerForm.reset();
            },
        });
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        forgotPasswordForm.post(route('password.email'), {
            onSuccess: () => {
                setResetSent(true);
                forgotPasswordForm.reset();
            },
        });
    };

    const toggleMode = () => {
        setIsFlipping(true);
        setTimeout(() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setIsFlipping(false);
        }, 200);
    };

    if (!isOpen) {
        return null;
    }

    // Newspaper-themed decorative elements
    const NewspaperDecorations = () => (
        <>
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: colors.accent }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: colors.accent }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: colors.accent }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: colors.accent }}></div>
        </>
    );

    // Edition stamp
    const EditionStamp = ({ text }) => (
        <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-3 py-0.5 font-mono text-[10px] tracking-widest z-10 whitespace-nowrap" style={{
            backgroundColor: colors.accent,
            color: colors.background,
            border: `1px solid ${colors.border}`,
        }}>
            {text}
        </div>
    );

    // Back button for forgot password
    const BackButton = () => (
        <motion.button
            whileHover={{ x: -2 }}
            onClick={() => setShowForgotPassword(false)}
            className="absolute left-3 top-3 flex items-center gap-1 text-xs font-serif hover:underline z-10"
            style={{ color: colors.textSecondary }}
        >
            <span>←</span> Back
        </motion.button>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    aria-label="Close"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-sm"
                >
                    {/* Main Card */}
                    <div className="relative rounded-lg shadow-xl" style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                    }}>
                        <NewspaperDecorations />

                        {!showForgotPassword ? (
                            // Main Auth Content
                            <>
                                <EditionStamp text={mode === 'login' ? 'MEMBER EDITION' : 'FIRST EDITION'} />

                                {/* Header */}
                                <div className="px-6 pt-6 pb-2 text-center border-b" style={{ borderColor: colors.border }}>
                                    <div className="font-serif text-3xl font-black tracking-tight" style={{ color: colors.text }}>
                                        THE FYI
                                    </div>
                                    <div className="font-mono text-[10px] tracking-[0.2em] mt-1" style={{ color: colors.textSecondary }}>
                                        {new Date().toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }).toUpperCase()}
                                    </div>
                                    <div className="w-8 h-px mx-auto my-2" style={{ backgroundColor: colors.border }}></div>
                                    <p className="font-serif text-xs italic" style={{ color: colors.textSecondary }}>
                                        {mode === 'login' ? 'Welcome back' : 'Join our community'}
                                    </p>
                                </div>

                                {/* Flippable Content */}
                                <div className="relative" style={{ perspective: '800px' }}>
                                    <motion.div
                                        animate={{
                                            rotateY: isFlipping ? 90 : 0,
                                            opacity: isFlipping ? 0 : 1
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {mode === 'login' ? (
                                            // Login Form
                                            <form onSubmit={handleLogin} className="px-6 py-4 space-y-4">
                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        EMAIL ADDRESS
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={loginForm.data.email}
                                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: loginForm.errors.email ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="reader@university.edu"
                                                    />
                                                    {loginForm.errors.email && (
                                                        <p className="mt-1 text-[10px]" style={{ color: colors.error }}>
                                                            {loginForm.errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        PASSWORD
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={loginForm.data.password}
                                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: loginForm.errors.password ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="••••••••"
                                                    />
                                                    {loginForm.errors.password && (
                                                        <p className="mt-1 text-[10px]" style={{ color: colors.error }}>
                                                            {loginForm.errors.password}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-1.5 text-xs">
                                                        <input
                                                            type="checkbox"
                                                            checked={loginForm.data.remember}
                                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                                            className="rounded border"
                                                            style={{ accentColor: colors.accent }}
                                                        />
                                                        <span className="text-xs" style={{ color: colors.textSecondary }}>Remember me</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowForgotPassword(true)}
                                                        className="text-xs italic hover:underline"
                                                        style={{ color: colors.accent }}
                                                    >
                                                        Forgot password?
                                                    </button>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    type="submit"
                                                    disabled={loginForm.processing}
                                                    className="w-full py-3 rounded font-serif font-bold text-sm transition-all"
                                                    style={{
                                                        backgroundColor: colors.primary,
                                                        color: colors.background
                                                    }}
                                                >
                                                    {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                                </motion.button>

                                                <div className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={toggleMode}
                                                        className="text-xs italic hover:underline inline-flex items-center gap-1"
                                                        style={{ color: colors.textSecondary }}
                                                    >
                                                        New reader? Create account <span className="text-sm">↻</span>
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            // Register Form
                                            <form onSubmit={handleRegister} className="px-6 py-4 space-y-4">
                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        FULL NAME
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={registerForm.data.name}
                                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: registerForm.errors.name ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="John Doe"
                                                    />
                                                    {registerForm.errors.name && (
                                                        <p className="mt-1 text-[10px]" style={{ color: colors.error }}>
                                                            {registerForm.errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        EMAIL ADDRESS
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={registerForm.data.email}
                                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: registerForm.errors.email ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="reader@university.edu"
                                                    />
                                                    {registerForm.errors.email && (
                                                        <p className="mt-1 text-[10px]" style={{ color: colors.error }}>
                                                            {registerForm.errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        PASSWORD
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={registerForm.data.password}
                                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: registerForm.errors.password ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="••••••••"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                        CONFIRM PASSWORD
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={registerForm.data.password_confirmation}
                                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                        className="w-full px-3 py-2 rounded border text-sm"
                                                        style={{
                                                            borderColor: registerForm.errors.password_confirmation ? colors.error : colors.border,
                                                            backgroundColor: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                        placeholder="••••••••"
                                                    />
                                                </div>

                                                {(registerForm.errors.password || registerForm.errors.password_confirmation) && (
                                                    <p className="text-[10px]" style={{ color: colors.error }}>
                                                        {registerForm.errors.password || registerForm.errors.password_confirmation}
                                                    </p>
                                                )}

                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    type="submit"
                                                    disabled={registerForm.processing}
                                                    className="w-full py-3 rounded font-serif font-bold text-sm transition-all"
                                                    style={{
                                                        backgroundColor: colors.primary,
                                                        color: colors.background
                                                    }}
                                                >
                                                    {registerForm.processing ? 'Creating account...' : 'Create Account'}
                                                </motion.button>

                                                <div className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={toggleMode}
                                                        className="text-xs italic hover:underline inline-flex items-center gap-1"
                                                        style={{ color: colors.textSecondary }}
                                                    >
                                                        Already have an account? Sign in <span className="text-sm">↻</span>
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </motion.div>
                                </div>
                            </>
                        ) : (
                            // Forgot Password Content
                            <>
                                <BackButton />
                                <EditionStamp text={resetSent ? 'RESET LINK SENT' : 'RESET PASSWORD'} />

                                <div className="px-6 pt-10 pb-6">
                                    {!resetSent ? (
                                        <form onSubmit={handleForgotPassword} className="space-y-4">
                                            <div className="text-center mb-2">
                                                <div className="text-3xl mb-2">🔐</div>
                                                <h3 className="font-serif text-lg font-bold" style={{ color: colors.text }}>
                                                    Forgot password?
                                                </h3>
                                                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                                                    Enter your email and we'll send you a reset link.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                                                    EMAIL ADDRESS
                                                </label>
                                                <input
                                                    type="email"
                                                    value={forgotPasswordForm.data.email}
                                                    onChange={(e) => forgotPasswordForm.setData('email', e.target.value)}
                                                    className="w-full px-3 py-2 rounded border text-sm"
                                                    style={{
                                                        borderColor: forgotPasswordForm.errors.email ? colors.error : colors.border,
                                                        backgroundColor: colors.surface,
                                                        color: colors.text,
                                                    }}
                                                    placeholder="reader@university.edu"
                                                />
                                                {forgotPasswordForm.errors.email && (
                                                    <p className="mt-1 text-[10px]" style={{ color: colors.error }}>
                                                        {forgotPasswordForm.errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                disabled={forgotPasswordForm.processing}
                                                className="w-full py-3 rounded font-serif font-bold text-sm transition-all"
                                                style={{
                                                    backgroundColor: colors.primary,
                                                    color: colors.background
                                                }}
                                            >
                                                {forgotPasswordForm.processing ? 'Sending...' : 'Send Reset Link'}
                                            </motion.button>
                                        </form>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center"
                                        >
                                            <div className="text-3xl mb-2">✉️</div>
                                            <h3 className="font-serif text-lg font-bold" style={{ color: colors.text }}>
                                                Check your email
                                            </h3>
                                            <p className="text-xs mt-2 mb-3" style={{ color: colors.textSecondary }}>
                                                We've sent a reset link to:
                                            </p>
                                            <p className="font-mono text-xs font-bold p-2 rounded" style={{
                                                backgroundColor: colors.surface,
                                                color: colors.accent,
                                                wordBreak: 'break-all'
                                            }}>
                                                {forgotPasswordForm.data.email}
                                            </p>
                                            <button
                                                onClick={() => setShowForgotPassword(false)}
                                                className="text-xs underline hover:no-underline mt-4"
                                                style={{ color: colors.accent }}
                                            >
                                                Return to sign in
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </>
                        )}


                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

//
