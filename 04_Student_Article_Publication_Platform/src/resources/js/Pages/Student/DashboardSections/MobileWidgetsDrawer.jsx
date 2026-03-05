import { Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { COLORS } from './dashboardTheme';

export default function MobileWidgetsDrawer({ open, onClose, trendingItems = [] }) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 320, p: 2 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <AutoAwesomeRoundedIcon sx={{ color: COLORS.softPink }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Trending Now
                    </Typography>
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseRoundedIcon />
                </IconButton>
            </Stack>

            <List dense sx={{ p: 0 }}>
                {trendingItems.map((item, index) => (
                    <ListItemButton key={item.id || index} onClick={() => onClose?.()} sx={{ borderRadius: 1.5 }}>
                        <ListItemText
                            primary={item.title}
                            secondary={item.category || 'General'}
                            primaryTypographyProps={{ fontWeight: 700, color: 'text.primary' }}
                            secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                    </ListItemButton>
                ))}

                {trendingItems.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
                        No trending items yet.
                    </Typography>
                )}
            </List>
        </Drawer>
    );
}
