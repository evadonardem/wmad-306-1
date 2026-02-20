import BrandMark from '@/Components/BrandMark';
import AppFooter from '@/Components/AppFooter';
import PageTransition from '@/Components/PageTransition';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import { LayoutDashboard, FolderKanban, User as UserIcon, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isProfileActive = route().current('profile.*');

    const [menuAnchor, setMenuAnchor] = useState(null);
    const open = Boolean(menuAnchor);

    const navItems = useMemo(
        () => [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                active: route().current('dashboard'),
                icon: <LayoutDashboard size={18} />,
            },
            {
                label: 'Projects',
                href: route('projects.index'),
                active: route().current('projects.*'),
                icon: <FolderKanban size={18} />,
            },
        ],
        [],
    );

    const logout = () => {
        router.post(route('logout'));
    };

    return (
        <Box sx={{ minHeight: '100dvh' }}>
            <AppBar position="sticky" color="default" elevation={0}>
                <Toolbar>
                    <Box
                        component={Link}
                        href="/"
                        sx={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <BrandMark />
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                href={item.href}
                                color={item.active ? 'primary' : 'inherit'}
                                startIcon={item.icon}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <IconButton
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        color={isProfileActive ? 'primary' : 'inherit'}
                        aria-label="Account"
                        sx={{
                            ml: 1,
                            ...(isProfileActive
                                ? {
                                      backgroundColor: 'action.selected',
                                      '&:hover': {
                                          backgroundColor: 'action.selected',
                                      },
                                  }
                                : {}),
                        }}
                    >
                        <UserIcon size={20} />
                    </IconButton>

                    <Menu
                        anchorEl={menuAnchor}
                        open={open}
                        onClose={() => setMenuAnchor(null)}
                    >
                        <MenuItem disabled>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            href={route('profile.edit')}
                            onClick={() => setMenuAnchor(null)}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                logout();
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LogOut size={18} />
                                <span>Log out</span>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {header ? (
                    <Box sx={{ mb: 3 }}>
                        {typeof header === 'string' ? (
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {header}
                            </Typography>
                        ) : (
                            header
                        )}
                    </Box>
                ) : null}

                <PageTransition>{children}</PageTransition>
                <AppFooter />
            </Container>
        </Box>
    );
}
