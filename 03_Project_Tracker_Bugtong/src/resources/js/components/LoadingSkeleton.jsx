import React from 'react';
import { Skeleton, Box, Grid } from '@mui/material';

export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'card') {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1 }} />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  // fallback: list
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={40} sx={{ mb: 1, borderRadius: 2 }} />
      ))}
    </Box>
  );
}
