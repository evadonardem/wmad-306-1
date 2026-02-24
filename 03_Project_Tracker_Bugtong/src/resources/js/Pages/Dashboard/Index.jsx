function Dashboard() {
  const { props } = usePage();
  const projects = props.projects || [];
  const recentProjects = projects.slice(0, 3);
  // Dummy task stats for now
  const taskStats = [
    { label: 'To Do', count: 5, color: 'default' },
    { label: 'In Progress', count: 3, color: 'info' },
    { label: 'Done', count: 8, color: 'success' },
  ];
  return (
    <AppLayout user={props.auth?.user} projects={projects}>
      <Box sx={{ px: { xs: 1, md: 4 }, py: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Dashboard</Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {taskStats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{stat.label}</Typography>
                  <Typography variant="h4" color={stat.color} fontWeight={700} sx={{ mb: 1 }}>{stat.count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, background: '#fff', borderRadius: 2, boxShadow: 2, p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Recent Projects</Typography>
          <Grid container spacing={4}>
            {recentProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" noWrap fontWeight={700} sx={{ mb: 1 }}>{project.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>{project.description}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button variant="contained" size="small" href={`/projects/${project.id}`} sx={{ borderRadius: 2 }}>View</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 4, borderRadius: 2 }}>Create Project</Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default Dashboard;
