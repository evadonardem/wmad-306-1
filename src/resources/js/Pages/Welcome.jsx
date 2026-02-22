import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Modal,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useEffect, useMemo, useRef, useState } from 'react';

function useTypewriter(messages) {
    const [messageIndex, setMessageIndex] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [tick, setTick] = useState(0);
    const timeoutRef = useRef(null);

    const currentMessage = useMemo(
        () => messages[messageIndex % messages.length],
        [messages, messageIndex],
    );

    const restartWith = (nextIndex) => {
        setMessageIndex(nextIndex);
        setText('');
        setIsDeleting(false);
        setTick((t) => t + 1);
    };

    useEffect(() => {
        if (!currentMessage) return;

        const typingSpeed = 35;
        const deletingSpeed = 18;
        const pauseAfterTyped = 800;
        const pauseAfterDeleted = 250;

        const run = () => {
            setText((prev) => {
                if (!isDeleting) {
                    const next = currentMessage.slice(0, prev.length + 1);
                    if (next.length === currentMessage.length) {
                        timeoutRef.current = setTimeout(() => {
                            setIsDeleting(true);
                            setTick((t) => t + 1);
                        }, pauseAfterTyped);
                    } else {
                        timeoutRef.current = setTimeout(() => {
                            setTick((t) => t + 1);
                        }, typingSpeed);
                    }
                    return next;
                }

                const next = currentMessage.slice(0, Math.max(0, prev.length - 1));
                if (next.length === 0) {
                    timeoutRef.current = setTimeout(() => {
                        setIsDeleting(false);
                        setMessageIndex((i) => i + 1);
                        setTick((t) => t + 1);
                    }, pauseAfterDeleted);
                } else {
                    timeoutRef.current = setTimeout(() => {
                        setTick((t) => t + 1);
                    }, deletingSpeed);
                }

                return next;
            });
        };

        run();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick, currentMessage, isDeleting]);

    return {
        text,
        restartWith,
        nextIndex: () => setMessageIndex((i) => i + 1),
    };
}

export default function Welcome({ auth, status }) {
    const messages = useMemo(
        () => [
            'Track projects. Finish tasks. Stay in motion.',
            'Build momentum—one tiny task at a time.',
            'Clarity today. Progress tomorrow.',
            'Turn plans into done.',
            'Small steps. Big wins.',
        ],
        [],
    );

    const { text, restartWith } = useTypewriter(messages);

    const [signupOpen, setSignupOpen] = useState(false);

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const signupForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const initialIndex = Math.floor(Math.random() * messages.length);
        restartWith(initialIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let last = 0;
        const onScroll = () => {
            const now = Date.now();
            if (now - last < 450) return;
            last = now;
            const nextIndex = Math.floor(Math.random() * messages.length);
            restartWith(nextIndex);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [messages.length, restartWith]);

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const submitSignup = (e) => {
        e.preventDefault();
        signupForm.post(route('register'), {
            onSuccess: () => {
                setSignupOpen(false);
                signupForm.reset('password', 'password_confirmation');
            },
        });
    };

    const scrollToSection = (id) => {
        if (typeof window === 'undefined') return;
        const el = document.getElementById(id);
        if (!el) return;
        window.history.replaceState(null, '', `#${id}`);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title="TaskMo" />

            <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 bg-grid dark:bg-grid-dark [background-size:32px_32px]">
                <div className="mx-auto max-w-7xl px-6">
                    <section className="flex min-h-[72vh] flex-col items-center justify-center gap-7 py-16 text-center md:py-24">
                        <div className="mx-auto w-full max-w-4xl">
                            <div className="mx-auto mb-3 flex items-center justify-center">
                                <img
                                    src="/images/TaskMo%20Logo.png"
                                    alt="TaskMo logo"
                                    className="taskmo-heading-glow animate-taskmo-float h-44 w-44 select-none object-contain drop-shadow-2xl sm:h-56 sm:w-56 md:h-72 md:w-72"
                                    draggable="false"
                                />
                            </div>

                            <h1 className="sr-only">TaskMo</h1>

                            <div className="mx-auto mt-6 w-full max-w-3xl">
                                <div className="taskmo-card-solid mx-auto inline-flex max-w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-center">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 sm:text-base">
                                        {text}
                                    </span>
                                    <span className="inline-block w-[1ch] animate-pulse font-black text-blue-600 dark:text-blue-300">
                                        |
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-3 sm:mx-auto sm:max-w-xl">
                                    <div className="taskmo-card-solid flex flex-col items-center justify-center gap-1 rounded-2xl p-3">
                                        <AutoGraphRoundedIcon className="text-blue-600 dark:text-blue-300" />
                                        <div className="text-xs font-extrabold text-gray-800 dark:text-gray-100">Progress</div>
                                    </div>
                                    <div className="taskmo-card-solid flex flex-col items-center justify-center gap-1 rounded-2xl p-3">
                                        <ChecklistRoundedIcon className="text-blue-600 dark:text-blue-300" />
                                        <div className="text-xs font-extrabold text-gray-800 dark:text-gray-100">Tasks</div>
                                    </div>
                                    <div className="taskmo-card-solid flex flex-col items-center justify-center gap-1 rounded-2xl p-3">
                                        <BoltRoundedIcon className="text-blue-600 dark:text-blue-300" />
                                        <div className="text-xs font-extrabold text-gray-800 dark:text-gray-100">Momentum</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => scrollToSection('about')}
                                    className="taskmo-btn px-7 py-3 text-base font-black"
                                >
                                    Learn More
                                </Button>

                                {auth?.user ? (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        href={route('dashboard')}
                                        className="taskmo-btn taskmo-btn-primary px-7 py-3 text-base font-black"
                                    >
                                        Go to Dashboard
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            onClick={() => scrollToSection('login')}
                                            className="taskmo-btn taskmo-btn-primary px-7 py-3 text-base font-black"
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={() => setSignupOpen(true)}
                                            className="taskmo-btn px-7 py-3 text-base font-black"
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="about" className="scroll-mt-24 py-16 md:py-24">
                        <div className="mx-auto max-w-5xl">
                            <div className="text-center">
                                <h2 className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-6xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-7xl md:text-8xl">
                                    About Us
                                </h2>
                                <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-gray-600 dark:text-gray-300">
                                    TaskMo is a project and task management tool built around one idea: make progress visible and momentum effortless.
                                    Instead of drowning you in complexity, it keeps your workflow clean—projects stay organized, tasks stay actionable, and your next step stays obvious.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-6 lg:grid-cols-2">
                                <Paper className="taskmo-card p-7" elevation={0}>
                                    <Typography className="text-xl font-black text-gray-900 dark:text-white">
                                        Designed for consistency
                                    </Typography>
                                    <Typography className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Whether you’re managing a personal project, a school workload, or a team deliverable, TaskMo helps you break work into clear tasks, track completion, and build a reliable routine.
                                        The interface stays simple so you can focus on doing the work, not configuring the tool.
                                    </Typography>
                                    <Typography className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        With a modern grid-based layout, inflated 3D surfaces, and smooth transitions, TaskMo keeps the experience polished and responsive across desktop, tablet, and mobile.
                                    </Typography>
                                </Paper>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Paper className="taskmo-card-solid overflow-hidden" elevation={0}>
                                        <img
                                            src="/images/taskmo-progress.svg"
                                            alt="Progress visualization"
                                            className="h-44 w-full object-cover sm:h-48"
                                            loading="lazy"
                                        />
                                        <div className="p-5 text-center">
                                            <div className="text-sm font-black text-gray-900 dark:text-white">Progress you can feel</div>
                                            <div className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                Quick visual cues that keep you moving.
                                            </div>
                                        </div>
                                    </Paper>

                                    <Paper className="taskmo-card-solid overflow-hidden" elevation={0}>
                                        <img
                                            src="/images/taskmo-tasks.svg"
                                            alt="Task checklist"
                                            className="h-44 w-full object-cover sm:h-48"
                                            loading="lazy"
                                        />
                                        <div className="p-5 text-center">
                                            <div className="text-sm font-black text-gray-900 dark:text-white">Task clarity</div>
                                            <div className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                Simple structure without the clutter.
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Paper
                                    className="taskmo-card p-6 text-center transition-transform duration-200 ease-out hover:-translate-y-0.5"
                                    elevation={0}
                                >
                                    <AutoGraphRoundedIcon className="mx-auto text-blue-600 dark:text-blue-300" />
                                    <Typography className="mt-3 text-lg font-black">
                                        Progress-first
                                    </Typography>
                                    <Typography className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        See how you’re doing at a glance, celebrate wins, and stay motivated.
                                    </Typography>
                                </Paper>

                                <Paper
                                    className="taskmo-card p-6 text-center transition-transform duration-200 ease-out hover:-translate-y-0.5"
                                    elevation={0}
                                >
                                    <ChecklistRoundedIcon className="mx-auto text-blue-600 dark:text-blue-300" />
                                    <Typography className="mt-3 text-lg font-black">
                                        Clean organization
                                    </Typography>
                                    <Typography className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Projects and tasks stay structured without feeling heavy.
                                    </Typography>
                                </Paper>

                                <Paper
                                    className="taskmo-card p-6 text-center transition-transform duration-200 ease-out hover:-translate-y-0.5"
                                    elevation={0}
                                >
                                    <BoltRoundedIcon className="mx-auto text-blue-600 dark:text-blue-300" />
                                    <Typography className="mt-3 text-lg font-black">
                                        Fast to use
                                    </Typography>
                                    <Typography className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Smooth interactions, elegant styling, and responsive layouts.
                                    </Typography>
                                </Paper>
                            </div>

                            <div className="mt-6">
                                <Paper className="taskmo-card p-6" elevation={0}>
                                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                                        <div>
                                            <Typography className="text-lg font-black text-gray-900 dark:text-white">
                                                Built for momentum—solo or together
                                            </Typography>
                                            <Typography className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                Plan your work, execute your next step, and keep the system lightweight.
                                                TaskMo works great for individuals and can scale to teams that want clear ownership and steady progress.
                                            </Typography>
                                        </div>
                                        <div className="mx-auto w-full max-w-[320px]">
                                            <img
                                                src="/images/taskmo-team.svg"
                                                alt="Team collaboration"
                                                className="h-40 w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </section>

                    {!auth?.user && (
                        <section id="login" className="scroll-mt-24 pb-20 md:pb-28">
                            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
                                <div className="w-full text-center">
                                    <h2 className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-6xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-7xl md:text-8xl">
                                        Log In
                                    </h2>
                                    <p className="mt-4 text-base font-semibold text-gray-600 dark:text-gray-300">
                                        Jump back into your workspace and keep your momentum going.
                                    </p>
                                </div>

                                <Paper className="taskmo-card w-full max-w-2xl p-8" elevation={0}>
                                    <Typography variant="h6" component="div" className="font-black">
                                        Welcome back
                                    </Typography>

                                    {status && (
                                        <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                            {status}
                                        </div>
                                    )}

                                    <form onSubmit={submitLogin} className="mt-6 grid gap-5">
                                        <TextField
                                            label="Email"
                                            type="email"
                                            size="medium"
                                            value={loginForm.data.email}
                                            onChange={(e) =>
                                                loginForm.setData('email', e.target.value)
                                            }
                                            error={Boolean(loginForm.errors.email)}
                                            helperText={loginForm.errors.email}
                                            fullWidth
                                        />

                                        <TextField
                                            label="Password"
                                            type="password"
                                            size="medium"
                                            value={loginForm.data.password}
                                            onChange={(e) =>
                                                loginForm.setData('password', e.target.value)
                                            }
                                            error={Boolean(loginForm.errors.password)}
                                            helperText={loginForm.errors.password}
                                            fullWidth
                                        />

                                        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={loginForm.processing}
                                                className="taskmo-btn taskmo-btn-primary px-7 py-3 text-base font-black"
                                            >
                                                Log in
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={() => setSignupOpen(true)}
                                                className="taskmo-btn px-7 py-3 text-base font-black"
                                            >
                                                Create account
                                            </Button>
                                        </div>
                                    </form>
                                </Paper>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Modal open={signupOpen} onClose={() => setSignupOpen(false)}>
                <Box className="flex min-h-screen items-center justify-center p-6">
                    <Paper
                        className="taskmo-card w-full max-w-md p-6"
                        elevation={0}
                    >
                        <Typography variant="h6" component="div" className="font-bold">
                            Sign up
                        </Typography>

                        <form onSubmit={submitSignup} className="mt-4 grid gap-4">
                            <TextField
                                label="Name"
                                value={signupForm.data.name}
                                onChange={(e) => signupForm.setData('name', e.target.value)}
                                error={Boolean(signupForm.errors.name)}
                                helperText={signupForm.errors.name}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={signupForm.data.email}
                                onChange={(e) =>
                                    signupForm.setData('email', e.target.value)
                                }
                                error={Boolean(signupForm.errors.email)}
                                helperText={signupForm.errors.email}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={signupForm.data.password}
                                onChange={(e) =>
                                    signupForm.setData('password', e.target.value)
                                }
                                error={Boolean(signupForm.errors.password)}
                                helperText={signupForm.errors.password}
                                fullWidth
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                value={signupForm.data.password_confirmation}
                                onChange={(e) =>
                                    signupForm.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                fullWidth
                            />

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => setSignupOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={signupForm.processing}
                                >
                                    Create account
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </Modal>
        </>
    );
}
