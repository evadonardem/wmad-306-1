// MobileBottomNav.jsx (updated with proper mobile-only display)
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { AutoStories, BookmarkBorder, History, Settings } from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

const NAV_ITEMS = [
    { key: 'feed', label: 'Home', icon: <AutoStories /> },
    { key: 'saved', label: 'Saved', icon: <BookmarkBorder /> },
    { key: 'history', label: 'History', icon: <History /> },
    { key: 'settings', label: 'Settings', icon: <Settings /> },
];

export default function MobileBottomNav({ activeNav, onSelect }) {
    const { colors } = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                borderTop: '1px solid',
                borderColor: colors.border,
                bgcolor: colors.background,
                display: { xs: 'block', md: 'none' }, // Only show on mobile
            }}
        >
            <BottomNavigation
                showLabels
                value={activeNav}
                onChange={(event, value) => onSelect?.(value)}
                sx={{
                    height: 64,
                    bgcolor: 'transparent',
                }}
            >
                {NAV_ITEMS.map((item) => (
                    <BottomNavigationAction
                        key={item.key}
                        value={item.key}
                        label={item.label}
                        icon={item.icon}
                        sx={{
                            color: colors.textSecondary,
                            '&.Mui-selected': {
                                color: colors.accent,
                            },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
