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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
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
    AddRounded,
    DeleteRounded,
    EditRounded,
    GroupsRounded,
    PendingRounded,
    SchoolRounded,
    SearchRounded,
    TuneRounded,
    VerifiedRounded,
    WarningAmberRounded,
} from '@mui/icons-material';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';
import AdminTopBar from './Components/AdminTopBar';

const ACCOUNT_STATUSES = ['active', 'pending', 'suspended', 'deleted'];

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

function statusColor(status) {
    if (status === 'active') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'suspended') return 'error';
    return 'default';
}

function normalizeForm(form, isEdit = false) {
    return {
        id: form.id || null,
        name: form.name || '',
        email: form.email || '',
        roles: Array.isArray(form.roles) ? form.roles : [],
        account_status: form.account_status || 'active',
        temporary_password: isEdit ? undefined : (form.temporary_password || ''),
    };
}

function hasRole(user, role) {
    return Array.isArray(user.roles) && user.roles.includes(role);
}

export default function Users({ users = [], roles = [] }) {
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

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [createForm, setCreateForm] = useState(normalizeForm({ account_status: 'active' }));
    const [editForm, setEditForm] = useState(normalizeForm({ account_status: 'active' }, true));
    const [targetUser, setTargetUser] = useState(null);

    const [createErrors, setCreateErrors] = useState({});
    const [editErrors, setEditErrors] = useState({});

    const summary = useMemo(() => {
        const total = users.length;
        const active = users.filter((u) => u.account_status === 'active').length;
        const pending = users.filter((u) => u.account_status === 'pending').length;
        const suspended = users.filter((u) => u.account_status === 'suspended').length;
        const students = users.filter((u) => hasRole(u, 'student')).length;
        const verifiedRate = total ? Math.round((active / total) * 100) : 0;

        return {
            total,
            active,
            pending,
            suspended,
            students,
            verifiedRate,
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        const base = users.filter((user) => {
            const name = String(user.name || '').toLowerCase();
            const email = String(user.email || '').toLowerCase();
            const userRoles = Array.isArray(user.roles) ? user.roles : [];

            const matchesKeyword = !keyword || name.includes(keyword) || email.includes(keyword);
            const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
            const matchesRole = roleFilter === 'all' || userRoles.includes(roleFilter);

            return matchesKeyword && matchesStatus && matchesRole;
        });

        base.sort((a, b) => {
            if (sortBy === 'name-asc') return String(a.name || '').localeCompare(String(b.name || ''));
            if (sortBy === 'name-desc') return String(b.name || '').localeCompare(String(a.name || ''));

            const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
            if (sortBy === 'oldest') return aDate - bDate;
            return bDate - aDate;
        });

        return base;
    }, [users, search, statusFilter, roleFilter, sortBy]);

    const pagedUsers = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, page, rowsPerPage]);

    const resetCreate = () => {
        setCreateForm(normalizeForm({ account_status: 'active' }));
        setCreateErrors({});
    };

    const openEdit = (user) => {
        setEditForm(normalizeForm({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            account_status: user.account_status,
        }, true));
        setEditErrors({});
        setEditOpen(true);
    };

    const submitCreate = () => {
        const payload = normalizeForm(createForm);
        router.post('/admin/users', payload, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateOpen(false);
                resetCreate();
            },
            onError: (errors) => setCreateErrors(errors || {}),
        });
    };

    const submitEdit = () => {
        if (!editForm.id) return;

        const payload = normalizeForm(editForm, true);
        delete payload.temporary_password;

        router.patch(`/admin/users/${editForm.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditForm(normalizeForm({ account_status: 'active' }, true));
            },
            onError: (errors) => setEditErrors(errors || {}),
        });
    };

    const submitDelete = () => {
        if (!targetUser?.id) return;

        router.delete(`/admin/users/${targetUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setTargetUser(null);
            },
        });
    };

    const updateStatus = (user, status) => {
        router.patch(
            `/admin/users/${user.id}/status`,
            { account_status: status },
            { preserveScroll: true },
        );
    };

    const metricCards = [
        {
            key: 'total',
            label: 'Total Accounts',
            value: summary.total,
            note: `${summary.active} active accounts`,
            icon: <GroupsRounded fontSize="small" />,
            tone: colors.newsprint,
            progress: 100,
        },
        {
            key: 'students',
            label: 'Students',
            value: summary.students,
            note: 'Eligible for writer/editor applications',
            icon: <SchoolRounded fontSize="small" />,
            tone: colors.accent,
            progress: summary.total ? Math.round((summary.students / summary.total) * 100) : 0,
        },
        {
            key: 'health',
            label: 'Account Health',
            value: `${summary.verifiedRate}%`,
            note: `${summary.suspended} suspended`,
            icon: <VerifiedRounded fontSize="small" />,
            tone: '#2e7d32',
            progress: summary.verifiedRate,
        },
    ];

    const queueItems = [
        {
            key: 'pending',
            label: 'Pending approvals',
            count: summary.pending,
            action: () => {
                setStatusFilter('pending');
                setPage(0);
            },
        },
        {
            key: 'suspended',
            label: 'Suspended accounts',
            count: summary.suspended,
            action: () => {
                setStatusFilter('suspended');
                setPage(0);
            },
        },
    ];

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Head title="Admin User Management" />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: colors.paper,
                    color: colors.ink,
                    transition: 'background-color 220ms ease, color 220ms ease',
                }}
            >
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    <AdminTopBar active="users" />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>User Administration</Typography>
                        <Typography variant="body2" sx={{ color: colors.byline }}>
                            Prioritize approvals and account issues, then manage role and status lifecycle.
                        </Typography>
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.25}>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {queueItems.map((item) => (
                                        <Chip
                                            key={item.key}
                                            icon={<WarningAmberRounded />}
                                            label={`${item.label}: ${item.count}`}
                                            color={item.count > 0 ? 'warning' : 'default'}
                                            onClick={item.action}
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" startIcon={<TuneRounded />} onClick={() => { setSearch(''); setStatusFilter('all'); setRoleFilter('all'); setSortBy('newest'); setPage(0); }}>
                                        Reset Filters
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddRounded />}
                                        onClick={() => {
                                            resetCreate();
                                            setCreateOpen(true);
                                        }}
                                        sx={{
                                            bgcolor: colors.newsprint,
                                            '&:hover': { bgcolor: colors.accent },
                                        }}
                                    >
                                        Add User
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.25, mb: 2 }}>
                        {metricCards.map((card) => (
                            <Card key={card.key} elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                                        <Typography variant="caption" sx={{ color: colors.byline, textTransform: 'uppercase', letterSpacing: 0.6 }}>{card.label}</Typography>
                                        <Box className="icon-shell" data-icon-shell="true" sx={{ display: 'inline-flex', p: 0.75, borderRadius: 2, bgcolor: alpha(card.tone, 0.12), color: card.tone }}>{card.icon}</Box>
                                    </Stack>
                                    <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>{card.value}</Typography>
                                    <Typography variant="caption" sx={{ color: colors.byline, display: 'block', mb: 1 }}>{card.note}</Typography>
                                    <LinearProgress variant="determinate" value={card.progress} sx={{ height: 6, borderRadius: 10, bgcolor: alpha(colors.border, 0.4), '& .MuiLinearProgress-bar': { bgcolor: card.tone } }} />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ flex: 1 }}>
                                    <TextField
                                        size="small"
                                        label="Search name/email"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(0);
                                        }}
                                        fullWidth
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>) }}
                                    />

                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                                            <MenuItem value="all">All</MenuItem>
                                            {ACCOUNT_STATUSES.map((status) => (
                                                <MenuItem key={status} value={status}>{status}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Role</InputLabel>
                                        <Select value={roleFilter} label="Role" onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}>
                                            <MenuItem value="all">All</MenuItem>
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>{role}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Sort</InputLabel>
                                        <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
                                            <MenuItem value="newest">Newest</MenuItem>
                                            <MenuItem value="oldest">Oldest</MenuItem>
                                            <MenuItem value="name-asc">Name A-Z</MenuItem>
                                            <MenuItem value="name-desc">Name Z-A</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <Chip label={`${filteredUsers.length} matches`} color="info" variant="outlined" />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.5 }}>
                                Managed Accounts
                            </Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Roles</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedUsers.map((user) => {
                                        const nextStatus = user.account_status === 'suspended' ? 'active' : 'suspended';
                                        const quickActionLabel = nextStatus === 'suspended' ? 'Disable' : 'Activate';

                                        return (
                                            <TableRow key={user.id} hover>
                                                <TableCell>
                                                    <Typography fontWeight={700}>{user.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: colors.byline }}>{user.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                        {(user.roles || []).map((role) => (
                                                            <Chip key={role} label={role} size="small" />
                                                        ))}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={user.account_status} color={statusColor(user.account_status)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{formatDate(user.created_at)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                        <Tooltip title="Edit user">
                                                            <Button size="small" variant="outlined" startIcon={<EditRounded />} onClick={() => openEdit(user)}>
                                                                Edit
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title={`${quickActionLabel} account`}>
                                                            <Button size="small" variant="contained" color={nextStatus === 'suspended' ? 'warning' : 'success'} startIcon={nextStatus === 'suspended' ? <PendingRounded fontSize="small" /> : <VerifiedRounded fontSize="small" />} onClick={() => updateStatus(user, nextStatus)}>
                                                                {quickActionLabel}
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Delete user">
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                                startIcon={<DeleteRounded />}
                                                                onClick={() => {
                                                                    setTargetUser(user);
                                                                    setDeleteOpen(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {pagedUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5}>No users found for the current filters.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={filteredUsers.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create Managed User</DialogTitle>
                <DialogContent>
                    <Stack spacing={1.25} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            value={createForm.name}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                            error={Boolean(createErrors.name)}
                            helperText={createErrors.name}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={createForm.email}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                            error={Boolean(createErrors.email)}
                            helperText={createErrors.email}
                            fullWidth
                        />
                        <FormControl error={Boolean(createErrors.roles)}>
                            <InputLabel>Roles</InputLabel>
                            <Select
                                multiple
                                value={createForm.roles}
                                label="Roles"
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, roles: e.target.value }))}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                            {createErrors.roles && (
                                <Typography variant="caption" color="error">{createErrors.roles}</Typography>
                            )}
                        </FormControl>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={createForm.account_status}
                                label="Status"
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, account_status: e.target.value }))}
                            >
                                {ACCOUNT_STATUSES.map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Temporary Password (optional)"
                            value={createForm.temporary_password}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, temporary_password: e.target.value }))}
                            error={Boolean(createErrors.temporary_password)}
                            helperText={createErrors.temporary_password}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button onClick={submitCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Stack spacing={1.25} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            error={Boolean(editErrors.name)}
                            helperText={editErrors.name}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                            error={Boolean(editErrors.email)}
                            helperText={editErrors.email}
                            fullWidth
                        />
                        <FormControl error={Boolean(editErrors.roles)}>
                            <InputLabel>Roles</InputLabel>
                            <Select
                                multiple
                                value={editForm.roles}
                                label="Roles"
                                onChange={(e) => setEditForm((prev) => ({ ...prev, roles: e.target.value }))}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                            {editErrors.roles && (
                                <Typography variant="caption" color="error">{editErrors.roles}</Typography>
                            )}
                        </FormControl>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editForm.account_status}
                                label="Status"
                                onChange={(e) => setEditForm((prev) => ({ ...prev, account_status: e.target.value }))}
                            >
                                {ACCOUNT_STATUSES.map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={submitEdit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete <strong>{targetUser?.name || 'this user'}</strong>? This action sets account status to deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={submitDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </MuiThemeProvider>
    );
}
