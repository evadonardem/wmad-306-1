// Glassmorphism utility function to generate sx props for MUI components
export const getGlassStyles = (isDarkMode) => ({
  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
  boxShadow: isDarkMode
    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
});

// Extended glass styles for cards with hover effect
export const getGlassCardStyles = (isDarkMode) => ({
  ...getGlassStyles(isDarkMode),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)',
    boxShadow: isDarkMode
      ? '0 8px 32px 0 rgba(7, 128, 128, 0.3)'
      : '0 8px 32px 0 rgba(7, 128, 128, 0.2)',
    transform: 'translateY(-4px)',
  },
});

// Color palette
export const colorPalette = {
  background: '#f8f5f2',
  darkBackground: '#1a1a1a',
  headline: '#232323',
  darkHeadline: '#ffffff',
  paragraph: '#222525',
  darkParagraph: '#e0e0e0',
  primary: '#078080',
  accent: '#f45d48',
};

// Utility to get responsive spacing
export const getSpacing = (value = 1) => value * 8;
