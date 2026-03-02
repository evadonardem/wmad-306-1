import { router, usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    CssBaseline,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Snackbar,
    Stack,
    ThemeProvider,
    Toolbar,
    Tooltip,
    Typography,
    createTheme,
    alpha,
    Badge,
    LinearProgress,
    Fade,
    Zoom,
    Grow,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    AdminPanelSettings as AdminIcon,
    Article as ArticleIcon,
    Comment as CommentIcon,
    TrendingUp as TrendingUpIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Visibility as VisibilityIcon,
    Schedule as ScheduleIcon,
    ThumbUp as ThumbUpIcon,
    RateReview as RateReviewIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// ============================================
// CUSTOM COLOR THEME (Your specified colors)
// ============================================
const COLORS = {
    deepPurple: '#37306B',
    royalPurple: '#66347F',
    mediumPurple: '#9E4784',
    softPink: '#D27685',
};

// ============================================
// GLASSMORPHISM STYLED COMPONENTS
// ============================================

const GlassPaper = styled(Paper)(({ theme }) => ({
    backdropFilter: 'blur(10px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backgroundImage: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        : 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(COLORS.deepPurple, 0.2)}`,
    transition: 'all 0.3s ease',
    color: theme.palette.text.primary,
    '&:hover': {
        backdropFilter: 'blur(12px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: `0 12px 48px 0 ${alpha(COLORS.royalPurple, 0.3)}`,
    },
}));

const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: 'blur(10px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backgroundImage: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        : 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(COLORS.deepPurple, 0.15)}`,
    transition: 'all 0.3s ease',
    color: theme.palette.text.primary,
    '&:hover': {
        transform: 'translateY(-4px)',
        backdropFilter: 'blur(12px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        boxShadow: `0 16px 48px 0 ${alpha(COLORS.royalPurple, 0.25)}`,
    },
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
    backdropFilter: 'blur(10px)',
    backgroundColor: theme.palette.mode === 'dark'
        ? COLORS.deepPurple
        : alpha(COLORS.deepPurple, 0.8),
    backgroundImage: theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${alpha(COLORS.deepPurple, 0.9)} 0%, ${alpha(COLORS.royalPurple, 0.9)} 50%, ${alpha(COLORS.mediumPurple, 0.9)} 100%)`
        : 'none',
    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 4px 20px 0 ${alpha(COLORS.deepPurple, 0.3)}`,
    color: '#ffffff',
}));

const GlassDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.palette.mode === 'dark'
            ? COLORS.deepPurple
            : alpha(theme.palette.background.paper, 0.7),
        backgroundImage: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            : 'none',
        borderRight: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
        boxShadow: `4px 0 32px 0 ${alpha(COLORS.deepPurple, 0.15)}`,
        color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
    },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${alpha(COLORS.softPink, 0.1)} 0%, ${alpha(COLORS.mediumPurple, 0.15)} 50%, ${alpha(COLORS.royalPurple, 0.1)} 100%)`
        : COLORS.deepPurple,
    transition: 'background 0.3s ease',
}));

const AnimatedNumber = styled(Typography)({
    animation: 'fadeInUp 0.5s ease',
    '@keyframes fadeInUp': {
        '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
});

// ============================================
// THEME CONFIGURATION
// ============================================
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: COLORS.deepPurple,
            light: COLORS.royalPurple,
            dark: '#1A0F33',
        },
        secondary: {
            main: COLORS.mediumPurple,
            light: COLORS.softPink,
            dark: COLORS.royalPurple,
        },
        success: {
            main: '#4CAF50',
            light: '#81C784',
            dark: '#388E3C',
        },
        warning: {
            main: '#FFB347',
            light: '#FFC107',
            dark: '#FF9800',
        },
        error: {
            main: '#FF6B6B',
            light: '#FF8A8A',
            dark: '#D32F2F',
        },
        background: {
            default: mode === 'light' ? '#F5F7FA' : COLORS.deepPurple,
            paper: mode === 'light' ? '#FFFFFF' : COLORS.deepPurple,
        },
        text: {
            primary: mode === 'light' ? '#2D3748' : '#FFFFFF',
            secondary: mode === 'light' ? '#718096' : '#B0B0B0',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            background: mode === 'light'
                ? `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.royalPurple} 50%, ${COLORS.mediumPurple} 100%)`
                : 'none',
            WebkitBackgroundClip: mode === 'light' ? 'text' : 'none',
            WebkitTextFillColor: mode === 'light' ? 'transparent' : '#FFFFFF',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 16px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px ${alpha(COLORS.royalPurple, 0.3)}`,
                    },
                },
                contained: {
                    background: mode === 'light'
                        ? `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.royalPurple} 100%)`
                        : COLORS.royalPurple,
                    color: '#ffffff',
                    '&:hover': {
                        background: mode === 'light'
                            ? `linear-gradient(135deg, ${COLORS.royalPurple} 0%, ${COLORS.mediumPurple} 100%)`
                            : COLORS.mediumPurple,
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#2D3748' : '#FFFFFF',
                },
                colorTextSecondary: {
                    color: mode === 'light' ? '#718096' : '#B0B0B0',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? COLORS.deepPurple : '#FFFFFF',
                },
            },
        },
    },
});

// ============================================
// CONSTANTS
// ============================================
const drawerWidth = 280;
const collapsedDrawerWidth = 88;

// Simplified navigation items - only Dashboard and User Management
const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function Dashboard({ stats = {}, chartData = {} }) {
    const { auth } = usePage().props;
    const [mode, setMode] = useState(() => {
        // Load saved theme preference from localStorage
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        // Load saved sidebar state from localStorage
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Notification State
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    // Save theme preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Save sidebar state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const currentDrawerWidth = isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

    // Sample data for demonstration - replace with actual props
    const dashboardStats = stats.total ? stats : {
        totalUsers: 1245,
        activeUsers: 1198,
        newToday: 23,
        totalWriters: 342,
        totalEditors: 89,
        totalAdmins: 12,
        totalArticles: 567,
        publishedArticles: 423,
        pendingArticles: 89,
        totalComments: 2345,
        pendingComments: 56,
        avgResponseTime: '2.4h',
        completionRate: 78,
    };

    const activityData = chartData.activity || [
        { day: 'Mon', users: 45, articles: 23, comments: 78 },
        { day: 'Tue', users: 52, articles: 28, comments: 92 },
        { day: 'Wed', users: 48, articles: 25, comments: 85 },
        { day: 'Thu', users: 61, articles: 32, comments: 110 },
        { day: 'Fri', users: 55, articles: 29, comments: 95 },
        { day: 'Sat', users: 38, articles: 18, comments: 62 },
        { day: 'Sun', users: 42, articles: 21, comments: 71 },
    ];

    const categoryData = chartData.categories || [
        { name: 'Technology', value: 342 },
        { name: 'Science', value: 256 },
        { name: 'Health', value: 189 },
        { name: 'Business', value: 145 },
        { name: 'Arts', value: 98 },
    ];

    const recentActivity = [
        { time: '2 min ago', user: 'John Smith', action: 'published "AI Ethics"', type: 'article' },
        { time: '15 min ago', user: 'Sarah Jones', action: 'submitted for review', type: 'submission' },
        { time: '32 min ago', user: 'Mike Brown', action: 'registered as student', type: 'user' },
        { time: '1 hour ago', user: 'Lisa Wang', action: 'commented on "Quantum Computing"', type: 'comment' },
        { time: '2 hours ago', user: 'David Kim', action: 'updated profile', type: 'user' },
    ];

    const showSnackbar = (severity, message) => {
        setSnackbar({ open: true, severity, message });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const navigateTo = (path) => {
        router.visit(path);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const pieColors = [COLORS.deepPurple, COLORS.royalPurple, COLORS.mediumPurple, COLORS.softPink, '#FFB347'];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GradientBackground>
                {/* ===== TOP NAVIGATION BAR ===== */}
                <GlassAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <AdminIcon sx={{ mr: 1, fontSize: 28, color: '#ffffff' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                                AdminSphere
                            </Typography>
                            <Chip
                                label="v2.0"
                                size="small"
                                sx={{
                                    ml: 2,
                                    backdropFilter: 'blur(4px)',
                                    backgroundColor: alpha('#FFFFFF', 0.2),
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: '#ffffff',
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Toggle theme">
                                <IconButton
                                    color="inherit"
                                    onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                                    sx={{ color: '#ffffff' }}
                                >
                                    {mode === 'light' ? '🌙' : '☀️'}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Notifications">
                                <IconButton color="inherit" sx={{ color: '#ffffff' }}>
                                    <Badge badgeContent={4} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: COLORS.softPink,
                                        width: 40,
                                        height: 40,
                                        border: '2px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    {auth?.user?.name?.charAt(0) ?? 'A'}
                                </Avatar>
                                <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                                        {auth?.user?.name ?? 'Admin User'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8, color: '#ffffff' }}>
                                        Super Admin
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Toolbar>
                </GlassAppBar>

                {/* ===== SIDE DRAWER ===== */}
                <Box
                    component="nav"
                    sx={{
                        width: { sm: currentDrawerWidth },
                        flexShrink: { sm: 0 },
                    }}
                >
                    <GlassDrawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': {
                                width: currentDrawerWidth,
                                boxSizing: 'border-box',
                                transition: theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                                overflowX: 'hidden',
                                top: 64,
                                height: 'calc(100% - 64px)',
                                display: 'flex',
                                flexDirection: 'column',
                            },
                        }}
                        open
                    >
                        {/* Collapse Button at Top */}
                        <Box sx={{ px: isSidebarCollapsed ? 0.5 : 1, py: 1, display: 'flex', justifyContent: isSidebarCollapsed ? 'center' : 'flex-end' }}>
                            <Tooltip title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                                <IconButton onClick={toggleSidebar} size="small" sx={{ p: 0.75 }}>
                                    {isSidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

                        {/* Navigation Items */}
                        <Box sx={{ overflow: 'auto', flex: 1, py: 1 }}>
                            <List>
                                {navigationItems.map((item) => (
                                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                        <Tooltip title={item.text} placement="right" disableHoverListener={!isSidebarCollapsed}>
                                            <ListItemButton
                                                selected={item.text === 'Dashboard'}
                                                onClick={() => navigateTo(item.path)}
                                                sx={{
                                                    borderRadius: '0 20px 20px 0',
                                                    mx: 1,
                                                    transition: 'all 0.2s',
                                                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                                                    minHeight: 48,
                                                    px: isSidebarCollapsed ? 1 : 2,
                                                    '&.Mui-selected': {
                                                        background: `linear-gradient(90deg, ${alpha(COLORS.royalPurple, 0.3)} 0%, ${alpha(COLORS.mediumPurple, 0.1)} 100%)`,
                                                        borderLeft: `3px solid ${COLORS.softPink}`,
                                                    },
                                                    '&:hover': {
                                                        background: alpha(COLORS.royalPurple, 0.15),
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{
                                                    minWidth: isSidebarCollapsed ? 0 : 40,
                                                    color: 'inherit',
                                                    mr: isSidebarCollapsed ? 0 : 2,
                                                }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                {!isSidebarCollapsed && (
                                                    <ListItemText
                                                        primary={item.text}
                                                        primaryTypographyProps={{
                                                            color: 'text.primary',
                                                        }}
                                                    />
                                                )}
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {/* Logout at Bottom */}
                        <Box sx={{ mt: 'auto', pb: 2 }}>
                            <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.common.white, 0.1) }} />
                            <List>
                                <ListItem disablePadding sx={{ mb: 0.5 }}>
                                    <Tooltip title="Logout" placement="right" disableHoverListener={!isSidebarCollapsed}>
                                        <ListItemButton
                                            onClick={handleLogout}
                                            sx={{
                                                borderRadius: '0 20px 20px 0',
                                                mx: 1,
                                                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                                                minHeight: 48,
                                                px: isSidebarCollapsed ? 1 : 2,
                                            }}
                                        >
                                            <ListItemIcon sx={{
                                                minWidth: isSidebarCollapsed ? 0 : 40,
                                                color: 'inherit',
                                                mr: isSidebarCollapsed ? 0 : 2,
                                            }}>
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            {!isSidebarCollapsed && (
                                                <ListItemText
                                                    primary="Logout"
                                                    primaryTypographyProps={{
                                                        color: 'text.primary',
                                                    }}
                                                />
                                            )}
                                        </ListItemButton>
                                    </Tooltip>
                                </ListItem>
                            </List>
                        </Box>
                    </GlassDrawer>
                </Box>

                {/* ===== MAIN CONTENT ===== */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
                        ml: { sm: `${currentDrawerWidth}px` },
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }}
                >
                    <Toolbar />

                    <Container maxWidth="xl" disableGutters>
                        <Fade in timeout={800}>
                            <Stack spacing={3}>
                                {/* Welcome Banner */}
                                <Zoom in timeout={1000}>
                                    <GlassPaper sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
                                        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                                            <DashboardIcon sx={{ fontSize: 200 }} />
                                        </Box>
                                        <Typography variant="h4" gutterBottom>
                                            Analytics Dashboard
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60%' }}>
                                            Monitor platform performance, user activity, and content metrics in real-time.
                                        </Typography>
                                    </GlassPaper>
                                </Zoom>

                                {/* Key Metrics Cards */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Grow in timeout={500}>
                                            <GlassCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Total Users
                                                            </Typography>
                                                            <AnimatedNumber variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                                                                {dashboardStats.totalUsers}
                                                            </AnimatedNumber>
                                                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <TrendingUpIcon fontSize="small" /> +12% this month
                                                            </Typography>
                                                        </Box>
                                                        <Avatar sx={{ bgcolor: alpha(COLORS.deepPurple, 0.2), color: COLORS.deepPurple }}>
                                                            <PeopleIcon />
                                                        </Avatar>
                                                    </Box>
                                                </CardContent>
                                            </GlassCard>
                                        </Grow>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Grow in timeout={600}>
                                            <GlassCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Active Today
                                                            </Typography>
                                                            <AnimatedNumber variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                                                                {dashboardStats.activeUsers}
                                                            </AnimatedNumber>
                                                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <CheckCircleIcon fontSize="small" /> 96% active rate
                                                            </Typography>
                                                        </Box>
                                                        <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.2), color: '#4CAF50' }}>
                                                            <VisibilityIcon />
                                                        </Avatar>
                                                    </Box>
                                                </CardContent>
                                            </GlassCard>
                                        </Grow>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Grow in timeout={700}>
                                            <GlassCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Total Articles
                                                            </Typography>
                                                            <AnimatedNumber variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                                                                {dashboardStats.totalArticles}
                                                            </AnimatedNumber>
                                                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <PendingIcon fontSize="small" /> {dashboardStats.pendingArticles} pending
                                                            </Typography>
                                                        </Box>
                                                        <Avatar sx={{ bgcolor: alpha(COLORS.royalPurple, 0.2), color: COLORS.royalPurple }}>
                                                            <ArticleIcon />
                                                        </Avatar>
                                                    </Box>
                                                </CardContent>
                                            </GlassCard>
                                        </Grow>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Grow in timeout={800}>
                                            <GlassCard>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Comments
                                                            </Typography>
                                                            <AnimatedNumber variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                                                                {dashboardStats.totalComments}
                                                            </AnimatedNumber>
                                                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <RateReviewIcon fontSize="small" /> {dashboardStats.pendingComments} pending
                                                            </Typography>
                                                        </Box>
                                                        <Avatar sx={{ bgcolor: alpha(COLORS.softPink, 0.2), color: COLORS.softPink }}>
                                                            <CommentIcon />
                                                        </Avatar>
                                                    </Box>
                                                </CardContent>
                                            </GlassCard>
                                        </Grow>
                                    </Grid>
                                </Grid>

                                {/* User Distribution Cards */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <GlassCard>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Writers
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.deepPurple }}>
                                                    {dashboardStats.totalWriters}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(dashboardStats.totalWriters / dashboardStats.totalUsers) * 100}
                                                    sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha(COLORS.deepPurple, 0.1) }}
                                                />
                                            </CardContent>
                                        </GlassCard>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <GlassCard>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Editors
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.royalPurple }}>
                                                    {dashboardStats.totalEditors}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(dashboardStats.totalEditors / dashboardStats.totalUsers) * 100}
                                                    sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha(COLORS.royalPurple, 0.1) }}
                                                />
                                            </CardContent>
                                        </GlassCard>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <GlassCard>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Admins
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.mediumPurple }}>
                                                    {dashboardStats.totalAdmins}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(dashboardStats.totalAdmins / dashboardStats.totalUsers) * 100}
                                                    sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha(COLORS.mediumPurple, 0.1) }}
                                                />
                                            </CardContent>
                                        </GlassCard>
                                    </Grid>
                                </Grid>

                                {/* Charts Section */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <GlassPaper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Platform Activity (Last 7 Days)
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <AreaChart data={activityData}>
                                                    <defs>
                                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS.deepPurple} stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor={COLORS.deepPurple} stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS.royalPurple} stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor={COLORS.royalPurple} stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                                    <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
                                                    <YAxis stroke={theme.palette.text.secondary} />
                                                    <RechartsTooltip
                                                        contentStyle={{
                                                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                                            backdropFilter: 'blur(10px)',
                                                            border: `1px solid ${alpha(COLORS.softPink, 0.3)}`,
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Area type="monotone" dataKey="users" stroke={COLORS.deepPurple} fillOpacity={1} fill="url(#colorUsers)" />
                                                    <Area type="monotone" dataKey="articles" stroke={COLORS.royalPurple} fillOpacity={1} fill="url(#colorArticles)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </GlassPaper>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <GlassPaper sx={{ p: 2, height: '100%' }}>
                                            <Typography variant="h6" gutterBottom>
                                                Content by Category
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        contentStyle={{
                                                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                                            backdropFilter: 'blur(10px)',
                                                            border: `1px solid ${alpha(COLORS.softPink, 0.3)}`,
                                                        }}
                                                    />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </GlassPaper>
                                    </Grid>
                                </Grid>

                                {/* Recent Activity Feed */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <GlassPaper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Recent Activity
                                            </Typography>
                                            <List>
                                                {recentActivity.map((activity, index) => (
                                                    <ListItem key={index} sx={{ px: 0 }}>
                                                        <ListItemIcon>
                                                            {activity.type === 'article' && <ArticleIcon sx={{ color: COLORS.deepPurple }} />}
                                                            {activity.type === 'submission' && <ScheduleIcon sx={{ color: COLORS.royalPurple }} />}
                                                            {activity.type === 'user' && <PersonIcon sx={{ color: COLORS.mediumPurple }} />}
                                                            {activity.type === 'comment' && <CommentIcon sx={{ color: COLORS.softPink }} />}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <strong>{activity.user}</strong> {activity.action}
                                                                </Typography>
                                                            }
                                                            secondary={activity.time}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </GlassPaper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <GlassPaper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Quick Stats
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'transparent' }}>
                                                        <CardContent>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Avg. Response Time
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                                {dashboardStats.avgResponseTime}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'transparent' }}>
                                                        <CardContent>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Completion Rate
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                                {dashboardStats.completionRate}%
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'transparent' }}>
                                                        <CardContent>
                                                            <Typography color="text.secondary" variant="body2">
                                                                Published Today
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                                12
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Card variant="outlined" sx={{ bgcolor: 'transparent' }}>
                                                        <CardContent>
                                                            <Typography color="text.secondary" variant="body2">
                                                                New Comments
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                                45
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </GlassPaper>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Fade>
                    </Container>
                </Box>

                {/* ===== SNACKBAR NOTIFICATIONS ===== */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            backdropFilter: 'blur(10px)',
                            backgroundColor: alpha(
                                snackbar.severity === 'success' ? '#4CAF50' :
                                snackbar.severity === 'error' ? '#FF6B6B' :
                                snackbar.severity === 'warning' ? '#FFB347' : '#2196F3',
                                0.9
                            ),
                            color: '#ffffff',
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </GradientBackground>
        </ThemeProvider>
    );
}
