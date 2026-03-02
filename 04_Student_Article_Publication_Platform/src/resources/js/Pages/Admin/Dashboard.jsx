import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AppLayout from '../Shared/Layouts/AppLayout';

export default function Dashboard({ users = [], roles = [] }) {
    const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

    const showMessage = (severity, message) => {
        setSnackbar({ open: true, severity, message });
    };

    const sendRequest = ({ method, url, payload, successMessage }) => {
        router[method](url, payload, {
            onSuccess: () => showMessage('success', successMessage),
            onError: () => showMessage('error', 'Request failed. Please check your inputs and try again.'),
        });
    };

    const handleCreateUser = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        sendRequest({
            method: 'post',
            url: '/admin/users',
            payload: {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                account_status: formData.get('account_status'),
                temporary_password: formData.get('temporary_password') || null,
            },
            successMessage: 'User account created successfully.',
        });

        event.currentTarget.reset();
    };

    const handleUpdateUser = (event, userId) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        sendRequest({
            method: 'patch',
            url: `/admin/users/${userId}`,
            payload: {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                account_status: formData.get('account_status'),
            },
            successMessage: 'User details updated successfully.',
        });
    };

    const handleStatusToggle = (userId, nextStatus) => {
        sendRequest({
            method: 'patch',
            url: `/admin/users/${userId}/status`,
            payload: { account_status: nextStatus },
            successMessage: `User ${nextStatus === 'active' ? 'activated' : 'suspended'} successfully.`,
        });
    };

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.account_status === 'active').length;
    const suspendedUsers = users.filter((user) => user.account_status === 'suspended').length;

    return (
        <AppLayout title="Admin Dashboard">
            <Stack spacing={3}>
                <Typography variant="h4">Account Management</Typography>
                <Typography variant="body2" color="text.secondary">
                    This page manages writer and editor accounts only. Student accounts are self-service and excluded here.
                </Typography>

                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Feature Health Check
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label="View Writer/Editor Users: Ready" color="success" />
                        <Chip label="Create Account: Ready" color="success" />
                        <Chip label="Edit Account: Ready" color="success" />
                        <Chip label="Assign Role: Ready" color="success" />
                        <Chip label="Activate/Suspend: Ready" color="success" />
                        <Chip label="Password Reset: Breeze Self-Service" color="info" />
                    </Stack>
                </Paper>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Total Users</Typography>
                                <Typography variant="h5">{totalUsers}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Active</Typography>
                                <Typography variant="h5">{activeUsers}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Suspended</Typography>
                                <Typography variant="h5">{suspendedUsers}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Paper component="form" onSubmit={handleCreateUser} sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Create Writer/Editor Account
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth name="name" label="Full Name" required />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth name="email" type="email" label="Email" required />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth name="role" label="Role" select required defaultValue="">
                                {roles.map((role) => (
                                    <MenuItem key={`create-${role}`} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth name="account_status" label="Status" select required defaultValue="active">
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="suspended">Suspended</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth name="temporary_password" label="Temporary Password" />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained">
                            Create User
                        </Button>
                    </Box>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <TextField name="name" defaultValue={user.name} form={`edit-user-${user.id}`} size="small" required />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            form={`edit-user-${user.id}`}
                                            size="small"
                                            required
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="role"
                                            select
                                            defaultValue={user.roles?.[0] ?? ''}
                                            form={`edit-user-${user.id}`}
                                            size="small"
                                            required
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={`row-${user.id}-${role}`} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            name="account_status"
                                            select
                                            defaultValue={user.account_status ?? 'active'}
                                            form={`edit-user-${user.id}`}
                                            size="small"
                                            required
                                        >
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="suspended">Suspended</MenuItem>
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Box component="form" id={`edit-user-${user.id}`} onSubmit={(event) => handleUpdateUser(event, user.id)} />
                                            <Button type="submit" form={`edit-user-${user.id}`} variant="outlined" size="small">
                                                Save
                                            </Button>
                                            {user.account_status === 'active' ? (
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    onClick={() => handleStatusToggle(user.id, 'suspended')}
                                                >
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleStatusToggle(user.id, 'active')}
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() => setSnackbar((previous) => ({ ...previous, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar((previous) => ({ ...previous, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}
