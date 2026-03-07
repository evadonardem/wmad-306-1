import { Head, useForm } from '@inertiajs/react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import AuthModal from '@/Components/AuthModal';
import ThemePicker from '@/Components/ThemePicker';
import { useTheme } from '@/Contexts/ThemeContext';

// Animation variants for consistent, reusable animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 25 }
};

export default function Welcome({ auth, recentArticles = [], landingStats = {} }) {
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [activeSection, setActiveSection] = useState('home');

    const targetRef = useRef(null);
    const { colors, theme, isDarkMode } = useTheme();

    // Smooth scroll progress with spring physics
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax effects
    const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.85]);
    const heroY = useTransform(smoothProgress, [0, 0.5], [0, 100]);

    // Navbar hide/show on scroll with throttle
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setIsNavVisible(currentScrollY < lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);

        // Update active section
        const sections = ['home', 'features', 'articles', 'about', 'submit='];
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    setActiveSection(section);
                    break;
                }
            }
        }
    }, [lastScrollY]);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    // Update time for newspaper dateline
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

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

    const formatCount = (value) => new Intl.NumberFormat('en-US').format(Number(value ?? 0));

    const benefits = [
        {
            stat: formatCount(landingStats.studentWriters),
            label: 'Student Writers',
            description: 'Join a thriving community of student writers sharing their perspectives.'
        },
        {
            stat: formatCount(landingStats.publishedArticles),
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
    const secondaryArticles = recentArticles.slice(2, 4);


    const [commentDrafts, setCommentDrafts] = useState({});
    const [showRegisterPrompt, setShowRegisterPrompt] = useState({});
    const [commentErrors, setCommentErrors] = useState({});
    const commentForm = useForm({ body: '', parent_id: null });

    const handleCommentInput = (articleId, value) => {
        setCommentDrafts((prev) => ({ ...prev, [articleId]: value }));
        setCommentErrors((prev) => ({ ...prev, [articleId]: null }));
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
            return;
        }

        const body = (commentDrafts[articleId] ?? '').trim();
        if (!body) {
            setCommentErrors((prev) => ({ ...prev, [articleId]: 'Please enter a comment.' }));
            return;
        }

        commentForm
            .transform(() => ({ body, parent_id: null }))
            .post(`/articles/${articleId}/comments`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCommentDrafts((prev) => ({ ...prev, [articleId]: '' }));
                    setCommentErrors((prev) => ({ ...prev, [articleId]: null }));
                },
                onError: (errors) => {
                    setCommentErrors((prev) => ({
                        ...prev,
                        [articleId]: errors?.body ?? 'Unable to post comment right now.',
                    }));
                },
            });
    };

    const renderCommentsSection = (article) => {
        const articleId = article.id;
        return (
            <div className="mt-6 mb-8">
                <div className="rounded-lg border border-gray-200 bg-white/80 p-4" style={{ color: colors.ink || colors.text, background: colors.paper || colors.background }}>
                    <div className="font-serif font-bold text-base mb-2" style={{ color: colors.newsprint || colors.text }}>Comments</div>
                    {Array.isArray(article.comments) && article.comments.length > 0 ? (
                        <div className="space-y-3 mb-3">
                            {[article.comments[0]].filter(Boolean).map((comment) => (
                                <div key={comment.id} className="border-l-2 pl-3" style={{ borderColor: colors.border }}>
                                    <div className="font-serif text-sm font-bold" style={{ color: colors.newsprint || colors.text }}>
                                        {comment.user?.name ?? 'Anonymous'}
                                    </div>
                                    <div className="font-serif text-sm mt-1" style={{ color: colors.ink || colors.text }}>
                                        {comment.body}
                                    </div>
                                    <div className="font-mono text-xs mt-1" style={{ color: colors.byline || colors.textSecondary }}>
                                        {comment.created_at
                                            ? new Date(comment.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })
                                            : 'Just now'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="font-serif text-sm italic mb-3" style={{ color: colors.byline || colors.textSecondary }}>
                            No comments yet.
                        </div>
                    )}
                    <div className="mt-2">
                        <a
                            href={article.id ? `/articles/${article.id}#comments` : '/articles'}
                            className="font-mono text-xs underline"
                            style={{ color: colors.byline || colors.textSecondary }}
                        >
                            View more comments
                        </a>
                    </div>
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
                            style={{ backgroundColor: colors.newsprint || colors.primary, color: colors.paper || colors.background }}
                            onClick={() => handleCommentSubmit(articleId)}
                            disabled={commentForm.processing}
                        >
                            {commentForm.processing ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                    {commentErrors[articleId] && (
                        <div className="mt-2 font-serif text-sm text-red-700">
                            {commentErrors[articleId]}
                        </div>
                    )}
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

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="FYI - Student Journal" />

            {/* Floating Theme Picker */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
            >
                <ThemePicker position="floating-bottom-right" />
            </motion.div>

            {/* Breaking News Ticker - Enhanced */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-40 py-2 border-b-4"
                style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                    color: colors.background
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <motion.span
                                className="px-2 py-1 font-bold relative overflow-hidden"
                                style={{ backgroundColor: colors.accent, color: colors.background }}
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
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
                        <motion.span
                            className="font-mono"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            {formatDate(currentTime)}
                        </motion.span>
                    </div>
                </div>
            </motion.div>

            {/* Navigation - Enhanced with backdrop blur and active states */}
            <motion.nav
                className="fixed top-8 left-0 right-0 z-30 border-b shadow-lg backdrop-blur-md"
                style={{
                    backgroundColor: `${colors.surface}CC`,
                    borderColor: colors.border
                }}
                initial={{ y: -100 }}
                animate={{ y: isNavVisible ? 0 : -100 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Newspaper Nameplate */}
                    <motion.div
                        className="flex justify-between items-center mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className="text-xs font-mono"
                            style={{ color: colors.textSecondary }}
                            whileHover={{ x: 2 }}
                        >
                            VOL. 1 • NO. 1
                        </motion.div>
                        <motion.div
                            className="text-xs font-mono"
                            style={{ color: colors.textSecondary }}
                            animate={{
                                color: [colors.textSecondary, colors.accent, colors.textSecondary]
                            }}
                            transition={{ repeat: Infinity, duration: 5 }}
                        >
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short' })} EDITION
                        </motion.div>
                    </motion.div>

                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-6xl font-black tracking-[-0.05em] font-serif cursor-pointer group"
                            style={{ color: colors.text }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => scrollToSection('home')}
                        >
                            <motion.span
                                className="pb-2 inline-block relative"
                                style={{ borderBottomColor: colors.text }}
                                whileHover={{ borderBottomWidth: 2 }}
                            >
                                THE FYI
                                <motion.span
                                    className="absolute -bottom-1 left-0 w-0 h-0.5"
                                    style={{ backgroundColor: colors.accent }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.span>
                        </motion.div>

                        {!auth.user && !showAuth && (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="flex gap-3"
                            >
                                <motion.button
                                    variants={scaleIn}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAuthMode('login');
                                        setShowAuth(true);
                                    }}
                                    className="px-6 py-2 font-serif text-sm uppercase tracking-wider transition-all duration-300 relative overflow-hidden group"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.background
                                    }}
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: colors.accent }}
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>
                                <motion.button
                                    variants={scaleIn}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAuthMode('register');
                                        setShowAuth(true);
                                    }}
                                    className="px-6 py-2 border-2 font-serif text-sm uppercase tracking-wider transition-all duration-300 relative overflow-hidden group"
                                    style={{
                                        borderColor: colors.primary,
                                        color: colors.text
                                    }}
                                >
                                    <span className="relative z-10">Subscribe</span>
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: colors.primary }}
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation Links with active indicator */}
                    <motion.div
                        className="mt-4 pt-2 border-t"
                        style={{ borderColor: colors.border }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ul className="flex gap-6 text-xs font-mono uppercase tracking-wider">
                            {[
                                { id: 'home', label: 'Home' },
                                { id: 'features', label: 'Features' },
                                { id: 'articles', label: 'Articles' },
                                { id: 'about', label: 'About' },
                                { id: 'submit', label: 'Submit' }
                            ].map((item, index) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <button
                                        onClick={() => scrollToSection(item.id)}
                                        className="relative py-1 group"
                                        style={{ color: activeSection === item.id ? colors.accent : colors.textSecondary }}
                                    >
                                        {item.label}
                                        {activeSection === item.id && (
                                            <motion.span
                                                className="absolute bottom-0 left-0 w-full h-0.5"
                                                style={{ backgroundColor: colors.accent }}
                                                layoutId="activeSection"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <motion.span
                                            className="absolute bottom-0 left-0 w-0 h-0.5"
                                            style={{ backgroundColor: colors.accent }}
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Section - Enhanced with parallax */}
            <div id="home" className="relative pt-48">
                <motion.div
                    ref={targetRef}
                    className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
                    style={{
                        opacity: heroOpacity,
                        scale: heroScale,
                        y: heroY,
                        backgroundColor: colors.background,
                    }}
                >
                    {/* Animated Newspaper Texture Overlay */}
                    <motion.div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                        animate={{
                            opacity: [0.05, 0.08, 0.05],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 10 }}
                    />

                    {/* Floating orbs for visual interest */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-full blur-3xl"
                        style={{
                            background: colors.primary,
                            opacity: 0.1,
                            top: '20%',
                            left: '10%'
                        }}
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 15 }}
                    />

                    <motion.div
                        className="absolute w-96 h-96 rounded-full blur-3xl"
                        style={{
                            background: colors.accent,
                            opacity: 0.1,
                            bottom: '10%',
                            right: '5%'
                        }}
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 40, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 20 }}
                    />

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {/* Lead Story Label */}
                            <motion.div
                                variants={scaleIn}
                                className="inline-block mb-6"
                            >
                                <motion.span
                                    className="px-4 py-2 font-mono text-xs tracking-[0.2em] inline-block"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.background
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    LEAD STORY • {theme.toUpperCase()} EDITION
                                </motion.span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                className="font-serif text-7xl md:text-8xl font-black mb-4 leading-tight"
                                style={{ color: colors.text }}
                                variants={fadeInUp}
                            >
                                For Your
                                <motion.span
                                    className="block italic"
                                    style={{ color: colors.accent }}
                                    animate={{
                                        textShadow: [
                                            `0 0 0 ${colors.accent}`,
                                            `0 0 20px ${colors.accent}`,
                                            `0 0 0 ${colors.accent}`
                                        ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                >
                                    Information
                                </motion.span>
                            </motion.h1>

                            {/* Deck Headline */}
                            <motion.div
                                className="relative mb-6"
                                variants={fadeInUp}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-24 h-px"
                                        style={{ backgroundColor: colors.border }}
                                    />
                                </div>
                                <motion.p
                                    className="relative inline-block px-6 font-serif text-xl italic"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.textSecondary
                                    }}
                                >
                                    {theme === 'vintage' ? currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                                     theme === 'financial' ? 'Markets & Minds' :
                                     theme === 'broadsheet' ? 'The Student Voice' :
                                     theme === 'berliner' ? 'Die Studentenzeitung' :
                                     theme === 'guardian' ? 'Open for Ideas' :
                                     theme === 'sunset' ? 'Evening Edition' :
                                     'The Student Voice Since 2024'}
                                </motion.p>
                            </motion.div>

                            {/* Lead Paragraph */}
                            <motion.p
                                className="text-lg max-w-3xl mx-auto mb-10 font-serif leading-relaxed"
                                style={{ color: colors.textSecondary }}
                                variants={fadeInUp}
                            >
                                A student-run journal where voices are heard, ideas are shared,
                                and knowledge is built together. Publish your articles, engage with peers,
                                and make an impact on your campus community.
                            </motion.p>

                            {/* Byline */}
                            <motion.div
                                className="mb-8 font-serif text-sm border-t border-b py-3 inline-block px-8"
                                style={{
                                    color: colors.textSecondary,
                                    borderColor: colors.border
                                }}
                                variants={fadeInUp}
                                whileHover={{
                                    borderColor: colors.accent,
                                    color: colors.accent
                                }}
                            >
                                BY THE FYI EDITORIAL BOARD | {theme.toUpperCase()} EDITION
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                variants={staggerContainer}
                            >
                                <motion.button
                                    variants={scaleIn}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setAuthMode('register');
                                        setShowAuth(true);
                                    }}
                                    className="px-8 py-4 font-serif text-lg transition-all duration-300 tracking-wide relative overflow-hidden group"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.background
                                    }}
                                >
                                    <span className="relative z-10">Start Writing Today</span>
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: colors.accent }}
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.button>

                                <motion.button
                                    variants={scaleIn}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => scrollToSection('features')}
                                    className="px-8 py-4 border-2 font-serif text-lg transition-all duration-300 relative overflow-hidden group"
                                    style={{
                                        borderColor: colors.primary,
                                        color: colors.text
                                    }}
                                >
                                    <span className="relative z-10">Read the Latest</span>
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: colors.primary }}
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1, opacity: 0.1 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section - Enhanced with staggered cards */}
            <motion.div
                id="features"
                className="relative py-24"
                style={{ backgroundColor: colors.surface }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <div className="inline-block mb-4">
                            <motion.span
                                className="font-mono text-xs tracking-[0.3em]"
                                style={{ color: colors.textSecondary }}
                                animate={{ letterSpacing: ['0.3em', '0.5em', '0.3em'] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                ——— FEATURES ———
                            </motion.span>
                        </div>
                        <motion.h2
                            className="font-serif text-5xl font-bold mb-4"
                            style={{ color: colors.text }}
                        >
                            Everything You Need to
                            <motion.span
                                className="block italic"
                                style={{ color: colors.accent }}
                            >
                                Share Your Voice
                            </motion.span>
                        </motion.h2>
                        <motion.div
                            className="w-24 h-px mx-auto"
                            style={{ backgroundColor: colors.border }}
                        />
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    initial: { opacity: 0, y: 50 },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100
                                        }
                                    }
                                }}
                                whileHover={{
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400 }
                                }}
                                className="pt-6 group cursor-pointer"
                                style={{ borderTopColor: colors.primary, borderTopWidth: 4 }}
                            >
                                <motion.div
                                    className="mb-4"
                                    style={{ color: colors.accent }}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <motion.h3
                                    className="font-serif text-xl font-bold mb-2"
                                    style={{ color: colors.text }}
                                >
                                    {feature.title}
                                </motion.h3>
                                <motion.p
                                    className="font-serif text-sm leading-relaxed"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {feature.description}
                                </motion.p>
                                <motion.div
                                    className="mt-4 text-xs font-mono"
                                    style={{ color: colors.border }}
                                >
                                    ——— • ———
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Recent Articles Section - Keep original but enhance animations */}
            <motion.div
                id="articles"
                className="relative py-24"
                style={{ backgroundColor: colors.background }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <motion.span
                            className="font-mono text-xs tracking-[0.3em]"
                            style={{ color: colors.textSecondary }}
                        >
                            ——— LATEST EDITION ———
                        </motion.span>
                        <motion.h2
                            className="font-serif text-5xl font-bold mt-4"
                            style={{ color: colors.text }}
                        >
                            Today's <motion.span
                                className="italic"
                                style={{ color: colors.accent }}
                            >Stories</motion.span>
                        </motion.h2>
                        <motion.div
                            className="w-24 h-px mx-auto mt-4"
                            style={{ backgroundColor: colors.border }}
                        />
                    </motion.div>

                    {/* Featured Articles */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-12 items-stretch">
                        {featuredArticles.map((article, index) => (
                            <motion.a
                                key={article.id ?? index}
                                href={article.id ? `/articles/${article.id}` : '/articles'}
                                variants={{
                                    initial: { opacity: 0, x: index === 0 ? -50 : 50 },
                                    animate: {
                                        opacity: 1,
                                        x: 0,
                                        transition: { delay: index * 0.2 }
                                    }
                                }}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer flex flex-col h-full min-h-[270px]"
                            >
                                <motion.div
                                    className="border-b-2 pb-4 mb-4"
                                    style={{
                                        borderColor: colors.primary,
                                        color: colors.textSecondary
                                    }}
                                >
                                    <span className="font-mono text-xs uppercase tracking-wider">
                                        {article.category?.name ?? 'FEATURE STORY'}
                                    </span>
                                </motion.div>
                                <div className="flex-1">
                                    <motion.h3
                                        className="font-serif text-3xl font-bold mb-3 group-hover:opacity-70 transition line-clamp-3 min-h-[5.5rem]"
                                        style={{ color: colors.text }}
                                    >
                                        {article.title}
                                    </motion.h3>
                                    <motion.p
                                        className="font-serif mb-3 italic line-clamp-2 min-h-[3.75rem]"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        {article.excerpt || 'An in-depth look at the stories shaping our campus community...'}
                                    </motion.p>
                                </div>
                                <div className="mt-auto pt-1 flex justify-between items-center text-sm font-mono" style={{ color: colors.border }}>
                                    <span>By {article.author?.name ?? 'Staff Writer'}</span>
                                    <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    }) : 'Just in'}</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Secondary Articles */}
                    <div className="grid md:grid-cols-2 gap-6 pt-8 border-t" style={{ borderColor: colors.border }}>
                        {secondaryArticles.map((article, index) => (
                            <motion.a
                                key={article.id ?? index}
                                href={article.id ? `/articles/${article.id}` : '/articles'}
                                variants={{
                                    initial: { opacity: 0, y: 30 },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.4 + index * 0.1 }
                                    }
                                }}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer"
                            >
                                <div className="mb-2">
                                    <span className="font-mono text-xs uppercase" style={{ color: colors.textSecondary }}>
                                        {article.category?.name ?? 'NEWS'}
                                    </span>
                                </div>
                                <motion.h3
                                    className="font-serif text-lg font-bold mb-2 group-hover:opacity-70 transition line-clamp-2"
                                    style={{ color: colors.text }}
                                >
                                    {article.title}
                                </motion.h3>
                                <motion.p
                                    className="font-serif text-sm mb-2 line-clamp-2"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {article.excerpt || 'Read more about this developing story...'}
                                </motion.p>
                                <div className="text-xs font-mono" style={{ color: colors.border }}>
                                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    }) : 'New'}
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Empty State - Keep original */}
                    {recentArticles.length === 0 && (
                        <motion.div
                            variants={fadeInUp}
                            className="border-2 p-12 text-center"
                            style={{
                                borderColor: colors.border,
                                backgroundColor: colors.surface,
                                color: colors.textSecondary
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
                        variants={fadeInUp}
                        className="text-center mt-12"
                    >
                        <motion.a
                            href="/articles"
                            className="inline-block px-8 py-3 border-2 font-mono text-sm transition duration-300 tracking-wider relative overflow-hidden group"
                            style={{
                                borderColor: colors.primary,
                                color: colors.text
                            }}
                            whileHover={{
                                backgroundColor: colors.primary,
                                color: colors.background
                            }}
                        >
                            <span className="relative z-10">VIEW ALL ARTICLES →</span>
                        </motion.a>
                    </motion.div>
                </div>
            </motion.div>

            {/* About Section - Keep original but enhance with subtle animations */}
            <motion.div
                id="about"
                className="relative py-24"
                style={{ backgroundColor: colors.surface }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <motion.div
                            variants={{
                                initial: { opacity: 0, x: -50 },
                                animate: { opacity: 1, x: 0 }
                            }}
                        >
                            <motion.span
                                className="font-mono text-xs tracking-[0.3em]"
                                style={{ color: colors.textSecondary }}
                            >
                                ——— ABOUT US ———
                            </motion.span>
                            <motion.h2
                                className="font-serif text-5xl font-bold mt-4 mb-6"
                                style={{ color: colors.text }}
                            >
                                The <motion.span
                                    className="italic"
                                    style={{ color: colors.accent }}
                                >Chronicle</motion.span> of Student Voices
                            </motion.h2>
                            <div className="prose prose-lg font-serif space-y-4" style={{ color: colors.textSecondary }}>
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
                            variants={{
                                initial: { opacity: 0, x: 50 },
                                animate: { opacity: 1, x: 0 }
                            }}
                            className="space-y-6"
                        >
                            {/* Mission Card */}
                            <motion.div
                                className="border-l-4 pl-6 py-2"
                                style={{ borderColor: colors.primary }}
                                whileHover={{ x: 5 }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.text }}
                                >
                                    🎯 Our Mission
                                </motion.h3>
                                <motion.p
                                    className="font-serif italic"
                                    style={{ color: colors.textSecondary }}
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
                                whileHover={{ x: 5 }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.text }}
                                >
                                    🌟 Our Vision
                                </motion.h3>
                                <motion.p
                                    className="font-serif italic"
                                    style={{ color: colors.textSecondary }}
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
                                style={{ borderColor: colors.textSecondary }}
                                whileHover={{ x: 5 }}
                            >
                                <motion.h3
                                    className="font-serif text-2xl font-bold mb-2"
                                    style={{ color: colors.text }}
                                >
                                    📋 How It Works
                                </motion.h3>
                                <ul className="space-y-2 font-serif" style={{ color: colors.textSecondary }}>
                                    {[
                                        'Write and submit your article for review',
                                        'Receive constructive feedback from editors',
                                        'Get published in the next edition',
                                        'Engage with readers through comments'
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            className="flex items-center gap-2"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                        >
                                            <span style={{ color: colors.accent }}>•</span> {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Bar - Enhanced with counter animations */}
            <motion.div
                className="py-12 border-y"
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border
                }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    initial: { opacity: 0, y: 20 },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: index * 0.1 }
                                    }
                                }}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <motion.div
                                    className="font-serif text-5xl font-bold mb-2 relative inline-block"
                                    style={{ color: colors.text }}
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
                                >
                                    {benefit.stat}
                                    <motion.span
                                        className="absolute -top-1 -right-2 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: colors.accent }}
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                </motion.div>
                                <motion.div
                                    className="font-mono text-xs uppercase tracking-wider mb-2"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {benefit.label}
                                </motion.div>
                                <motion.div
                                    className="font-serif text-sm"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {benefit.description}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA Section - Keep original but enhance with pulse animation */}
            <motion.div
                id="submit"
                className="relative py-20 overflow-hidden"
                style={{ backgroundColor: colors.primary }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ repeat: Infinity, duration: 10 }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        variants={fadeInUp}
                    >
                        <motion.span
                            className="font-mono text-xs tracking-[0.3em]"
                            style={{ color: colors.background }}
                        >
                            ——— CALL FOR SUBMISSIONS ———
                        </motion.span>
                        <motion.h2
                            className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-4"
                            style={{ color: colors.background }}
                        >
                            Ready to Share Your Story?
                        </motion.h2>
                        <motion.p
                            className="font-serif text-xl italic mb-8"
                            style={{ color: colors.background }}
                        >
                            Join hundreds of student writers already publishing on FYI.
                        </motion.p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.button
                                onClick={() => {
                                    setAuthMode('register');
                                    setShowAuth(true);
                                }}
                                className="px-10 py-4 font-serif text-lg font-bold transition duration-300 border-2 tracking-wider relative overflow-hidden group"
                                style={{
                                    backgroundColor: colors.background,
                                    borderColor: colors.background,
                                    color: colors.primary
                                }}
                                animate={{
                                    boxShadow: [
                                        `0 0 0 0 ${colors.background}`,
                                        `0 0 20px ${colors.background}`,
                                        `0 0 0 0 ${colors.background}`
                                    ]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <span className="relative z-10">Submit Your Article</span>
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ backgroundColor: colors.accent }}
                                    initial={{ scale: 0 }}
                                    whileHover={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        </motion.div>
                        <motion.p
                            className="font-mono text-xs mt-4"
                            style={{ color: colors.background }}
                        >
                            Deadline for next edition: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer - Keep original but enhance with subtle animations */}
            <motion.footer
                className="py-16 border-t-4"
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.primary
                }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Masthead */}
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeInUp}
                    >
                        <motion.div
                            className="font-serif text-7xl font-black tracking-[-0.05em] mb-2 cursor-pointer"
                            style={{ color: colors.text }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => scrollToSection('home')}
                        >
                            THE FYI
                        </motion.div>
                        <motion.div
                            className="font-mono text-xs tracking-[0.5em]"
                            style={{ color: colors.textSecondary }}
                        >
                            STUDENT JOURNAL • {theme.toUpperCase()} EDITION
                        </motion.div>
                        <motion.div
                            className="w-24 h-px mx-auto my-4"
                            style={{ backgroundColor: colors.border }}
                        />
                        <motion.p
                            className="font-serif text-sm italic"
                            style={{ color: colors.textSecondary }}
                        >
                            "All the news that's fit to print, by students, for students."
                        </motion.p>
                    </motion.div>

                    {/* Footer Columns */}
                    <div className="grid md:grid-cols-4 gap-8 font-serif text-sm">
                        {[
                            {
                                title: 'For Writers',
                                links: [
                                    { label: 'Submit an Article', action: 'register' },
                                    { label: 'Writing Guidelines', action: 'login' },
                                    { label: 'Editor Resources', action: 'login' },
                                    { label: 'Style Guide', action: null }
                                ]
                            },
                            {
                                title: 'Sections',
                                links: ['News', 'Opinion', 'Arts & Culture', 'Science'].map(label => ({ label, action: null }))
                            },
                            {
                                title: 'Company',
                                links: ['About Us', 'Meet the Team', 'Careers', 'Advertise'].map(label => ({ label, action: null }))
                            },
                            {
                                title: 'Contact',
                                links: [
                                    { label: '📍 Campus Newsroom', isText: true },
                                    { label: '📞 (555) 123-4567', isText: true },
                                    { label: '✉️ editor@fyi.edu', isText: true },
                                    { label: '📱 @thefyi', isText: true }
                                ]
                            }
                        ].map((column, colIndex) => (
                            <motion.div
                                key={colIndex}
                                variants={{
                                    initial: { opacity: 0, y: 20 },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.2 + colIndex * 0.1 }
                                    }
                                }}
                            >
                                <h4 className="font-mono text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: colors.text }}>
                                    {column.title}
                                </h4>
                                <ul className="space-y-2">
                                    {column.links.map((link, linkIndex) => (
                                        <motion.li
                                            key={linkIndex}
                                            whileHover={{ x: 3 }}
                                        >
                                            {link.isText ? (
                                                <span style={{ color: colors.textSecondary }}>{link.label}</span>
                                            ) : link.action ? (
                                                <button
                                                    onClick={() => {
                                                        setAuthMode(link.action);
                                                        setShowAuth(true);
                                                    }}
                                                    className="transition hover:opacity-70"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    {link.label}
                                                </button>
                                            ) : (
                                                <button
                                                    className="transition hover:opacity-70"
                                                    style={{ color: colors.textSecondary }}
                                                >
                                                    {link.label}
                                                </button>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Copyright */}
                    <motion.div
                        className="mt-12 pt-8 border-t"
                        style={{ borderColor: colors.border }}
                        variants={fadeInUp}
                    >
                        <p className="font-mono text-xs text-center" style={{ color: colors.border }}>
                            © {new Date().getFullYear()} THE FYI STUDENT JOURNAL. ALL RIGHTS RESERVED.
                        </p>
                        <p className="font-serif text-xs text-center mt-2 italic" style={{ color: colors.border }}>
                            "The student journal where every voice matters."
                        </p>
                    </motion.div>
                </div>
            </motion.footer>

            {/* Auth Modal */}
            <AnimatePresence>
                {showAuth && (
                    <AuthModal
                        isOpen={showAuth}
                        onClose={() => setShowAuth(false)}
                        initialMode={authMode}
                    />
                )}
            </AnimatePresence>
        </>
    );
}






