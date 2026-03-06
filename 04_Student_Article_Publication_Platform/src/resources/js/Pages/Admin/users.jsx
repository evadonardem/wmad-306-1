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
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    createTheme
} from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AddRounded, DeleteRounded, EditRounded } from '@mui/icons-material';
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

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [createForm, setCreateForm] = useState(normalizeForm({ account_status: 'active' }));
    const [editForm, setEditForm] = useState(normalizeForm({ account_status: 'active' }, true));
    const [targetUser, setTargetUser] = useState(null);

    const [createErrors, setCreateErrors] = useState({});
    const [editErrors, setEditErrors] = useState({});

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return users.filter((user) => {
            const name = String(user.name || '').toLowerCase();
            const email = String(user.email || '').toLowerCase();
            const userRoles = Array.isArray(user.roles) ? user.roles : [];

            const matchesKeyword = !keyword || name.includes(keyword) || email.includes(keyword);
            const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
            const matchesRole = roleFilter === 'all' || userRoles.includes(roleFilter);

            return matchesKeyword && matchesStatus && matchesRole;
        });
    }, [users, search, statusFilter, roleFilter]);

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

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={1.25}
                                alignItems={{ xs: 'stretch', md: 'center' }}
                                justifyContent="space-between"
                            >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ flex: 1 }}>
                                    <TextField
                                        size="small"
                                        label="Search name/email"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        fullWidth
                                    />

                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                                            <MenuItem value="all">All</MenuItem>
                                            {ACCOUNT_STATUSES.map((status) => (
                                                <MenuItem key={status} value={status}>{status}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <InputLabel>Role</InputLabel>
                                        <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
                                            <MenuItem value="all">All</MenuItem>
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>{role}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>

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
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.5 }}>
                                Managed Accounts ({filteredUsers.length})
                            </Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Roles</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>
                                                <Typography fontWeight={700}>{user.name}</Typography>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    {(user.roles || []).map((role) => (
                                                        <Chip key={role} label={role} size="small" />
                                                    ))}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 130 }}>
                                                    <Select
                                                        value={user.account_status}
                                                        onChange={(e) => updateStatus(user, e.target.value)}
                                                    >
                                                        {ACCOUNT_STATUSES.map((status) => (
                                                            <MenuItem key={status} value={status}>{status}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{formatDate(user.created_at)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                    <Chip size="small" label={user.account_status} color={statusColor(user.account_status)} />
                                                    <IconButton size="small" onClick={() => openEdit(user)}>
                                                        <EditRounded fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            setTargetUser(user);
                                                            setDeleteOpen(true);
                                                        }}
                                                    >
                                                        <DeleteRounded fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6}>No users found for the current filters.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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

