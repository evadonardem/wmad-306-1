import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
    {subtitle && <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>{subtitle}</Typography>}
    {children}
  </Box>
);

export default PageHeader;
