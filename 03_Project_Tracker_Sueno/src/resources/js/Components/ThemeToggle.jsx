import { IconButton, Box } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@/Context/ThemeContext';

export default function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 9999,
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                padding: '0.5rem',
            }}
        >
            <IconButton
                onClick={toggleTheme}
                sx={{
                    color: '#d4af37',
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDarkMode ? <LightModeIcon fontSize="medium" /> : <DarkModeIcon fontSize="medium" />}
            </IconButton>
        </Box>
    );
}
