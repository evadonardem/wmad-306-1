import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

export default function Welcome({ auth }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

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
        loginForm.post(route('login'));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'));
    };

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            title: 'Task Management',
            description: 'Organize tasks with priority levels, due dates, and assignments. Never miss a deadline again.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            title: 'Project Overview',
            description: 'Visualize project progress with interactive dashboards and real-time analytics.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Analytics Dashboard',
            description: 'Track productivity metrics, completion rates, and team performance in real-time.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Team Collaboration',
            description: 'Assign tasks, share updates, and communicate seamlessly within your team.'
        }
    ];

    const benefits = [
        {
            stat: '40%',
            label: 'Increased Productivity',
            description: 'Teams report up to 40% higher productivity with structured task management.'
        },
        {
            stat: '24/7',
            label: 'Real-time Updates',
            description: 'Access your projects anytime, anywhere with instant synchronization.'
        },
        {
            stat: '100%',
            label: 'Data Security',
            description: 'Enterprise-grade security to protect your valuable project data.'
        }
    ];

    return (
        <>
            <Head title="Taskaye - Modern Project Management" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-white"
                    >
                        Taskaye
                    </motion.div>

                    {!auth.user && !showAuth && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <button
                                onClick={() => setShowAuth(true)}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setShowAuth(true);
                                    setTimeout(() => setIsFlipped(true), 100);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-lg text-white font-medium transition"
                            >
                                Get Started
                            </button>
                        </motion.div>
                    )}
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <motion.div
                ref={targetRef}
                style={{ opacity, scale }}
                className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-800 overflow-hidden"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse animation-delay-2000"></div>
                    <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse animation-delay-4000"></div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                            Transform Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
                                Project Management
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                            Taskaye helps teams organize, prioritize, and track work with powerful analytics
                            and intuitive tools. Move from chaos to clarity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setShowAuth(true);
                                    setTimeout(() => setIsFlipped(true), 100);
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl text-white font-semibold text-lg shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition"
                            >
                                Start Free Trial
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const featuresSection = document.getElementById('features');
                                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition"
                            >
                                Learn More
                            </motion.button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl font-bold text-white mb-2">{benefit.stat}</div>
                                    <div className="text-white/90 font-semibold mb-1">{benefit.label}</div>
                                    <div className="text-white/60 text-sm">{benefit.description}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/50 rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Features Section */}
            <div id="features" className="relative bg-gray-900 py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl -top-96 -right-96"></div>
                    <div className="absolute w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl -bottom-96 -left-96"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Everything You Need to
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                Manage Projects Effectively
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Powerful features that help you and your team stay organized, focused, and productive.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition"
                            >
                                <div className="text-indigo-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                📌 Overview
                            </h2>
                            <div className="space-y-4 text-gray-300 text-lg">
                                <p>
                                    Taskaye is a modern web-based Project and Task Management System designed to help individuals and teams organize, prioritize, and monitor their work efficiently.
                                </p>
                                <p>
                                    It provides a structured environment where users can manage projects, assign tasks, track completion progress, and analyze productivity through a visual analytics dashboard.
                                </p>
                                <p>
                                    Taskaye goes beyond a simple to-do list by integrating real-time task statistics, priority tracking, and performance insights—allowing users to make informed decisions about their workflow and focus on high-impact tasks.
                                </p>
                                <p>
                                    The system is built to promote clarity, accountability, and measurable productivity in both academic and professional environments.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="grid gap-6"
                        >
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-4">🎯 Mission</h3>
                                <p className="text-gray-300 text-lg">
                                    To empower individuals and teams with a clean, intuitive, and data-driven productivity platform that simplifies project management, enhances task prioritization, and improves overall workflow efficiency.
                                </p>
                                <p className="text-gray-300 text-lg mt-4">
                                    Taskaye aims to transform task tracking into a structured, analytical, and goal-oriented experience.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-4">🌟 Vision</h3>
                                <p className="text-gray-300 text-lg">
                                    To become a trusted and innovative productivity management system that enables users to work smarter, stay organized, and achieve measurable success through intelligent task analytics and modern digital solutions.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-cyan-600 py-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48"></div>
                    <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Ready to Transform Your Workflow?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/90 mb-8"
                    >
                        Join thousands of teams already using Taskaye to boost productivity.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <button
                            onClick={() => {
                                setShowAuth(true);
                                setTimeout(() => setIsFlipped(true), 100);
                            }}
                            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-xl hover:bg-gray-100 transition"
                        >
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Taskaye</h3>
                            <p className="text-gray-400">Modern project management for modern teams.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">Features</button></li>
                                <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">Pricing</button></li>
                                <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">FAQ</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">About</button></li>
                                <li><button className="hover:text-white transition">Blog</button></li>
                                <li><button className="hover:text-white transition">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">Privacy</button></li>
                                <li><button className="hover:text-white transition">Terms</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
                        <p>&copy; 2026 Taskaye. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Auth Modal - Perfectly Centered */}
            {showAuth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-md"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuth(false)}
                            className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
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
                                transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    position: 'relative',
                                    width: '100%',
                                    minHeight: '550px'
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
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                                        <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={loginForm.data.email}
                                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {loginForm.errors.email && (
                                                    <p className="text-red-300 text-sm mt-1">{loginForm.errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={loginForm.data.password}
                                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {loginForm.errors.password && (
                                                    <p className="text-red-300 text-sm mt-1">{loginForm.errors.password}</p>
                                                )}
                                            </div>

                                            {/* Remember Me and Forgot Password */}
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={loginForm.data.remember}
                                                        onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm text-white/80">Remember me</span>
                                                </label>

                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm text-white/80 hover:text-white underline transition"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loginForm.processing}
                                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-indigo-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loginForm.processing ? 'Signing in...' : 'Sign In'}
                                            </button>
                                        </form>

                                        <div className="mt-6">
                                            <p className="text-white/70 text-center">
                                                Don't have an account?{' '}
                                                <button
                                                    onClick={() => setIsFlipped(true)}
                                                    className="text-white font-semibold underline hover:text-indigo-200 transition"
                                                >
                                                    Register
                                                </button>
                                            </p>
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
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                                        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={registerForm.data.name}
                                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {registerForm.errors.name && (
                                                    <p className="text-red-300 text-sm mt-1">{registerForm.errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={registerForm.data.email}
                                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {registerForm.errors.email && (
                                                    <p className="text-red-300 text-sm mt-1">{registerForm.errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={registerForm.data.password}
                                                    onChange={(e) => registerForm.setData('password', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {registerForm.errors.password && (
                                                    <p className="text-red-300 text-sm mt-1">{registerForm.errors.password}</p>
                                                )}
                                                {registerForm.data.password && registerForm.data.password.length < 8 && (
                                                    <p className="text-yellow-300 text-sm mt-1">Password must be at least 8 characters</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-white/80 text-sm mb-1">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={registerForm.data.password_confirmation}
                                                    onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
                                                />
                                                {registerForm.data.password !== registerForm.data.password_confirmation &&
                                                 registerForm.data.password_confirmation && (
                                                    <p className="text-red-300 text-sm mt-1">Passwords do not match</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={registerForm.processing}
                                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-indigo-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {registerForm.processing ? 'Creating account...' : 'Register'}
                                            </button>
                                        </form>

                                        <p className="mt-6 text-white/70 text-center">
                                            Already have an account?{' '}
                                            <button
                                                onClick={() => setIsFlipped(false)}
                                                className="text-white font-semibold underline hover:text-indigo-200 transition"
                                            >
                                                Sign In
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
