import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.setProperty('--bg-primary', '#f4f4f8');
    root.style.setProperty('--bg-surface', '#ffffff');
    root.style.setProperty('--bg-elevated', '#f0f0f5');
    root.style.setProperty('--border', 'rgba(0,0,0,0.07)');
    root.style.setProperty('--border-strong', 'rgba(0,0,0,0.12)');
    root.style.setProperty('--text-primary', '#0d0d1a');
    root.style.setProperty('--text-secondary', '#4a4a6a');
    root.style.setProperty('--text-muted', '#9090aa');
    document.body.style.background = '#f4f4f8';
    document.body.style.color = '#0d0d1a';
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.style.setProperty('--bg-primary', '#080810');
    root.style.setProperty('--bg-surface', '#0d0d1a');
    root.style.setProperty('--bg-elevated', '#12121f');
    root.style.setProperty('--border', 'rgba(255,255,255,0.06)');
    root.style.setProperty('--border-strong', 'rgba(255,255,255,0.1)');
    root.style.setProperty('--text-primary', '#f0f0ff');
    root.style.setProperty('--text-secondary', '#8b8baa');
    root.style.setProperty('--text-muted', '#4a4a6a');
    document.body.style.background = '#080810';
    document.body.style.color = '#f0f0ff';
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('tf-theme') || 'dark';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('tf-theme', next);
    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
