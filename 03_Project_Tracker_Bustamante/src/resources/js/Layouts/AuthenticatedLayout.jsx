import { Link, router, usePage } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import {
    FolderKanban,
    LayoutDashboard,
    LogOut,
    UserCircle2,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const nav = useMemo(
        () => [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                active: route().current('dashboard'),
                icon: LayoutDashboard,
            },
            {
                label: 'Projects',
                href: route('projects.index'),
                active: route().current('projects.*') || route().current('tasks.*'),
                icon: FolderKanban,
            },
        ],
        [],
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" elevation={0} color="transparent">
                <Toolbar>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                            sx={(theme) => ({
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.14),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                            })}
                        >
                            <FolderKanban size={18} />
                        </Box>
                        <Typography
                            component={Link}
                            href={route('dashboard')}
                            color="inherit"
                            sx={{ textDecoration: 'none' }}
                            variant="h6"
                            fontWeight={950}
                        >
                            Project Tracker of Juswa
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ ml: 3, flexGrow: 1 }}>
                        {nav.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                href={item.href}
                                variant={item.active ? 'contained' : 'text'}
                                color={item.active ? 'primary' : 'inherit'}
                                startIcon={item.icon ? <item.icon size={18} /> : null}
                                sx={{
                                    borderRadius: 999,
                                    ...(item.active
                                        ? {}
                                        : {
                                              '&:hover': {
                                                  bgcolor: (theme) =>
                                                      alpha(
                                                          theme.palette.primary.main,
                                                          0.08,
                                                      ),
                                              },
                                          }),
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>

                    <IconButton
                        color="inherit"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        aria-label="account menu"
                        sx={{
                            borderRadius: 999,
                            '&:hover': {
                                bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        <UserCircle2 size={22} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem disabled>
                            <Stack>
                                <Typography fontWeight={700}>{user.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                router.visit(route('profile.edit'));
                            }}
                        >
                            <ListItemIcon>
                                <UserCircle2 size={18} />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                router.post(route('logout'));
                            }}
                        >
                            <ListItemIcon>
                                <LogOut size={18} />
                            </ListItemIcon>
                            Log out
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {header ? (
                    <Box sx={{ mb: 3 }}>{header}</Box>
                ) : null}
                {children}
            </Container>
        </Box>
    );
}
