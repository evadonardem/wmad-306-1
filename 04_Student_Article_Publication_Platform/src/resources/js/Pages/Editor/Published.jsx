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
import { PublicRounded, VisibilityRounded } from '@mui/icons-material';
import EditorLayout from '@/Layouts/EditorLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

function getLatestActionActorName(article) {
    const latestLog = Array.isArray(article?.editorial_logs) ? article.editorial_logs[0] : null;
    return latestLog?.actor?.name || null;
}

export default function Published({ publishedArticles = [], kpis = {}, availableRoles = [] }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('published_newest');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredPublished = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        const rows = publishedArticles.filter((article) => {
            const title = String(article.title || '').toLowerCase();
            const author = String(article.author?.name || '').toLowerCase();
            return !keyword || title.includes(keyword) || author.includes(keyword);
        });

        rows.sort((a, b) => {
            if (sort === 'title_asc') return String(a.title || '').localeCompare(String(b.title || ''));
            if (sort === 'title_desc') return String(b.title || '').localeCompare(String(a.title || ''));
            if (sort === 'published_oldest') return new Date(a.published_at || 0) - new Date(b.published_at || 0);
            return new Date(b.published_at || 0) - new Date(a.published_at || 0);
        });

        return rows;
    }, [publishedArticles, search, sort]);

    const pagedRows = filteredPublished.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <EditorLayout active="published" availableRoles={availableRoles}>
            <Head title="Published Articles" />

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                    Published Articles
                </Typography>
                <Typography variant="body2" sx={{ color: colors.byline }}>
                    Review all editor-published entries and approve public visibility.
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 1.5, mb: 2 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                    <CardContent>
                        <Typography variant="caption" sx={{ color: colors.byline }}>Total Published</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>
                            {Number(kpis.publishedCount || 0)}
                        </Typography>
                    </CardContent>
                </Card>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                    <CardContent>
                        <Typography variant="caption" sx={{ color: colors.byline }}>Public Articles</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>
                            {Number(kpis.publicApprovedCount || 0)}
                        </Typography>
                    </CardContent>
                </Card>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                    <CardContent>
                        <Typography variant="caption" sx={{ color: colors.byline }}>Internal Only</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>
                            {Number(kpis.internalOnlyCount || 0)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                <CardContent>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        spacing={1}
                        mb={1.5}
                    >
                        <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint }}>
                            Published Records
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <TextField
                                size="small"
                                label="Search title/author"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                            />
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Sort</InputLabel>
                                <Select
                                    value={sort}
                                    label="Sort"
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        setPage(0);
                                    }}
                                >
                                    <MenuItem value="published_newest">Published newest</MenuItem>
                                    <MenuItem value="published_oldest">Published oldest</MenuItem>
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
                                <TableCell>Visibility</TableCell>
                                <TableCell>Published</TableCell>
                                <TableCell>Acting Editor</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pagedRows.map((article) => (
                                <TableRow key={article.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{article.title}</Typography>
                                        <Typography variant="caption" sx={{ color: colors.byline }}>
                                            {article.author?.name || 'Unknown'} | {article.comments_count || 0} comments
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            icon={<PublicRounded fontSize="small" />}
                                            label={article.is_public ? 'Public' : 'Internal'}
                                            color={article.is_public ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(article.published_at)}</TableCell>
                                    <TableCell>{getLatestActionActorName(article) || article.public_approver?.name || '-'}</TableCell>
                                    <TableCell><Chip size="small" color="success" label={article.status?.name || 'Published'} /></TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<VisibilityRounded fontSize="small" />}
                                                onClick={() => router.visit(`/articles/${article.id}`)}
                                            >
                                                View
                                            </Button>
                                            {!article.is_public && (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<PublicRounded fontSize="small" />}
                                                    onClick={() =>
                                                        router.post(route('editor.articles.approvePublic', article.id), {}, { preserveScroll: true })
                                                    }
                                                    sx={{ bgcolor: colors.newsprint, '&:hover': { bgcolor: colors.accent } }}
                                                >
                                                    Approve Public
                                                </Button>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pagedRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>No published articles found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={filteredPublished.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </CardContent>
            </Card>
        </EditorLayout>
    );
}
