import { Paper, BottomNavigation, BottomNavigationAction, Zoom, Box } from '@mui/material';
import {
  AutoAwesome,
  BookmarkBorder,
  History,
  Settings,
  MenuBook,
} from '@mui/icons-material';
import { SIDEBAR_ITEMS } from './Student/DashboardSections/dashboardTheme';
import { useTheme as useGlobalTheme } from '@/Contexts/ThemeContext';

const iconMap = {
  feed: <AutoAwesome />,
  saved: <BookmarkBorder />,
  history: <History />,
  settings: <Settings />,
};

export default function MobileBottomNav({ activeNav, onSelect }) {
  const { colors } = useGlobalTheme();

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <Zoom in timeout={300}>
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1300,
            borderRadius: '32px',
            width: 'auto',
            minWidth: 320,
            maxWidth: '90%',
            backdropFilter: 'blur(10px)',
            backgroundColor: `${colors.paper}e6`,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transition: 'all 300ms ease',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.16)',
            },
          }}
        >
          <BottomNavigation
            showLabels
            value={activeNav}
            onChange={(event, value) => onSelect?.(value)}
            sx={{
              height: 56,
              bgcolor: 'transparent',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 64,
                px: 1.5,
                color: colors.byline,
                transition: 'all 200ms ease',
                '&.Mui-selected': {
                  color: colors.accent,
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  },
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.7rem',
                  transition: 'all 200ms ease',
                },
                '&:hover': {
                  color: colors.newsprint,
                  transform: 'translateY(-2px)',
                },
              },
            }}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <BottomNavigationAction
                key={item.key}
                value={item.key}
                label={item.label}
                icon={iconMap[item.key] || <MenuBook />}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Zoom>
    </Box>
  );
}
