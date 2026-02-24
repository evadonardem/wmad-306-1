import React, { useEffect, useState } from 'react';
import api from '../../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 160,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={params.value || 0} sx={{ height: 8, borderRadius: 2 }} />
          <Typography variant="caption" sx={{ ml: 1 }}>{params.value || 0}%</Typography>
        </Box>
      ),
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" sx={{ fontWeight: 500 }} />
      ),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 28, height: 28 }}>{params.value ? params.value[0] : '?'}</Avatar>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: () => {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const handleOpen = (event) => setAnchorEl(event.currentTarget);
        const handleClose = () => setAnchorEl(null);
        return (
          <>
            <IconButton onClick={handleOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout title="Projects">
      <Card sx={{ p: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Projects</Typography>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={projects}
            columns={columns}
            loading={loading}
            disableSelectionOnClick
            autoHeight
            sx={{
              borderRadius: 2,
              background: '#fff',
              boxShadow: 1,
              '& .MuiDataGrid-row:hover': {
                background: '#f5f7fb',
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Project Change History</Typography>
          {/* Placeholder: Fetch and display project changes from Laravel API (e.g., /api/projects/{id}/changes) */}
          <Box sx={{ bgcolor: '#f5f7fb', borderRadius: 2, p: 2, color: 'grey.700' }}>
            Coming soon: View project change history here.
          </Box>
        </Box>
      </Card>
    </MainLayout>
  );
};

export default Projects;
