import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <AppBar position="fixed" color="primary" elevation={2} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={onDrawerOpen} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
          Project Tracker
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {user ? (
            <>
              <Tooltip title={user.name}>
                <IconButton onClick={handleMenu} color="inherit" size="small" sx={{ ml: 1 }}>
                  <Avatar alt={user.name} src={user.avatar || undefined} />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} onClick={handleClose} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <MenuItem component="a" href="/login">Sign in</MenuItem>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
