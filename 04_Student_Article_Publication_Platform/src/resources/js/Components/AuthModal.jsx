import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [isFlipped, setIsFlipped] = useState(initialMode === 'register');

    useEffect(() => {
        if (isOpen) {
            setIsFlipped(initialMode === 'register');
        }
    }, [isOpen, initialMode]);

    // Professional purple/pink color palette
    const colors = {
        deepPurple: '#37306B',
        royalPurple: '#66347F',
        mediumPurple: '#9E4784',
        softPink: '#D27685',
    };

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
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-md"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
                        aria-label="Close"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Flip Card Container */}
                    <div className="relative" style={{ perspective: '1200px' }}>
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{
                                duration: 0.6,
                                type: "spring",
                                stiffness: 70,
                                damping: 15
                            }}
                            style={{
                                transformStyle: 'preserve-3d',
                                position: 'relative',
                                width: '100%',
                                minHeight: isFlipped ? '520px' : '500px'
                            }}
                        >
                            {/* LOGIN SIDE */}
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                                    {/* Glassmorphism Effects */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                                    {/* Decorative Elements */}
                                    <div
                                        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `radial-gradient(circle, ${colors.softPink}30, transparent 70%)` }}
                                    ></div>
                                    <div
                                        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `radial-gradient(circle, ${colors.deepPurple}30, transparent 70%)` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative z-10 p-6">
                                        {/* Header */}
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                                            <p className="text-sm text-white/70">Sign in to continue</p>
                                        </div>

                                        {/* Login Form */}
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                <label className="block text-white/80 text-xs font-medium mb-1.5">
                                                    Email
                                                </label>
                                                <div className="relative group">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/60 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m12 0a4 4 0 01-4 4H6a4 4 0 01-4-4V8a4 4 0 014-4h10a4 4 0 014 4v4z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={loginForm.data.email}
                                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                    />
                                                </div>
                                                {loginForm.errors.email && (
                                                    <p className="text-xs mt-1.5" style={{ color: colors.softPink }}>
                                                        {loginForm.errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-xs font-medium mb-1.5">
                                                    Password
                                                </label>
                                                <div className="relative group">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/60 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={loginForm.data.password}
                                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                    />
                                                </div>
                                                {loginForm.errors.password && (
                                                    <p className="text-xs mt-1.5" style={{ color: colors.softPink }}>
                                                        {loginForm.errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remember Me & Forgot Password */}
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={loginForm.data.remember}
                                                        onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                                        className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 checked:bg-softPink focus:ring-offset-0 focus:ring-1 focus:ring-white/30"
                                                        style={{ accentColor: colors.softPink }}
                                                    />
                                                    <span className="text-xs text-white/70">Remember</span>
                                                </label>

                                                <button
                                                    type="button"
                                                    className="text-xs text-white/70 hover:text-white transition-colors"
                                                >
                                                    Forgot?
                                                </button>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loginForm.processing}
                                                className="w-full py-2.5 px-4 rounded-lg text-white font-medium text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.deepPurple} 0%, ${colors.royalPurple} 50%, ${colors.mediumPurple} 100%)`,
                                                    boxShadow: `0 5px 15px -5px ${colors.deepPurple}80`
                                                }}
                                            >
                                                <span className="relative z-10">
                                                    {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                                </span>
                                            </button>
                                        </form>

                                        {/* Switch to Register */}
                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => setIsFlipped(true)}
                                                className="text-xs text-white/70 hover:text-white transition-colors"
                                            >
                                                New here? <span style={{ color: colors.softPink }}>Create account</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* REGISTER SIDE - Compact Version */}
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                                    {/* Glassmorphism Effects */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                                    {/* Decorative Elements */}
                                    <div
                                        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `radial-gradient(circle, ${colors.mediumPurple}30, transparent 70%)` }}
                                    ></div>
                                    <div
                                        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `radial-gradient(circle, ${colors.royalPurple}30, transparent 70%)` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative z-10 p-6">
                                        {/* Header */}
                                        <div className="text-center mb-4">
                                            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-bold text-white mb-1">Join FYI</h2>
                                            <p className="text-xs text-white/70">Create your account</p>
                                        </div>

                                        {/* Register Form - Compact */}
                                        <form onSubmit={handleRegister} className="space-y-3">
                                            <div>
                                                <label className="block text-white/80 text-xs font-medium mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={registerForm.data.name}
                                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                />
                                                {registerForm.errors.name && (
                                                    <p className="text-xs mt-1" style={{ color: colors.mediumPurple }}>
                                                        {registerForm.errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-xs font-medium mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={registerForm.data.email}
                                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                />
                                                {registerForm.errors.email && (
                                                    <p className="text-xs mt-1" style={{ color: colors.mediumPurple }}>
                                                        {registerForm.errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-white/80 text-xs font-medium mb-1">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={registerForm.data.password}
                                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 text-xs font-medium mb-1">
                                                        Confirm
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={registerForm.data.password_confirmation}
                                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Compact Validation */}
                                            {registerForm.data.password && registerForm.data.password.length < 8 && registerForm.data.password.length > 0 && (
                                                <p className="text-xs" style={{ color: colors.softPink }}>
                                                    8+ characters needed
                                                </p>
                                            )}

                                            {registerForm.data.password !== registerForm.data.password_confirmation &&
                                             registerForm.data.password_confirmation && (
                                                <p className="text-xs" style={{ color: colors.softPink }}>
                                                    Passwords don't match
                                                </p>
                                            )}

                                            {registerForm.errors.password && (
                                                <p className="text-xs" style={{ color: colors.mediumPurple }}>
                                                    {registerForm.errors.password}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={registerForm.processing}
                                                className="w-full py-2 px-4 rounded-lg text-white font-medium text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.royalPurple} 0%, ${colors.mediumPurple} 50%, ${colors.softPink} 100%)`,
                                                    boxShadow: `0 5px 15px -5px ${colors.deepPurple}80`
                                                }}
                                            >
                                                {registerForm.processing ? 'Creating...' : 'Create Account'}
                                            </button>
                                        </form>

                                        {/* Switch to Login */}
                                        <div className="mt-3 text-center">
                                            <button
                                                onClick={() => setIsFlipped(false)}
                                                className="text-xs text-white/70 hover:text-white transition-colors"
                                            >
                                                Already have an account? <span style={{ color: colors.softPink }}>Sign in</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Note - More Compact */}
                    <div className="absolute -bottom-10 left-0 right-0 text-center">
                        <p className="text-xs text-white/50">
                            By continuing, you agree to our Terms & Privacy
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
