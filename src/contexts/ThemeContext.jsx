import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  accentTheme: 'ocean',
  setAccentTheme: () => {},
  accentThemes: [],
});

const accentThemes = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'violet', label: 'Violet' }
];

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('payout-theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [accentTheme, setAccentTheme] = useState(() => {
    if (typeof window === 'undefined') return 'ocean';
    return localStorage.getItem('payout-accent-theme') || 'ocean';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
      localStorage.setItem('payout-theme', 'dark');
    } else {
      root.classList.remove('dark-mode');
      localStorage.setItem('payout-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentTheme);
    localStorage.setItem('payout-accent-theme', accentTheme);
  }, [accentTheme]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, accentTheme, setAccentTheme, accentThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
