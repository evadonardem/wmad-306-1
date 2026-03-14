import { Head, router } from '@inertiajs/react';
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
import { useMemo, useState } from 'react';
import EditorLayout from '@/Layouts/EditorLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

function workflowChipColor(workflow) {
    if (workflow === 'published') return 'success';
    if (workflow === 'rejected') return 'error';
    if (workflow === 'returned_for_revision') return 'warning';
    if (workflow === 'in_review') return 'info';
    return 'default';
}

function workflowLabel(workflow) {
    return {
        pending_review: 'Pending Review',
        in_review: 'In Review',
        returned_for_revision: 'Returned for Revision',
        rejected: 'Rejected',
        published: 'Published',
    }[workflow] || workflow || 'Unknown';
}

export default function Tracking({
    records,
    filters = {},
    statusOptions = [],
    authorOptions = [],
    reviewerOptions = [],
    dateFieldOptions = [],
    sortOptions = [],
    availableRoles = [],
}) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        status: filters.status || 'all',
        author: filters.author || '',
        reviewer: filters.reviewer || '',
        date_field: filters.date_field || 'activity',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        sort: filters.sort || 'activity_newest',
        per_page: Number(filters.per_page || records?.per_page || 10),
    });

    const rows = useMemo(() => records?.data || [], [records?.data]);
    const page = Math.max(0, (records?.current_page || 1) - 1);
    const total = records?.total || 0;
    const perPage = Number(localFilters.per_page || 10);

    const syncFilters = (nextFilters) => {
        router.get(
            route('editor.tracking.index'),
            {
                ...nextFilters,
                page: 1,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <EditorLayout active="tracking" availableRoles={availableRoles}>
            <Head title="Editorial Tracking" />

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                    Editorial Tracking
                </Typography>
                <Typography variant="body2" sx={{ color: colors.byline }}>
                    Filterable accountability table for reviewed entries across reviewers, authors, status, and date windows.
                </Typography>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
                        <TextField
                            size="small"
                            label="Search Article Title"
                            value={localFilters.search}
                            onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    syncFilters(localFilters);
                                }
                            }}
                            sx={{ minWidth: 240 }}
                        />

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={localFilters.status}
                                label="Status"
                                onChange={(e) => {
                                    const next = { ...localFilters, status: e.target.value };
                                    setLocalFilters(next);
                                    syncFilters(next);
                                }}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Author</InputLabel>
                            <Select
                                value={localFilters.author}
                                label="Author"
                                onChange={(e) => {
                                    const next = { ...localFilters, author: e.target.value };
                                    setLocalFilters(next);
                                    syncFilters(next);
                                }}
                            >
                                <MenuItem value="">All authors</MenuItem>
                                {authorOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Reviewer</InputLabel>
                            <Select
                                value={localFilters.reviewer}
                                label="Reviewer"
                                onChange={(e) => {
                                    const next = { ...localFilters, reviewer: e.target.value };
                                    setLocalFilters(next);
                                    syncFilters(next);
                                }}
                            >
                                <MenuItem value="">All reviewers</MenuItem>
                                {reviewerOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 190 }}>
                            <InputLabel>Date Field</InputLabel>
                            <Select
                                value={localFilters.date_field}
                                label="Date Field"
                                onChange={(e) => {
                                    const next = { ...localFilters, date_field: e.target.value };
                                    setLocalFilters(next);
                                    syncFilters(next);
                                }}
                            >
                                {dateFieldOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            type="date"
                            label="Date From"
                            InputLabelProps={{ shrink: true }}
                            value={localFilters.date_from}
                            onChange={(e) => {
                                const next = { ...localFilters, date_from: e.target.value };
                                setLocalFilters(next);
                                syncFilters(next);
                            }}
                        />

                        <TextField
                            size="small"
                            type="date"
                            label="Date To"
                            InputLabelProps={{ shrink: true }}
                            value={localFilters.date_to}
                            onChange={(e) => {
                                const next = { ...localFilters, date_to: e.target.value };
                                setLocalFilters(next);
                                syncFilters(next);
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Sort</InputLabel>
                            <Select
                                value={localFilters.sort}
                                label="Sort"
                                onChange={(e) => {
                                    const next = { ...localFilters, sort: e.target.value };
                                    setLocalFilters(next);
                                    syncFilters(next);
                                }}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={() => syncFilters(localFilters)}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                const reset = {
                                    search: '',
                                    status: 'all',
                                    author: '',
                                    reviewer: '',
                                    date_field: 'activity',
                                    date_from: '',
                                    date_to: '',
                                    sort: 'activity_newest',
                                    per_page: 10,
                                };
                                setLocalFilters(reset);
                                syncFilters(reset);
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
                                <TableCell>Article Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Reviewer</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Submission Date</TableCell>
                                <TableCell>Review Date</TableCell>
                                <TableCell>Publish Date</TableCell>
                                <TableCell>Revision Return</TableCell>
                                <TableCell>Rejection Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{row.title}</Typography>
                                        {row.decision_note ? (
                                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                                Note: {row.decision_note}
                                            </Typography>
                                        ) : null}
                                    </TableCell>
                                    <TableCell>{row.author?.name || '-'}</TableCell>
                                    <TableCell>{row.reviewer?.name || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            color={workflowChipColor(row.status?.workflow)}
                                            label={workflowLabel(row.status?.workflow)}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(row.submitted_at)}</TableCell>
                                    <TableCell>{formatDate(row.reviewed_at)}</TableCell>
                                    <TableCell>{formatDate(row.published_at)}</TableCell>
                                    <TableCell>{formatDate(row.revision_returned_at)}</TableCell>
                                    <TableCell>{formatDate(row.rejected_at)}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => router.visit(`/articles/${row.id}`)}
                                        >
                                            Open
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10}>No matching editorial records found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(_, nextPage) => {
                            router.get(
                                route('editor.tracking.index'),
                                {
                                    ...localFilters,
                                    page: nextPage + 1,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        }}
                        rowsPerPage={perPage}
                        onRowsPerPageChange={(e) => {
                            const next = { ...localFilters, per_page: Number(e.target.value) };
                            setLocalFilters(next);
                            syncFilters(next);
                        }}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </CardContent>
            </Card>
        </EditorLayout>
    );
}
