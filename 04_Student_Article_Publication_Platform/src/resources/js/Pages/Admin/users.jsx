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
    Checkbox,
    Chip,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
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
    Add as AddIcon,
    Edit as EditIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    PeopleAlt as PeopleAltIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    MoreVert as MoreVertIcon,
    FilterList as FilterListIcon,
    Clear as ClearIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    Delete as DeleteIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const GlassDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backgroundImage: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 100%)',
        border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
        boxShadow: `0 25px 50px 0 ${alpha(COLORS.deepPurple, 0.3)}`,
        borderRadius: 16,
        color: theme.palette.text.primary,
    },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${alpha(COLORS.softPink, 0.1)} 0%, ${alpha(COLORS.mediumPurple, 0.15)} 50%, ${alpha(COLORS.royalPurple, 0.1)} 100%)`
        : COLORS.deepPurple,
    transition: 'background 0.3s ease',
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => {
    const colors = {
        active: {
            bg: alpha('#4CAF50', 0.2),
            color: theme.palette.mode === 'light' ? '#2E7D32' : '#81C784',
            border: alpha('#4CAF50', 0.3)
        },
        suspended: {
            bg: alpha('#FF6B6B', 0.2),
            color: theme.palette.mode === 'light' ? '#D32F2F' : '#FF8A8A',
            border: alpha('#FF6B6B', 0.3)
        },
        pending: {
            bg: alpha('#FFB347', 0.2),
            color: theme.palette.mode === 'light' ? '#ED6C02' : '#FFB74D',
            border: alpha('#FFB347', 0.3)
        },
        deleted: {
            bg: alpha('#9E9E9E', 0.2),
            color: theme.palette.mode === 'light' ? '#616161' : '#E0E0E0',
            border: alpha('#9E9E9E', 0.3)
        },
    };
    const config = colors[statuscolor] || colors.pending;

    return {
        backdropFilter: 'blur(4px)',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontWeight: 600,
        '& .MuiChip-icon': {
            color: config.color,
        },
    };
});

const GlassTableRow = styled(TableRow)(({ theme }) => ({
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.3),
        backdropFilter: 'blur(8px)',
    },
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
                outlined: {
                    borderColor: alpha(mode === 'light' ? COLORS.deepPurple : '#ffffff', 0.5),
                    color: mode === 'light' ? COLORS.deepPurple : '#ffffff',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#2D3748' : '#FFFFFF',
                    borderBottom: `1px solid ${alpha(mode === 'light' ? '#E2E8F0' : '#FFFFFF', 0.1)}`,
                },
                head: {
                    fontWeight: 700,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#718096' : '#B0B0B0',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#2D3748' : '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(mode === 'light' ? '#718096' : '#FFFFFF', 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(mode === 'light' ? COLORS.royalPurple : COLORS.softPink, 0.5),
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: mode === 'light' ? '#718096' : '#B0B0B0',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: mode === 'light' ? '#2D3748' : '#FFFFFF',
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
        MuiChip: {
            styleOverrides: {
                label: {
                    color: 'inherit',
                },
            },
        },
    },
});

// ============================================
// CONSTANTS AND HELPERS
// ============================================
const drawerWidth = 280;
const collapsedDrawerWidth = 88;

const ROLE_DETAILS = {
    admin: 'Full system access and user management',
    editor: 'Can review, request revisions, and publish',
    writer: 'Can create and submit articles',
};

const STATUS_OPTIONS = ['active', 'suspended', 'pending', 'deleted'];

const formatStatus = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'active': return <CheckCircleIcon fontSize="small" />;
        case 'suspended': return <CancelIcon fontSize="small" />;
        case 'pending': return <PendingIcon fontSize="small" />;
        default: return <PendingIcon fontSize="small" />;
    }
};

// Simplified navigation items - only Dashboard and User Management
const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function Users({ users = [], roles = [] }) {
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

    // Save theme preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Save sidebar state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const roleOptions = roles.length ? roles : ['admin', 'editor', 'writer'];

    // State Management
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('name');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Dialog States
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Notification State
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    // Form States
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        roles: ['writer'],
        account_status: 'active',
        temporary_password: '',
        send_invitation: true,
    });

    const [editForm, setEditForm] = useState({
        id: null,
        name: '',
        email: '',
        phone: '',
        location: '',
        roles: [],
        account_status: 'active',
    });

    // Loading States
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Current drawer width based on collapse state
    const currentDrawerWidth = isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    const showSnackbar = (severity, message) => {
        setSnackbar({ open: true, severity, message });
    };

    const handleSort = (column) => {
        if (orderBy === column) {
            setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(column);
            setOrderDirection('asc');
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleBulkAction = () => {
        if (selectedUsers.length === 0) {
            showSnackbar('warning', 'No users selected');
            return;
        }
        setOpenBulkDialog(true);
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

    // ========================================
    // DATA FILTERING AND SORTING
    // ========================================
    const filteredUsers = useMemo(() => {
        setSearching(true);

        const normalizedSearch = search.trim().toLowerCase();

        const visibleUsers = users.filter((user) => {
            const roleList = user.roles ?? [];

            const searchMatches = !normalizedSearch ||
                user.name?.toLowerCase().includes(normalizedSearch) ||
                user.email?.toLowerCase().includes(normalizedSearch) ||
                (user.phone && user.phone.toLowerCase().includes(normalizedSearch)) ||
                (user.location && user.location.toLowerCase().includes(normalizedSearch));

            const roleMatches = roleFilter === 'all' || roleList.includes(roleFilter);
            const statusMatches = statusFilter === 'all' || (user.account_status ?? 'active') === statusFilter;

            return searchMatches && roleMatches && statusMatches;
        });

        const sorted = visibleUsers.sort((a, b) => {
            let aVal = '', bVal = '';

            if (orderBy === 'name') {
                aVal = a.name ?? '';
                bVal = b.name ?? '';
            } else if (orderBy === 'email') {
                aVal = a.email ?? '';
                bVal = b.email ?? '';
            } else if (orderBy === 'status') {
                aVal = a.account_status ?? 'active';
                bVal = b.account_status ?? 'active';
            }

            const comparison = aVal.localeCompare(bVal);
            return orderDirection === 'asc' ? comparison : -comparison;
        });

        setTimeout(() => setSearching(false), 300);
        return sorted;
    }, [orderBy, orderDirection, roleFilter, search, statusFilter, users]);

    // ========================================
    // STATISTICS CALCULATION
    // ========================================
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => (u.account_status ?? 'active') === 'active').length;
        const suspended = users.filter(u => u.account_status === 'suspended').length;
        const pending = users.filter(u => u.account_status === 'pending').length;
        const writers = users.filter(u => (u.roles ?? []).includes('writer')).length;
        const editors = users.filter(u => (u.roles ?? []).includes('editor')).length;
        const admins = users.filter(u => (u.roles ?? []).includes('admin')).length;

        return { total, active, suspended, pending, writers, editors, admins };
    }, [users]);

    // ========================================
    // CRUD OPERATIONS
    // ========================================
    const handleCreateUser = (event) => {
        event.preventDefault();
        setLoading(true);

        router.post('/admin/users', createForm, {
            preserveScroll: true,
            onSuccess: () => {
                showSnackbar('success', 'User created successfully');
                setOpenCreateDialog(false);
                setCreateForm({
                    name: '', email: '', phone: '', location: '',
                    roles: ['writer'], account_status: 'active',
                    temporary_password: '', send_invitation: true,
                });
                setLoading(false);
            },
            onError: (errors) => {
                const firstError = Object.values(errors ?? {})[0];
                showSnackbar('error', String(firstError ?? 'Failed to create user'));
                setLoading(false);
            },
        });
    };

    const openEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            id: user.id,
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            location: user.location ?? '',
            roles: user.roles?.length ? user.roles : ['writer'],
            account_status: user.account_status ?? 'active',
        });
        setOpenEditDialog(true);
    };

    const handleEditUser = (event) => {
        event.preventDefault();
        setLoading(true);

        router.patch(`/admin/users/${editForm.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                showSnackbar('success', 'User updated successfully');
                setOpenEditDialog(false);
                setLoading(false);
            },
            onError: (errors) => {
                const firstError = Object.values(errors ?? {})[0];
                showSnackbar('error', String(firstError ?? 'Failed to update user'));
                setLoading(false);
            },
        });
    };

    const handleStatusToggle = (user) => {
        const currentStatus = user.account_status ?? 'active';
        const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';

        router.patch(`/admin/users/${user.id}/status`, {
            account_status: nextStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => showSnackbar('success', `User ${nextStatus} successfully`),
            onError: (errors) => {
                const firstError = Object.values(errors ?? {})[0];
                showSnackbar('error', String(firstError ?? 'Failed to update status'));
            },
        });
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;

        router.delete(`/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showSnackbar('success', 'User deleted successfully');
                setOpenDeleteDialog(false);
            },
            onError: (errors) => {
                const firstError = Object.values(errors ?? {})[0];
                showSnackbar('error', String(firstError ?? 'Failed to delete user'));
            },
        });
    };

    // ========================================
    // RENDER
    // ========================================
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
                        <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
                            <List>
                                {navigationItems.map((item) => (
                                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                        <Tooltip title={item.text} placement="right" disableHoverListener={!isSidebarCollapsed}>
                                            <ListItemButton
                                                selected={item.text === 'User Management'}
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
                                            <PeopleAltIcon sx={{ fontSize: 200 }} />
                                        </Box>
                                        <Typography variant="h4" gutterBottom>
                                            User Management
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60%' }}>
                                            Create, edit, and manage user accounts. Assign roles and control access permissions.
                                        </Typography>
                                    </GlassPaper>
                                </Zoom>

                                {/* Stats Cards */}
                                <Grid container spacing={2}>
                                    {[
                                        { label: 'Total Users', value: stats.total, icon: <PeopleAltIcon />, color: COLORS.deepPurple },
                                        { label: 'Active', value: stats.active, icon: <CheckCircleIcon />, color: '#4CAF50' },
                                        { label: 'Writers', value: stats.writers, icon: <PersonIcon />, color: COLORS.royalPurple },
                                        { label: 'Editors', value: stats.editors, icon: <PersonIcon />, color: COLORS.mediumPurple },
                                        { label: 'Admins', value: stats.admins, icon: <AdminIcon />, color: COLORS.softPink },
                                        { label: 'Pending', value: stats.pending, icon: <PendingIcon />, color: '#FFB347' },
                                    ].map((stat, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={2} key={stat.label}>
                                            <Grow in timeout={500 + index * 100}>
                                                <GlassCard>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography color="text.secondary" variant="body2">
                                                                    {stat.label}
                                                                </Typography>
                                                                <AnimatedNumber variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                                                                    {stat.value}
                                                                </AnimatedNumber>
                                                            </Box>
                                                            <Avatar sx={{ bgcolor: alpha(stat.color, 0.2), color: stat.color }}>
                                                                {stat.icon}
                                                            </Avatar>
                                                        </Box>
                                                    </CardContent>
                                                </GlassCard>
                                            </Grow>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Search & Filters */}
                                <GlassPaper sx={{ p: 2 }}>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Search users by name, email, phone, location..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: searching && (
                                                    <InputAdornment position="end">
                                                        <LinearProgress sx={{ width: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ flex: 2 }}
                                        />

                                        <FormControl sx={{ minWidth: 180 }}>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={roleFilter}
                                                label="Role"
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <MenuItem value="all">All Roles</MenuItem>
                                                {roleOptions.map(role => (
                                                    <MenuItem key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl sx={{ minWidth: 180 }}>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={statusFilter}
                                                label="Status"
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <MenuItem value="all">All Status</MenuItem>
                                                {STATUS_OPTIONS.map(status => (
                                                    <MenuItem key={status} value={status}>
                                                        {formatStatus(status)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={() => {
                                                setSearch('');
                                                setRoleFilter('all');
                                                setStatusFilter('all');
                                                setSelectedUsers([]);
                                            }}
                                        >
                                            Clear
                                        </Button>

                                        {selectedUsers.length > 0 && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleBulkAction}
                                            >
                                                Bulk Actions ({selectedUsers.length})
                                            </Button>
                                        )}
                                    </Stack>
                                </GlassPaper>

                                {/* User Table */}
                                <GlassPaper sx={{ p: 0, overflow: 'hidden' }}>
                                    <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6">
                                                User List
                                                <Chip
                                                    size="small"
                                                    label={`${filteredUsers.length} users`}
                                                    sx={{ ml: 2, backgroundColor: alpha(COLORS.royalPurple, 0.2) }}
                                                />
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => setOpenCreateDialog(true)}
                                            >
                                                Add New User
                                            </Button>
                                        </Box>
                                    </Box>

                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                            indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={orderBy === 'name'}
                                                            direction={orderBy === 'name' ? orderDirection : 'asc'}
                                                            onClick={() => handleSort('name')}
                                                        >
                                                            User
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>Contact</TableCell>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={orderBy === 'status'}
                                                            direction={orderBy === 'status' ? orderDirection : 'asc'}
                                                            onClick={() => handleSort('status')}
                                                        >
                                                            Status
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>Roles</TableCell>
                                                    <TableCell align="center">Access</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredUsers.map((user) => {
                                                    const userStatus = user.account_status ?? 'active';
                                                    const isSelected = selectedUsers.includes(user.id);

                                                    return (
                                                        <GlassTableRow
                                                            key={user.id}
                                                            hover
                                                            selected={isSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onChange={() => handleSelectUser(user.id)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.royalPurple} 100%)`,
                                                                            border: `2px solid ${alpha(COLORS.softPink, 0.3)}`,
                                                                        }}
                                                                    >
                                                                        {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body2" fontWeight={600}>
                                                                            {user.name}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            ID: {user.id}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack spacing={0.5}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <EmailIcon fontSize="small" sx={{ opacity: 0.7 }} />
                                                                        <Typography variant="body2">{user.email}</Typography>
                                                                    </Box>
                                                                    {user.phone && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <PhoneIcon fontSize="small" sx={{ opacity: 0.7 }} />
                                                                            <Typography variant="body2">{user.phone}</Typography>
                                                                        </Box>
                                                                    )}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <StatusChip
                                                                    icon={getStatusIcon(userStatus)}
                                                                    label={formatStatus(userStatus)}
                                                                    statuscolor={userStatus}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                                    {(user.roles ?? []).map((role) => (
                                                                        <Chip
                                                                            key={role}
                                                                            label={role}
                                                                            size="small"
                                                                            sx={{
                                                                                backgroundColor: alpha(
                                                                                    role === 'admin' ? COLORS.deepPurple :
                                                                                    role === 'editor' ? COLORS.royalPurple :
                                                                                    role === 'writer' ? COLORS.mediumPurple : COLORS.softPink,
                                                                                    0.2
                                                                                ),
                                                                                border: `1px solid ${alpha(
                                                                                    role === 'admin' ? COLORS.deepPurple :
                                                                                    role === 'editor' ? COLORS.royalPurple :
                                                                                    role === 'writer' ? COLORS.mediumPurple : COLORS.softPink,
                                                                                    0.3
                                                                                )}`,
                                                                                color: mode === 'light' ?
                                                                                    (role === 'admin' ? COLORS.deepPurple :
                                                                                     role === 'editor' ? COLORS.royalPurple :
                                                                                     role === 'writer' ? COLORS.mediumPurple : COLORS.softPink)
                                                                                    : '#ffffff',
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Switch
                                                                    checked={userStatus === 'active'}
                                                                    onChange={() => handleStatusToggle(user)}
                                                                    disabled={userStatus === 'deleted'}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => openEdit(user)}
                                                                    sx={{ color: mode === 'light' ? COLORS.royalPurple : COLORS.softPink }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    sx={{ color: mode === 'light' ? '#FF6B6B' : '#FF8A8A' }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </GlassTableRow>
                                                    );
                                                })}
                                                {filteredUsers.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                            <Typography color="text.secondary">
                                                                No users found matching your criteria
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </GlassPaper>
                            </Stack>
                        </Fade>
                    </Container>
                </Box>

                {/* ===== CREATE USER DIALOG ===== */}
                <GlassDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
                    <Box component="form" onSubmit={handleCreateUser}>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: COLORS.royalPurple }}>
                                    <AddIcon />
                                </Avatar>
                                <Typography variant="h6">Create New User Account</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={3} sx={{ pt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Full Name"
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            type="email"
                                            label="Email Address"
                                            value={createForm.email}
                                            onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={createForm.phone}
                                            onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            value={createForm.location}
                                            onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <FormControl fullWidth required>
                                    <InputLabel>Role Assignment</InputLabel>
                                    <Select
                                        multiple
                                        value={createForm.roles}
                                        label="Role Assignment"
                                        onChange={(e) => setCreateForm({...createForm, roles: e.target.value})}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {roleOptions.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                <Checkbox checked={createForm.roles.includes(role)} />
                                                <ListItemText
                                                    primary={role.charAt(0).toUpperCase() + role.slice(1)}
                                                    secondary={ROLE_DETAILS[role]}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Account Status</InputLabel>
                                            <Select
                                                value={createForm.account_status}
                                                label="Account Status"
                                                onChange={(e) => setCreateForm({...createForm, account_status: e.target.value})}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {formatStatus(status)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Temporary Password"
                                            value={createForm.temporary_password}
                                            onChange={(e) => setCreateForm({...createForm, temporary_password: e.target.value})}
                                            helperText="Leave empty to auto-generate"
                                        />
                                    </Grid>
                                </Grid>

                                <FormControl>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Switch
                                            checked={createForm.send_invitation}
                                            onChange={(e) => setCreateForm({...createForm, send_invitation: e.target.checked})}
                                        />
                                        <Box>
                                            <Typography variant="body2">Send welcome email</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                User will receive login instructions
                                            </Typography>
                                        </Box>
                                    </Box>
                                </FormControl>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading && <CloudDoneIcon />}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogActions>
                    </Box>
                </GlassDialog>

                {/* ===== EDIT USER DIALOG ===== */}
                <GlassDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
                    <Box component="form" onSubmit={handleEditUser}>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: COLORS.royalPurple }}>
                                    <EditIcon />
                                </Avatar>
                                <Typography variant="h6">Edit User: {selectedUser?.name}</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={3} sx={{ pt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Full Name"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            type="email"
                                            label="Email Address"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <FormControl fullWidth required>
                                    <InputLabel>Role Assignment</InputLabel>
                                    <Select
                                        multiple
                                        value={editForm.roles}
                                        label="Role Assignment"
                                        onChange={(e) => setEditForm({...editForm, roles: e.target.value})}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {roleOptions.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                <Checkbox checked={editForm.roles.includes(role)} />
                                                <ListItemText
                                                    primary={role.charAt(0).toUpperCase() + role.slice(1)}
                                                    secondary={ROLE_DETAILS[role]}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required>
                                    <InputLabel>Account Status</InputLabel>
                                    <Select
                                        value={editForm.account_status}
                                        label="Account Status"
                                        onChange={(e) => setEditForm({...editForm, account_status: e.target.value})}
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {formatStatus(status)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading && <CloudDoneIcon />}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogActions>
                    </Box>
                </GlassDialog>

                {/* ===== DELETE CONFIRMATION DIALOG ===== */}
                <GlassDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete user "{selectedUser?.name}"?
                            This action can be undone within 30 days.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} variant="contained" color="error">
                            Delete User
                        </Button>
                    </DialogActions>
                </GlassDialog>

                {/* ===== BULK ACTION DIALOG ===== */}
                <GlassDialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Bulk Actions</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Selected {selectedUsers.length} users
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Choose Action</InputLabel>
                            <Select
                                value=""
                                label="Choose Action"
                                onChange={(e) => {
                                    showSnackbar('info', `Bulk action: ${e.target.value} not implemented yet`);
                                    setOpenBulkDialog(false);
                                }}
                            >
                                <MenuItem value="activate">Activate Users</MenuItem>
                                <MenuItem value="suspend">Suspend Users</MenuItem>
                                <MenuItem value="delete">Delete Users</MenuItem>
                                <MenuItem value="role">Change Role</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
                    </DialogActions>
                </GlassDialog>

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
