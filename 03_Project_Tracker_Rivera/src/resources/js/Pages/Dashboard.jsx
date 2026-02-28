import TaskMoLayout from '@/Layouts/TaskMoLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PieChart, BarChart, LineChart } from '@/Components/Charts/D3Charts';
import useCountUp from '@/Hooks/useCountUp';
import {
    Button,
    CircularProgress,
    LinearProgress,
    MenuItem,
    Modal,
    Paper,
    Popover,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';

function getViewportCenterAnchor() {
    if (typeof window === 'undefined') return { top: 0, left: 0 };
    return {
        top: Math.round(window.innerHeight / 2),
        left: Math.round(window.innerWidth / 2),
    };
}

function TaskEditorRow({ task, onSaved }) {
    const form = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        priority: task.priority ?? 'low',
        status: task.status ?? 'pending',
    });

    return (
        <div className="taskmo-card p-4">
            <div className="grid gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-sm font-black text-gray-900 dark:text-gray-100 truncate">{task.title}</div>
                        <div className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                            <span className="inline-flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${
                                            task.priority === 'high'
                                                ? 'bg-red-500'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                        }`}
                                    />
                                    <span className="font-bold">{String(task.priority ?? 'low')}</span>
                                </span>
                                <span className="text-gray-400 dark:text-gray-500">•</span>
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${
                                            task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                                        }`}
                                    />
                                    <span className="font-bold">{String(task.status ?? 'pending')}</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={form.processing}
                        onClick={() =>
                            form.put(route('tasks.update', task.id), {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    onSaved?.();
                                },
                            })
                        }
                    >
                        {form.processing ? 'Saving…' : 'Save'}
                    </Button>
                </div>

                <TextField
                    size="small"
                    label="Title"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    error={Boolean(form.errors.title)}
                    helperText={form.errors.title}
                />

                <TextField
                    size="small"
                    label="Description"
                    multiline
                    minRows={2}
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    error={Boolean(form.errors.description)}
                    helperText={form.errors.description}
                />

                <div className="grid grid-cols-2 gap-3">
                    <TextField
                        select
                        size="small"
                        label="Priority"
                        value={form.data.priority}
                        onChange={(e) => form.setData('priority', e.target.value)}
                        error={Boolean(form.errors.priority)}
                        helperText={form.errors.priority}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        error={Boolean(form.errors.status)}
                        helperText={form.errors.status}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                </div>
            </div>
        </div>
    );
}

function TaskEditorModal({ open, onClose, task, onSaved }) {
    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex min-h-screen items-center justify-center p-6">
                <Paper elevation={0} className="taskmo-card w-[min(720px,calc(100vw-32px))] p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-lg font-black text-gray-900 dark:text-gray-100 truncate">
                                Edit Task
                            </div>
                            <div className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">
                                {task?.title}
                            </div>
                        </div>
                        <Button size="small" onClick={onClose}>
                            Close
                        </Button>
                    </div>

                    <div className="mt-4">
                        {task ? (
                            <TaskEditorRow
                                task={task}
                                onSaved={() => {
                                    onSaved?.();
                                    onClose?.();
                                }}
                            />
                        ) : null}
                    </div>
                </Paper>
            </div>
        </Modal>
    );
}

function ProjectPopover({ open, anchorPosition, onClose, project, taskmoCard }) {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [details, setDetails] = useState(null);

    const [activeTask, setActiveTask] = useState(null);

    const projectForm = useForm({ title: project?.title ?? '', description: project?.description ?? '' });

    useEffect(() => {
        if (!open || !project?.id) return;

        setTab(0);
        setLoadError('');
        setDetails(null);
        setLoading(true);
        setActiveTask(null);

        axios
            .get(route('projects.show', project.id), {
                headers: { Accept: 'application/json' },
            })
            .then((res) => setDetails(res.data))
            .catch(() => setLoadError('Could not load project details.'))
            .finally(() => setLoading(false));
    }, [open, project?.id]);

    useEffect(() => {
        projectForm.setData('title', project?.title ?? '');
        projectForm.setData('description', project?.description ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.id]);

    const tasks = details?.tasks ?? [];

    const openTaskEditor = (task) => {
        setActiveTask(task ?? null);
    };

    const refreshProjectDetails = () => {
        if (!project?.id) return;
        axios
            .get(route('projects.show', project.id), { headers: { Accept: 'application/json' } })
            .then((res) => setDetails(res.data))
            .catch(() => null);

        router.reload({
            only: ['projects', 'stats', 'charts'],
            preserveState: true,
        });
    };

    return (
        <Popover
            open={open}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition ?? { top: 0, left: 0 }}
            onClose={onClose}
            transformOrigin={{ vertical: 'center', horizontal: 'center' }}
            PaperProps={{
                className: `${taskmoCard} taskmo-hide-scrollbar w-[min(720px,calc(100vw-32px))] p-4 sm:p-5`,
                sx: { maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' },
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-lg font-black text-gray-900 dark:text-gray-100 truncate">{project?.title}</div>
                    <div className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Tap outside to close
                    </div>
                </div>
                <Button size="small" onClick={onClose}>
                    Close
                </Button>
            </div>

            <div className="mt-4">
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                    <Tab label="Details" />
                    <Tab label="Tasks" />
                </Tabs>
            </div>

            <div className="mt-4">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <CircularProgress size={26} />
                    </div>
                ) : loadError ? (
                    <div className="py-8 text-center text-sm font-semibold text-red-600 dark:text-red-400">{loadError}</div>
                ) : tab === 0 ? (
                    <div className="grid gap-4">
                        <TextField
                            label="Project title"
                            value={projectForm.data.title}
                            onChange={(e) => projectForm.setData('title', e.target.value)}
                            error={Boolean(projectForm.errors.title)}
                            helperText={projectForm.errors.title}
                        />
                        <TextField
                            label="Project description"
                            multiline
                            minRows={3}
                            value={projectForm.data.description}
                            onChange={(e) => projectForm.setData('description', e.target.value)}
                            error={Boolean(projectForm.errors.description)}
                            helperText={projectForm.errors.description}
                        />

                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                disabled={projectForm.processing || !project?.id}
                                onClick={() =>
                                    projectForm.put(route('projects.update', project.id), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        onSuccess: () => {
                                            router.reload({ only: ['projects'], preserveState: true });
                                        },
                                    })
                                }
                            >
                                {projectForm.processing ? 'Saving…' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {tasks.length === 0 ? (
                            <div className="py-8 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                                No tasks to show.
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {tasks.map((t) => (
                                    <Paper
                                        key={t.id}
                                        elevation={0}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => openTaskEditor(t)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') openTaskEditor(t);
                                        }}
                                        className="taskmo-card-solid cursor-pointer select-none p-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-sm font-black text-gray-900 dark:text-gray-100 truncate">
                                                    {t.title}
                                                </div>
                                                <div className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                    <span className="inline-flex flex-wrap items-center gap-2">
                                                        <span className="inline-flex items-center gap-2">
                                                            <span
                                                                className={`h-2.5 w-2.5 rounded-full ${
                                                                    t.priority === 'high'
                                                                        ? 'bg-red-500'
                                                                        : t.priority === 'medium'
                                                                            ? 'bg-yellow-500'
                                                                            : 'bg-green-500'
                                                                }`}
                                                            />
                                                            <span className="font-bold">{String(t.priority ?? 'low')}</span>
                                                        </span>
                                                        <span className="text-gray-400 dark:text-gray-500">•</span>
                                                        <span className="inline-flex items-center gap-2">
                                                            <span
                                                                className={`h-2.5 w-2.5 rounded-full ${
                                                                    t.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                                                                }`}
                                                            />
                                                            <span className="font-bold">{String(t.status ?? 'pending')}</span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openTaskEditor(t);
                                                }}
                                            >
                                                Open
                                            </Button>
                                        </div>
                                    </Paper>
                                ))}
                            </div>
                        )}

                        <TaskEditorModal
                            open={Boolean(activeTask)}
                            onClose={() => setActiveTask(null)}
                            task={activeTask}
                            onSaved={refreshProjectDetails}
                        />
                    </div>
                )}
            </div>
        </Popover>
    );
}

function ProjectCard({ project, taskmoCard, onOpen }) {
    const totalTasks = Number(project?.tasks_count ?? 0) || 0;
    const completedTasks = Number(project?.tasks_completed ?? 0) || 0;

    const totalCount = useCountUp(totalTasks);
    const completedCount = useCountUp(Math.min(completedTasks, totalTasks));

    return (
        <Paper
            role="button"
            tabIndex={0}
            onClick={(e) => onOpen?.(project, e.currentTarget)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpen?.(project, e.currentTarget);
            }}
            className={`${taskmoCard} p-5 cursor-pointer select-none`}
        >
            <div className="text-center text-xl font-black tracking-tight">{project.title}</div>

            {project.description ? (
                <div className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-300">{project.description}</div>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tasks</div>
                    <div className="mt-1 text-4xl font-black leading-none text-indigo-600 dark:text-indigo-400">
                        {totalCount}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Completed
                    </div>
                    <div className="mt-1 text-4xl font-black leading-none text-emerald-600 dark:text-emerald-400">
                        {completedCount}
                    </div>
                </div>
            </div>

            <div className="mt-5 flex justify-center">
                <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen?.(project, e.currentTarget);
                    }}
                >
                    View / Edit
                </Button>
            </div>
        </Paper>
    );
}

export default function Dashboard({ q, stats, charts, projects }) {
    const taskmoCard = 'taskmo-card';
    const heroSolidCard = 'taskmo-card-solid rounded-[20px]';

    const userName = usePage().props.auth?.user?.name ?? 'there';
    const userFirstName = String(userName).trim().split(/\s+/)[0] || 'there';

    const welcomeWords = useMemo(() => `Hello there ${userFirstName}`.split(' '), [userFirstName]);

    const heroMessages = useMemo(
        () => [
            'Focus on one thing. Finish it. Repeat.',
            'Your future self loves completed tasks.',
            'Progress is built in small sessions.',
            'Start now. Make it real.',
            'Small wins stack into big results.',
            'One task at a time — keep going.',
        ],
        [],
    );

    const [heroMessageIndex, setHeroMessageIndex] = useState(() => Math.floor(Math.random() * heroMessages.length));
    const [heroTyped, setHeroTyped] = useState('');
    const [heroPhase, setHeroPhase] = useState('typing');
    const heroCycleStartedAt = useRef(Date.now());

    const currentHeroMessage = heroMessages[heroMessageIndex] ?? '';

    useEffect(() => {
        if (!currentHeroMessage) return;

        const typeMs = 35;
        const deleteMs = 25;
        const pauseAfterTypedMs = 5000;
        const minCycleMs = 10000;

        let timeoutId;

        if (heroPhase === 'typing') {
            if (heroTyped.length < currentHeroMessage.length) {
                timeoutId = setTimeout(() => {
                    setHeroTyped(currentHeroMessage.slice(0, heroTyped.length + 1));
                }, typeMs);
            } else {
                timeoutId = setTimeout(() => setHeroPhase('pausing'), 150);
            }
        }

        if (heroPhase === 'pausing') {
            timeoutId = setTimeout(() => setHeroPhase('deleting'), pauseAfterTypedMs);
        }

        if (heroPhase === 'deleting') {
            if (heroTyped.length > 0) {
                timeoutId = setTimeout(() => {
                    setHeroTyped(currentHeroMessage.slice(0, heroTyped.length - 1));
                }, deleteMs);
            } else {
                const elapsedMs = Date.now() - heroCycleStartedAt.current;
                const waitMs = Math.max(0, minCycleMs - elapsedMs);

                timeoutId = setTimeout(() => {
                    heroCycleStartedAt.current = Date.now();
                    setHeroMessageIndex((idx) => (idx + 1) % heroMessages.length);
                    setHeroPhase('typing');
                }, waitMs);
            }
        }

        return () => clearTimeout(timeoutId);
    }, [currentHeroMessage, heroMessages.length, heroPhase, heroTyped]);

    const [priorityPopoverOpen, setPriorityPopoverOpen] = useState(false);
    const [weeklyPopoverOpen, setWeeklyPopoverOpen] = useState(false);
    const [progressPopoverOpen, setProgressPopoverOpen] = useState(false);

    const [chartPopoverAnchorPosition, setChartPopoverAnchorPosition] = useState(() => getViewportCenterAnchor());

    useEffect(() => {
        const update = () => setChartPopoverAnchorPosition(getViewportCenterAnchor());
        update();

        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    const projectsCount = useCountUp(stats.projects);
    const tasksCount = useCountUp(stats.tasks);
    const completedCount = useCountUp(stats.completed);
    const pendingCount = useCountUp(stats.pending);

    const [projectPopoverAnchor, setProjectPopoverAnchor] = useState(null);
    const [activeProject, setActiveProject] = useState(null);

    const summaryReady =
        projectsCount === stats.projects &&
        tasksCount === stats.tasks &&
        completedCount === stats.completed &&
        pendingCount === stats.pending;

    const safePercent = (value, total) => {
        const safeTotal = Math.max(1, Number(total) || 0);
        const safeValue = Math.max(0, Number(value) || 0);
        return Math.round((safeValue / safeTotal) * 100);
    };

    const finalProjectTaskTotal = Math.max(1, (Number(stats.projects) || 0) + (Number(stats.tasks) || 0));
    const finalTasksTotal = Math.max(1, Number(stats.tasks) || 0);

    const projectsPct = safePercent(projectsCount, Math.max(1, projectsCount + tasksCount));
    const tasksPct = safePercent(tasksCount, Math.max(1, projectsCount + tasksCount));
    const completedPct = safePercent(completedCount, Math.max(1, tasksCount));
    const pendingPct = safePercent(pendingCount, Math.max(1, tasksCount));

    const statusFromPct = (pct, { goodMin, badMax, invert = false } = {}) => {
        if (!summaryReady) return 'neutral';
        if (invert) {
            if (pct <= badMax) return 'good';
            if (pct >= goodMin) return 'bad';
            return 'neutral';
        }
        if (pct >= goodMin) return 'good';
        if (pct <= badMax) return 'bad';
        return 'neutral';
    };

    const projectsStatus = statusFromPct(safePercent(stats.projects, finalProjectTaskTotal), { goodMin: 55, badMax: 45 });
    const tasksStatus = statusFromPct(safePercent(stats.tasks, finalProjectTaskTotal), { goodMin: 55, badMax: 45 });
    const completedStatus = statusFromPct(safePercent(stats.completed, finalTasksTotal), { goodMin: 60, badMax: 40 });
    const pendingStatus = statusFromPct(safePercent(stats.pending, finalTasksTotal), { goodMin: 50, badMax: 25, invert: true });

    const statusStyles = (status) => {
        if (status === 'good') {
            return {
                text: 'text-emerald-600 dark:text-emerald-400',
                icon: <TrendingUpRoundedIcon fontSize="small" className="text-emerald-600 dark:text-emerald-400" />,
                label: 'Growth',
            };
        }
        if (status === 'bad') {
            return {
                text: 'text-red-600 dark:text-red-400',
                icon: <TrendingDownRoundedIcon fontSize="small" className="text-red-600 dark:text-red-400" />,
                label: 'Falling',
            };
        }
        return {
            text: 'text-gray-600 dark:text-gray-300',
            icon: <RemoveRoundedIcon fontSize="small" className="text-gray-500 dark:text-gray-400" />,
            label: 'Neutral',
        };
    };

    return (
        <TaskMoLayout title={null} searchValue={q ?? ''}>
            <Head title="Dashboard" />

            <div className="space-y-8">
                <div className="pt-2 pb-6">
                    <h1 className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-center text-5xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-6xl">
                        Dashboard
                    </h1>
                </div>

                <div className="relative">
                    <div className="pointer-events-none absolute -inset-4 rounded-[26px] bg-gradient-to-r from-indigo-500/18 via-pink-500/14 to-indigo-500/18 blur-2xl dark:from-indigo-400/22 dark:via-pink-400/16 dark:to-indigo-400/22" />
                    <div className="pointer-events-none absolute -inset-4 rounded-[26px] taskmo-grid-flow text-indigo-500/20 dark:text-white/10 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_78%)]" />
                    <div className="pointer-events-none absolute -inset-2 rounded-[24px] bg-white/40 blur-xl dark:bg-white/10" />
                    <Paper
                        elevation={0}
                        className={`${heroSolidCard} px-8 pt-6 pb-4 sm:px-10 sm:pt-8 sm:pb-5 flex items-start justify-center`}
                    >
                        <div className="relative w-full max-w-5xl">
                            <div className="grid gap-4">
                                {/* Welcome message (no separate card) */}
                                <div className="text-center">
                                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                                        <span className="taskmo-heading-3d taskmo-heading-glow inline-block select-none text-6xl leading-none sm:text-7xl">
                                            <span className="animate-taskmo-twitch">👋</span>
                                        </span>

                                        <div className="taskmo-heading-3d taskmo-heading-glow text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                                            {welcomeWords.map((word, wordIndex) => {
                                                const lettersBefore = welcomeWords
                                                    .slice(0, wordIndex)
                                                    .reduce((sum, w) => sum + w.length, 0);
                                                const hopIndexOffset = lettersBefore + wordIndex;

                                                return (
                                                    <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                                                        {Array.from(word).map((ch, charIndex) => (
                                                            <span
                                                                key={`${ch}-${charIndex}`}
                                                                className="taskmo-letter-hop animate-taskmo-gradient bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-200 dark:via-fuchsia-200 dark:to-pink-200"
                                                                style={{ '--taskmo-hop-index': hopIndexOffset + charIndex }}
                                                            >
                                                                {ch}
                                                            </span>
                                                        ))}
                                                        {wordIndex < welcomeWords.length - 1 ? (
                                                            <span aria-hidden="true" className="inline-block w-[0.35em]" />
                                                        ) : null}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Typography
                                        component="div"
                                        className="mt-2 text-xl font-bold tracking-tight text-gray-700 dark:text-gray-200 sm:text-2xl"
                                        sx={{ fontFamily: '"Courier New", Courier, monospace' }}
                                    >
                                        {heroTyped}
                                        <span className="inline-block w-[0.6ch] animate-pulse select-none">|</span>
                                    </Typography>
                                </div>

                                {/* Summary cards inside the Hero */}
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <Paper className={`${taskmoCard} p-6`} elevation={0}>
                                        {(() => {
                                            const styles = statusStyles(projectsStatus);
                                            return (
                                                <div className="relative flex flex-col items-center justify-center text-center">
                                                    <Typography variant="overline" className="text-gray-600 dark:text-gray-300">
                                                        Projects
                                                    </Typography>
                                                    <div className={`mt-2 text-5xl font-black leading-none ${styles.text}`}>{projectsCount}</div>
                                                    <div className={`mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-extrabold ${styles.text}`}>
                                                        {styles.icon}
                                                        <span className="select-none">%</span>
                                                        <span>{projectsPct}</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </Paper>
                                    <Paper className={`${taskmoCard} p-6`} elevation={0}>
                                        {(() => {
                                            const styles = statusStyles(tasksStatus);
                                            return (
                                                <div className="relative flex flex-col items-center justify-center text-center">
                                                    <Typography variant="overline" className="text-gray-600 dark:text-gray-300">
                                                        Tasks
                                                    </Typography>
                                                    <div className={`mt-2 text-5xl font-black leading-none ${styles.text}`}>{tasksCount}</div>
                                                    <div className={`mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-extrabold ${styles.text}`}>
                                                        {styles.icon}
                                                        <span className="select-none">%</span>
                                                        <span>{tasksPct}</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </Paper>
                                    <Paper className={`${taskmoCard} p-6`} elevation={0}>
                                        {(() => {
                                            const styles = statusStyles(completedStatus);
                                            return (
                                                <div className="relative flex flex-col items-center justify-center text-center">
                                                    <Typography variant="overline" className="text-gray-600 dark:text-gray-300">
                                                        Completed
                                                    </Typography>
                                                    <div className={`mt-2 text-5xl font-black leading-none ${styles.text}`}>{completedCount}</div>
                                                    <div className={`mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-extrabold ${styles.text}`}>
                                                        {styles.icon}
                                                        <span className="select-none">%</span>
                                                        <span>{completedPct}</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </Paper>
                                    <Paper className={`${taskmoCard} p-6`} elevation={0}>
                                        {(() => {
                                            const styles = statusStyles(pendingStatus);
                                            return (
                                                <div className="relative flex flex-col items-center justify-center text-center">
                                                    <Typography variant="overline" className="text-gray-600 dark:text-gray-300">
                                                        Pending
                                                    </Typography>
                                                    <div className={`mt-2 text-5xl font-black leading-none ${styles.text}`}>{pendingCount}</div>
                                                    <div className={`mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-extrabold ${styles.text}`}>
                                                        {styles.icon}
                                                        <span className="select-none">%</span>
                                                        <span>{pendingPct}</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </Paper>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>

                <div className="pt-2">
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        <div className="md:row-span-2">
                            <div className="mb-2 text-center">
                                <div className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    Priority
                                </div>
                                <div className="mt-1 text-sm italic text-gray-600 dark:text-gray-300">Low / Medium / High</div>
                            </div>
                            <Paper
                                elevation={0}
                                tabIndex={0}
                                role="button"
                                onClick={() => setPriorityPopoverOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setPriorityPopoverOpen(true);
                                }}
                                className={`${taskmoCard} p-6 cursor-pointer select-none`}
                            >
                                <div className="mt-2 flex items-center justify-center">
                                    <PieChart data={charts.priority} />
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                        <span className="font-semibold">Low</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                                        <span className="font-semibold">Medium</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                        <span className="font-semibold">High</span>
                                    </div>
                                </div>
                            </Paper>
                        </div>

                        <div className="md:col-span-2">
                            <div className="mb-2 text-center">
                                <div className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    Weekly Activity
                                </div>
                                <div className="mt-1 text-sm italic text-gray-600 dark:text-gray-300">
                                    Created tasks vs completed tasks
                                </div>
                            </div>

                            <Paper
                                elevation={0}
                                tabIndex={0}
                                role="button"
                                onClick={() => setWeeklyPopoverOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setWeeklyPopoverOpen(true);
                                }}
                                className={`${taskmoCard} p-6 cursor-pointer select-none`}
                            >
                                <div className="relative">
                                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                            <span className="font-semibold">Created tasks</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                            <span className="font-semibold">Completed tasks</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <BarChart data={charts.weekly} xLabel="Days" yLabel="Tasks" />
                                    </div>
                                </div>
                            </Paper>
                        </div>

                        <div className="md:col-span-3 pt-6 md:pt-2">
                            <h2 className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-center text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                                Project Progress
                            </h2>
                            <p className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-300">
                                Completion percentage by project, plus the details list on tap.
                            </p>
                        </div>

                        <div className="md:col-span-3">
                            <Paper
                                elevation={0}
                                tabIndex={0}
                                role="button"
                                onClick={() => setProgressPopoverOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setProgressPopoverOpen(true);
                                }}
                                className={`${taskmoCard} p-6 cursor-pointer select-none`}
                            >
                                <div className="relative">
                                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="h-0.5 w-6 rounded-full bg-indigo-500" />
                                            <span className="font-semibold">Completion (%)</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <LineChart data={charts.progress} xLabel="Projects" yLabel="Completion (%)" />
                                    </div>

                                </div>
                            </Paper>
                        </div>
                    </div>
                </div>

                {/* Chart popovers */}
                <Popover
                    open={priorityPopoverOpen}
                    anchorReference="anchorPosition"
                    anchorPosition={chartPopoverAnchorPosition}
                    onClose={() => setPriorityPopoverOpen(false)}
                    transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                    PaperProps={{
                        className: `${taskmoCard} taskmo-hide-scrollbar p-6 w-[min(740px,92vw)]`,
                        sx: { maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' },
                    }}
                >
                    <div className="text-center">
                        <div className="taskmo-heading-3d taskmo-heading-glow text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            Priority Details
                        </div>
                        <div className="mt-1 text-sm italic text-gray-600 dark:text-gray-300">
                            Per-project low / medium / high priority task counts
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {(charts.priority_projects ?? []).map((p) => (
                            <div key={p.id} className="rounded-xl border border-gray-200/60 p-3 dark:border-gray-700/60">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="font-extrabold">{p.title}</div>
                                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Total: {p.total}</div>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-200">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Low: {p.low}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Medium: {p.medium}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> High: {p.high}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Popover>

                <Popover
                    open={weeklyPopoverOpen}
                    anchorReference="anchorPosition"
                    anchorPosition={chartPopoverAnchorPosition}
                    onClose={() => setWeeklyPopoverOpen(false)}
                    transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                    PaperProps={{
                        className: `${taskmoCard} taskmo-hide-scrollbar p-6 w-[min(860px,92vw)]`,
                        sx: { maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' },
                    }}
                >
                    <div className="text-center">
                        <div className="taskmo-heading-3d taskmo-heading-glow text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            Weekly Activity Details
                        </div>
                        <div className="mt-1 text-sm italic text-gray-600 dark:text-gray-300">
                            Created projects, created tasks, and completed tasks per week
                        </div>
                    </div>

                    <div className="taskmo-hide-scrollbar mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    <th className="py-2 pr-4">Week</th>
                                    <th className="py-2 pr-4">Created projects</th>
                                    <th className="py-2 pr-4">Created tasks</th>
                                    <th className="py-2">Completed tasks</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-200">
                                {(charts.weekly ?? []).map((w) => (
                                    <tr key={w.label} className="border-t border-gray-200/60 dark:border-gray-700/60">
                                        <td className="py-2 pr-4 font-semibold">{w.label}</td>
                                        <td className="py-2 pr-4">{w.created_projects ?? 0}</td>
                                        <td className="py-2 pr-4">{w.created ?? 0}</td>
                                        <td className="py-2">{w.completed ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Popover>

                <Popover
                    open={progressPopoverOpen}
                    anchorReference="anchorPosition"
                    anchorPosition={chartPopoverAnchorPosition}
                    onClose={() => setProgressPopoverOpen(false)}
                    transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                    PaperProps={{
                        className: `${taskmoCard} taskmo-hide-scrollbar p-6 w-[min(980px,92vw)]`,
                        sx: { maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' },
                    }}
                >
                    <div className="text-center">
                        <div className="taskmo-heading-3d taskmo-heading-glow text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            Project Progress Details
                        </div>
                        <div className="mt-1 text-sm italic text-gray-600 dark:text-gray-300">
                            Completion percentage by project
                        </div>
                    </div>

                    <div className="mt-4">
                        <LineChart data={charts.progress} height={300} xLabel="Projects" yLabel="Completion (%)" />
                    </div>

                    <div className="mt-5 space-y-3">
                        {charts.progress.map((p) => (
                            <div key={p.id}>
                                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                    <span className="font-extrabold">{p.title}</span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {p.completed}/{p.total} ({p.pct}%)
                                    </span>
                                </div>
                                <LinearProgress variant="determinate" value={p.pct} />
                            </div>
                        ))}
                    </div>
                </Popover>

                <div className="pt-6">
                    <div className="text-center">
                        <div className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                            Projects
                        </div>
                        <div className="mt-2 text-sm italic text-gray-600 dark:text-gray-300">
                            Open a project to view details and tasks.
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {projects.map((p) => (
                            <ProjectCard
                                key={p.id}
                                project={p}
                                taskmoCard={taskmoCard}
                                onOpen={(proj, anchorEl) => {
                                    setActiveProject(proj);
                                    setProjectPopoverAnchor({
                                        top: Math.round(window.innerHeight / 2),
                                        left: Math.round(window.innerWidth / 2),
                                    });
                                }}
                            />
                        ))}
                    </div>

                    <ProjectPopover
                        open={Boolean(projectPopoverAnchor && activeProject)}
                        anchorPosition={projectPopoverAnchor}
                        onClose={() => {
                            setProjectPopoverAnchor(null);
                            setActiveProject(null);
                        }}
                        project={activeProject}
                        taskmoCard={taskmoCard}
                    />
                </div>
            </div>
        </TaskMoLayout>
    );
}
