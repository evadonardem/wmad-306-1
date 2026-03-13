import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PublishIcon from '@mui/icons-material/Publish';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';

const DRAWER_WIDTH = 260;

function getSidebarItems(roles) {
    if (roles?.includes('writer')) {
        return [
            { label: 'Dashboard', href: route('writer.dashboard'), icon: <DashboardIcon />, active: route().current('writer.dashboard') },
            { label: 'Create Article', href: route('articles.create'), icon: <AddCircleIcon />, active: route().current('articles.create') },
        ];
    }
    if (roles?.includes('editor')) {
        return [
            { label: 'Dashboard', href: route('editor.dashboard'), icon: <DashboardIcon />, active: route().current('editor.dashboard') },
        ];
    }
    if (roles?.includes('student')) {
        return [
            { label: 'Published Articles', href: route('student.dashboard'), icon: <ArticleIcon />, active: route().current('student.dashboard') },
        ];
    }
    return [
        { label: 'Dashboard', href: route('dashboard'), icon: <DashboardIcon />, active: route().current('dashboard') },
    ];
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const roles = user?.roles ?? [];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const sidebarItems = getSidebarItems(roles);
    const roleName = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : 'User';

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SchoolIcon sx={{ fontSize: 32, color: '#FAFAF9' }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#FAFAF9', fontWeight: 700, lineHeight: 1.2 }}>
                        Highland
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(250,250,249,0.7)', fontWeight: 500 }}>
                        Scholar
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(250,250,249,0.15)' }} />

            {/* Role Badge */}
            <Box sx={{ px: 2.5, py: 1.5 }}>
                <Typography variant="overline" sx={{ color: 'rgba(250,250,249,0.5)', letterSpacing: 1.5, fontSize: 10 }}>
                    {roleName} Panel
                </Typography>
            </Box>

            {/* Nav Items  */}
            <List sx={{ px: 1.5, flexGrow: 1 }}>
                {sidebarItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            selected={item.active}
                            sx={{
                                borderRadius: 2,
                                color: 'rgba(250,250,249,0.8)',
                                '&:hover': {
                                    bgcolor: 'rgba(250,250,249,0.1)',
                                    color: '#FAFAF9',
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(250,250,249,0.15)',
                                    color: '#FAFAF9',
                                    '&:hover': {
                                        bgcolor: 'rgba(250,250,249,0.2)',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(250,250,249,0.15)' }} />

            {/* User Info */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#C2410C', fontSize: 14, fontWeight: 700 }}>
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: '#FAFAF9', fontWeight: 600 }} noWrap>
                        {user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(250,250,249,0.6)' }} noWrap>
                        {user?.email}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar – permanent on desktop, drawer on mobile */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            bgcolor: '#064E3B',
                            borderRight: 'none',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop permanent */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            bgcolor: '#064E3B',
                            borderRight: 'none',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main content area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
                {/* Top AppBar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: '#FFFFFF',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {header && (
                            <Box sx={{ flexGrow: 1, color: 'text.primary' }}>
                                {header}
                            </Box>
                        )}

                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                                <Avatar sx={{ width: 34, height: 34, bgcolor: '#064E3B', fontSize: 14, fontWeight: 700 }}>
                                    {user?.name?.[0]?.toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
                            >
                                <MenuItem component={Link} href={route('profile.edit')}>
                                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                    Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => router.post(route('logout'))}>
                                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                    Log Out
                                </MenuItem>
                            </Menu>
                        </Stack>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    {children}
                </Box>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        py: 2,
                        px: 3,
                        textAlign: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#FFFFFF',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Highland Scholar &copy; {new Date().getFullYear()} &mdash; Student Article Publication Platform
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
