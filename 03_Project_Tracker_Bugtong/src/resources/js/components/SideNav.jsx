import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Collapse, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { usePage } from '@inertiajs/react';

export default function SideNav({ open, onClose, projects = [] }) {
  const [showProjects, setShowProjects] = React.useState(true);
  const { url } = usePage();
  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: { md: 220 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 220,
          boxSizing: 'border-box',
          borderRadius: '0 14px 14px 0',
          background: 'background.default',
          boxShadow: 2,
        },
        display: { xs: open ? 'block' : 'none', md: 'block' },
      }}
    >
      <Box sx={{ mt: 2 }}>
        <List>
          <ListItemButton component="a" href="/dashboard" selected={url === '/dashboard'} sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component="a" href="/projects" selected={url.startsWith('/projects')} sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon><FolderIcon /></ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItemButton>
        </List>
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={() => setShowProjects((v) => !v)}>
          <ListItemText primary="Recent Projects" />
          {showProjects ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={showProjects} timeout="auto" unmountOnExit>
          <List dense>
            {projects.slice(0, 5).map((project) => (
              <ListItemButton key={project.id} component="a" href={`/projects/${project.id}`}>
                <ListItemIcon><FolderIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={project.title} primaryTypographyProps={{ noWrap: true }} />
              </ListItemButton>
            ))}
            {projects.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                No projects yet.
              </Typography>
            )}
          </List>
        </Collapse>
      </Box>
    </Drawer>
  );
}
