import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { SIDEBAR_ITEMS } from './dashboardTheme';

const iconMap = {
    feed: <AutoAwesomeRoundedIcon />,
    saved: <BookmarkBorderRoundedIcon />,
    history: <HistoryRoundedIcon />,
    settings: <SettingsRoundedIcon />,
};

export default function MobileBottomNav({ activeNav, onSelect }) {
    return (
        <Paper
            elevation={12}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                borderTop: '1px solid rgba(0,0,0,0.08)',
            }}
        >
            <BottomNavigation
                showLabels
                value={activeNav}
                onChange={(event, value) => onSelect?.(value)}
                sx={{ height: 64 }}
            >
                {SIDEBAR_ITEMS.map((item) => (
                    <BottomNavigationAction
                        key={item.key}
                        value={item.key}
                        label={item.label}
                        icon={iconMap[item.key] || <AutoAwesomeRoundedIcon />}
                        sx={{ minWidth: 0 }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
