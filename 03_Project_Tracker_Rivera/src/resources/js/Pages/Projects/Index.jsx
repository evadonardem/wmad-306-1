import TaskMoLayout from '@/Layouts/TaskMoLayout';
import DraggableFab from '@/Components/DraggableFab';
import useCountUp from '@/Hooks/useCountUp';
import { Head, router, useForm } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Button, CircularProgress, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function ProjectsIndex({ projects, stats }) {
    const [filter, setFilter] = useState('newest');
    const [viewMode, setViewMode] = useState('card');
    const [createOpen, setCreateOpen] = useState(false);

    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [activeProject, setActiveProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectError, setProjectError] = useState('');

    const [projectEditOpen, setProjectEditOpen] = useState(false);
    const projectEditForm = useForm({ title: '', description: '' });

    const [taskCreateOpen, setTaskCreateOpen] = useState(false);
    const taskCreateForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const [activeTask, setActiveTask] = useState(null);
    const taskEditForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    const [taskCtaOpen, setTaskCtaOpen] = useState(false);
    const [taskCtaRoll, setTaskCtaRoll] = useState(0);

    const TASK_CTA_MARGIN = 20;
    const TASK_CTA_SIZE = 56;
    const TASK_CTA_EXPANDED_W = 244;
    const [taskCtaPos, setTaskCtaPos] = useState({ x: 0, y: 0 });
    const [taskCtaReady, setTaskCtaReady] = useState(false);
    const [taskCtaBounds, setTaskCtaBounds] = useState({ w: 0, h: 0 });
    const taskCtaDraggingRef = useRef(false);
    const taskCtaStartRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const taskCtaIgnoreClickRef = useRef(false);

    const projectModalScrollRef = useRef(null);
    const projectEditRef = useRef(null);
    const projectModalBoundsRef = useRef(null);

    const projectsCount = useCountUp(stats?.projects ?? 0);
    const tasksCount = useCountUp(stats?.tasks ?? 0);

    const total = Math.max(1, (stats?.projects ?? 0) + (stats?.tasks ?? 0));
    const projectsPct = Math.round(((stats?.projects ?? 0) / total) * 100);
    const tasksPct = Math.round(((stats?.tasks ?? 0) / total) * 100);

    const createForm = useForm({ title: '', description: '' });

    const filtered = useMemo(() => {
        const list = [...projects];
        if (filter === 'az') list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
        if (filter === 'za') list.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
        if (filter === 'newest') list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        return list;
    }, [projects, filter]);

    const cycleFilter = () => {
        setFilter((f) => {
            if (f === 'newest') return 'az';
            if (f === 'az') return 'za';
            return 'newest';
        });
    };

    const setSort = (next) => {
        setFilter(next);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('projects.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const formatCreatedAt = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    };

    const openProjectModal = (project) => {
        if (!project?.id) return;

        setActiveProject(project);
        setProjectDetails(null);
        setProjectError('');
        setProjectModalOpen(true);
        setProjectLoading(true);
        setProjectEditOpen(false);

        projectEditForm.setData('title', project.title ?? '');
        projectEditForm.setData('description', project.description ?? '');

        axios
            .get(route('projects.show', project.id), {
                headers: { Accept: 'application/json' },
            })
            .then((res) => setProjectDetails(res.data))
            .catch(() => setProjectError('Could not load this project.'))
            .finally(() => setProjectLoading(false));
    };

    const closeProjectModal = () => {
        setProjectModalOpen(false);
        setActiveProject(null);
        setProjectDetails(null);
        setProjectError('');
        setProjectLoading(false);
        setProjectEditOpen(false);
        setTaskCreateOpen(false);
        setActiveTask(null);
        taskCreateForm.reset();
    };

    const getTaskCtaExpandedWidth = (dir, anchorX, boundsW) => {
        if (!boundsW) return TASK_CTA_EXPANDED_W;
        const maxWidth =
            dir === 'right'
                ? Math.max(TASK_CTA_SIZE, boundsW - TASK_CTA_MARGIN - anchorX)
                : Math.max(TASK_CTA_SIZE, anchorX + TASK_CTA_SIZE - TASK_CTA_MARGIN);
        return Math.min(TASK_CTA_EXPANDED_W, maxWidth);
    };

    const pickTaskCtaDir = (anchorX, boundsW, expandedW) => {
        const needed = Math.max(0, expandedW - TASK_CTA_SIZE);
        const spaceRight = Math.max(0, boundsW - TASK_CTA_MARGIN - (anchorX + TASK_CTA_SIZE));
        const spaceLeft = Math.max(0, anchorX - TASK_CTA_MARGIN);

        if (spaceRight >= needed) return 'right';
        if (spaceLeft >= needed) return 'left';
        return spaceRight >= spaceLeft ? 'right' : 'left';
    };

    const clampTaskCtaAnchor = (next, opts = { expanded: false }) => {
        const boundsW = taskCtaBounds.w;
        const boundsH = taskCtaBounds.h;
        if (!boundsW || !boundsH) return next;

        let minX = TASK_CTA_MARGIN;
        let maxX = Math.max(TASK_CTA_MARGIN, boundsW - TASK_CTA_SIZE - TASK_CTA_MARGIN);

        if (opts.expanded) {
            const tentativeDir = pickTaskCtaDir(next.x, boundsW, TASK_CTA_EXPANDED_W);
            const expandedW = getTaskCtaExpandedWidth(tentativeDir, next.x, boundsW);
            const needed = Math.max(0, expandedW - TASK_CTA_SIZE);

            if (tentativeDir === 'right') {
                maxX = Math.max(TASK_CTA_MARGIN, boundsW - expandedW - TASK_CTA_MARGIN);
            } else {
                minX = TASK_CTA_MARGIN + needed;
                maxX = Math.max(minX, boundsW - TASK_CTA_SIZE - TASK_CTA_MARGIN);
            }
        }

        const maxY = Math.max(TASK_CTA_MARGIN, boundsH - TASK_CTA_SIZE - TASK_CTA_MARGIN);

        return {
            x: Math.min(maxX, Math.max(minX, next.x)),
            y: Math.min(maxY, Math.max(TASK_CTA_MARGIN, next.y)),
        };
    };

    const taskCtaLayout = useMemo(() => {
        const boundsW = taskCtaBounds.w;
        if (!boundsW) return { dir: 'left', expandedW: TASK_CTA_EXPANDED_W };
        const dir = pickTaskCtaDir(taskCtaPos.x, boundsW, TASK_CTA_EXPANDED_W);
        const expandedW = getTaskCtaExpandedWidth(dir, taskCtaPos.x, boundsW);
        return { dir, expandedW };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskCtaBounds.w, taskCtaPos.x]);

    useEffect(() => {
        if (!projectModalOpen) return;

        setTaskCtaReady(false);
        setTaskCtaBounds({ w: 0, h: 0 });
        setTaskCtaOpen(false);

        const el = projectModalBoundsRef.current;
        if (!el) return;

        const update = () => {
            const rect = el.getBoundingClientRect();
            setTaskCtaBounds({ w: Math.max(0, rect.width), h: Math.max(0, rect.height) });
        };

        update();

        let ro = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(update);
            ro.observe(el);
        }

        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);

        return () => {
            try {
                ro?.disconnect?.();
            } catch {
                // ignore
            }
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, [projectModalOpen]);

    useEffect(() => {
        if (!projectModalOpen) return;
        if (!taskCtaBounds.w || !taskCtaBounds.h) return;

        const x = taskCtaBounds.w - TASK_CTA_SIZE - TASK_CTA_MARGIN;
        const y = taskCtaBounds.h - TASK_CTA_SIZE - TASK_CTA_MARGIN;
        setTaskCtaPos(clampTaskCtaAnchor({ x, y }, { expanded: false }));
        setTaskCtaReady(true);
    }, [projectModalOpen, taskCtaBounds.w, taskCtaBounds.h]);

    useEffect(() => {
        if (!projectModalOpen) return;
        setTaskCtaRoll((r) => r + 1);
    }, [projectModalOpen, taskCtaOpen]);

    useEffect(() => {
        if (!projectModalOpen || !projectEditOpen) return;
        // Ensure the user can reach the edit fields immediately.
        window.requestAnimationFrame(() => {
            try {
                projectEditRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch {
                // ignore
            }
        });
    }, [projectModalOpen, projectEditOpen]);

    useEffect(() => {
        if (!projectModalOpen || !taskCtaReady) return;
        setTaskCtaPos((p) => clampTaskCtaAnchor(p, { expanded: taskCtaOpen }));
    }, [taskCtaOpen, projectModalOpen, taskCtaReady, taskCtaBounds.w, taskCtaBounds.h]);

    const onTaskCtaPointerDown = (e) => {
        if (!taskCtaReady) return;
        taskCtaDraggingRef.current = true;
        taskCtaIgnoreClickRef.current = false;
        taskCtaStartRef.current = {
            x: taskCtaPos.x,
            y: taskCtaPos.y,
            px: e.clientX,
            py: e.clientY,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onTaskCtaPointerMove = (e) => {
        if (!taskCtaReady) return;
        if (!taskCtaDraggingRef.current) return;
        const dx = e.clientX - taskCtaStartRef.current.px;
        const dy = e.clientY - taskCtaStartRef.current.py;

        if (Math.abs(dx) + Math.abs(dy) > 4) taskCtaIgnoreClickRef.current = true;

        setTaskCtaPos(
            clampTaskCtaAnchor(
                {
                    x: taskCtaStartRef.current.x + dx,
                    y: taskCtaStartRef.current.y + dy,
                },
                { expanded: taskCtaOpen },
            ),
        );
    };

    const onTaskCtaPointerUp = (e) => {
        if (!taskCtaReady) return;
        if (!taskCtaDraggingRef.current) return;
        taskCtaDraggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }

        window.setTimeout(() => {
            taskCtaIgnoreClickRef.current = false;
        }, 0);
    };

    const refreshProjectDetails = () => {
        if (!activeProject?.id) return;
        setProjectLoading(true);
        setProjectError('');
        axios
            .get(route('projects.show', activeProject.id), { headers: { Accept: 'application/json' } })
            .then((res) => setProjectDetails(res.data))
            .catch(() => setProjectError('Could not load this project.'))
            .finally(() => setProjectLoading(false));

        router.reload({ only: ['projects', 'stats'], preserveState: true });
    };

    useEffect(() => {
        if (!projectModalOpen) return;

        const intervalId = window.setInterval(() => {
            setTaskCtaRoll((r) => r + 1);
            setTaskCtaOpen(true);
            window.setTimeout(() => setTaskCtaOpen(false), 2400);
        }, 10000);

        return () => window.clearInterval(intervalId);
    }, [projectModalOpen]);

    return (
        <TaskMoLayout title={null}>
            <Head title="Projects" />

            <div className="pt-2 pb-6">
                <h1 className="taskmo-heading-3d taskmo-heading-glow animate-taskmo-float text-center text-5xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-6xl">
                    Projects
                </h1>
                <p className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-300">
                    Manage projects and track task volume.
                </p>
            </div>

            <Paper
                elevation={0}
                className="taskmo-card p-8 text-center"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="text-center">
                        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                            Projects Created
                        </div>
                        <div className="mt-3 text-6xl font-black leading-none text-indigo-600 dark:text-indigo-400 sm:text-7xl">
                            {projectsCount}
                        </div>
                        <div className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-indigo-700 dark:text-indigo-300">
                            <TrendingUpRoundedIcon fontSize="small" className="text-indigo-600 dark:text-indigo-400" />
                            <span>{projectsPct}%</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                            Tasks Created
                        </div>
                        <div className="mt-3 text-6xl font-black leading-none text-emerald-600 dark:text-emerald-400 sm:text-7xl">
                            {tasksCount}
                        </div>
                        <div className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                            <TrendingUpRoundedIcon fontSize="small" className="text-emerald-600 dark:text-emerald-400" />
                            <span>{tasksPct}%</span>
                        </div>
                    </div>
                </div>
            </Paper>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

            <div className="flex flex-col items-center gap-2">
                <div className="taskmo-card-solid flex w-full flex-col items-center justify-between gap-3 p-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <div className="text-xs font-black uppercase tracking-wide text-gray-600 dark:text-gray-300">
                            Sorting
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant={filter === 'newest' ? 'contained' : 'outlined'}
                                onClick={() => setSort('newest')}
                                className="taskmo-btn"
                            >
                                Newest
                            </Button>
                            <Button
                                type="button"
                                variant={filter === 'az' ? 'contained' : 'outlined'}
                                onClick={() => setSort('az')}
                                className="taskmo-btn"
                            >
                                A–Z
                            </Button>
                            <Button
                                type="button"
                                variant={filter === 'za' ? 'contained' : 'outlined'}
                                onClick={() => setSort('za')}
                                className="taskmo-btn"
                            >
                                Z–A
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <div className="text-xs font-black uppercase tracking-wide text-gray-600 dark:text-gray-300">
                            Display
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                                onClick={() => setViewMode('list')}
                                className="taskmo-btn"
                            >
                                List
                            </Button>
                            <Button
                                type="button"
                                variant={viewMode === 'card' ? 'contained' : 'outlined'}
                                onClick={() => setViewMode('card')}
                                className="taskmo-btn"
                            >
                                Cards
                            </Button>
                        </div>
                    </div>
                </div>

                {/* keep cycleFilter for keyboard/legacy hooks (unused UI-wise) */}
                <button type="button" onClick={cycleFilter} className="hidden" aria-hidden="true" tabIndex={-1} />
            </div>

            <div className={viewMode === 'list' ? 'mt-8 grid gap-4' : 'mt-8 grid gap-4 md:grid-cols-2'}>
                {filtered.map((p) => (
                    <Paper
                        key={p.id}
                        elevation={0}
                        className={
                            viewMode === 'list'
                                ? 'taskmo-card-solid cursor-pointer select-none p-6'
                                : 'taskmo-card cursor-pointer select-none p-6'
                        }
                        role="button"
                        tabIndex={0}
                        onClick={() => openProjectModal(p)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') openProjectModal(p);
                        }}
                    >
                        {viewMode === 'list' ? (
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="text-left text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 truncate">
                                        {p.title}
                                    </div>
                                    {p.description ? (
                                        <div className="mt-1 text-left text-sm italic text-gray-600 dark:text-gray-300 truncate">
                                            {p.description}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                    {(() => {
                                        const created = formatCreatedAt(p.created_at);
                                        const tasks = p.tasks_count ?? 0;
                                        return (
                                            <>
                                                {created ? <span>Created: {created}</span> : null}
                                                <span>Tasks: {tasks}</span>
                                            </>
                                        );
                                    })()}

                                    <button
                                        type="button"
                                        className="taskmo-btn taskmo-btn-primary inline-flex h-10 w-10 items-center justify-center rounded-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openProjectModal(p);
                                            // open edit panel once modal is up
                                            window.setTimeout(() => setProjectEditOpen(true), 0);
                                        }}
                                        aria-label="Edit project"
                                        title="Edit"
                                    >
                                        <EditRoundedIcon fontSize="small" />
                                    </button>
                                    <button
                                        type="button"
                                        className="taskmo-btn taskmo-btn-danger inline-flex h-10 w-10 items-center justify-center rounded-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            router.delete(route('projects.destroy', p.id), {
                                                onSuccess: () => router.reload({ only: ['projects', 'stats'], preserveState: true }),
                                            });
                                        }}
                                        aria-label="Delete project"
                                        title="Delete"
                                    >
                                        <DeleteRoundedIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center text-3xl font-black tracking-tight">{p.title}</div>
                                {p.description && (
                                    <div className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-300">
                                        {p.description}
                                    </div>
                                )}

                                <div className="mt-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                                    {(() => {
                                        const created = formatCreatedAt(p.created_at);
                                        const tasks = p.tasks_count ?? 0;

                                        if (created) {
                                            return (
                                                <span>
                                                    Created: {created} • Tasks: {tasks}
                                                </span>
                                            );
                                        }

                                        return <span>Tasks: {tasks}</span>;
                                    })()}
                                </div>
                            </>
                        )}
                    </Paper>
                ))}
            </div>

            <Modal open={projectModalOpen} onClose={closeProjectModal}>
                <Box className="fixed inset-x-0 bottom-0 top-[72px] p-5 sm:p-8">
                    <div ref={projectModalBoundsRef} className="relative h-full w-full overflow-hidden">
                        <Paper
                            ref={projectModalScrollRef}
                            elevation={0}
                            className="taskmo-card taskmo-card-scroll taskmo-hide-scrollbar h-full w-full p-6"
                        >
                        <div className="sticky top-0 z-20">
                            <div className="flex items-start justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={closeProjectModal}
                                    className="taskmo-btn inline-flex h-12 w-12 items-center justify-center rounded-full"
                                    aria-label="Close"
                                    title="Close"
                                >
                                    <CloseRoundedIcon />
                                </button>

                                <div className="min-w-0 flex-1 px-2">
                                    <div className="taskmo-heading-3d taskmo-heading-glow text-center text-5xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-6xl">
                                        {projectDetails?.project?.title ?? activeProject?.title ?? 'Project'}
                                    </div>
                                    {projectDetails?.project?.description || activeProject?.description ? (
                                        <div className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-300">
                                            {projectDetails?.project?.description ?? activeProject?.description}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setProjectEditOpen((v) => !v)}
                                        className="taskmo-btn taskmo-btn-primary inline-flex h-12 w-12 items-center justify-center rounded-full"
                                        aria-label="Edit project"
                                        title="Edit"
                                    >
                                        <EditRoundedIcon />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!activeProject?.id) return;
                                            router.delete(route('projects.destroy', activeProject.id), {
                                                onSuccess: () => {
                                                    closeProjectModal();
                                                    router.reload({ only: ['projects', 'stats'], preserveState: true });
                                                },
                                            });
                                        }}
                                        className="taskmo-btn taskmo-btn-danger inline-flex h-12 w-12 items-center justify-center rounded-full"
                                        aria-label="Delete project"
                                        title="Delete"
                                    >
                                        <DeleteRoundedIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {projectEditOpen ? (
                            <div ref={projectEditRef} className="mt-6 grid gap-4">
                                <TextField
                                    label="Project title"
                                    value={projectEditForm.data.title}
                                    onChange={(e) => projectEditForm.setData('title', e.target.value)}
                                    error={Boolean(projectEditForm.errors.title)}
                                    helperText={projectEditForm.errors.title}
                                />
                                <TextField
                                    label="Project description"
                                    multiline
                                    minRows={3}
                                    value={projectEditForm.data.description}
                                    onChange={(e) => projectEditForm.setData('description', e.target.value)}
                                    error={Boolean(projectEditForm.errors.description)}
                                    helperText={projectEditForm.errors.description}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        variant="contained"
                                        disabled={projectEditForm.processing || !activeProject?.id}
                                        onClick={() =>
                                            projectEditForm.put(route('projects.update', activeProject.id), {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => {
                                                    setProjectEditOpen(false);
                                                    setActiveProject((p) =>
                                                        p
                                                            ? {
                                                                  ...p,
                                                                  title: projectEditForm.data.title,
                                                                  description: projectEditForm.data.description,
                                                              }
                                                            : p,
                                                    );
                                                    refreshProjectDetails();
                                                },
                                            })
                                        }
                                    >
                                        {projectEditForm.processing ? 'Saving…' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-6">
                            {projectLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <CircularProgress size={28} />
                                </div>
                            ) : projectError ? (
                                <div className="py-10 text-center text-sm font-semibold text-red-600 dark:text-red-400">
                                    {projectError}
                                </div>
                            ) : (
                                (() => {
                                    const tasks = projectDetails?.tasks ?? [];

                                    if (!tasks.length) {
                                        return (
                                            <div className="py-10 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                No tasks to show.
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid gap-4">
                                            <div className="text-center text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                                                Tasks
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                {tasks.map((t) => (
                                                    <Paper
                                                        key={t.id}
                                                        elevation={0}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => {
                                                            setActiveTask(t);
                                                            taskEditForm.setData('title', t.title ?? '');
                                                            taskEditForm.setData('description', t.description ?? '');
                                                            taskEditForm.setData('priority', t.priority ?? 'medium');
                                                            taskEditForm.setData('status', t.status ?? 'pending');
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                setActiveTask(t);
                                                                taskEditForm.setData('title', t.title ?? '');
                                                                taskEditForm.setData('description', t.description ?? '');
                                                                taskEditForm.setData('priority', t.priority ?? 'medium');
                                                                taskEditForm.setData('status', t.status ?? 'pending');
                                                            }
                                                        }}
                                                        className="taskmo-card-solid cursor-pointer select-none p-4"
                                                    >
                                                        <div className="text-center text-lg font-black text-gray-900 dark:text-gray-100">
                                                            {t.title}
                                                        </div>

                                                        {t.description ? (
                                                            <div className="mt-1 text-center text-sm italic text-gray-600 dark:text-gray-300">
                                                                {t.description}
                                                            </div>
                                                        ) : null}

                                                        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-200">
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
                                                                Priority: {String(t.priority ?? 'low')}
                                                            </span>
                                                            <span className="text-gray-400 dark:text-gray-500">•</span>
                                                            <span className="inline-flex items-center gap-2">
                                                                <span
                                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                                        t.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                                                                    }`}
                                                                />
                                                                Status: {String(t.status ?? 'pending')}
                                                            </span>
                                                        </div>

                                                        {t.created_at ? (
                                                            <div className="mt-3 text-center text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                                                Created: {formatCreatedAt(t.created_at) ?? ''}
                                                            </div>
                                                        ) : null}
                                                    </Paper>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()
                            )}
                        </div>

                        <Modal open={taskCreateOpen} onClose={() => setTaskCreateOpen(false)}>
                            <Box className="flex min-h-screen items-center justify-center p-6">
                                <Paper elevation={0} className="taskmo-card w-[min(720px,calc(100vw-32px))] p-6">
                                    <div className="text-center text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                                        Create Task
                                    </div>
                                    <div className="mt-1 text-center text-sm italic text-gray-600 dark:text-gray-300">
                                        For: {activeProject?.title}
                                    </div>

                                    <form
                                        className="mt-6 grid gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!activeProject?.id) return;

                                            taskCreateForm.post(route('tasks.store', activeProject.id), {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => {
                                                    setTaskCreateOpen(false);
                                                    taskCreateForm.reset();
                                                    refreshProjectDetails();
                                                },
                                            });
                                        }}
                                    >
                                        <TextField
                                            label="Title"
                                            value={taskCreateForm.data.title}
                                            onChange={(e) => taskCreateForm.setData('title', e.target.value)}
                                            error={Boolean(taskCreateForm.errors.title)}
                                            helperText={taskCreateForm.errors.title}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Description"
                                            value={taskCreateForm.data.description}
                                            onChange={(e) => taskCreateForm.setData('description', e.target.value)}
                                            error={Boolean(taskCreateForm.errors.description)}
                                            helperText={taskCreateForm.errors.description}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                        />
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <TextField
                                                select
                                                label="Priority"
                                                value={taskCreateForm.data.priority}
                                                onChange={(e) => taskCreateForm.setData('priority', e.target.value)}
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </TextField>
                                            <TextField
                                                select
                                                label="Status"
                                                value={taskCreateForm.data.status}
                                                onChange={(e) => taskCreateForm.setData('status', e.target.value)}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                            </TextField>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <Button type="button" variant="outlined" onClick={() => setTaskCreateOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="contained" disabled={taskCreateForm.processing}>
                                                {taskCreateForm.processing ? 'Creating…' : 'Create'}
                                            </Button>
                                        </div>
                                    </form>
                                </Paper>
                            </Box>
                        </Modal>

                        <Modal open={Boolean(activeTask)} onClose={() => setActiveTask(null)}>
                            <Box className="flex min-h-screen items-center justify-center p-6">
                                <Paper elevation={0} className="taskmo-card w-[min(820px,calc(100vw-32px))] p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="text-lg font-black text-gray-900 dark:text-gray-100 truncate">
                                                Edit Task
                                            </div>
                                            <div className="mt-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">
                                                {activeTask?.title}
                                            </div>
                                        </div>
                                        <Button variant="contained" onClick={() => setActiveTask(null)}>
                                            Close
                                        </Button>
                                    </div>

                                    <form
                                        className="mt-6 grid gap-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!activeTask?.id) return;

                                            taskEditForm.put(route('tasks.update', activeTask.id), {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => {
                                                    setActiveTask(null);
                                                    refreshProjectDetails();
                                                },
                                            });
                                        }}
                                    >
                                        <TextField
                                            label="Title"
                                            value={taskEditForm.data.title}
                                            onChange={(e) => taskEditForm.setData('title', e.target.value)}
                                            error={Boolean(taskEditForm.errors.title)}
                                            helperText={taskEditForm.errors.title}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Description"
                                            value={taskEditForm.data.description}
                                            onChange={(e) => taskEditForm.setData('description', e.target.value)}
                                            error={Boolean(taskEditForm.errors.description)}
                                            helperText={taskEditForm.errors.description}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                        />
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <TextField
                                                select
                                                label="Priority"
                                                value={taskEditForm.data.priority}
                                                onChange={(e) => taskEditForm.setData('priority', e.target.value)}
                                            >
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </TextField>
                                            <TextField
                                                select
                                                label="Status"
                                                value={taskEditForm.data.status}
                                                onChange={(e) => taskEditForm.setData('status', e.target.value)}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="completed">Completed</MenuItem>
                                            </TextField>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <Button type="button" variant="outlined" onClick={() => setActiveTask(null)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="contained" disabled={taskEditForm.processing}>
                                                {taskEditForm.processing ? 'Saving…' : 'Save'}
                                            </Button>
                                        </div>
                                    </form>
                                </Paper>
                            </Box>
                        </Modal>

                        </Paper>

                        {/* Floating Add Task CTA (auto-expands every 10s) */}
                        {activeProject?.id ? (
                            <button
                                type="button"
                                onPointerDown={onTaskCtaPointerDown}
                                onPointerMove={onTaskCtaPointerMove}
                                onPointerUp={onTaskCtaPointerUp}
                                onClick={(e) => {
                                    if (taskCtaIgnoreClickRef.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    setTaskCreateOpen(true);
                                }}
                                style={{
                                    position: 'absolute',
                                    left: taskCtaReady
                                        ? taskCtaOpen && taskCtaLayout.dir === 'left'
                                            ? taskCtaPos.x - (taskCtaLayout.expandedW - TASK_CTA_SIZE)
                                            : taskCtaPos.x
                                        : undefined,
                                    top: taskCtaReady ? taskCtaPos.y : undefined,
                                    right: taskCtaReady ? undefined : TASK_CTA_MARGIN,
                                    bottom: taskCtaReady ? undefined : TASK_CTA_MARGIN,
                                    zIndex: 120,
                                    width: taskCtaOpen ? taskCtaLayout.expandedW : TASK_CTA_SIZE,
                                    height: TASK_CTA_SIZE,
                                }}
                                className={`taskmo-btn taskmo-btn-primary animate-taskmo-float inline-flex select-none items-center rounded-full font-extrabold transition-all duration-500 ease-in-out ${
                                    taskCtaLayout.dir === 'left' ? 'flex-row-reverse' : ''
                                } ${taskCtaOpen ? 'gap-3 px-4' : 'gap-0 justify-center'} p-0`}
                                aria-label="Create new task"
                                title="Create new task"
                            >
                                <span
                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full leading-none"
                                    style={{
                                        transform: `rotate(${taskCtaRoll * 360}deg)`,
                                        transition: 'transform 650ms ease-in-out',
                                    }}
                                >
                                    <AddIcon sx={{ display: 'block', fontSize: 26 }} />
                                </span>
                                <span
                                    className={`whitespace-nowrap transition-all duration-500 ease-in-out ${
                                        taskCtaOpen ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
                                    }`}
                                >
                                    Create new task here
                                </span>
                            </button>
                        ) : null}
                    </div>
                </Box>
            </Modal>

            <DraggableFab
                icon={<AddIcon className="text-white" />}
                label="New Project"
                onClick={() => setCreateOpen(true)}
                rollIntervalMs={5000}
            />

            <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
                <Box className="flex min-h-screen items-center justify-center p-6">
                    <Paper
                        className="taskmo-card w-full max-w-lg p-6"
                        elevation={0}
                    >
                        <Typography variant="h6" className="text-center font-extrabold">
                            Create Project
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-center text-gray-600 dark:text-gray-300"
                        >
                            Add a title and description.
                        </Typography>

                        <form onSubmit={submitCreate} className="mt-6 grid gap-4">
                            <TextField
                                label="Title"
                                value={createForm.data.title}
                                onChange={(e) => createForm.setData('title', e.target.value)}
                                error={Boolean(createForm.errors.title)}
                                helperText={createForm.errors.title}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={createForm.data.description}
                                onChange={(e) =>
                                    createForm.setData('description', e.target.value)
                                }
                                error={Boolean(createForm.errors.description)}
                                helperText={createForm.errors.description}
                                multiline
                                minRows={3}
                                fullWidth
                            />
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => setCreateOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={createForm.processing}
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Box>
            </Modal>
        </TaskMoLayout>
    );
}
