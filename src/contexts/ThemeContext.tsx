import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  currentTheme: string;
  customBackground: string;
  toggleDark: () => void;
  setTheme: (theme: string) => void;
  setCustomBackground: (url: string) => void;
}

export const themes = {
  serenityBlue: {
    name: 'Serenity Blue',
    primary: '#3B82F6',
    secondary: '#0EA5E9',
    accent: '#6366F1',
    background: '#F8FAFC',
    darkBackground: '#0F172A',
    surface: '#FFFFFF',
    darkSurface: '#1E293B',
    text: '#1F2937',
    darkText: '#F9FAFB',
    textSecondary: '#6B7280',
    darkTextSecondary: '#9CA3AF',
    border: '#E5E7EB',
    darkBorder: '#374151'
  },
  sageGreen: {
    name: 'Sage Green',
    primary: '#10B981',
    secondary: '#14B8A6',
    accent: '#059669',
    background: '#F0FDF4',
    darkBackground: '#064E3B',
    surface: '#FFFFFF',
    darkSurface: '#065F46',
    text: '#1F2937',
    darkText: '#F0FDF4',
    textSecondary: '#6B7280',
    darkTextSecondary: '#A7F3D0',
    border: '#D1FAE5',
    darkBorder: '#047857'
  },
  roseDust: {
    name: 'Rose Dust',
    primary: '#F43F5E',
    secondary: '#EC4899',
    accent: '#DC2626',
    background: '#FFF1F2',
    darkBackground: '#7F1D1D',
    surface: '#FFFFFF',
    darkSurface: '#991B1B',
    text: '#1F2937',
    darkText: '#FFF1F2',
    textSecondary: '#6B7280',
    darkTextSecondary: '#FECACA',
    border: '#FECACA',
    darkBorder: '#DC2626'
  },
  jetBlack: {
    name: 'Jet Black',
    primary: '#6B7280',
    secondary: '#64748B',
    accent: '#374151',
    background: '#F9FAFB',
    darkBackground: '#111827',
    surface: '#FFFFFF',
    darkSurface: '#1F2937',
    text: '#1F2937',
    darkText: '#F9FAFB',
    textSecondary: '#6B7280',
    darkTextSecondary: '#9CA3AF',
    border: '#E5E7EB',
    darkBorder: '#374151'
  },
  creamBeige: {
    name: 'Cream Beige',
    primary: '#F59E0B',
    secondary: '#EAB308',
    accent: '#D97706',
    background: '#FFFBEB',
    darkBackground: '#78350F',
    surface: '#FFFFFF',
    darkSurface: '#92400E',
    text: '#1F2937',
    darkText: '#FFFBEB',
    textSecondary: '#6B7280',
    darkTextSecondary: '#FDE68A',
    border: '#FDE68A',
    darkBorder: '#D97706'
  },
  lavenderFog: {
    name: 'Lavender Fog',
    primary: '#A855F7',
    secondary: '#8B5CF6',
    accent: '#C026D3',
    background: '#FAF5FF',
    darkBackground: '#581C87',
    surface: '#FFFFFF',
    darkSurface: '#6B21A8',
    text: '#1F2937',
    darkText: '#FAF5FF',
    textSecondary: '#6B7280',
    darkTextSecondary: '#DDD6FE',
    border: '#DDD6FE',
    darkBorder: '#C026D3'
  },
  autumnBrown: {
    name: 'Autumn Brown',
    primary: '#EA580C',
    secondary: '#F59E0B',
    accent: '#DC2626',
    background: '#FFF7ED',
    darkBackground: '#9A3412',
    surface: '#FFFFFF',
    darkSurface: '#C2410C',
    text: '#1F2937',
    darkText: '#FFF7ED',
    textSecondary: '#6B7280',
    darkTextSecondary: '#FDBA74',
    border: '#FDBA74',
    darkBorder: '#DC2626'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check system preference first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusreads-dark');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [currentTheme, setCurrentTheme] = useState('serenityBlue');
  const [customBackground, setCustomBackground] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('focusreads-theme');
    const savedBackground = localStorage.getItem('focusreads-background');

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedBackground) setCustomBackground(savedBackground);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('focusreads-dark', JSON.stringify(isDark));
    
    // Apply comprehensive theme colors to CSS variables
    const theme = themes[currentTheme as keyof typeof themes];
    if (theme) {
      const root = document.documentElement;
      
      // Primary theme colors
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
      
      // Background colors
      root.style.setProperty('--color-background', isDark ? theme.darkBackground : theme.background);
      root.style.setProperty('--color-surface', isDark ? theme.darkSurface : theme.surface);
      
      // Text colors
      root.style.setProperty('--color-text', isDark ? theme.darkText : theme.text);
      root.style.setProperty('--color-text-secondary', isDark ? theme.darkTextSecondary : theme.textSecondary);
      
      // Border colors
      root.style.setProperty('--color-border', isDark ? theme.darkBorder : theme.border);
      
      // Apply to body for full coverage
      document.body.style.backgroundColor = isDark ? theme.darkBackground : theme.background;
      document.body.style.color = isDark ? theme.darkText : theme.text;
    }
  }, [isDark, currentTheme]);

  useEffect(() => {
    localStorage.setItem('focusreads-theme', currentTheme);
    
    // Apply theme colors immediately
    const theme = themes[currentTheme as keyof typeof themes];
    if (theme) {
      const root = document.documentElement;
      
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-background', isDark ? theme.darkBackground : theme.background);
      root.style.setProperty('--color-surface', isDark ? theme.darkSurface : theme.surface);
      root.style.setProperty('--color-text', isDark ? theme.darkText : theme.text);
      root.style.setProperty('--color-text-secondary', isDark ? theme.darkTextSecondary : theme.textSecondary);
      root.style.setProperty('--color-border', isDark ? theme.darkBorder : theme.border);
      
      document.body.style.backgroundColor = isDark ? theme.darkBackground : theme.background;
      document.body.style.color = isDark ? theme.darkText : theme.text;
    }
  }, [currentTheme, isDark]);

  useEffect(() => {
    localStorage.setItem('focusreads-background', customBackground);
  }, [customBackground]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('focusreads-dark');
      if (saved === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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