import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Get from localStorage or default to light mode
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme-mode');
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('theme-mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Light Mode Colors
    const lightTheme = {
        isDark: false,
        bg: {
            primary: '#e8e8e8',
            secondary: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#555555',
            tertiary: '#777777',
        },
        accent: '#d4af37',
        accentHover: '#e6c550',
        border: 'rgba(212, 175, 55, 0.2)',
        borderHover: '#d4af37',
    };

    // Dark Mode Colors
    const darkTheme = {
        isDark: true,
        bg: {
            primary: '#1a1a1a',
            secondary: '#2d2d2d',
            paper: '#3a3a3a',
        },
        text: {
            primary: '#ffffff',
            secondary: '#e0e0e0',
            tertiary: '#b0b0b0',
        },
        accent: '#d4af37',
        accentHover: '#e6c550',
        border: 'rgba(212, 175, 55, 0.3)',
        borderHover: '#d4af37',
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}
