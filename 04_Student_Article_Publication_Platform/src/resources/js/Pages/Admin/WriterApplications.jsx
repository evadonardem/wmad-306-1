import { Head, router, useForm } from '@inertiajs/react';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import AdminTopBar from './Components/AdminTopBar';

function statusColor(status) {
    if (status === 'accepted') return 'success';
    if (status === 'rejected') return 'error';
    return 'warning';
}

function shortText(value, length = 120) {
    const text = String(value || '');
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
}

export default function WriterApplications({ applications, filters = {}, statusOptions = [] }) {
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

    const rows = applications?.data || [];
    const page = Math.max(0, (applications?.current_page || 1) - 1);
    const total = applications?.total || 0;

    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        status: filters.status || 'all',
        sort: filters.sort || 'newest',
        per_page: Number(filters.per_page || applications?.per_page || 25),
    });

    const [decisionTarget, setDecisionTarget] = useState(null);
    const [decisionType, setDecisionType] = useState('accept');

    const decisionForm = useForm({
        admin_notes: '',
    });

    const apply = (next) => {
        router.get(route('admin.writer-applications.index'), { ...next, page: 1 }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const openDecisionDialog = (row, type) => {
        setDecisionTarget(row);
        setDecisionType(type);
        decisionForm.setData('admin_notes', '');
        decisionForm.clearErrors();
    };

    const submitDecision = () => {
        if (!decisionTarget?.id) return;
        const routeName = decisionType === 'accept'
            ? 'admin.writer-applications.accept'
            : 'admin.writer-applications.reject';

        decisionForm.post(route(routeName, decisionTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDecisionTarget(null);
                decisionForm.reset();
            },
        });
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Head title="Writer Applications" />
            <Box sx={{ minHeight: '100vh', bgcolor: colors.paper, color: colors.ink }}>
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <AdminTopBar active="applications" />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                            Writer Applications
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.byline }}>
                            Review student applications and send approval or rejection decisions by email.
                        </Typography>
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                                <TextField
                                    size="small"
                                    label="Search student or content"
                                    value={localFilters.search}
                                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') apply(localFilters);
                                    }}
                                    sx={{ minWidth: 260 }}
                                />
                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={localFilters.status}
                                        label="Status"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, status: e.target.value }))}
                                    >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Sort</InputLabel>
                                    <Select
                                        value={localFilters.sort}
                                        label="Sort"
                                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, sort: e.target.value }))}
                                    >
                                        <MenuItem value="newest">Newest first</MenuItem>
                                        <MenuItem value="oldest">Oldest first</MenuItem>
                                        <MenuItem value="reviewed_newest">Recently reviewed</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="contained" onClick={() => apply(localFilters)}>Apply</Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const reset = { search: '', status: 'all', sort: 'newest', per_page: 25 };
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
                                        <TableCell>Applicant</TableCell>
                                        <TableCell>Motivation</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Submitted</TableCell>
                                        <TableCell>Reviewed</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>{row.applicant?.name || 'Unknown'}</Typography>
                                                <Typography variant="caption" sx={{ color: colors.byline }}>{row.applicant?.email || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>{shortText(row.motivation)}</TableCell>
                                            <TableCell>
                                                <Chip size="small" color={statusColor(row.status)} label={String(row.status || 'pending').toUpperCase()} />
                                            </TableCell>
                                            <TableCell>{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</TableCell>
                                            <TableCell>{row.reviewed_at ? new Date(row.reviewed_at).toLocaleString() : '-'}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        disabled={row.status !== 'pending'}
                                                        onClick={() => openDecisionDialog(row, 'reject')}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        disabled={row.status !== 'pending'}
                                                        onClick={() => openDecisionDialog(row, 'accept')}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>No applications found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(_, nextPage) => {
                                    router.get(route('admin.writer-applications.index'), { ...localFilters, page: nextPage + 1 }, {
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

            <Dialog open={Boolean(decisionTarget)} onClose={() => setDecisionTarget(null)} fullWidth maxWidth="sm">
                <DialogTitle>{decisionType === 'accept' ? 'Accept Application' : 'Reject Application'}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {decisionType === 'accept'
                            ? 'The applicant will be granted Writer role and receive a confirmation email.'
                            : 'The applicant will receive a rejection email with your note.'}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Admin note"
                        value={decisionForm.data.admin_notes}
                        onChange={(e) => decisionForm.setData('admin_notes', e.target.value)}
                        error={Boolean(decisionForm.errors.admin_notes)}
                        helperText={decisionForm.errors.admin_notes || (decisionType === 'accept' ? 'Optional note.' : 'Required for rejection.')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDecisionTarget(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={decisionType === 'accept' ? 'primary' : 'error'}
                        onClick={submitDecision}
                        disabled={decisionForm.processing}
                    >
                        {decisionForm.processing ? 'Sending...' : decisionType === 'accept' ? 'Accept & Email' : 'Reject & Email'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MuiThemeProvider>
    );
}
