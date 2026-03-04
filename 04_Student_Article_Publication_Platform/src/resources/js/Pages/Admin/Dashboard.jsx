import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Paper, Typography, Box, TextField, MenuItem, FormControl, Select, Chip } from '@mui/material';

export default function AdminDashboard({ auth, users }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter users based on the search bar (Name or Email)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRoleChange = (userId, newRole) => {
        router.post(route('admin.users.update-role', userId), {
            role: newRole
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">Admin Command Center</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white eclipse:!text-rose-50 border dark:border-slate-800 eclipse:border-red-900/50 transition-colors duration-500">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <Typography variant="h5" className="!font-black !mb-2">User Management</Typography>
                                <Typography variant="body2" className="text-gray-500 dark:text-slate-400 eclipse:text-rose-300 transition-colors">Search for a student and instantly upgrade their platform access.</Typography>
                            </div>

                            {/* Live Search Bar */}
                            <TextField
                                size="small"
                                placeholder="Search name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-72"
                                InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800 transition-colors' }}
                            />
                        </div>

                        <div className="space-y-4">
                            {filteredUsers.length === 0 ? (
                                <Typography variant="body1" className="text-center py-8 text-gray-500 eclipse:text-rose-300">No users found matching "{searchQuery}"</Typography>
                            ) : (
                                filteredUsers.map((user) => (
                                    <Box key={user.id} className="p-4 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 eclipse:bg-rose-950/40 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:eclipse:shadow-[0_0_15px_rgba(220,38,38,0.15)] transition-all">

                                        <div className="flex-1">
                                            <Typography variant="subtitle1" className="!font-bold">{user.name}</Typography>
                                            <Typography variant="caption" className="text-gray-500 dark:text-gray-400 eclipse:text-red-300 block">{user.email}</Typography>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <Chip
                                                label={`Current: ${user.role.toUpperCase()}`}
                                                size="small"
                                                color={user.role === 'admin' ? 'secondary' : (user.role === 'writer' ? 'primary' : 'default')}
                                                className="!font-mono !text-[10px] !tracking-widest eclipse:shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                                            />

                                            <FormControl size="small" className="w-32">
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800 transition-colors text-sm"
                                                    disabled={user.id === auth.user.id} // Prevents admin from accidentally demoting themselves
                                                >
                                                    <MenuItem value="student">Student</MenuItem>
                                                    <MenuItem value="writer">Writer</MenuItem>
                                                    <MenuItem value="editor">Editor</MenuItem>
                                                    <MenuItem value="admin">Admin</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                    </Box>
                                ))
                            )}
                        </div>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
