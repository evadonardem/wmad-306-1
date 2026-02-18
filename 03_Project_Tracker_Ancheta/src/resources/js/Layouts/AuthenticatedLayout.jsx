import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Typography, Divider
} from '@mui/material';
import {
  Menu, Dashboard, Folder,
  Brightness4, Brightness7, ChevronLeft, Logout, Person
} from '@mui/icons-material';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';

const drawerWidth = 260;

export default function AuthenticatedLayout({ header, children, auth }) {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    // Load sidebar state from localStorage, default to true (open)
    const [open, setOpen] = useState(() => {
        const savedState = localStorage.getItem('sidebarOpen');
        // If no saved state, default to true (open)
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    const { post } = useForm();
    const { props } = usePage();
    const user = props.auth?.user;

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(open));
    }, [open]);

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    const glassDrawerStyle = {
        width: open ? drawerWidth : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 80,
            boxSizing: 'border-box',
            background: colors.glass,
            backdropFilter: 'blur(15px)',
            borderRight: `1px solid ${colors.glassBorder}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
    };

    const navigationItems = [
        { text: 'Dashboard', icon: <Dashboard />, route: 'dashboard' },
        { text: 'Projects', icon: <Folder />, route: 'projects.index' },
    ];

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: colors.background,
            transition: 'background-color 0.2s ease',
        }}>
            {/* Sidebar */}
            <Drawer variant="permanent" sx={glassDrawerStyle} open={open}>
                {/* Top Section: Brand & Toggle */}
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    minHeight: 64,
                    borderBottom: `1px solid ${colors.border}`,
                }}>
                    {open && (
                        <Typography
                            variant="h6"
                            sx={{
                                color: colors.primary,
                                fontWeight: 800,
                                letterSpacing: 1.5,
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                            }}
                        >
                            Taskaye
                        </Typography>
                    )}
                    <IconButton
                        onClick={() => setOpen(!open)}
                        sx={{
                            color: colors.primary,
                            '&:hover': {
                                backgroundColor: colors.glass,
                            },
                            transition: 'all 0.2s ease',
                        }}
                        size="small"
                    >
                        {open ? <ChevronLeft /> : <Menu />}
                    </IconButton>
                </Box>

                {/* Navigation Section */}
                <Box sx={{ flexGrow: 1, py: 2 }}>
                    <List sx={{ px: 1 }}>
                        {navigationItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <Link
                                    href={route(item.route)}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        width: '100%',
                                    }}
                                >
                                    <ListItemButton
                                        sx={{
                                            borderRadius: '12px',
                                            justifyContent: open ? 'initial' : 'center',
                                            color: colors.textSecondary,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: colors.glass,
                                                color: colors.primary,
                                                transform: 'translateX(2px)',
                                            },
                                            py: 1.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : 'auto',
                                                color: colors.primary,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {open && (
                                            <ListItemText
                                                primary={item.text}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontWeight: 500,
                                                        color: colors.textSecondary,
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Bottom Section: User Profile, Theme & Logout */}
                <Box sx={{ pb: 2, px: 1, borderTop: `1px solid ${colors.border}` }}>
                    <Divider sx={{ my: 1, opacity: 0.1 }} />

                    {/* User Profile Section */}
                    {user && (
                        <>
                            <Link
                                href={route('profile.edit')}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'block',
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        borderRadius: '12px',
                                        mb: 0.5,
                                        justifyContent: open ? 'initial' : 'center',
                                        color: colors.textSecondary,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: colors.glass,
                                            color: colors.primary,
                                        },
                                        py: 1.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 'auto',
                                            color: colors.primary,
                                        }}
                                    >
                                        <Person />
                                    </ListItemIcon>
                                    {open && (
                                        <Box sx={{ minWidth: 0 }}>
                                            <ListItemText
                                                primary="Profile"
                                                secondary={user.name}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem',
                                                    },
                                                    '& .MuiListItemText-secondary': {
                                                        color: colors.textSecondary,
                                                        fontSize: '0.75rem',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                </ListItemButton>
                            </Link>
                            <Divider sx={{ my: 1, opacity: 0.1 }} />
                        </>
                    )}

                    {/* Theme Toggle */}
                    <ListItemButton
                        onClick={toggleTheme}
                        sx={{
                            borderRadius: '12px',
                            mb: 0.5,
                            justifyContent: open ? 'initial' : 'center',
                            color: colors.textSecondary,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: colors.glass,
                                color: colors.secondary,
                            },
                            py: 1.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 2 : 'auto',
                                color: colors.secondary,
                            }}
                        >
                            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary={isDarkMode ? 'Light' : 'Dark'}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                    },
                                }}
                            />
                        )}
                    </ListItemButton>

                    {/* Logout Button */}
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: '12px',
                            justifyContent: open ? 'initial' : 'center',
                            color: colors.danger,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: `${colors.danger}20`,
                            },
                            py: 1.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 2 : 'auto',
                                color: colors.danger,
                            }}
                        >
                            <Logout />
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary="Logout"
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                    },
                                }}
                            />
                        )}
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    overflowX: 'hidden',
                    backgroundColor: colors.background,
                    transition: 'background-color 0.2s ease',
                }}
            >
                {header && (
                    <Box
                        sx={{
                            mb: 4,
                            p: 3,
                            backgroundColor: colors.surface,
                            borderRadius: '16px',
                            boxShadow: `0 1px 3px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                            border: `1px solid ${colors.border}`,
                        }}
                    >
                        {header}
                    </Box>
                )}
                <Box sx={{ animationName: 'fadeIn', animationDuration: '0.3s' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
