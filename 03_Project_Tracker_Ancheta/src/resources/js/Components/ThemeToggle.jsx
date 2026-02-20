import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: colors.secondary,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: colors.glass,
          transform: 'rotate(20deg) scale(1.1)',
        },
        '&:active': {
          transform: 'rotate(20deg) scale(0.95)',
        },
      }}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
