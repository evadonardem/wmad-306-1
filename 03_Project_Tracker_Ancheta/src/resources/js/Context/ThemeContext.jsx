import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Midnight Slate Pro Theme
 * A modern, professional SaaS-style theme with light and dark modes
 * Enhanced typography for better readability in both light and dark modes
 */
const themes = {
  light: {
    // Background colors
    background: '#F5F7FA',
    surface: '#FFFFFF',

    // Accent colors
    primary: '#4F46E5',        // deep indigo
    secondary: '#0EA5E9',      // sky blue

    // Status colors
    success: '#10B981',        // emerald
    warning: '#F59E0B',        // amber
    danger: '#EF4444',         // red

    // Text colors - Enhanced for better readability
    textPrimary: '#111827',    // Nearly black for maximum contrast
    textSecondary: '#4B5563',  // Medium gray for secondary text
    textTertiary: '#6B7280',   // Light gray for tertiary text

    // UI elements
    border: '#E5E7EB',
    divider: '#E5E7EB',

    // Glass effect
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(229, 231, 235, 0.5)',

    // Shadows (soft elevation)
    shadowSoft: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',

    // Additional utilities
    headline: '#111827',
    paragraph: '#1F2937',
  },
  dark: {
    // Background colors
    background: '#0F172A',
    surface: '#1E293B',

    // Accent colors
    primary: '#6366F1',        // soft indigo glow
    secondary: '#38BDF8',      // cyan

    // Status colors
    success: '#34D399',        // emerald
    warning: '#FBBF24',        // amber
    danger: '#F87171',         // red

    // Text colors - Enhanced for better readability in dark mode
    textPrimary: '#F8FAFC',    // Almost white for maximum contrast (was #F8FAFC)
    textSecondary: '#CBD5E1',  // Light gray for secondary text (improved from #94A3B8)
    textTertiary: '#94A3B8',   // Medium gray for tertiary text

    // UI elements
    border: '#334155',
    divider: '#334155',

    // Glass effect
    glass: 'rgba(30, 41, 59, 0.8)',
    glassBorder: 'rgba(51, 65, 85, 0.6)',

    // Shadows (soft elevation)
    shadowSoft: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
    shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2)',

    // Additional utilities
    headline: '#F8FAFC',
    paragraph: '#E2E8F0',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme-mode');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    // Update document class for Tailwind dark mode support
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? themes.dark : themes.light;

  const theme = {
    isDarkMode,
    colors,
    // Utility function to get gradient for progress bars
    getGradient: () => isDarkMode
      ? 'linear-gradient(90deg, #6366F1 0%, #38BDF8 100%)'
      : 'linear-gradient(90deg, #4F46E5 0%, #0EA5E9 100%)',
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
