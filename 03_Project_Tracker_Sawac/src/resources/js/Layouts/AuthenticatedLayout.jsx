import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const flash = page.props.flash || {};
    const csrfToken = page.props.csrf_token;
    const currentUrl = page.props.url || (typeof window !== 'undefined' && window.location.pathname) || '/';

    const [anchorEl, setAnchorEl] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.up('md'));
    const drawerWidth = 220;
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (flash.message || flash.success || flash.error) {
            setSnackOpen(true);
        }
    }, [flash]);

    useEffect(() => {
        function onNotify(e) {
            const msg = (e && e.detail && e.detail.message) || '';
            setSnackMessage(msg);
            setSnackOpen(true);
        }

        window.addEventListener('app:notify', onNotify);
        return () => window.removeEventListener('app:notify', onNotify);
    }, []);

    // Keyboard shortcuts: press `g` then `p` for Projects, `g` then `t` for Tasks, `g` then `d` for Dashboard
    const shortcutState = useRef('');
    useEffect(() => {
        let timer;
        function onKey(e) {
            const key = e.key.toLowerCase();
            if (shortcutState.current === '' && key === 'g') {
                shortcutState.current = 'g';
                timer = setTimeout(() => (shortcutState.current = ''), 1500);
                return;
            }
            if (shortcutState.current === 'g') {
                if (key === 'p') {
                    window.location.href = route('projects.index');
                } else if (key === 't') {
                    window.location.href = route('tasks.index');
                } else if (key === 'd') {
                    window.location.href = route('dashboard');
                }
                shortcutState.current = '';
                clearTimeout(timer);
            }
        }

        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            clearTimeout(timer);
        };
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <AppBar
                position="fixed"
                color="primary"
                elevation={2}
                sx={mdUp ? { width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` } : {}}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                            <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                                Project Tracker
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ maxWidth: 560, width: '100%' }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        placeholder="Search projects, tasks..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            inputProps: { 'aria-label': 'global-search' }
                                        }}
                                        sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
                                    />
                                </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {!mdUp && (
                                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
                                    <MenuIcon />
                                </IconButton>
                            )}
                                <Tooltip title={user.name}>
                                    <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{user.name?.charAt(0)}</Avatar>
                                    </IconButton>
                                </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose} component="div">
                                    <Link href={route('profile.edit')}>Profile</Link>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        router.post(route('logout'));
                                    }}
                                >
                                    Log Out
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="left"
                variant={mdUp ? 'permanent' : 'temporary'}
                open={mdUp ? true : drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={mdUp ? { '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } } : {}}
            >
                <Box sx={{ width: drawerWidth }} role="presentation" onClick={() => !mdUp && setDrawerOpen(false)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: 'linear-gradient(135deg, primary.main 0%, primary.light 100%)', color: 'primary.contrastText' }}>
                        <ApplicationLogo className="block h-8 w-auto" />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'inherit' }}>Project Tracker</Typography>
                    </Box>
                    <Divider />
                    <List>
                        {[{
                            title: 'Dashboard',
                            icon: <HomeIcon />,
                            href: route('dashboard')
                        }, {
                            title: 'Projects',
                            icon: <FolderIcon />,
                            href: route('projects.index')
                        }, {
                            title: 'Tasks',
                            icon: <TaskIcon />,
                            href: route('tasks.index')
                        }].map((item) => {
                            const active = currentUrl && currentUrl.startsWith(item.href.replace(location.origin || '', ''));
                            return (
                                <ListItem disablePadding key={item.title}>
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        selected={active}
                                        sx={active ? { '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: 'primary.main' } } : {}}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>

                    <Box sx={{ flex: 1 }} />
                    <Divider />
                    <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name?.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="body2">Signed in as</Typography>
                            <Typography variant="subtitle2">{user.email}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flex: 1, py: 3, width: '100%', ml: mdUp ? `${drawerWidth}px` : 0, overflowX: 'hidden' }}>
                <Toolbar />
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    {header && (
                        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                            <Typography color="text.secondary">Home</Typography>
                            <Typography color="text.primary">{typeof header === 'string' ? header : (header.props?.children || 'Dashboard')}</Typography>
                        </Breadcrumbs>
                    )}

                    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 }, minHeight: 420, boxShadow: 3, borderRadius: 2, borderTop: '4px solid', borderTopColor: 'secondary.main', overflowX: 'hidden' }}>
                        {children}
                    </Paper>
                </Container>
            </Box>

            <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackOpen(false)} severity={flash.error ? 'error' : (flash.success ? 'success' : 'info')} sx={{ width: '100%' }}>
                    {flash.error || flash.success || snackMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
