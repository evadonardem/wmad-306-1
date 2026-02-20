import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    FolderKanban,
    ListTodo,
    TrendingUp,
} from 'lucide-react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Tooltip,
    Typography,
    Grow,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

function StatCard({ title, value, subtitle, icon }) {
    return (
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={(theme) => ({
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        })}
                    >
                        {icon}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.25 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function formatWhen(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
}

export default function Dashboard({ stats, recentProjects, topOpenTasks }) {
    const theme = useTheme();
    const { auth } = usePage().props;
    const topCardMinHeight = 156;
    const bottomCardMinHeight = 360;

    const firstName = useMemo(() => {
        const fullName = auth?.user?.name?.trim();
        if (!fullName) return 'there';
        return fullName.split(/\s+/)[0];
    }, [auth?.user?.name]);

    const completionPct = useMemo(() => {
        const total = stats?.tasks?.total ?? 0;
        const completed = stats?.tasks?.completed ?? 0;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }, [stats]);

    const openTotal = stats?.tasks?.open ?? 0;
    const openByPriority = stats?.tasks?.openByPriority ?? { high: 0, medium: 0, low: 0 };

    const priorityPct = useMemo(() => {
        const denom = Math.max(openTotal, 1);
        return {
            high: Math.round((openByPriority.high / denom) * 100),
            medium: Math.round((openByPriority.medium / denom) * 100),
            low: Math.round((openByPriority.low / denom) * 100),
        };
    }, [openTotal, openByPriority]);

    const unfinishedRecentProjects = useMemo(
        () => (recentProjects ?? []).filter((project) => !project.is_finished),
        [recentProjects],
    );

    const finishedRecentProjects = useMemo(
        () => (recentProjects ?? []).filter((project) => Boolean(project.is_finished)),
        [recentProjects],
    );

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <Stack spacing={2.5} sx={{ width: '100%' }}>
                {/* Welcome card */}
                <Grow in timeout={360}>
                    <Card
                        sx={{
                            overflow: 'hidden',
                            backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(
                                theme.palette.primary.main,
                                0.14
                            )} 0%, transparent 45%), radial-gradient(circle at 90% 30%, ${alpha(
                                theme.palette.secondary.main,
                                0.12
                            )} 0%, transparent 50%)`,
                        }}
                    >
                        <CardContent>
                            <Stack spacing={1.5}>
                                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                    Welcome back, {firstName}!
                                </Typography>
                                <Typography color="text.secondary">
                                    Here’s a quick snapshot of your work—without needing to open each project.
                                </Typography>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ pt: 0.5 }}>
                                    <Button
                                        component={Link}
                                        href={route('projects.index')}
                                        variant="contained"
                                        startIcon={<FolderKanban size={18} />}
                                        endIcon={<ArrowRight size={18} />}
                                    >
                                        Go to projects
                                    </Button>
                                    <Button component={Link} href={route('projects.index')} variant="outlined">
                                        Finish Tasks
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grow>

                {/* Top stats cards */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
                    <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '33.333%' }, minHeight: topCardMinHeight, display: 'flex' }}>
                        <StatCard
                            title="Projects"
                            value={stats?.projects?.total ?? 0}
                            subtitle={`${stats?.projects?.unfinished ?? 0} unfinished • ${stats?.projects?.finished ?? 0} finished`}
                            icon={<TrendingUp size={20} />}
                        />
                    </Box>

                    <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '33.333%' }, minHeight: topCardMinHeight, display: 'flex' }}>
                        <StatCard
                            title="Open tasks"
                            value={stats?.tasks?.open ?? 0}
                            subtitle={`${stats?.tasks?.completed ?? 0} completed total`}
                            icon={<ListTodo size={20} />}
                        />
                    </Box>

                    <Box sx={{ flex: { md: 1 }, width: { xs: '100%', md: '33.333%' }, minHeight: topCardMinHeight, display: 'flex' }}>
                        <Card sx={{ flex: 1, minHeight: topCardMinHeight, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box
                                            sx={(t) => ({
                                                width: 44,
                                                height: 44,
                                                borderRadius: '50%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                backgroundColor: alpha(t.palette.primary.main, 0.12),
                                            })}
                                        >
                                            <ClipboardList size={20} />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Task completion
                                            </Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.25 }}>
                                                {completionPct}%
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <LinearProgress
                                        value={completionPct}
                                        variant="determinate"
                                        sx={{ height: 10, borderRadius: 999 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {stats?.tasks?.completed ?? 0} / {stats?.tasks?.total ?? 0} tasks completed
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>

                {/* Recent Projects & Open Tasks */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
                    {/* Recent projects */}
                    <Box sx={{ width: { xs: '100%', md: '58.333%' }, minHeight: bottomCardMinHeight, display: 'flex' }}>
                        <Card sx={{ flex: 1, minHeight: bottomCardMinHeight, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                                    Recent projects
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Latest updated projects with quick progress.
                                                </Typography>
                                            </Box>

                                            <Button
                                                component={Link}
                                                href={route('projects.index')}
                                                variant="text"
                                                endIcon={<ArrowRight size={18} />}
                                            >
                                                View all
                                            </Button>
                                        </Stack>

                                        <Divider />

                                        <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                                            {(recentProjects ?? []).length === 0 && (
                                                <Typography color="text.secondary">
                                                    No projects yet. Create one from the Projects page.
                                                </Typography>
                                            )}

                                                {unfinishedRecentProjects.length > 0 ? (
                                                    <>
                                                        <Divider textAlign="left">
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                Unfinished
                                                            </Typography>
                                                        </Divider>

                                                        {unfinishedRecentProjects.map((project, idx) => (
                                                            <Grow key={project.id} in timeout={500 + idx * 120}>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 800,
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap',
                                                                                }}
                                                                            >
                                                                                {project.title}
                                                                            </Typography>
                                                                            <Chip
                                                                                size="small"
                                                                                variant="outlined"
                                                                                label={`${project.tasks_done}/${project.tasks_total} done`}
                                                                            />
                                                                        </Stack>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Updated {formatWhen(project.updated_at)}
                                                                        </Typography>
                                                                        <LinearProgress
                                                                            value={project.progress ?? 0}
                                                                            variant="determinate"
                                                                            sx={{ height: 8, borderRadius: 999, mt: 1 }}
                                                                        />
                                                                    </Box>

                                                                    <Button
                                                                        component={Link}
                                                                        href={route('projects.show', project.id)}
                                                                        variant="outlined"
                                                                        size="small"
                                                                    >
                                                                        Open
                                                                    </Button>
                                                                </Stack>
                                                            </Grow>
                                                        ))}
                                                    </>
                                                ) : null}

                                                {finishedRecentProjects.length > 0 ? (
                                                    <>
                                                        <Divider textAlign="left">
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                Finished
                                                            </Typography>
                                                        </Divider>

                                                        {finishedRecentProjects.map((project, idx) => (
                                                            <Grow key={project.id} in timeout={620 + idx * 120}>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 800,
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap',
                                                                                }}
                                                                            >
                                                                                {project.title}
                                                                            </Typography>
                                                                            <Chip
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="success"
                                                                                label={`${project.tasks_done}/${project.tasks_total} done`}
                                                                            />
                                                                        </Stack>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Updated {formatWhen(project.updated_at)}
                                                                        </Typography>
                                                                        <LinearProgress
                                                                            value={project.progress ?? 0}
                                                                            variant="determinate"
                                                                            color="success"
                                                                            sx={{ height: 8, borderRadius: 999, mt: 1 }}
                                                                        />
                                                                    </Box>

                                                                    <Button
                                                                        component={Link}
                                                                        href={route('projects.show', project.id)}
                                                                        variant="outlined"
                                                                        size="small"
                                                                    >
                                                                        Open
                                                                    </Button>
                                                                </Stack>
                                                            </Grow>
                                                        ))}
                                                    </>
                                                ) : null}
                                        </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Open tasks by priority */}
                    <Box sx={{ width: { xs: '100%', md: '41.667%' }, minHeight: bottomCardMinHeight, display: 'flex' }}>
                        <Card sx={{ flex: 1, minHeight: bottomCardMinHeight, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                                Open tasks by priority
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Quick urgency breakdown (only open tasks).
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1}>
                                            {['high', 'medium', 'low'].map((level) => (
                                                <Tooltip
                                                    key={level}
                                                    title={`${openByPriority[level]} open ${level}-priority tasks`}
                                                >
                                                    <Box>
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {openByPriority[level]}
                                                            </Typography>
                                                        </Stack>
                                                        <LinearProgress
                                                            value={priorityPct[level]}
                                                            variant="determinate"
                                                            sx={{ height: 8, borderRadius: 999, mt: 0.5 }}
                                                            color={
                                                                level === 'high'
                                                                    ? 'error'
                                                                    : level === 'medium'
                                                                    ? 'warning'
                                                                    : 'success'
                                                            }
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            ))}
                                        </Stack>

                                        <Divider />

                                        <Box>
                                            <Typography sx={{ fontWeight: 900 }}>Top open tasks</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Highest priority first.
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1} sx={{ flex: 1, overflow: 'auto' }}>
                                            {(topOpenTasks ?? []).length === 0 && (
                                                <Typography color="text.secondary">No open tasks. Nice.</Typography>
                                            )}

                                            {(topOpenTasks ?? []).map((task) => (
                                                <Box
                                                    key={task.id}
                                                    sx={{
                                                        p: 1.25,
                                                        borderRadius: 2,
                                                        border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                                                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                                                    }}
                                                >
                                                    <Stack spacing={0.5}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    flex: 1,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={task.priority}
                                                                variant="outlined"
                                                                color={
                                                                    task.priority === 'high'
                                                                        ? 'error'
                                                                        : task.priority === 'medium'
                                                                        ? 'warning'
                                                                        : 'success'
                                                                }
                                                            />
                                                        </Stack>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {task.project?.title ? `Project: ${task.project.title} • ` : ''}
                                                            Updated {formatWhen(task.updated_at)}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Stack>
        </AuthenticatedLayout>
    );
}
