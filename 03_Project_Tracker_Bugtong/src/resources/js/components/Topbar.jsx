const Topbar = ({ title, onToggleSidebar }) => {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#fff',
        boxShadow: '0 2px 8px 0 rgba(60,72,100,0.07)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onToggleSidebar} sx={{ mr: 2 }}>
            <SearchIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>{title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', background: '#f5f7fb', borderRadius: 2, px: 2, py: 0.5 }}>
            <SearchIcon sx={{ color: 'grey.500', mr: 1 }} />
            <InputBase placeholder="Search…" sx={{ width: 120 }} />
          </Box>
          <IconButton>
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon sx={{ color: 'grey.700' }} />
            </Badge>
          </IconButton>
          <Avatar alt="User" src="https://i.pravatar.cc/40" sx={{ width: 40, height: 40 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
