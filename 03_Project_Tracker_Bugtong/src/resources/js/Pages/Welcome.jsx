// resources/js/Pages/Welcome.jsx
import React from 'react'
import { Box, Typography, Button, Card } from '@mui/material'
import MainLayout from '../layouts/MainLayout' // make sure this path exists

export default function Welcome() {
  return (
    <MainLayout title="Welcome">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: 600, maxWidth: '95vw' }}>
          <Card sx={{ p: 5, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
              Welcome to Project Tracker
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Manage your projects, tasks, and team with a modern SaaS dashboard.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                href="/signin"
                sx={{ py: 1.5, fontWeight: 600, mt: 2 }}
              >
                Get Started
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  )
}