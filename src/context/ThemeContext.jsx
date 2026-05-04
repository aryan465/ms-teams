import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../theme/themes';

const SynqThemeContext = createContext(null);
const STORAGE_KEY = 'synq-theme';

export function SynqThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return Object.values(THEMES).includes(stored) ? stored : THEMES.VIOLET;
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Apply on first render
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SynqThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </SynqThemeContext.Provider>
  );
}

export const useSynqTheme = () => useContext(SynqThemeContext);
