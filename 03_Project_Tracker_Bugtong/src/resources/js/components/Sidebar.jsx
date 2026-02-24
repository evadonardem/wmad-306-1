import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { label: 'Projects', icon: <FolderIcon />, href: '/projects' },
  { label: 'Tasks', icon: <TaskIcon />, href: '/tasks' },
  { label: 'Team', icon: <GroupIcon />, href: '/team' },
  { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

import { Link as InertiaLink, usePage } from '@inertiajs/react';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = ({ collapsed }) => {
  const { url } = usePage();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 64 : 220,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 64 : 220,
          boxSizing: 'border-box',
          background: 'background.default',
          borderRight: '1px solid #e0e3ea',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {!collapsed && <Typography variant="h6" fontWeight={700}>Project Tracker</Typography>}
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.href}
            selected={url.startsWith(item.href)}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              background: url.startsWith(item.href) ? '#e0e3ea' : 'transparent',
              '&:hover': { background: '#e0e3ea' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
            {!collapsed && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
