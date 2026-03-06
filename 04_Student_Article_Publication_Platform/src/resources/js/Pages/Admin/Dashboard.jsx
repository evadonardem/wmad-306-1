import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    CssBaseline,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    createTheme,
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import {
    ArticleRounded,
    BarChartRounded,
    ForumRounded,
    PendingRounded,
    PeopleRounded,
    VisibilityRounded,
    WarningAmberRounded,
} from '@mui/icons-material';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import AdminTopBar from './Components/AdminTopBar';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

function statusColor(status) {
    if (status === 'active' || status === 'Published') return 'success';
    if (status === 'pending' || status === 'Pending') return 'warning';
    if (status === 'suspended') return 'error';
    return 'default';
}

function number(value) {
    return Number(value || 0);
}

function pct(numerator, denominator) {
    if (!denominator) return 0;
    return Math.round((numerator / denominator) * 100);
}

export default function Dashboard({ stats = {}, activity = [], recentUsers = [], recentArticles = [] }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'light',
                    primary: { main: colors.newsprint },
                    secondary: { main: colors.accent },
                    background: {
                        default: colors.paper,
                        paper: '#ffffff',
                    },
                },
                shape: { borderRadius: 14 },
            }),
        [colors],
    );

    const [userSearch, setUserSearch] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [userPage, setUserPage] = useState(0);
    const [userRowsPerPage, setUserRowsPerPage] = useState(5);

    const [articleSearch, setArticleSearch] = useState('');
    const [articleStatusFilter, setArticleStatusFilter] = useState('all');
    const [articlePage, setArticlePage] = useState(0);
    const [articleRowsPerPage, setArticleRowsPerPage] = useState(5);

    const totalUsers = number(stats.totalUsers);
    const activeUsers = number(stats.activeUsers);
    const totalArticles = number(stats.totalArticles);
    const publishedArticles = number(stats.publishedArticles);
    const totalComments = number(stats.totalComments);
    const pendingUsers = number(stats.pendingUsers);
    const pendingArticles = number(stats.pendingArticles);
    const newCommentsToday = number(stats.newCommentsToday);

    const suspendedUsers = recentUsers.filter((u) => u.account_status === 'suspended').length;

    const activeRate = pct(activeUsers, totalUsers);
    const publishRate = pct(publishedArticles, totalArticles);

    const kpiCards = [
        {
            key: 'users',
            title: 'Total Users',
            value: totalUsers,
            helper: `${activeUsers} active accounts`,
            icon: <PeopleRounded fontSize="small" />,
            tone: colors.newsprint,
            progress: activeRate,
        },
        {
            key: 'articles',
            title: 'Published Articles',
            value: publishedArticles,
            helper: `${totalArticles} total articles`,
            icon: <ArticleRounded fontSize="small" />,
            tone: colors.accent,
            progress: publishRate,
        },
        {
            key: 'engagement',
            title: 'Comment Volume',
            value: totalComments,
            helper: `${newCommentsToday} new today`,
            icon: <ForumRounded fontSize="small" />,
            tone: colors.accent2 || colors.byline,
            progress: Math.min(100, newCommentsToday * 12),
        },
        {
            key: 'health',
            title: 'Platform Health',
            value: `${Math.round((activeRate + publishRate) / 2)}%`,
            helper: `${activeRate}% active users • ${publishRate}% publish rate`,
            icon: <BarChartRounded fontSize="small" />,
            tone: '#2e7d32',
            progress: Math.round((activeRate + publishRate) / 2),
        },
    ];

    const priorityQueue = [
        {
            key: 'pending-users',
            label: 'Pending user approvals',
            count: pendingUsers,
            tone: '#ed6c02',
            action: () => router.visit('/admin/users'),
            actionLabel: 'Review Users',
        },
        {
            key: 'pending-articles',
            label: 'Pending article moderation',
            count: pendingArticles,
            tone: '#ed6c02',
            action: () => router.visit('/articles'),
            actionLabel: 'Open Articles',
        },
        {
            key: 'suspended-users',
            label: 'Suspended users for follow-up',
            count: suspendedUsers,
            tone: '#d32f2f',
            action: () => {
                setUserStatusFilter('suspended');
                document.getElementById('recent-users')?.scrollIntoView({ behavior: 'smooth' });
            },
            actionLabel: 'View Suspended',
        },
    ];

    const activitySummary = useMemo(() => {
        const totals = activity.reduce(
            (acc, row) => {
                acc.newUsers += number(row.newUsers);
                acc.publishedArticles += number(row.publishedArticles);
                acc.newComments += number(row.newComments);
                return acc;
            },
            { newUsers: 0, publishedArticles: 0, newComments: 0 },
        );

        const maxValue = Math.max(
            1,
            ...activity.map((row) => number(row.newUsers) + number(row.publishedArticles) + number(row.newComments)),
        );

        const peak = activity.reduce((best, row) => {
            const total = number(row.newUsers) + number(row.publishedArticles) + number(row.newComments);
            if (!best || total > best.total) {
                return { label: row.label, total };
            }
            return best;
        }, null);

        return { totals, maxValue, peak };
    }, [activity]);

    const filteredUsers = useMemo(() => {
        const keyword = userSearch.trim().toLowerCase();

        const rows = recentUsers.filter((user) => {
            const name = String(user.name || '').toLowerCase();
            const email = String(user.email || '').toLowerCase();
            const matchKeyword = !keyword || name.includes(keyword) || email.includes(keyword);
            const matchStatus = userStatusFilter === 'all' || user.account_status === userStatusFilter;
            return matchKeyword && matchStatus;
        });

        rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return rows;
    }, [recentUsers, userSearch, userStatusFilter]);

    const filteredArticles = useMemo(() => {
        const keyword = articleSearch.trim().toLowerCase();

        const rows = recentArticles.filter((article) => {
            const title = String(article.title || '').toLowerCase();
            const author = String(article.author || '').toLowerCase();
            const matchKeyword = !keyword || title.includes(keyword) || author.includes(keyword);
            const matchStatus = articleStatusFilter === 'all' || article.status === articleStatusFilter;
            return matchKeyword && matchStatus;
        });

        rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return rows;
    }, [recentArticles, articleSearch, articleStatusFilter]);

    const pagedUsers = filteredUsers.slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage);
    const pagedArticles = filteredArticles.slice(articlePage * articleRowsPerPage, articlePage * articleRowsPerPage + articleRowsPerPage);

    const setUserStatus = (user, nextStatus) => {
        router.patch(
            `/admin/users/${user.id}/status`,
            { account_status: nextStatus },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Head title="Admin Dashboard" />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: colors.paper,
                    color: colors.ink,
                    transition: 'background-color 220ms ease, color 220ms ease',
                }}
            >
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <AdminTopBar active="dashboard" />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                            Admin Overview
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.byline }}>
                            Critical items first, analytics second, then operational tables for user and article management.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', xl: 'repeat(4,1fr)' }, gap: 1.5, mb: 2 }}>
                        {kpiCards.map((card) => (
                            <Card key={card.key} elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" sx={{ color: colors.byline, fontWeight: 700 }}>{card.title}</Typography>
                                        <Box className="icon-shell" data-icon-shell="true" sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: alpha(card.tone, 0.14), color: card.tone, display: 'grid', placeItems: 'center' }}>
                                            {card.icon}
                                        </Box>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint, mb: 1 }}>{card.value}</Typography>
                                    <Typography variant="caption" sx={{ color: colors.byline, display: 'block', mb: 1 }}>{card.helper}</Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={card.progress}
                                        sx={{ height: 8, borderRadius: 999, bgcolor: alpha(colors.border, 0.4), '& .MuiLinearProgress-bar': { bgcolor: card.tone } }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>
                                    Priority Action Queue
                                </Typography>
                                <Chip icon={<WarningAmberRounded />} label={`${priorityQueue.reduce((sum, item) => sum + item.count, 0)} items`} color="warning" variant="outlined" />
                            </Stack>

                            <Stack spacing={1}>
                                {priorityQueue.map((item) => (
                                    <Box
                                        key={item.key}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: alpha(colors.border, 0.7),
                                            borderRadius: 2,
                                            p: 1.25,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.tone }} />
                                            <Typography variant="body2" fontWeight={700} sx={{ color: colors.newsprint }}>{item.label}</Typography>
                                            <Chip size="small" label={item.count} color={item.count > 0 ? 'warning' : 'default'} />
                                        </Stack>
                                        <Button size="small" variant="outlined" onClick={item.action} disabled={item.count === 0}>
                                            {item.actionLabel}
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>
                                    Trend Analytics
                                </Typography>
                                <Chip icon={<BarChartRounded />} label="Last 7 days" size="small" />
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
                                <Chip label={`Users +${activitySummary.totals.newUsers}`} color="primary" variant="outlined" />
                                <Chip label={`Published +${activitySummary.totals.publishedArticles}`} color="success" variant="outlined" />
                                <Chip label={`Comments +${activitySummary.totals.newComments}`} color="warning" variant="outlined" />
                                <Chip label={`Peak day: ${activitySummary.peak ? activitySummary.peak.label : '-'}`} variant="outlined" />
                            </Stack>

                            <Stack spacing={1}>
                                {activity.map((row) => {
                                    const users = number(row.newUsers);
                                    const published = number(row.publishedArticles);
                                    const comments = number(row.newComments);
                                    const total = users + published + comments;
                                    const totalPct = Math.min(100, Math.round((total / activitySummary.maxValue) * 100));

                                    return (
                                        <Box key={row.date}>
                                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" sx={{ color: colors.newsprint, fontWeight: 700 }}>{row.label}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>{`U ${users} • A ${published} • C ${comments}`}</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={totalPct}
                                                sx={{ height: 9, borderRadius: 999, bgcolor: alpha(colors.border, 0.35), '& .MuiLinearProgress-bar': { bgcolor: colors.accent } }}
                                            />
                                        </Box>
                                    );
                                })}
                                {activity.length === 0 && <Typography variant="body2">No activity data available.</Typography>}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' }, gap: 1.5 }}>
                        <Card id="recent-users" elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                            <CardContent>
                                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1} mb={1.5}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>User Management Queue</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <TextField size="small" label="Search" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(0); }} />
                                        <FormControl size="small" sx={{ minWidth: 130 }}>
                                            <InputLabel>Status</InputLabel>
                                            <Select value={userStatusFilter} label="Status" onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(0); }}>
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="active">Active</MenuItem>
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="suspended">Suspended</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Stack>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Roles</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pagedUsers.map((user) => {
                                            const nextStatus = user.account_status === 'suspended' ? 'active' : 'suspended';
                                            const quickActionLabel = user.account_status === 'suspended' ? 'Activate' : 'Disable';
                                            return (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: colors.byline }}>{user.email}</Typography>
                                                    </TableCell>
                                                    <TableCell><Chip size="small" label={user.account_status} color={statusColor(user.account_status)} /></TableCell>
                                                    <TableCell>{Array.isArray(user.roles) ? user.roles.join(', ') : '-'}</TableCell>
                                                    <TableCell align="right">
                                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                            <Tooltip title="Open full user management">
                                                                <Button size="small" variant="outlined" onClick={() => router.visit('/admin/users')}>Manage</Button>
                                                            </Tooltip>
                                                            <Tooltip title={`${quickActionLabel} account`}>
                                                                <Button size="small" variant="contained" color={nextStatus === 'suspended' ? 'warning' : 'success'} onClick={() => setUserStatus(user, nextStatus)}>
                                                                    {quickActionLabel}
                                                                </Button>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {pagedUsers.length === 0 && (
                                            <TableRow><TableCell colSpan={4}>No managed users found.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <TablePagination
                                    component="div"
                                    count={filteredUsers.length}
                                    page={userPage}
                                    onPageChange={(_, newPage) => setUserPage(newPage)}
                                    rowsPerPage={userRowsPerPage}
                                    onRowsPerPageChange={(e) => { setUserRowsPerPage(Number(e.target.value)); setUserPage(0); }}
                                    rowsPerPageOptions={[5, 10]}
                                />
                            </CardContent>
                        </Card>

                        <Card id="articles-management" elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                            <CardContent>
                                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1} mb={1.5}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>Recent Article Moderation</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <TextField size="small" label="Search" value={articleSearch} onChange={(e) => { setArticleSearch(e.target.value); setArticlePage(0); }} />
                                        <FormControl size="small" sx={{ minWidth: 130 }}>
                                            <InputLabel>Status</InputLabel>
                                            <Select value={articleStatusFilter} label="Status" onChange={(e) => { setArticleStatusFilter(e.target.value); setArticlePage(0); }}>
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="Published">Published</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Stack>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Comments</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pagedArticles.map((article) => (
                                            <TableRow key={article.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>{article.title}</Typography>
                                                    <Typography variant="caption" sx={{ color: colors.byline }}>{article.author || 'Unknown'} | {formatDate(article.published_at || article.created_at)}</Typography>
                                                </TableCell>
                                                <TableCell><Chip size="small" label={article.status} color={statusColor(article.status)} /></TableCell>
                                                <TableCell>{number(article.comments_count)}</TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                        <Tooltip title="View Article"><Button size="small" variant="outlined" startIcon={<VisibilityRounded />} onClick={() => router.visit(`/articles/${article.id}`)}>View</Button></Tooltip>
                                                        <Tooltip title="Moderate Comments"><Button size="small" variant="contained" startIcon={<PendingRounded />} onClick={() => router.visit(`/articles/${article.id}#comments`)}>Moderate</Button></Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {pagedArticles.length === 0 && (
                                            <TableRow><TableCell colSpan={4}>No articles found for current filters.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <TablePagination
                                    component="div"
                                    count={filteredArticles.length}
                                    page={articlePage}
                                    onPageChange={(_, newPage) => setArticlePage(newPage)}
                                    rowsPerPage={articleRowsPerPage}
                                    onRowsPerPageChange={(e) => { setArticleRowsPerPage(Number(e.target.value)); setArticlePage(0); }}
                                    rowsPerPageOptions={[5, 10]}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </MuiThemeProvider>
    );
}
