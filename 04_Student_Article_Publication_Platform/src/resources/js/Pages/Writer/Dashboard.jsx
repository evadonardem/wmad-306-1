import WriterLayout from '@/Layouts/WriterLayout';
import { Link } from '@inertiajs/react';
import {
    alpha,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import DraftList from './Components/DraftList';
import SubmittedList from './Components/SubmittedList';
import { useTheme } from '@/Contexts/ThemeContext';

export default function Dashboard({
    articles = [],
    personalAnalytics = {},
    upcomingDeadlines = [],
    relatedArticles = [],
    notifications = [],
}) {
    const { colors } = useTheme();
    const [liveAnalytics, setLiveAnalytics] = useState(personalAnalytics ?? {});

    const draftCount = useMemo(() => {
        return articles.filter((article) => {
            const slug = article?.status?.slug ?? null;
            if (slug) return slug === 'draft';
            return !article.submitted_at && !article.published_at;
        }).length;
    }, [articles]);

    const acceptanceRateLabel = useMemo(() => {
        if (liveAnalytics.acceptanceRate == null) return 'N/A';
        return `${liveAnalytics.acceptanceRate}%`;
    }, [liveAnalytics.acceptanceRate]);

    useEffect(() => {
        setLiveAnalytics(personalAnalytics ?? {});
    }, [personalAnalytics]);

    useEffect(() => {
        let cancelled = false;

        async function refresh() {
            try {
                const res = await axios.get(route('writer.dashboard.personalAnalytics'), {
                    headers: { Accept: 'application/json' },
                });
                if (cancelled) return;
                if (res?.data?.personalAnalytics) {
                    setLiveAnalytics(res.data.personalAnalytics);
                }
            } catch {
                // keep last known values
            }
        }

        const id = setInterval(refresh, 5000);
        refresh();

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    const metricCards = [
        { label: 'Drafts', value: draftCount, helper: 'Unsubmitted work', tone: colors.primary },
        { label: 'Submitted', value: liveAnalytics.submittedCount ?? 0, helper: 'In editorial queue', tone: colors.accent },
        { label: 'Published', value: liveAnalytics.publishedCount ?? 0, helper: 'Live articles', tone: colors.success },
        { label: 'Acceptance', value: acceptanceRateLabel, helper: 'Submission success rate', tone: colors.info },
    ];

    const statusDistribution = useMemo(() => {
        const stats = { Draft: 0, Submitted: 0, Revision: 0, Published: 0 };
        articles.forEach((article) => {
            const slug = String(article?.status?.slug || '').toLowerCase();
            if (slug === 'published') stats.Published += 1;
            else if (slug === 'submitted' || slug === 'in-review') stats.Submitted += 1;
            else if (slug === 'revision-requested') stats.Revision += 1;
            else stats.Draft += 1;
        });
        return Object.entries(stats)
            .map(([name, value]) => ({ name, value }))
            .filter((item) => item.value > 0);
    }, [articles]);

    return (
        <WriterLayout>
            <Box sx={{ mx: 'auto', maxWidth: '1500px', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 1.5, sm: 2 } }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75), mb: 2 }}>
                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            spacing={2}
                        >
                            <Box>
                                <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: colors.textSecondary }}>
                                    WRITER DESK
                                </Typography>
                                <Typography variant="h4" fontWeight={900} sx={{ color: colors.text }}>
                                    Writer Dashboard
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                    Draft, submit, and track article progress in one workspace.
                                </Typography>
                            </Box>
                            <Link
                                href={route('writer.articles.create')}
                                className="inline-flex items-center border px-4 py-2 text-sm font-semibold"
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
                                    color: colors.background,
                                }}
                            >
                                New Article
                            </Link>
                        </Stack>
                    </CardContent>
                </Card>

                <Box
                    sx={{
                        mb: 2,
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            lg: 'repeat(4, minmax(0, 1fr))',
                        },
                    }}
                >
                    {metricCards.map((item) => (
                        <Card
                            key={item.label}
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: alpha(colors.border, 0.75),
                                minHeight: 126,
                            }}
                        >
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" sx={{ color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                                        {item.label}
                                    </Typography>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '999px', bgcolor: item.tone }} />
                                </Stack>
                                <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5, color: colors.text, lineHeight: 1.1 }}>
                                    {item.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                    {item.helper}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(340px, 1fr)' },
                        alignItems: 'start',
                        gap: 2,
                    }}
                >
                    <Stack spacing={2}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <DraftList articles={articles} />
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <SubmittedList articles={articles} />
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.text, mb: 1 }}>
                                        Personal Analytics
                                    </Typography>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1.5}
                                        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: colors.border }} />}
                                    >
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>Submitted: <strong style={{ color: colors.text }}>{liveAnalytics.submittedCount ?? 0}</strong></Typography>
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>Published: <strong style={{ color: colors.text }}>{liveAnalytics.publishedCount ?? 0}</strong></Typography>
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>Acceptance: <strong style={{ color: colors.text }}>{acceptanceRateLabel}</strong></Typography>
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>Avg Feedback: <strong style={{ color: colors.text }}>{liveAnalytics.avgEditorFeedbackHours == null ? 'N/A' : `${liveAnalytics.avgEditorFeedbackHours}h`}</strong></Typography>
                                    </Stack>
                                    {statusDistribution.length > 0 && (
                                        <Box sx={{ mt: 2, height: 200 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={statusDistribution}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        innerRadius={45}
                                                        outerRadius={72}
                                                        paddingAngle={2}
                                                    >
                                                        {statusDistribution.map((entry, index) => {
                                                            const palette = [colors.primary, colors.accent, colors.warning, colors.success];
                                                            return <Cell key={entry.name} fill={palette[index % palette.length]} />;
                                                        })}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        contentStyle={{
                                                            border: `1px solid ${colors.border}`,
                                                            background: colors.surface,
                                                            color: colors.text,
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                    </Stack>

                    <Stack spacing={2}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.text, mb: 1 }}>
                                        Submission Deadlines
                                    </Typography>
                                    {upcomingDeadlines.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                            No upcoming deadlines.
                                        </Typography>
                                    ) : (
                                        <List dense disablePadding sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
                                            {upcomingDeadlines.map((d) => (
                                                <ListItem key={d.id} disableGutters sx={{ py: 0.75, borderBottom: '1px solid', borderColor: alpha(colors.border, 0.65) }}>
                                                    <ListItemText
                                                        primary={d.title}
                                                        secondary={`${d.category?.name ? `${d.category.name} | ` : ''}Due: ${d.due_at ? new Date(d.due_at).toLocaleString() : 'N/A'}`}
                                                        primaryTypographyProps={{ sx: { color: colors.text, fontWeight: 700, fontSize: 14 } }}
                                                        secondaryTypographyProps={{ sx: { color: colors.textSecondary, fontSize: 12 } }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.text, mb: 1 }}>
                                        Notifications
                                    </Typography>
                                    {notifications.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>No notifications yet.</Typography>
                                    ) : (
                                        <Stack spacing={1}>
                                            {notifications.map((n) => (
                                                <Box key={n.id} sx={{ p: 1, border: '1px solid', borderColor: alpha(colors.border, 0.7), bgcolor: alpha(colors.hover, 0.5) }}>
                                                    <Typography variant="body2" sx={{ color: colors.text }}>
                                                        {n.data?.message ?? n.type}
                                                        {n.data?.title ? ` - ${n.data.title}` : ''}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                                        {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.75) }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.text, mb: 1 }}>
                                        Related Articles
                                    </Typography>
                                    {relatedArticles.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>No related articles to show.</Typography>
                                    ) : (
                                        <Stack spacing={1}>
                                            {relatedArticles.map((a) => (
                                                <Box key={a.id}>
                                                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 700 }}>{a.title}</Typography>
                                                    <Chip
                                                        size="small"
                                                        label={a.author?.name ? `By ${a.author.name}` : 'Unknown Author'}
                                                        sx={{ mt: 0.5, bgcolor: alpha(colors.accent, 0.14), color: colors.accent }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                    </Stack>
                </Box>
            </Box>
        </WriterLayout>
    );
}
