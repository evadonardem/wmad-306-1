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

    // Original purple/pink color palette
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
                {/* Backdrop with enhanced blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
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
                                minHeight: '600px'
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
                                    {/* Gradient Orbs with purple/pink colors */}
                                    <div
                                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `linear-gradient(135deg, ${colors.softPink}30, ${colors.mediumPurple}30)` }}
                                    ></div>
                                    <div
                                        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `linear-gradient(135deg, ${colors.deepPurple}30, ${colors.royalPurple}30)` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative z-10 p-8">
                                        {/* Header with purple theme */}
                                        <div className="text-center mb-8">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border border-white/30 mb-4"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.softPink}80, ${colors.mediumPurple}80)`,
                                                }}
                                            >
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </motion.div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                            <p className="text-white/70">Sign in to continue your journey</p>
                                        </div>

                                        {/* Login Form */}
                                        <form onSubmit={handleLogin} className="space-y-5">
                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m12 0a4 4 0 01-4 4H6a4 4 0 01-4-4V8a4 4 0 014-4h10a4 4 0 014 4v4z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={loginForm.data.email}
                                                        onChange={(e) => loginForm.setData('email', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.softPink,
                                                            focusRingColor: `${colors.softPink}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.softPink;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {loginForm.errors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm mt-1"
                                                        style={{ color: colors.softPink }}
                                                    >
                                                        {loginForm.errors.email}
                                                    </motion.p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={loginForm.data.password}
                                                        onChange={(e) => loginForm.setData('password', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.softPink,
                                                            focusRingColor: `${colors.softPink}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.softPink;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {loginForm.errors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm mt-1"
                                                        style={{ color: colors.softPink }}
                                                    >
                                                        {loginForm.errors.password}
                                                    </motion.p>
                                                )}
                                            </div>

                                            {/* Remember Me & Forgot Password */}
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={loginForm.data.remember}
                                                        onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                                        className="w-4 h-4 rounded border-white/30 bg-white/10 focus:ring-offset-0"
                                                        style={{ accentColor: colors.softPink }}
                                                    />
                                                    <span className="text-sm text-white/80">Remember me</span>
                                                </label>

                                                {route().has('password.request') && (
                                                    <Link
                                                        href={route('password.request')}
                                                        className="text-sm hover:underline transition"
                                                        style={{ color: colors.softPink }}
                                                    >
                                                        Forgot password?
                                                    </Link>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loginForm.processing}
                                                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.deepPurple} 0%, ${colors.royalPurple} 50%, ${colors.mediumPurple} 100%)`,
                                                    boxShadow: `0 10px 20px -5px ${colors.deepPurple}80`
                                                }}
                                            >
                                                <span className="relative z-10">
                                                    {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                                </span>
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${colors.softPink} 0%, ${colors.mediumPurple} 100%)`,
                                                    }}
                                                ></div>
                                            </button>
                                        </form>

                                        {/* Switch to Register */}
                                        <div className="mt-6 text-center">
                                            <p className="text-white/70">
                                                New to FYI?{' '}
                                                <button
                                                    onClick={() => setIsFlipped(true)}
                                                    className="font-semibold hover:underline transition"
                                                    style={{ color: colors.softPink }}
                                                >
                                                    Create an account
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* REGISTER SIDE */}
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
                                    {/* Gradient Orbs with purple/pink colors */}
                                    <div
                                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `linear-gradient(135deg, ${colors.mediumPurple}30, ${colors.softPink}30)` }}
                                    ></div>
                                    <div
                                        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
                                        style={{ background: `linear-gradient(135deg, ${colors.royalPurple}30, ${colors.deepPurple}30)` }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative z-10 p-8">
                                        {/* Header with purple theme */}
                                        <div className="text-center mb-8">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border border-white/30 mb-4"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.mediumPurple}80, ${colors.softPink}80)`,
                                                }}
                                            >
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                            </motion.div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Join FYI</h2>
                                            <p className="text-white/70">Start your academic journey today</p>
                                        </div>

                                        {/* Register Form */}
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={registerForm.data.name}
                                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.mediumPurple,
                                                            focusRingColor: `${colors.mediumPurple}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.mediumPurple;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {registerForm.errors.name && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm mt-1"
                                                        style={{ color: colors.mediumPurple }}
                                                    >
                                                        {registerForm.errors.name}
                                                    </motion.p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m12 0a4 4 0 01-4 4H6a4 4 0 01-4-4V8a4 4 0 014-4h10a4 4 0 014 4v4z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={registerForm.data.email}
                                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.mediumPurple,
                                                            focusRingColor: `${colors.mediumPurple}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.mediumPurple;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {registerForm.errors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm mt-1"
                                                        style={{ color: colors.mediumPurple }}
                                                    >
                                                        {registerForm.errors.email}
                                                    </motion.p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        placeholder="Create a strong password"
                                                        value={registerForm.data.password}
                                                        onChange={(e) => registerForm.setData('password', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.mediumPurple,
                                                            focusRingColor: `${colors.mediumPurple}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.mediumPurple;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {registerForm.errors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm mt-1"
                                                        style={{ color: colors.mediumPurple }}
                                                    >
                                                        {registerForm.errors.password}
                                                    </motion.p>
                                                )}
                                                {registerForm.data.password && registerForm.data.password.length < 8 && registerForm.data.password.length > 0 && (
                                                    <p className="text-sm mt-1" style={{ color: colors.softPink }}>
                                                        Password must be at least 8 characters
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/90 text-sm font-medium mb-2">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        placeholder="Re-enter your password"
                                                        value={registerForm.data.password_confirmation}
                                                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all"
                                                        style={{
                                                            focusBorderColor: colors.mediumPurple,
                                                            focusRingColor: `${colors.mediumPurple}50`
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = colors.mediumPurple;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                        }}
                                                    />
                                                </div>
                                                {registerForm.data.password !== registerForm.data.password_confirmation &&
                                                 registerForm.data.password_confirmation && (
                                                    <p className="text-sm mt-1" style={{ color: colors.softPink }}>
                                                        Passwords do not match
                                                    </p>
                                                )}
                                            </div>

                                            {/* Terms and Conditions */}
                                            <div className="flex items-start space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 focus:ring-offset-0"
                                                    style={{ accentColor: colors.softPink }}
                                                    required
                                                />
                                                <label htmlFor="terms" className="text-sm text-white/80">
                                                    I agree to the{' '}
                                                    {route().has('terms') ? (
                                                        <Link href={route('terms')} className="font-medium hover:underline" style={{ color: colors.softPink }}>
                                                            Terms of Service
                                                        </Link>
                                                    ) : (
                                                        <span className="font-medium" style={{ color: colors.softPink }}>Terms of Service</span>
                                                    )}
                                                    {' '}and{' '}
                                                    {route().has('privacy') ? (
                                                        <Link href={route('privacy')} className="font-medium hover:underline" style={{ color: colors.softPink }}>
                                                            Privacy Policy
                                                        </Link>
                                                    ) : (
                                                        <span className="font-medium" style={{ color: colors.softPink }}>Privacy Policy</span>
                                                    )}
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={registerForm.processing}
                                                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.royalPurple} 0%, ${colors.mediumPurple} 50%, ${colors.softPink} 100%)`,
                                                    boxShadow: `0 10px 20px -5px ${colors.deepPurple}80`
                                                }}
                                            >
                                                <span className="relative z-10">
                                                    {registerForm.processing ? 'Creating account...' : 'Create Account'}
                                                </span>
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${colors.softPink} 0%, ${colors.mediumPurple} 100%)`,
                                                    }}
                                                ></div>
                                            </button>
                                        </form>

                                        {/* Switch to Login */}
                                        <p className="mt-6 text-center text-white/70">
                                            Already have an account?{' '}
                                            <button
                                                onClick={() => setIsFlipped(false)}
                                                className="font-semibold hover:underline transition"
                                                style={{ color: colors.softPink }}
                                            >
                                                Sign in
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
