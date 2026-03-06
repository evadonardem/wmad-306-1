import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useThemeContext, NEWSPAPER_THEMES, getThemeColors } from '@/Components/ThemeContext';
import AuthModal from '@/Components/AuthModal';

export default function Welcome({ auth, recentArticles = [] }) {


    const [isFlipped, setIsFlipped] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });
    const [commentDrafts, setCommentDrafts] = useState({});
    const [showRegisterPrompt, setShowRegisterPrompt] = useState({});
    const { theme: currentTheme, setTheme: setCurrentTheme } = useThemeContext();

    // Update time for newspaper dateline
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const themes = NEWSPAPER_THEMES;
    const colors = getThemeColors(currentTheme);

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            title: 'Publish Your Voice',
            description: 'Share your ideas, research, and stories with the entire student community. Every voice matters.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: 'Peer Review',
            description: 'Get constructive feedback from fellow students and editors to refine your work before publication.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            title: 'Engage & Discuss',
            description: 'Spark meaningful conversations through comments and discussions on published articles.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

    const featuredArticles = recentArticles.slice(0, 2);
    const secondaryArticles = recentArticles.slice(2, 5);

    const handleCommentInput = (articleId, value) => {
        setCommentDrafts((prev) => ({ ...prev, [articleId]: value }));
    };

    const promptRegisterToComment = (articleId) => {
        if (auth.user) return;
        setShowRegisterPrompt((prev) => ({ ...prev, [articleId]: true }));
        setAuthMode('register');
        setShowAuth(true);
    };

    const handleCommentSubmit = (articleId) => {
        if (!auth.user) {
            promptRegisterToComment(articleId);
        }
    };

    const renderCommentsSection = (article) => {
        const articleId = article.id;
        return (
            <div className="mt-6 mb-8">
                <div className="rounded-lg border border-gray-200 bg-white/80 p-4" style={{ color: colors.ink, background: colors.paper }}>
                    <div className="font-serif font-bold text-base mb-2" style={{ color: colors.newsprint }}>Comments</div>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Add a comment..."
                            value={commentDrafts[articleId] || ''}
                            onChange={(e) => handleCommentInput(articleId, e.target.value)}
                            onFocus={() => promptRegisterToComment(articleId)}
                            onClick={() => promptRegisterToComment(articleId)}
                            readOnly={!auth.user}
                        />
                        <button
                            type="button"
                            className="px-4 py-2 rounded font-serif text-sm"
                            style={{ backgroundColor: colors.newsprint, color: colors.paper }}
                            onClick={() => handleCommentSubmit(articleId)}
                        >
                            Post
                        </button>
                    </div>
                    {!auth.user && showRegisterPrompt[articleId] && (
                        <div className="mt-3 p-3 rounded bg-pink-50 border border-pink-200 text-pink-800 font-serif text-sm">
                            Register an account to comment.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).toUpperCase();
    };

    return (
        <>
            <Head title="FYI - Student Journal" />

            {/* Theme Picker Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
                    style={{
                        backgroundColor: colors.accent,
                        color: colors.paper
                    }}
                >
                    🎨
                </motion.button>

                <AnimatePresence>
                    {showThemePicker && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="absolute bottom-16 right-0 p-4 rounded-lg shadow-xl min-w-[200px]"
                            style={{
                                backgroundColor: colors.paper,
                                borderColor: colors.border,
                                borderWidth: '1px'
                            }}
                        >
                            <h3 className="font-serif text-sm font-bold mb-3" style={{ color: colors.newsprint }}>
                                Newspaper Themes
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(themes).map(([key, theme]) => (
                                    <motion.button
                                        key={key}
                                        whileHover={{ x: 5 }}
                                        onClick={() => {
                                            setCurrentTheme(key);
                                            setShowThemePicker(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded transition-colors"
                                        style={{
                                            backgroundColor: currentTheme === key ? colors.accent + '20' : 'transparent',
                                            color: colors.newsprint
                                        }}
                                    >
                                        <span className="text-xl">{theme.icon}</span>
                                        <span className="font-serif text-sm">{theme.name}</span>
                                        {currentTheme === key && (
                                            <span className="ml-auto">✓</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Breaking News Ticker */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 py-2 border-b-4"
                style={{
                    backgroundColor: colors.newsprint,
                    borderColor: colors.accent,
                    color: colors.paper
                }}
                animate={{ backgroundColor: colors.newsprint }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4">
                            <motion.span
                                className="px-2 py-1 font-bold"
                                style={{ backgroundColor: colors.accent, color: colors.paper }}
                                animate={{ backgroundColor: colors.accent }}
                            >
                                BREAKING
                            </motion.span>
                            <motion.div
                                animate={{ x: [0, -1000] }}
                                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                                className="whitespace-nowrap"
                            >
                                • STUDENT JOURNAL LAUNCHES NEW PLATFORM • CALL FOR SUBMISSIONS NOW OPEN • JOIN THE STUDENT PRESS •
                            </motion.div>
                        </div>
                        <span className="font-mono">{formatDate(currentTime)}</span>
                    </div>
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.nav
                className="fixed top-8 left-0 right-0 z-40 border-b shadow-sm"
                style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.border
                }}
                animate={{ backgroundColor: colors.paper }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Newspaper Nameplate */}
                    <div className="flex justify-between items-center mb-4">
                        <motion.div
                            className="text-xs font-mono"
                            style={{ color: colors.byline }}
                            animate={{ color: colors.byline }}
                        >
                            VOL. 1 • NO. 1
                        </motion.div>
                        <motion.div
                            className="text-xs font-mono"
                            style={{ color: colors.byline }}
                            animate={{ color: colors.byline }}
                        >
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short' })} EDITION
                        </motion.div>
                    </div>

                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-6xl font-black tracking-[-0.05em] font-serif"
                            style={{ color: colors.newsprint }}
                        >
                            <motion.span
                                className="pb-2"
                                style={{ borderBottomColor: colors.newsprint }}
                                animate={{ borderBottomColor: colors.newsprint }}
                            >
                                THE FYI
                            </motion.span>
                        </motion.div>

                        {!auth.user && !showAuth && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAuthMode('login');
                                        setShowAuth(true);
                                    }}
                                    className="px-6 py-2 font-serif text-sm uppercase tracking-wider transition duration-300"
                                    style={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                    animate={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                >
                                    Sign In
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAuthMode('register');
                                        setShowAuth(true);
                                    }}
                                    className="px-6 py-2 border-2 font-serif text-sm uppercase tracking-wider transition duration-300"
                                    style={{
                                        borderColor: colors.newsprint,
                                        color: colors.newsprint
                                    }}
                                    animate={{
                                        borderColor: colors.newsprint,
                                        color: colors.newsprint
                                    }}
                                >
                                    Subscribe
                                </motion.button>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-4 pt-2 border-t" style={{ borderColor: colors.border }}>
                        <ul className="flex gap-6 text-xs font-mono uppercase tracking-wider" style={{ color: colors.byline }}>
                            <li><a href="#" className="hover:opacity-70 transition">Home</a></li>
                            <li><a href="#features" className="hover:opacity-70 transition">Features</a></li>
                            <li><a href="#articles" className="hover:opacity-70 transition">Articles</a></li>
                            <li><a href="#about" className="hover:opacity-70 transition">About</a></li>
                            <li><a href="#submit" className="hover:opacity-70 transition">Submit</a></li>
                        </ul>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <div className="relative pt-48">
                <motion.div
                    ref={targetRef}
                    className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
                    style={{
                        opacity,
                        scale,
                        backgroundColor: colors.paper,
                    }}
                    animate={{ backgroundColor: colors.paper }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Newspaper Texture Overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Lead Story Label */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="inline-block mb-6"
                            >
                                <motion.span
                                    className="px-4 py-2 font-mono text-xs tracking-[0.2em]"
                                    style={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                    animate={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                >
                                    LEAD STORY • {currentTheme.toUpperCase()} EDITION
                                </motion.span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                className="font-serif text-7xl md:text-8xl font-black mb-4 leading-tight"
                                style={{ color: colors.newsprint }}
                                animate={{ color: colors.newsprint }}
                            >
                                For Your
                                <motion.span
                                    className="block italic"
                                    style={{ color: colors.accent }}
                                    animate={{ color: colors.accent }}
                                >
                                    Information
                                </motion.span>
                            </motion.h1>

                            {/* Deck Headline */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-24 h-px"
                                        style={{ backgroundColor: colors.border }}
                                        animate={{ backgroundColor: colors.border }}
                                    ></motion.div>
                                </div>
                                <motion.p
                                    className="relative inline-block px-6 font-serif text-xl italic"
                                    style={{
                                        backgroundColor: colors.paper,
                                        color: colors.byline
                                    }}
                                    animate={{
                                        backgroundColor: colors.paper,
                                        color: colors.byline
                                    }}
                                >
                                    {currentTheme === 'vintage' ? 'Est. 1920' :
                                     currentTheme === 'financial' ? 'Markets & Minds' :
                                     currentTheme === 'broadsheet' ? 'The Student Voice' :
                                     currentTheme === 'berliner' ? 'Die Studentenzeitung' :
                                     currentTheme === 'guardian' ? 'Open for Ideas' :
                                     currentTheme === 'sunset' ? 'Evening Edition' :
                                     'The Student Voice Since 2024'}
                                </motion.p>
                            </div>

                            {/* Lead Paragraph */}
                            <motion.p
                                className="text-lg max-w-3xl mx-auto mb-10 font-serif leading-relaxed"
                                style={{ color: colors.accent2 || colors.byline }}
                                animate={{ color: colors.accent2 || colors.byline }}
                            >
                                A student-run journal where voices are heard, ideas are shared,
                                and knowledge is built together. Publish your articles, engage with peers,
                                and make an impact on your campus community.
                            </motion.p>

                            {/* Byline */}
                            <motion.div
                                className="mb-8 font-serif text-sm border-t border-b py-3 inline-block px-8"
                                style={{
                                    color: colors.byline,
                                    borderColor: colors.border
                                }}
                                animate={{
                                    color: colors.byline,
                                    borderColor: colors.border
                                }}
                            >
                                BY THE FYI EDITORIAL BOARD | {currentTheme.toUpperCase()} EDITION
                            </motion.div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: colors.accent }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setAuthMode('register');
                                        setShowAuth(true);
                                    }}
                                    className="px-8 py-4 font-serif text-lg transition duration-300 tracking-wide"
                                    style={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                    animate={{
                                        backgroundColor: colors.newsprint,
                                        color: colors.paper
                                    }}
                                >
                                    Start Writing Today
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: colors.newsprint, color: colors.paper }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        const featuresSection = document.getElementById('features');
                                        featuresSection?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 border-2 font-serif text-lg transition duration-300"
                                    style={{
                                        borderColor: colors.newsprint,
                                        color: colors.newsprint
                                    }}
                                    animate={{
                                        borderColor: colors.newsprint,
                                        color: colors.newsprint
                                    }}
                                >
                                    Read the Latest
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
                id="features"
                className="relative py-24"
                style={{ backgroundColor: colors.aged }}
                animate={{ backgroundColor: colors.aged }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-block mb-4">
                            <motion.span
                                className="font-mono text-xs tracking-[0.3em]"
                                style={{ color: colors.byline }}
                                animate={{ color: colors.byline }}
                            >
                                ——— FEATURES ———
                            </motion.span>
                        </div>
                        <motion.h2
                            className="font-serif text-5xl font-bold mb-4"
                            style={{ color: colors.newsprint }}
                            animate={{ color: colors.newsprint }}
                        >
                            Everything You Need to
                            <motion.span
                                className="block italic"
                                style={{ color: colors.accent }}
                                animate={{ color: colors.accent }}
                            >
                                Share Your Voice
                            </motion.span>
                        </motion.h2>
                        <motion.div
                            className="w-24 h-px mx-auto"
                            style={{ backgroundColor: colors.border }}
                            animate={{ backgroundColor: colors.border }}
                        ></motion.div>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="pt-6"
                                style={{ borderTopColor: colors.newsprint, borderTopWidth: 4 }}
                            >
                                <motion.div
                                    className="mb-4"
                                    style={{ color: colors.accent }}
                                    animate={{ color: colors.accent }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <motion.h3
                                    className="font-serif text-xl font-bold mb-2"
                                    style={{ color: colors.newsprint }}
                                    animate={{ color: colors.newsprint }}
                                >
                                    {feature.title}
                                </motion.h3>
                                <motion.p
                                    className="font-serif text-sm leading-relaxed"
                                    style={{ color: colors.byline }}
                                    animate={{ color: colors.byline }}
                                >
                                    {feature.description}
                                </motion.p>
                                <motion.div
                                    className="mt-4 text-xs font-mono"
                                    style={{ color: colors.border }}
                                    animate={{ color: colors.border }}
                                >
                                    ——— • ———
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Recent Articles Section */}
            <motion.div
                id="articles"
                className="relative py-24"
                style={{ backgroundColor: colors.paper }}
                animate={{ backgroundColor: colors.paper }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <motion.span
                            className="font-mono text-xs tracking-[0.3em]"
                            style={{ color: colors.byline }}
                            animate={{ color: colors.byline }}
                        >
                            ——— LATEST EDITION ———
                        </motion.span>
                        <motion.h2
                            className="font-serif text-5xl font-bold mt-4"
                            style={{ color: colors.newsprint }}
                            animate={{ color: colors.newsprint }}
                        >
                            Today's <motion.span
                                className="italic"
                                style={{ color: colors.accent }}
                                animate={{ color: colors.accent }}
                            >Stories</motion.span>
                        </motion.h2>
                        <motion.div
                            className="w-24 h-px mx-auto mt-4"
                            style={{ backgroundColor: colors.border }}
                            animate={{ backgroundColor: colors.border }}
                        ></motion.div>
                    </motion.div>

                    {/* Featured Articles */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {featuredArticles.map((article, index) => (
                            <motion.div
                                key={article.id ?? index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <a
                                    href={article.id ? `/articles/${article.id}` : '/articles'}
                                    className="block cursor-pointer"
                                >
                                    <motion.div
                                        className="border-b-2 pb-4 mb-4"
                                        style={{
                                            borderColor: colors.newsprint,
                                            color: colors.byline
                                        }}
                                    >
                                        <span className="font-mono text-xs uppercase tracking-wider">
                                            {article.category?.name ?? 'FEATURE STORY'}
                                        </span>
                                    </motion.div>
                                    <motion.h3
                                        className="font-serif text-3xl font-bold mb-3 group-hover:opacity-70 transition line-clamp-3"
                                        style={{ color: colors.newsprint }}
                                    >
                                        {article.title}
                                    </motion.h3>
                                    <motion.p
                                        className="font-serif mb-3 italic line-clamp-2"
                                        style={{ color: colors.byline }}
                                    >
                                        {article.excerpt || 'An in-depth look at the stories shaping our campus community...'}
                                    </motion.p>
                                    <div className="flex justify-between items-center text-sm font-mono" style={{ color: colors.border }}>
                                        <span>By {article.author?.name ?? 'Staff Writer'}</span>
                                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'Just in'}</span>
                                    </div>
                                </a>
                                {/* Comments Section for this article */}
                                {renderCommentsSection(article)}
                            </motion.div>
                        ))}
                    </div>

                    {/* Secondary Articles */}
                    <div className="grid md:grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: colors.border }}>
                        {secondaryArticles.map((article, index) => (
                            <motion.div
                                key={article.id ?? index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <a
                                    href={article.id ? `/articles/${article.id}` : '/articles'}
                                    className="block cursor-pointer"
                                >
                                    <div className="mb-2">
                                        <span className="font-mono text-xs uppercase" style={{ color: colors.byline }}>
                                            {article.category?.name ?? 'NEWS'}
                                        </span>
                                    </div>
                                    <motion.h3
                                        className="font-serif text-lg font-bold mb-2 group-hover:opacity-70 transition line-clamp-2"
                                        style={{ color: colors.newsprint }}
                                    >
                                        {article.title}
                                    </motion.h3>
                                    <motion.p
                                        className="font-serif text-sm mb-2 line-clamp-2"
                                        style={{ color: colors.byline }}
                                    >
                                        {article.excerpt || 'Read more about this developing story...'}
                                    </motion.p>
                                    <div className="text-xs font-mono" style={{ color: colors.border }}>
                                        {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'New'}
                                    </div>
                                </a>
                                {/* Comments Section for this article */}
                                {renderCommentsSection(article)}
                            </motion.div>
                        ))}
                    </div>

                    {recentArticles.length === 0 && (
                        <motion.div
                            className="border-2 p-12 text-center"
                            style={{
                                borderColor: colors.border,
                                backgroundColor: colors.aged,
                                color: colors.byline
                            }}
                        >
                            <p className="font-serif text-xl italic">
                                "The pages are still blank, but there is a miraculous feeling of the words being there, written in invisible ink and bursting to be written."
                            </p>
                            <p className="font-mono text-sm mt-4" style={{ color: colors.border }}>— No articles yet. Be the first to publish!</p>
                        </motion.div>
                    )}

                    {/* View All Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <motion.a
                            href="/articles"
                            className="inline-block px-8 py-3 border-2 font-mono text-sm transition duration-300 tracking-wider"
                            style={{
                                borderColor: colors.newsprint,
                                color: colors.newsprint
                            }}
                            whileHover={{
                                backgroundColor: colors.newsprint,
                                color: colors.paper
                            }}
                        >
                            VIEW ALL ARTICLES →
                        </motion.a>
                    </motion.div>
                </div>
            </motion.div>

            {/* About Section */}
            <motion.div
                id="about"
                className="relative py-24"
                style={{ backgroundColor: colors.aged }}
                animate={{ backgroundColor: colors.aged }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                className="font-mono text-xs tracking-[0.3em]"
                                style={{ color: colors.byline }}
                                animate={{ color: colors.byline }}
                            >
                                ——— ABOUT US ———
                            </motion.span>
                            <motion.h2
                                className="font-serif text-5xl font-bold mt-4 mb-6"
                                style={{ color: colors.newsprint }}
                                animate={{ color: colors.newsprint }}
                            >
                                The <motion.span
                                    className="italic"
                                    style={{ color: colors.accent }}
                                    animate={{ color: colors.accent }}
                                >Chronicle</motion.span> of Student Voices
                            </motion.h2>
                            <div className="prose prose-lg font-serif space-y-4" style={{ color: colors.accent2 || colors.byline }}>
                                <p className="leading-relaxed">
                                    FYI is a student-driven journal platform that empowers writers to share their perspectives, research, and creative works with the academic community.
                                </p>
                                <p className="leading-relaxed">
                                    Our mission is to create a space where every student voice matters—whether you're writing about science, culture, technology, or personal experiences. Through a structured peer review process, we ensure quality while nurturing new writers.
                                </p>
                                <p className="leading-relaxed">
                                    From draft to publication, FYI guides you through every step, providing constructive feedback from editors and engagement from readers. It's more than just publishing—it's about building a community of thoughtful contributors.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            {/* Mission Card */}
                            <motion.div
                                className="border-l-4 pl-6 py-2"
                                style={{ borderColor: colors.newsprint }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.newsprint }}
                                >
                                    🎯 Our Mission
                                </motion.h3>
                                <motion.p
                                    className="font-serif italic"
                                    style={{ color: colors.byline }}
                                >
                                    "To provide a supportive platform where student writers can develop their skills, share knowledge, and contribute to academic discourse through quality publications."
                                </motion.p>
                                <motion.p
                                    className="font-mono text-xs mt-2"
                                    style={{ color: colors.border }}
                                >
                                    — EDITORIAL MISSION STATEMENT
                                </motion.p>
                            </motion.div>

                            {/* Vision Card */}
                            <motion.div
                                className="border-l-4 pl-6 py-2"
                                style={{ borderColor: colors.accent }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.newsprint }}
                                >
                                    🌟 Our Vision
                                </motion.h3>
                                <motion.p
                                    className="font-serif italic"
                                    style={{ color: colors.byline }}
                                >
                                    "To become the leading student journal that bridges the gap between academic writing and real-world impact, fostering the next generation of thought leaders."
                                </motion.p>
                                <motion.p
                                    className="font-mono text-xs mt-2"
                                    style={{ color: colors.border }}
                                >
                                    — EDITORIAL VISION
                                </motion.p>
                            </motion.div>

                            {/* How It Works */}
                            <motion.div
                                className="border-l-4 pl-6 py-2"
                                style={{ borderColor: colors.accent2 || colors.byline }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.newsprint }}
                                >
                                    📋 How It Works
                                </motion.h3>
                                <ul className="space-y-2 font-serif" style={{ color: colors.byline }}>
                                    {[
                                        'Write and submit your article for review',
                                        'Receive constructive feedback from editors',
                                        'Get published in the next edition',
                                        'Engage with readers through comments'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span style={{ color: colors.accent }}>•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
                className="py-12 border-y"
                style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.border
                }}
                animate={{
                    backgroundColor: colors.paper,
                    borderColor: colors.border
                }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <motion.div
                                    className="font-serif text-5xl font-bold mb-2"
                                    style={{ color: colors.newsprint }}
                                >
                                    {benefit.stat}
                                </motion.div>
                                <motion.div
                                    className="font-mono text-xs uppercase tracking-wider mb-2"
                                    style={{ color: colors.byline }}
                                >
                                    {benefit.label}
                                </motion.div>
                                <motion.div
                                    className="font-serif text-sm"
                                    style={{ color: colors.accent2 || colors.byline }}
                                >
                                    {benefit.description}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                id="submit"
                className="relative py-20"
                style={{ backgroundColor: colors.newsprint }}
                animate={{ backgroundColor: colors.newsprint }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <motion.span
                            className="font-mono text-xs tracking-[0.3em]"
                            style={{ color: colors.border }}
                        >
                            ——— CALL FOR SUBMISSIONS ———
                        </motion.span>
                        <motion.h2
                            className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4"
                            style={{ color: colors.paper }}
                        >
                            Ready to Share Your Story?
                        </motion.h2>
                        <motion.p
                            className="font-serif text-xl italic mb-8"
                            style={{ color: colors.border }}
                        >
                            Join hundreds of student writers already publishing on FYI.
                        </motion.p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.button
                                onClick={() => {
                                    setAuthMode('register');
                                    setShowAuth(true);
                                }}
                                className="px-10 py-4 font-serif text-lg font-bold transition duration-300 border-2 tracking-wider"
                                style={{
                                    backgroundColor: colors.paper,
                                    borderColor: colors.paper,
                                    color: colors.newsprint
                                }}
                                whileHover={{
                                    backgroundColor: colors.accent,
                                    borderColor: colors.accent,
                                    color: colors.paper
                                }}
                            >
                                Submit Your Article
                            </motion.button>
                        </motion.div>
                        <motion.p
                            className="font-mono text-xs mt-4"
                            style={{ color: colors.border }}
                        >
                            Deadline for next edition: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                className="py-16 border-t-4"
                style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.newsprint
                }}
                animate={{
                    backgroundColor: colors.paper,
                    borderColor: colors.newsprint
                }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Masthead */}
                    <div className="text-center mb-12">
                        <motion.div
                            className="font-serif text-7xl font-black tracking-[-0.05em] mb-2"
                            style={{ color: colors.newsprint }}
                        >
                            THE FYI
                        </motion.div>
                        <motion.div
                            className="font-mono text-xs tracking-[0.5em]"
                            style={{ color: colors.byline }}
                        >
                            STUDENT JOURNAL • {currentTheme.toUpperCase()} EDITION
                        </motion.div>
                        <motion.div
                            className="w-24 h-px mx-auto my-4"
                            style={{ backgroundColor: colors.border }}
                        ></motion.div>
                        <motion.p
                            className="font-serif text-sm italic"
                            style={{ color: colors.accent2 || colors.byline }}
                        >
                            "All the news that's fit to print, by students, for students."
                        </motion.p>
                    </div>

                    {/* Footer Columns */}
                    <div className="grid md:grid-cols-4 gap-8 font-serif text-sm">
                        <div>
                            <h4 className="font-mono text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: colors.newsprint }}>
                                For Writers
                            </h4>
                            <ul className="space-y-2">
                                <li><button onClick={() => { setAuthMode('register'); setShowAuth(true); }} className="transition" style={{ color: colors.byline }}>Submit an Article</button></li>
                                <li><button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="transition" style={{ color: colors.byline }}>Writing Guidelines</button></li>
                                <li><button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="transition" style={{ color: colors.byline }}>Editor Resources</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Style Guide</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: colors.newsprint }}>
                                Sections
                            </h4>
                            <ul className="space-y-2">
                                <li><button className="transition" style={{ color: colors.byline }}>News</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Opinion</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Arts & Culture</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Science</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: colors.newsprint }}>
                                Company
                            </h4>
                            <ul className="space-y-2">
                                <li><button className="transition" style={{ color: colors.byline }}>About Us</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Meet the Team</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Careers</button></li>
                                <li><button className="transition" style={{ color: colors.byline }}>Advertise</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: colors.newsprint }}>
                                Contact
                            </h4>
                            <ul className="space-y-2" style={{ color: colors.byline }}>
                                <li>📍 Campus Newsroom</li>
                                <li>📞 (555) 123-4567</li>
                                <li>✉️ editor@fyi.edu</li>
                                <li>📱 @thefyi</li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t" style={{ borderColor: colors.border }}>
                        <p className="font-mono text-xs text-center" style={{ color: colors.border }}>
                            © {new Date().getFullYear()} THE FYI STUDENT JOURNAL. ALL RIGHTS RESERVED.
                        </p>
                        <p className="font-serif text-xs text-center mt-2 italic" style={{ color: colors.border }}>
                            "The student journal where every voice matters."
                        </p>
                    </div>
                </div>
            </motion.footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />

            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                }
            `}</style>
        </>
    );
}

