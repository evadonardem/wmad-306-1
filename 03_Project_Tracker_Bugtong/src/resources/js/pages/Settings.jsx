import React from 'react';
import { Box, Container, Card, Typography, TextField, Button } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

const Settings = () => (
  <MainLayout title="Settings">
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Settings</Typography>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Profile</Typography>
        <TextField label="Name" fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>Save Changes</Button>
      </Card>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Account</Typography>
        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>Update Password</Button>
      </Card>
    </Container>
  </MainLayout>
);

export default Settings;
