import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  currentTheme: string;
  customBackground: string;
  toggleDark: () => void;
  setTheme: (theme: string) => void;
  setCustomBackground: (url: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = {
  serenityBlue: {
    name: 'Serenity Blue',
    primary: 'blue',
    secondary: 'sky',
    accent: 'indigo'
  },
  sageGreen: {
    name: 'Sage Green',
    primary: 'emerald',
    secondary: 'teal',
    accent: 'green'
  },
  roseDust: {
    name: 'Rose Dust',
    primary: 'rose',
    secondary: 'pink',
    accent: 'red'
  },
  jetBlack: {
    name: 'Jet Black',
    primary: 'gray',
    secondary: 'slate',
    accent: 'zinc'
  },
  creamBeige: {
    name: 'Cream Beige',
    primary: 'amber',
    secondary: 'yellow',
    accent: 'orange'
  },
  lavenderFog: {
    name: 'Lavender Fog',
    primary: 'purple',
    secondary: 'violet',
    accent: 'fuchsia'
  },
  autumnBrown: {
    name: 'Autumn Brown',
    primary: 'orange',
    secondary: 'amber',
    accent: 'red'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('serenityBlue');
  const [customBackground, setCustomBackground] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('focusreads-theme');
    const savedDark = localStorage.getItem('focusreads-dark');
    const savedBackground = localStorage.getItem('focusreads-background');

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedDark) setIsDark(JSON.parse(savedDark));
    if (savedBackground) setCustomBackground(savedBackground);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('focusreads-dark', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('focusreads-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('focusreads-background', customBackground);
  }, [customBackground]);

  const toggleDark = () => setIsDark(!isDark);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      isDark,
      currentTheme,
      customBackground,
      toggleDark,
      setTheme,
      setCustomBackground
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};