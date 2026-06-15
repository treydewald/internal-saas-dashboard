import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

interface UseThemeReturn {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const useThemeHook = (): UseThemeReturn => {
  // This is a fallback implementation in case context isn't available
  // The main implementation is in the context file
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const theme = savedTheme || 'dark';

  return {
    theme,
    toggleTheme: () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export { useTheme } from '../context/ThemeContext';
