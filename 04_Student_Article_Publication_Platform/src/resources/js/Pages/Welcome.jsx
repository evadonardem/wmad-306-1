import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import AuthModal from '@/Components/AuthModal'; // Import the AuthModal component

export default function Welcome({ auth, recentArticles = [] }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // Add this state
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    // Color theme based on your specified colors
    const colors = {
        deepPurple: '#37306B',
        royalPurple: '#66347F',
        mediumPurple: '#9E4784',
        softPink: '#D27685',
    };

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            title: 'Publish Your Voice',
            description: 'Share your ideas, research, and stories with the entire student community. Every voice matters.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: 'Peer Review',
            description: 'Get constructive feedback from fellow students and editors to refine your work before publication.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            title: 'Engage & Discuss',
            description: 'Spark meaningful conversations through comments and discussions on published articles.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Track Impact',
            description: 'Monitor views, engagement, and the reach of your published articles with built-in analytics.'
        }
    ];

    const benefits = [
        {
            stat: '500+',
            label: 'Student Writers',
            description: 'Join a thriving community of student writers sharing their perspectives.'
        },
        {
            stat: '1,200+',
            label: 'Published Articles',
            description: 'Discover a diverse range of topics from science to creative writing.'
        },
        {
            stat: '24/7',
            label: 'Always Open',
            description: 'Submit and review articles anytime, from anywhere.'
        }
    ];

    return (
        <>
            <Head title="FYI - Student Journal" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black tracking-tighter"
                        style={{ color: colors.softPink }}
                    >
                        FYI
                    </motion.div>

                    {!auth.user && !showAuth && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <button
                                onClick={() => {
                                    setAuthMode('login');
                                    setShowAuth(true);
                                }}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setAuthMode('register');
                                    setShowAuth(true);
                                }}
                                className="px-6 py-2 rounded-lg text-white font-medium transition"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.deepPurple} 0%, ${colors.royalPurple} 50%, ${colors.mediumPurple} 100%)`,
                                }}
                            >
                                Get Started
                            </button>
                        </motion.div>
                    )}
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <div className="relative">
            <motion.div
                ref={targetRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{
                    opacity,
                    scale,
                    background: `linear-gradient(135deg, ${colors.deepPurple} 0%, ${colors.royalPurple} 50%, ${colors.mediumPurple} 100%)`
                }}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div className="absolute w-[500px] h-[500px] animate-pulse animation-delay-2000 rounded-full blur-3xl -bottom-48 -right-48"
                         style={{ backgroundColor: `${colors.softPink}20` }}></div>
                    <div className="absolute w-[300px] h-[300px] animate-pulse animation-delay-4000 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                         style={{ backgroundColor: `${colors.mediumPurple}30` }}></div>
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
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <span className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white text-sm font-medium border border-white/20">
                                🎓 Student Journal Platform
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                            For Your Information,
                            <span className="block" style={{ color: colors.softPink }}>
                                Your Voice Matters
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                            A student-run journal where voices are heard, ideas are shared,
                            and knowledge is built together. Publish your articles, engage with peers,
                            and make an impact.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setAuthMode('register');
                                    setShowAuth(true);
                                }}
                                className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-xl transition"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.softPink} 0%, ${colors.mediumPurple} 100%)`,
                                }}
                            >
                                Start Writing Today
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
                                Explore Journal
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
            </div>

            {/* Features Section */}
            <div id="features" className="relative py-24 overflow-hidden"
                 style={{ background: colors.deepPurple }}>
                <div className="absolute inset-0">
                    <div className="absolute w-[800px] h-[800px] rounded-full blur-3xl -top-96 -right-96"
                         style={{ backgroundColor: `${colors.softPink}10` }}></div>
                    <div className="absolute w-[800px] h-[800px] rounded-full blur-3xl -bottom-96 -left-96"
                         style={{ backgroundColor: `${colors.royalPurple}10` }}></div>
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
                            <span className="block" style={{ color: colors.softPink }}>
                                Share Your Voice
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Powerful tools designed specifically for student journalists and writers.
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
                                <div className="mb-4" style={{ color: colors.softPink }}>
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

            {/* Recent Articles Preview */}
            <div className="relative py-24"
                 style={{ background: colors.royalPurple }}>
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Recent <span style={{ color: colors.softPink }}>Articles</span>
                        </h2>
                        <p className="text-xl text-gray-300">
                            Discover what your peers are writing about
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {recentArticles.map((article, index) => (
                            <motion.a
                                key={article.id ?? index}
                                href={article.id ? `/articles/${article.id}` : '/articles'}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="block bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition cursor-pointer"
                            >
                                <div className="mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                                          style={{
                                              background: `${colors.softPink}30`,
                                              color: colors.softPink
                                          }}>
                                        {article.category?.name ?? 'General'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    by {article.author?.name ?? 'Unknown'}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>
                                        {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recently approved'}
                                    </span>
                                    <span>{article.comments_count ?? 0} comments</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {recentArticles.length === 0 && (
                        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 text-center text-gray-300">
                            No public articles are available yet.
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-10"
                    >
                        <a
                            href="/articles"
                            className="inline-block px-8 py-3 rounded-lg text-white font-medium transition"
                            style={{
                                background: `linear-gradient(135deg, ${colors.softPink} 0%, ${colors.mediumPurple} 100%)`,
                            }}
                        >
                            View All Articles
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Overview Section */}
            <div className="relative py-24"
                 style={{ background: colors.deepPurple }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                📖 About <span style={{ color: colors.softPink }}>FYI</span>
                            </h2>
                            <div className="space-y-4 text-gray-300 text-lg">
                                <p>
                                    FYI is a student-driven journal platform that empowers writers to share their perspectives, research, and creative works with the academic community.
                                </p>
                                <p>
                                    Our mission is to create a space where every student voice matters—whether you're writing about science, culture, technology, or personal experiences. Through a structured peer review process, we ensure quality while nurturing new writers.
                                </p>
                                <p>
                                    From draft to publication, FYI guides you through every step, providing constructive feedback from editors and engagement from readers. It's more than just publishing—it's about building a community of thoughtful contributors.
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
                                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.softPink }}>🎯 Our Mission</h3>
                                <p className="text-gray-300 text-lg">
                                    To provide a supportive platform where student writers can develop their skills, share knowledge, and contribute to academic discourse through quality publications.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.softPink }}>🌟 Our Vision</h3>
                                <p className="text-gray-300 text-lg">
                                    To become the leading student journal that bridges the gap between academic writing and real-world impact, fostering the next generation of thought leaders.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.softPink }}>📋 How It Works</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: colors.softPink }}>✍️</span> Write and submit your article
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: colors.softPink }}>👥</span> Receive feedback from editors
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: colors.softPink }}>📢</span> Get published and engage with readers
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: colors.softPink }}>📊</span> Track your impact
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-16 overflow-hidden"
                 style={{
                     background: `linear-gradient(135deg, ${colors.mediumPurple} 0%, ${colors.royalPurple} 50%, ${colors.deepPurple} 100%)`
                 }}>
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
                        Ready to Share Your Story?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/90 mb-8"
                    >
                        Join hundreds of student writers already publishing on FYI.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <button
                            onClick={() => {
                                setAuthMode('register');
                                setShowAuth(true);
                            }}
                            className="px-8 py-4 bg-white rounded-xl font-semibold text-lg shadow-xl hover:bg-gray-100 transition"
                            style={{ color: colors.deepPurple }}
                        >
                            Start Writing Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10"
                    style={{ background: colors.deepPurple }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter mb-4" style={{ color: colors.softPink }}>FYI</h3>
                            <p className="text-gray-400">The student journal where every voice matters.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">For Writers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => {
                                    setAuthMode('register');
                                    setShowAuth(true);
                                }} className="hover:text-white transition">Write an Article</button></li>
                                <li><button onClick={() => {
                                    setAuthMode('login');
                                    setShowAuth(true);
                                }} className="hover:text-white transition">Submission Guidelines</button></li>
                                <li><button onClick={() => {
                                    setAuthMode('login');
                                    setShowAuth(true);
                                }} className="hover:text-white transition">Editor Resources</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">About Us</button></li>
                                <li><button className="hover:text-white transition">Meet the Editors</button></li>
                                <li><button className="hover:text-white transition">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button className="hover:text-white transition">Privacy Policy</button></li>
                                <li><button className="hover:text-white transition">Terms of Use</button></li>
                                <li><button className="hover:text-white transition">Code of Conduct</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} FYI Student Journal. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Auth Modal - Using the imported component */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />

            <style>{`
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
