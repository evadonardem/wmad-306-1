// resources/js/Pages/Projects/Index.jsx
import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Snackbar,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  LinearProgress,
  Paper,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FolderIcon from '@mui/icons-material/Folder'
import axios from 'axios'
import { usePage } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'

// ⬇️ Adjust this import path to where your dialog component actually lives
// e.g. '../../Components/EditCreateDialog' or '../Components/EditCreateDialog'
import EditCreateDialog from '../../Components/EditCreateDialog'

export default function Index({ initialProjects }) {
  const [open, setOpen] = React.useState(false)
  const [editProject, setEditProject] = React.useState(null)
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '' })
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [changes, setChanges] = React.useState([])

  const { props } = usePage()
  const projects = initialProjects ?? props?.projects ?? []
  const currentProjectId = props?.project?.id ?? null

  React.useEffect(() => {
    if (currentProjectId) {
      axios.get(`/projects/${currentProjectId}/changes`).then((res) => {
        setChanges(res.data)
      })
    } else {
      setChanges([])
    }
  }, [currentProjectId])

  const handleCreate = () => {
    setEditProject(null)
    setOpen(true)
  }

  const handleEdit = (project) => {
    setEditProject(project)
    setOpen(true)
  }

  const handleDelete = (project) => {
    if (window.confirm('Delete this project?')) {
      Inertia.delete(`/projects/${project.id}`, {
        onSuccess: () => setSnackbar({ open: true, message: 'Project deleted!' }),
      })
      // Alternatively (newer API):
      // router.delete(`/projects/${project.id}`, { onSuccess: () => setSnackbar({ open: true, message: 'Project deleted!' }) })
    }
  }

  const handleDialogClose = () => setOpen(false)
  const handleDialogSuccess = (msg) => {
    setOpen(false)
    setSnackbar({ open: true, message: msg })
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        minHeight: '100vh',
        px: { xs: 1, md: 4 },
        py: { xs: 2, md: 4 },
      }}
    >
      <AppBar position="static" sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Project Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { borderRadius: 2, boxShadow: 2, p: 2 } }}
      >
        <List>
          <ListItem
            button
            selected={!currentProjectId}
            onClick={() => Inertia.visit('/projects')}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemText primary="Projects" />
          </ListItem>

          {projects.map((project) => (
            <ListItem
              button
              key={project.id}
              selected={currentProjectId === project.id}
              onClick={() => Inertia.visit(`/projects/${project.id}`)}
              sx={{ borderRadius: 2, mb: 1, pl: 2 }}
            >
              <ListItemText primary={project.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Welcome to Project Tracker
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Manage your projects efficiently and visually.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCreate}
          sx={{ mt: 2, borderRadius: 2, boxShadow: 2 }}
        >
          Create New Project
        </Button>
      </Paper>

      <Box sx={{ p: { xs: 1, md: 3 }, background: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Projects
          </Typography>
          <Button variant="contained" onClick={handleCreate} sx={{ borderRadius: 2, boxShadow: 2 }}>
            Add Project
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Typography sx={{ mt: 2 }}>No projects found. Create your first project!</Typography>
        ) : (
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  elevation={6}
                  sx={{
                    borderRadius: 3,
                    transition: 'transform 0.2s',
                    ':hover': { transform: 'scale(1.03)', boxShadow: 8 },
                    border: currentProjectId === project.id ? '2px solid #1976d2' : undefined,
                    boxShadow: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#3f51b5', mr: 2, width: 48, height: 48 }}>
                        <FolderIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>
                        {project.title}
                      </Typography>
                    </Box>

                    <Typography color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>

                    {/* Example progress bar for project completion */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress ?? 50}
                        sx={{ height: 8, borderRadius: 5, mt: 0.5 }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button size="small" onClick={() => Inertia.visit(`/projects/${project.id}`)} sx={{ borderRadius: 2 }}>
                      View
                    </Button>
                    <Button size="small" onClick={() => handleEdit(project)} sx={{ borderRadius: 2 }}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(project)} sx={{ borderRadius: 2 }}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Project Change History */}
      {currentProjectId && (
        <Box sx={{ mt: 4, background: '#fff', borderRadius: 2, boxShadow: 2, p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Project Change History
          </Typography>

          {changes.length === 0 ? (
            <Typography color="text.secondary">No changes found for this project.</Typography>
          ) : (
            <List>
              {changes.map((change) => (
                <ListItem key={change.id} sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText primary={change.change_type} secondary={change.description || ''} />
                  {change.user && <Avatar sx={{ ml: 2 }}>{change.user.name?.[0] ?? '?'}</Avatar>}
                  <Typography variant="caption" sx={{ ml: 2 }}>
                    {new Date(change.created_at).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      <EditCreateDialog
        open={open}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        project={editProject}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  )
}