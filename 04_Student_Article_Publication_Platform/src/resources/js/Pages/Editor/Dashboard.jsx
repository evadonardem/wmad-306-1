import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputAdornment,
    InputLabel,
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
    Typography,
} from '@mui/material';
import { AssignmentIndRounded, ChecklistRounded, SearchRounded } from '@mui/icons-material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import EditorLayout from '@/Layouts/EditorLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

function getStatusLabel(article) {
    return article?.status?.name || 'Unknown';
}

export default function Dashboard({ queueArticles = [], myClaimedArticles = [], kpis = {}, availableRoles = [] }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);
    const [queueSearch, setQueueSearch] = useState('');
    const [queueSort, setQueueSort] = useState('submitted_newest');
    const [queuePage, setQueuePage] = useState(0);
    const [queueRowsPerPage, setQueueRowsPerPage] = useState(10);

    const kpiCards = [
        {
            key: 'queue',
            title: 'Unclaimed Queue',
            value: Number(kpis.queueCount || 0),
            helper: 'Submitted entries waiting for first claim',
            icon: <ChecklistRounded fontSize="small" />,
            tone: colors.newsprint,
        },
        {
            key: 'claims',
            title: 'My Claimed Reviews',
            value: Number(kpis.myClaimsCount || 0),
            helper: 'Entries currently assigned to you',
            icon: <AssignmentIndRounded fontSize="small" />,
            tone: colors.accent,
        },
    ];

    const workflowBars = useMemo(
        () => [
            { name: 'Queue', value: Number(kpis.queueCount || 0) },
            { name: 'My Claims', value: Number(kpis.myClaimsCount || 0) },
            {
                name: 'Published',
                value: Number(
                    [...queueArticles, ...myClaimedArticles].filter((a) => String(a?.status?.slug || '').toLowerCase() === 'published')
                        .length,
                ),
            },
        ],
        [kpis.queueCount, kpis.myClaimsCount, queueArticles, myClaimedArticles],
    );

    const filteredQueue = useMemo(() => {
        const keyword = queueSearch.trim().toLowerCase();
        const rows = queueArticles.filter((article) => {
            const title = String(article.title || '').toLowerCase();
            const author = String(article.author?.name || '').toLowerCase();
            return !keyword || title.includes(keyword) || author.includes(keyword);
        });

        rows.sort((a, b) => {
            if (queueSort === 'title_asc') return String(a.title || '').localeCompare(String(b.title || ''));
            if (queueSort === 'title_desc') return String(b.title || '').localeCompare(String(a.title || ''));
            if (queueSort === 'submitted_oldest') return new Date(a.submitted_at || 0) - new Date(b.submitted_at || 0);
            return new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0);
        });

        return rows;
    }, [queueArticles, queueSearch, queueSort]);

    const pagedQueue = filteredQueue.slice(queuePage * queueRowsPerPage, queuePage * queueRowsPerPage + queueRowsPerPage);

    return (
        <EditorLayout active="queue" availableRoles={availableRoles}>
            <Head title="Editor Review Queue" />

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                    Review Queue
                </Typography>
                <Typography variant="body2" sx={{ color: colors.byline }}>
                    Claim submitted entries, complete review actions, and keep the queue moving.
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 1.5, mb: 2 }}>
                {kpiCards.map((card) => (
                    <Card key={card.key} elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body2" sx={{ color: colors.byline, fontWeight: 700 }}>
                                    {card.title}
                                </Typography>
                                <Box
                                    className="icon-shell"
                                    data-icon-shell="true"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        display: 'grid',
                                        placeItems: 'center',
                                        borderRadius: '50%',
                                        bgcolor: alpha(card.tone, 0.14),
                                        color: card.tone,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                            </Stack>
                            <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>
                                {card.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                {card.helper}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.5 }}>
                        Editorial Throughput
                    </Typography>
                    <Box sx={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workflowBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke={alpha(colors.border, 0.5)} strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fill: colors.byline, fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fill: colors.byline, fontSize: 11 }} />
                                <RechartsTooltip
                                    contentStyle={{
                                        border: `1px solid ${colors.border}`,
                                        background: colors.paper,
                                        color: colors.newsprint,
                                    }}
                                />
                                <Bar dataKey="value" fill={colors.accent} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        spacing={1}
                        mb={1.5}
                    >
                        <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>
                            Unclaimed Submissions
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <TextField
                                size="small"
                                label="Search title/author"
                                value={queueSearch}
                                onChange={(e) => {
                                    setQueueSearch(e.target.value);
                                    setQueuePage(0);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRounded fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Sort</InputLabel>
                                <Select
                                    value={queueSort}
                                    label="Sort"
                                    onChange={(e) => {
                                        setQueueSort(e.target.value);
                                        setQueuePage(0);
                                    }}
                                >
                                    <MenuItem value="submitted_newest">Submitted newest</MenuItem>
                                    <MenuItem value="submitted_oldest">Submitted oldest</MenuItem>
                                    <MenuItem value="title_asc">Title A-Z</MenuItem>
                                    <MenuItem value="title_desc">Title Z-A</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Article</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Submitted</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagedQueue.map((article) => (
                                <TableRow key={article.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{article.title}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.byline }}>
                                            {article.author?.name || 'Unknown'} | {article.category?.name || 'Uncategorized'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="small" label={getStatusLabel(article)} />
                                    </TableCell>
                                    <TableCell>{formatDate(article.submitted_at)}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => router.post(route('editor.articles.claim', article.id), {}, { preserveScroll: true })}
                                            sx={{ bgcolor: colors.newsprint, '&:hover': { bgcolor: colors.accent } }}
                                        >
                                            Claim
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pagedQueue.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>No entries in queue for current filters.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={filteredQueue.length}
                        page={queuePage}
                        onPageChange={(_, newPage) => setQueuePage(newPage)}
                        rowsPerPage={queueRowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setQueueRowsPerPage(Number(e.target.value));
                            setQueuePage(0);
                        }}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.5 }}>
                        My Claimed Reviews
                    </Typography>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Article</TableCell>
                                <TableCell>Claimed At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myClaimedArticles.map((article) => (
                                <TableRow key={article.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{article.title}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.byline }}>
                                            {article.author?.name || 'Unknown'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatDate(article.claimed_at)}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => router.visit(route('editor.articles.show', article.id))}
                                            >
                                                Open Review
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => router.post(route('editor.articles.release', article.id), {}, { preserveScroll: true })}
                                            >
                                                Release
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {myClaimedArticles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>You have no claimed entries right now.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </EditorLayout>
    );
}
