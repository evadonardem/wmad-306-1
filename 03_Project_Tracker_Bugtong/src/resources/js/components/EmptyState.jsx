import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function EmptyState({ title, description, cta, onCta }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <AddCircleOutlineIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
      {cta && (
        <Stack alignItems="center">
          <Button variant="contained" color="primary" onClick={onCta} startIcon={<AddCircleOutlineIcon />}>{cta}</Button>
        </Stack>
      )}
    </Box>
  );
}
