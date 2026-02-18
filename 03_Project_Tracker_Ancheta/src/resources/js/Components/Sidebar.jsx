import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Stack,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
  ChecklistRtl as TasksIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import ThemeToggle from '@/Components/ThemeToggle';
import { getGlassStyles } from '@/Utils/theme';

export default function Sidebar({ open, onClose }) {
  const { isDarkMode, colors } = useTheme();
  const { auth } = usePage().props;
  const user = auth.user;

  const drawerStyle = {
    ...getGlassStyles(isDarkMode),
    borderRight: `1px solid ${colors.glassBorder}`,
    backgroundColor: colors.glass,
  };

  const navItems = [
    { label: 'Dashboard', href: route('dashboard'), icon: DashboardIcon, active: route().current('dashboard') },
    { label: 'Projects', href: route('projects.index'), icon: ProjectsIcon, active: route().current('projects.*') },
    { label: 'Tasks', href: route('tasks.index'), icon: TasksIcon, active: route().current('tasks.*') },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...drawerStyle,
          backdropFilter: 'blur(10px)',
          width: 280,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose} size="small" sx={{ color: colors.primary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo/Title */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: colors.headline,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📊 Tracker
        </Typography>
      </Box>

      <Divider sx={{ borderColor: colors.glassBorder }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
              <ListItem
                button
                sx={{
                  mx: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  mb: 1,
                  background: item.active ? `rgba(7, 128, 128, 0.15)` : 'transparent',
                  '&:hover': {
                    background: `rgba(7, 128, 128, 0.1)`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: item.active ? colors.primary : colors.paragraph, minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      color: item.active ? colors.primary : colors.paragraph,
                      fontWeight: item.active ? 600 : 500,
                    },
                  }}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>

      <Divider sx={{ borderColor: colors.glassBorder }} />

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          background: `rgba(7, 128, 128, 0.05)`,
          borderTop: `1px solid ${colors.glassBorder}`,
        }}
      >
        {/* User Info */}
        <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <Avatar
            sx={{
              background: colors.primary,
              color: '#fff',
              width: 40,
              height: 40,
              fontWeight: 700,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: colors.headline,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.paragraph,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <ThemeToggle />
          <Link href={route('logout')} method="post" as="button" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <IconButton
              size="small"
              sx={{
                color: colors.accent,
                '&:hover': {
                  background: colors.glass,
                },
              }}
              title="Logout"
            >
              <LogoutIcon />
            </IconButton>
          </Link>
        </Stack>
      </Box>
    </Drawer>
  );
}
