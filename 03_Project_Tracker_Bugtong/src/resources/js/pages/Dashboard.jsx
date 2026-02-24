import PageHeader from '../components/PageHeader';
import { Card, LinearProgress, Avatar, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

const stats = [
  {
    title: 'Projects',
    value: 12,
    icon: <FolderIcon fontSize="large" />,
    color: 'primary.main',
  },
  {
    title: 'Tasks',
    value: 48,
    icon: <AssignmentIcon fontSize="large" />,
    color: 'secondary.main',
  },
  {
    title: 'Completed %',
    value: '76%',
    icon: <CheckCircleIcon fontSize="large" />,
    color: 'success.main',
  },
  {
    title: 'Overdue',
    value: 3,
    icon: <ErrorIcon fontSize="large" />,
    color: 'error.main',
  },
];

const recentProjects = [
  { id: 1, name: 'Website Redesign', progress: 80, owner: 'Jane Doe' },
  { id: 2, name: 'Mobile App', progress: 100, owner: 'John Smith' },
  { id: 3, name: 'API Integration', progress: 45, owner: 'Alice Lee' },
];

const activityFeed = [
  { id: 1, text: 'Project "Website Redesign" marked as Completed.', time: '2h ago' },
  { id: 2, text: 'Task "Setup CI/CD" moved to In Progress.', time: '4h ago' },
  { id: 3, text: 'Task "User Authentication" assigned to Jane Doe.', time: '1d ago' },
];

const Dashboard = () => (
  <MainLayout title="Dashboard">
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      <PageHeader title="Dashboard" subtitle="Overview & recent activity" />
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mb: 5 }}>
        <PageHeader title="Recent Projects" />
        <Grid container spacing={4}>
          {recentProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>{project.name[0]}</Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>{project.name}</Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 2, pl: 1 }}>Owner: {project.owner}</Typography>
                <Box sx={{ pl: 1 }}>
                  <Typography variant="caption" color="text.secondary">Progress</Typography>
                  <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 2, mt: 0.5 }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ mb: 2 }}>
        <PageHeader title="Activity Feed" />
        <Stack spacing={2}>
          {activityFeed.map((activity) => (
            <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', borderRadius: 2, p: 2, boxShadow: 2, minHeight: 56 }}>
              <Typography variant="body2" sx={{ flexGrow: 1, pl: 1 }}>{activity.text}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ pr: 2 }}>{activity.time}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  </MainLayout>
);

Dashboard.layout = page => <MainLayout>{page}</MainLayout>;

export default Dashboard;
