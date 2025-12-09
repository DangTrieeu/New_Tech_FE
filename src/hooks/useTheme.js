import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Custom hook để sử dụng ThemeContext dễ dàng hơn
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

