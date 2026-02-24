import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar collapsed={collapsed} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} onToggleSidebar={() => setCollapsed((c) => !c)} />
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4, px: { xs: 2, md: 4 }, py: 2 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
