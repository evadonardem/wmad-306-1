import { Link, router, usePage } from '@inertiajs/react';
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useThemeMode } from '@/Providers/ThemeModeProvider';

export default function TaskMoLayout({ title, children, searchValue = '' }) {
    const page = usePage();
    const user = page.props.auth.user;
    const { mode, toggle } = useThemeMode();
    const [anchorEl, setAnchorEl] = useState(null);
    const [q, setQ] = useState(searchValue);
    const dashRef = useRef(null);
    const projectsRef = useRef(null);
    const navWrapRef = useRef(null);
    const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false });

    const currentUrl = page.url ?? '';
    const onDashboard = currentUrl === '/dashboard' || currentUrl.startsWith('/dashboard?');
    const onProjects = currentUrl === '/projects' || currentUrl.startsWith('/projects/');

    const navBase =
        'relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-extrabold text-gray-800 transition-colors dark:text-gray-100';
    const navActive = 'text-gray-950 dark:text-white';

    const initials = useMemo(() => {
        const name = user?.name ?? '';
        if (!name) return 'U';
        return name
            .split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();
    }, [user?.name]);

    const onSubmitSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard'), { q }, { preserveState: true });
    };

    useEffect(() => {
        const wrap = navWrapRef.current;
        if (!wrap) return;

        const activeEl = onDashboard ? dashRef.current : onProjects ? projectsRef.current : null;
        if (!activeEl) {
            setNavIndicator((prev) => (prev.visible ? { left: 0, width: 0, visible: false } : prev));
            return;
        }

        const wrapRect = wrap.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const nextLeft = Math.round(activeRect.left - wrapRect.left);
        const nextWidth = Math.round(activeRect.width);

        setNavIndicator({ left: nextLeft, width: nextWidth, visible: true });
    }, [onDashboard, onProjects, currentUrl]);

    return (
        <Box className="min-h-screen bg-white dark:bg-gray-950 bg-grid dark:bg-grid-dark [background-size:32px_32px]">
            <AppBar
                position="sticky"
                elevation={0}
                color="default"
                enableColorOnDark
                className="border-b border-gray-200/60 bg-white/95 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/95"
            >
                <Toolbar className="mx-auto min-h-[72px] w-full max-w-7xl gap-3 px-6">
                    <Typography
                        variant="h4"
                        component={Link}
                        href={route('dashboard')}
                        className="flex items-center gap-1"
                        sx={{ textDecoration: 'none' }}
                        aria-label="TaskMo"
                    >
                        <Box
                            component="img"
                            src="/images/taskmo-logo.png"
                            alt="TaskMo"
                            draggable={false}
                            className="h-11 w-auto select-none"
                        />
                        <Box className="hidden select-none text-lg font-black leading-none tracking-tight text-blue-600 dark:text-blue-400 sm:block">
                            TaskMo
                        </Box>
                    </Typography>

                    <Box component="form" onSubmit={onSubmitSearch} className="flex-1">
                        <TextField
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            size="small"
                            fullWidth
                            placeholder="Search projects & tasks"
                            InputProps={{
                                startAdornment: (
                                    <Box className="mr-2 flex items-center text-gray-500 dark:text-gray-400">
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                                className: 'taskmo-card',
                            }}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 0,
                                },
                            }}
                        />
                    </Box>

                    <Box ref={navWrapRef} className="relative flex items-center gap-2">
                        <Link
                            ref={dashRef}
                            href={route('dashboard')}
                            className={`${navBase} ${onDashboard ? navActive : ''}`}
                            aria-current={onDashboard ? 'page' : undefined}
                        >
                            <DashboardIcon fontSize="small" className="opacity-80" />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            ref={projectsRef}
                            href={route('projects.index')}
                            className={`${navBase} ${onProjects ? navActive : ''}`}
                            aria-current={onProjects ? 'page' : undefined}
                        >
                            <FolderIcon fontSize="small" className="opacity-80" />
                            <span>Projects</span>
                        </Link>

                        <span
                            aria-hidden
                            className={`taskmo-nav-indicator pointer-events-none absolute -bottom-1 h-[3px] rounded-full transition-[left,width,opacity] duration-300 ease-out ${
                                navIndicator.visible ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ left: navIndicator.left, width: navIndicator.width }}
                        />
                    </Box>

                    <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        className="taskmo-btn p-0.5 !border-gray-200/40 dark:!border-gray-700/40"
                        aria-label="Profile menu"
                        title="Profile menu"
                    >
                        <Avatar className="shadow-sm">{initials}</Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        disableScrollLock
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        PaperProps={{
                            elevation: 0,
                            className: 'taskmo-card !rounded-2xl !p-2',
                            sx: {
                                mt: 1.25,
                                width: 232,
                                maxWidth: 'calc(100vw - 24px)',
                            },
                        }}
                        MenuListProps={{ className: '!p-0 taskmo-hide-scrollbar' }}
                    >
                        <Box className="px-5 py-4 text-center">
                            <div className="taskmo-heading-3d taskmo-heading-glow text-lg font-black text-blue-600 dark:text-blue-400">
                                {user?.name}
                            </div>
                            <div className="mt-1 truncate text-xs font-semibold text-gray-500 dark:text-gray-300">
                                {user?.email}
                            </div>
                        </Box>

                        <Box className="h-px bg-gray-200/60 dark:bg-gray-700/60" />

                        <MenuItem
                            component={Link}
                            href={route('profile.edit')}
                            onClick={() => setAnchorEl(null)}
                            className="taskmo-card-solid mx-2 my-1 flex w-[calc(100%-16px)] items-center justify-center gap-2 rounded-2xl py-3 text-center font-extrabold text-indigo-700 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 dark:text-indigo-200"
                        >
                            <AccountCircleRoundedIcon fontSize="small" className="opacity-90" />
                            <span>Profile Page</span>
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                toggle();
                                setAnchorEl(null);
                            }}
                            className="taskmo-card-solid mx-2 my-1 flex w-[calc(100%-16px)] items-center justify-center gap-2 rounded-2xl py-3 text-center font-extrabold text-fuchsia-700 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 dark:text-fuchsia-200"
                        >
                            {mode === 'dark' ? (
                                <LightModeRoundedIcon fontSize="small" className="opacity-90" />
                            ) : (
                                <DarkModeRoundedIcon fontSize="small" className="opacity-90" />
                            )}
                            <span>Theme Toggle</span>
                        </MenuItem>

                        <MenuItem
                            component="button"
                            onClick={() => {
                                setAnchorEl(null);
                                router.post(route('logout'));
                            }}
                            className="taskmo-card-solid mx-2 my-1 flex w-[calc(100%-16px)] items-center justify-center gap-2 rounded-2xl py-3 text-center font-extrabold text-red-700 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 dark:text-red-200"
                        >
                            <LogoutRoundedIcon fontSize="small" className="opacity-90" />
                            <span>Log Out</span>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box className="mx-auto w-full max-w-7xl px-6 py-10">
                {title && (
                    <Typography variant="h4" component="h1" className="mb-6 text-center font-extrabold">
                        {title}
                    </Typography>
                )}

                {children}
            </Box>
        </Box>
    );
}
