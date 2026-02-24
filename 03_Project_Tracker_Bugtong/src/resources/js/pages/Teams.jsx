import React from 'react';
import { Box, Container, Grid, Card, Stack, Typography, Avatar } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

const mockTeams = [
  { id: 1, name: 'Frontend', members: ['Jane Doe', 'John Smith'] },
  { id: 2, name: 'Backend', members: ['Alice Lee', 'Bob Ray'] },
  { id: 3, name: 'DevOps', members: ['Sam Green'] },
];

const Teams = () => (
  <MainLayout title="Teams">
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Teams</Typography>
      <Grid container spacing={4}>
        {mockTeams.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team.id}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{team.name}</Typography>
              <Stack direction="row" spacing={2}>
                {team.members.map((member) => (
                  <Avatar key={member} sx={{ width: 32, height: 32 }}>{member[0]}</Avatar>
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>Members: {team.members.join(', ')}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </MainLayout>
);

export default Teams;
