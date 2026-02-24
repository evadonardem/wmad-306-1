import { Box, Container, Grid, Typography, Card, Chip, Avatar } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

const mockTasks = [
  { id: 1, title: 'Setup CI/CD', status: 'Todo', priority: 'High', assignee: 'Jane Doe' },
  { id: 2, title: 'User Authentication', status: 'In Progress', priority: 'Medium', assignee: 'John Smith' },
  { id: 3, title: 'API Integration', status: 'Done', priority: 'Low', assignee: 'Alice Lee' },
  { id: 4, title: 'UI Polish', status: 'Todo', priority: 'Low', assignee: 'Bob Ray' },
];

const columns = ['Todo', 'In Progress', 'Done'];

const getTasksByStatus = (status) => mockTasks.filter((task) => task.status === status);

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'default',
};

const Tasks = () => (
  <MainLayout title="Tasks">
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {columns.map((col) => (
          <Grid item xs={12} md={4} key={col}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{col}</Typography>
            <Stack spacing={2}>
              {getTasksByStatus(col).map((task) => (
                <Card key={task.id} sx={{ p: 2, borderRadius: 2, boxShadow: 2, display: 'flex', alignItems: 'center', gap: 2, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600}>{task.title}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={task.priority} color={priorityColors[task.priority]} size="small" sx={{ fontWeight: 500 }} />
                      <Avatar sx={{ width: 28, height: 28 }}>{task.assignee[0]}</Avatar>
                      <Typography variant="caption">{task.assignee}</Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  </MainLayout>
);

export default Tasks;
