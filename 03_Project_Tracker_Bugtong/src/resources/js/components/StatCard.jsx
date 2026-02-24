import React from 'react';
import { Card, Box, Typography, IconButton } from '@mui/material';

const StatCard = ({ icon, title, value, color }) => (
  <Card
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: 2,
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 4 },
      cursor: 'pointer',
      borderRadius: 2,
    }}
  >
    <Box sx={{ bgcolor: color || 'primary.main', color: '#fff', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
    </Box>
  </Card>
);

export default StatCard;
