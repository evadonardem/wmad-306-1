import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { router, usePoll } from '@inertiajs/react'; // NEW: Added usePoll

export default function NotificationBell({ notifications = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const unreadCount = notifications.filter(n => !n.read_at).length;

    // NEW: Automatically check for new notifications every 15 seconds
    // This makes it feel "Live" without manual refreshing.
    usePoll(15000);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const markAsRead = (id, articleId) => {
        router.post(route('notifications.markAsRead', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // NEW: Tell the dashboard to scroll to the specific article
                window.dispatchEvent(new CustomEvent('scroll-to-article', { detail: articleId }));
            }
        });
        handleClose();
    };

    return (
        <Box>
            <IconButton onClick={handleClick} className="!text-gray-500 dark:!text-slate-400 eclipse:!text-rose-400">
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 dark:!text-white eclipse:!text-rose-100 border dark:border-slate-800 eclipse:border-red-900/50 !mt-2 w-80 shadow-2xl'
                }}
            >
                <Box className="p-3">
                    <Typography variant="subtitle2" className="!font-bold uppercase tracking-widest text-[10px] text-gray-500 eclipse:text-red-400">
                        Notifications
                    </Typography>
                </Box>
                <Divider className="dark:!border-slate-800 eclipse:!border-red-900/30" />

                {notifications.length === 0 ? (
                    <MenuItem className="!py-4 italic text-gray-500 text-sm">No new alerts.</MenuItem>
                ) : (
                    notifications.map((n) => (
                        <MenuItem
                            key={n.id}
                            onClick={() => markAsRead(n.id, n.data.article_id)} // Passes Article ID
                            className={`!block !py-3 !whitespace-normal border-b last:border-0 dark:border-slate-800 eclipse:border-red-900/20 ${!n.read_at ? 'bg-cyan-50/50 dark:bg-cyan-900/10 eclipse:bg-red-900/20' : ''}`}
                        >
                            <Typography variant="body2" className="!font-bold text-xs">
                                {n.data.title || 'New Update'}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500 eclipse:text-rose-300/70 block mt-1">
                                {n.data.message}
                            </Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </Box>
    );
}
