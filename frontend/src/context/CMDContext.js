import { createContext, useContext, useState, useEffect } from 'react';

const CMDContext = createContext();

export function CMDProvider({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <CMDContext.Provider value={{ open, setOpen }}>
      {children}
    </CMDContext.Provider>
  );
}

export const useCMD = () => useContext(CMDContext);
