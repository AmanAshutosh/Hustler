import { createContext, useContext, useEffect, useState } from 'react';

function getAutoTheme() {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? 'light' : 'dark';
}

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kx-theme') || getAutoTheme();
  });

  // Apply theme attribute immediately on change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kx-theme', theme);
  }, [theme]);

  // Enable smooth transitions after initial paint to prevent flash-of-transition
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.add('theme-ready');
      }, 80);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
