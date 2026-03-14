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
    createTheme,
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { DownloadRounded } from '@mui/icons-material';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import AdminTopBar from './Components/AdminTopBar';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

export default function EditorialLogs({
    logs,
    filters = {},
    actionOptions = [],
    editorOptions = [],
    sortOptions = [],
}) {
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
            }),
        [colors],
    );

    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        action: filters.action || 'all',
        editor: filters.editor || '',
        status_from: filters.status_from || '',
        status_to: filters.status_to || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        sort: filters.sort || 'newest',
        per_page: Number(filters.per_page || logs?.per_page || 25),
    });

    const rows = logs?.data || [];
    const page = Math.max(0, (logs?.current_page || 1) - 1);
    const total = logs?.total || 0;

    const apply = (next) => {
        router.get(route('admin.editorial-logs.index'), { ...next, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const exportCsv = () => {
        const params = new URLSearchParams(
            Object.entries(localFilters).reduce((acc, [key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    acc[key] = String(value);
                }
                return acc;
            }, {}),
        );
        window.location.href = `${route('admin.editorial-logs.export')}?${params.toString()}`;
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Head title="Editorial Logs" />
            <Box sx={{ minHeight: '100vh', bgcolor: colors.paper, color: colors.ink }}>
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <AdminTopBar active="logs" />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                            Editorial Accountability Logs
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.byline }}>
                            Filter and export editorial decisions, status transitions, and acting users.
                        </Typography>
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                                <TextField
                                    size="small"
                                    label="Search article/editor/action"
                                    value={localFilters.search}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') apply(localFilters);
                                    }}
                                    sx={{ minWidth: 240 }}
                                />

                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Action</InputLabel>
                                    <Select
                                        value={localFilters.action}
                                        label="Action"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, action: e.target.value }))}
                                    >
                                        <MenuItem value="all">All actions</MenuItem>
                                        {actionOptions.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Editor</InputLabel>
                                    <Select
                                        value={localFilters.editor}
                                        label="Editor"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, editor: e.target.value }))}
                                    >
                                        <MenuItem value="">All editors</MenuItem>
                                        {editorOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    size="small"
                                    label="From Status"
                                    value={localFilters.status_from}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, status_from: e.target.value }))}
                                />

                                <TextField
                                    size="small"
                                    label="To Status"
                                    value={localFilters.status_to}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, status_to: e.target.value }))}
                                />

                                <TextField
                                    size="small"
                                    type="date"
                                    label="Date From"
                                    InputLabelProps={{ shrink: true }}
                                    value={localFilters.date_from}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, date_from: e.target.value }))}
                                />

                                <TextField
                                    size="small"
                                    type="date"
                                    label="Date To"
                                    InputLabelProps={{ shrink: true }}
                                    value={localFilters.date_to}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, date_to: e.target.value }))}
                                />

                                <FormControl size="small" sx={{ minWidth: 170 }}>
                                    <InputLabel>Sort</InputLabel>
                                    <Select
                                        value={localFilters.sort}
                                        label="Sort"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, sort: e.target.value }))}
                                    >
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" onClick={() => apply(localFilters)}>
                                        Apply
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            const reset = {
                                                search: '',
                                                action: 'all',
                                                editor: '',
                                                status_from: '',
                                                status_to: '',
                                                date_from: '',
                                                date_to: '',
                                                sort: 'newest',
                                                per_page: 25,
                                            };
                                            setLocalFilters(reset);
                                            apply(reset);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button variant="outlined" startIcon={<DownloadRounded />} onClick={exportCsv}>
                                        Export CSV
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Article</TableCell>
                                        <TableCell>Actor</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Status Transition</TableCell>
                                        <TableCell>Note</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((log) => (
                                        <TableRow key={log.id} hover>
                                            <TableCell>{formatDate(log.created_at)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>{log.article_title}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    ID: {log.article_id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{log.actor?.name || 'Unknown'}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    {log.actor?.email || '-'} | {log.acting_role}
                                                </Typography>
                                            </TableCell>
                                            <TableCell><Chip size="small" label={log.action} /></TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {(log.previous_status || 'none')} {'>'} {(log.new_status || 'none')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    {log.note || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>No editorial logs found for current filters.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(_, nextPage) => {
                                    router.get(route('admin.editorial-logs.index'), { ...localFilters, page: nextPage + 1 }, {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    });
                                }}
                                rowsPerPage={Number(localFilters.per_page || 25)}
                                onRowsPerPageChange={(e) => {
                                    const next = { ...localFilters, per_page: Number(e.target.value) };
                                    setLocalFilters(next);
                                    apply(next);
                                }}
                                rowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </MuiThemeProvider>
    );
}
