import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export default function AppTheme({ children, disableCustomTheme }) {
  // You can add color mode logic here if needed
  const theme = lightTheme; // Replace with dynamic mode if needed
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
