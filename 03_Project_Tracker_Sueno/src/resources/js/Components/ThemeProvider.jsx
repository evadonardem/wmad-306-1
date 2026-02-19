import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: 'professional',
      styles: {},
    };
  }
  return context;
};

export default function ThemeProvider({ children }) {
  const value = {
    mode: 'professional',
    styles: {},
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
