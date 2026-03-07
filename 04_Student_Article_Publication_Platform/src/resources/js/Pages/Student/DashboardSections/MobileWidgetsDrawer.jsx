// MobileWidgetsDrawer.jsx (updated for consistency)
import {
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import { Close, TrendingUp } from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

export default function MobileWidgetsDrawer({ open, onClose, trendingItems = [] }) {
    const { colors } = useTheme();

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 300,
                    borderLeft: '1px solid',
                    borderColor: colors.border,
                    bgcolor: colors.background,
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TrendingUp sx={{ color: colors.accent }} />
                        <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700 }}>
                            Trending Now
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} size="small" sx={{ border: '1px solid', borderColor: colors.border, borderRadius: 0 }}>
                        <Close />
                    </IconButton>
                </Stack>

                <Divider sx={{ borderColor: colors.border, mb: 2 }} />

                <List disablePadding>
                    {trendingItems.map((item, index) => (
                        <ListItemButton
                            key={item.id || index}
                            onClick={onClose}
                            sx={{
                                px: 0,
                                py: 1.5,
                                borderBottom: index < trendingItems.length - 1 ? '1px solid' : 'none',
                                borderColor: colors.border,
                            }}
                        >
                            <ListItemText
                                primary={item.title}
                                secondary={item.category || 'General'}
                                primaryTypographyProps={{
                                    sx: {
                                        fontFamily: '"Times New Roman", Times, serif',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                    }
                                }}
                                secondaryTypographyProps={{
                                    sx: {
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: '0.7rem',
                                        color: colors.textSecondary,
                                    }
                                }}
                            />
                        </ListItemButton>
                    ))}

                    {trendingItems.length === 0 && (
                        <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: colors.textSecondary, py: 2 }}>
                            No trending items yet.
                        </Typography>
                    )}
                </List>
            </Box>
        </Drawer>
    );
}
