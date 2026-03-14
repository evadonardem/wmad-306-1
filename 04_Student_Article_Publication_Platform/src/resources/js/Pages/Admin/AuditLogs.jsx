import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    alpha,
    Box,
    Card,
    CardContent,
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
    Button,
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import AdminTopBar from './Components/AdminTopBar';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

export default function AuditLogs({
    logs,
    filters = {},
    actionOptions = [],
    actorOptions = [],
    entityTypeOptions = [],
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
        actor: filters.actor || '',
        entity_type: filters.entity_type || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        sort: filters.sort || 'newest',
        per_page: Number(filters.per_page || logs?.per_page || 25),
    });

    const rows = logs?.data || [];
    const page = Math.max(0, (logs?.current_page || 1) - 1);
    const total = logs?.total || 0;

    const apply = (next) => {
        router.get(route('admin.audit-logs.index'), { ...next, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Head title="System Audit Logs" />
            <Box sx={{ minHeight: '100vh', bgcolor: colors.paper, color: colors.ink }}>
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <AdminTopBar active="audit" />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                            System Audit Logs
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.byline }}>
                            Accountability records for role switches and admin account operations.
                        </Typography>
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                                <TextField
                                    size="small"
                                    label="Search action/entity/actor"
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
                                    <InputLabel>Actor</InputLabel>
                                    <Select
                                        value={localFilters.actor}
                                        label="Actor"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, actor: e.target.value }))}
                                    >
                                        <MenuItem value="">All actors</MenuItem>
                                        {actorOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 170 }}>
                                    <InputLabel>Entity Type</InputLabel>
                                    <Select
                                        value={localFilters.entity_type}
                                        label="Entity Type"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, entity_type: e.target.value }))}
                                    >
                                        <MenuItem value="">All entities</MenuItem>
                                        {entityTypeOptions.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

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

                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel>Sort</InputLabel>
                                    <Select
                                        value={localFilters.sort}
                                        label="Sort"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, sort: e.target.value }))}
                                    >
                                        <MenuItem value="newest">Newest</MenuItem>
                                        <MenuItem value="oldest">Oldest</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button variant="contained" onClick={() => apply(localFilters)}>
                                    Apply
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const reset = {
                                            search: '',
                                            action: 'all',
                                            actor: '',
                                            entity_type: '',
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
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Actor</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Entity</TableCell>
                                        <TableCell>State Change</TableCell>
                                        <TableCell>Note</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((log) => (
                                        <TableRow key={log.id} hover>
                                            <TableCell>{formatDate(log.created_at)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{log.actor?.name || 'System'}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    {log.actor?.email || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{log.entity_type || '-'}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    {log.entity_label || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>
                                                    {`${log.previous_state || '-'} -> ${log.new_state || '-'}`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{log.note || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>No audit entries found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(_, nextPage) => {
                                    router.get(route('admin.audit-logs.index'), {
                                        ...localFilters,
                                        page: nextPage + 1,
                                    }, {
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
