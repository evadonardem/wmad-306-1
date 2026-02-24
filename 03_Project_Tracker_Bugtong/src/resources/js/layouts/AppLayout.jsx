import React from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import TopBar from '../components/TopBar';
import SideNav from '../components/SideNav';

export default function AppLayout({ children, user, projects }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar onDrawerOpen={() => setDrawerOpen(true)} user={user} />
      <SideNav open={drawerOpen} onClose={() => setDrawerOpen(false)} projects={projects} />
      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1280, mx: 'auto', width: '100%' }}>
        <Toolbar />
        <Container maxWidth={false} disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
