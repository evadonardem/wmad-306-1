import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    alpha,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    CssBaseline,
    List,
    ListItem,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    createTheme
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import {
    CheckCircleRounded,
    PendingRounded,
    PeopleRounded,
    PersonRounded,
    ShieldRounded,
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

    const metricCards = [
        { label: 'Total Users', value: Number(stats.totalUsers || 0), icon: <PeopleRounded />, tone: colors.newsprint },
        { label: 'Active', value: Number(stats.activeUsers || 0), icon: <CheckCircleRounded />, tone: '#2e7d32' },
        { label: 'Writers', value: Number(stats.writers || 0), icon: <PersonRounded />, tone: colors.accent1 || colors.accent },
        { label: 'Editors', value: Number(stats.editors || 0), icon: <PersonRounded />, tone: colors.accent2 || colors.byline },
        { label: 'Students', value: Number(stats.students || 0), icon: <ShieldRounded />, tone: colors.newsprint },
        { label: 'Pending', value: Number(stats.pendingUsers || 0), icon: <PendingRounded />, tone: '#ed6c02' },
    ];

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

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(6,1fr)' },
                            gap: 1.5,
                            mb: 2,
                        }}
                    >
                        {metricCards.map((card) => (
                            <Card key={card.label} elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" sx={{ color: colors.byline }}>
                                            {card.label}
                                        </Typography>
                                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: alpha(card.tone, 0.14), color: card.tone, display: 'grid', placeItems: 'center' }}>
                                            {card.icon}
                                        </Box>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: colors.newsprint }}>
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
                            gap: 1.5,
                        }}
                    >
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.5 }}>
                                    Live Reports
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} mb={2}>
                                    <Chip label={`Total Articles: ${Number(stats.totalArticles || 0)}`} />
                                    <Chip label={`Published: ${Number(stats.publishedArticles || 0)}`} color="success" />
                                    <Chip label={`Pending: ${Number(stats.pendingArticles || 0)}`} color="warning" />
                                    <Chip label={`Public: ${Number(stats.publicArticles || 0)}`} />
                                    <Chip label={`Comments: ${Number(stats.totalComments || 0)}`} />
                                    <Chip label={`New Users Today: ${Number(stats.newUsersToday || 0)}`} />
                                    <Chip label={`Comments Today: ${Number(stats.newCommentsToday || 0)}`} />
                                </Stack>

                                <Typography variant="subtitle2" sx={{ color: colors.byline, mb: 1 }}>
                                    7-Day Activity
                                </Typography>
                                <List dense disablePadding>
                                    {activity.map((row) => {
                                        const dayTotal = Number(row.newUsers || 0) + Number(row.publishedArticles || 0) + Number(row.newComments || 0);
                                        return (
                                            <ListItem key={row.date} sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography fontWeight={700}>{row.label}</Typography>
                                                            <Typography variant="body2" sx={{ color: colors.byline }}>
                                                                {dayTotal} events
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                    secondary={`Users ${row.newUsers} · Articles ${row.publishedArticles} · Comments ${row.newComments}`}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                    {activity.length === 0 && (
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemText primary="No activity data available." />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>

                        <Stack spacing={1.5}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1 }}>
                                        Recent Managed Users
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Roles</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentUsers.map((user) => (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={user.account_status} color={statusColor(user.account_status)} />
                                                    </TableCell>
                                                    <TableCell>{Array.isArray(user.roles) ? user.roles.join(', ') : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                            {recentUsers.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3}>No managed users found.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1 }}>
                                        Recent Articles
                                    </Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Comments</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentArticles.map((article) => (
                                                <TableRow key={article.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>{article.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {article.author || 'Unknown'} · {formatDate(article.published_at || article.created_at)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={article.status} color={statusColor(article.status)} />
                                                    </TableCell>
                                                    <TableCell>{Number(article.comments_count || 0)}</TableCell>
                                                </TableRow>
                                            ))}
                                            {recentArticles.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3}>No articles found.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </MuiThemeProvider>
    );
}


