import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Accent = 'blue' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose';

interface ThemeContextType {
  accent: Accent;
  setAccent: (a: Accent) => void;
  glass: boolean;
  toggleGlass: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_KEY = 'drishti:accent';
const GLASS_KEY = 'drishti:glass';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<Accent>(() => (localStorage.getItem(ACCENT_KEY) as Accent) || 'blue');
  const [glass, setGlass] = useState<boolean>(() => localStorage.getItem(GLASS_KEY) === 'true');

  const setAccent = (a: Accent) => {
    setAccentState(a);
    localStorage.setItem(ACCENT_KEY, a);
    document.documentElement.style.setProperty('--accent-color', accentToHex(a));
  };

  const toggleGlass = () => {
    setGlass(g => {
      const nv = !g; localStorage.setItem(GLASS_KEY, String(nv)); return nv;
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentToHex(accent));
    document.body.classList.toggle('glass-mode', glass);
  }, [accent]);

  useEffect(() => {
    document.body.classList.toggle('glass-mode', glass);
  }, [glass]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent, glass, toggleGlass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};

export const accentToClasses = (accent: Accent) => {
  switch (accent) {
    case 'cyan': return { grad: 'from-cyan-500 to-sky-600', solid: 'bg-cyan-600', ring: 'ring-cyan-500/40', text: 'text-cyan-400' };
    case 'emerald': return { grad: 'from-emerald-500 to-teal-600', solid: 'bg-emerald-600', ring: 'ring-emerald-500/40', text: 'text-emerald-400' };
    case 'amber': return { grad: 'from-amber-500 to-orange-600', solid: 'bg-amber-600', ring: 'ring-amber-500/40', text: 'text-amber-400' };
    case 'violet': return { grad: 'from-violet-500 to-indigo-600', solid: 'bg-violet-600', ring: 'ring-violet-500/40', text: 'text-violet-400' };
    case 'rose': return { grad: 'from-rose-500 to-pink-600', solid: 'bg-rose-600', ring: 'ring-rose-500/40', text: 'text-rose-400' };
    default: return { grad: 'from-blue-500 to-indigo-600', solid: 'bg-blue-600', ring: 'ring-blue-500/40', text: 'text-blue-400' };
  }
};

const accentToHex = (accent: Accent) => {
  switch (accent) {
    case 'cyan': return '#0891b2';
    case 'emerald': return '#059669';
    case 'amber': return '#d97706';
    case 'violet': return '#6366f1';
    case 'rose': return '#e11d48';
    default: return '#2563eb';
  }
};
