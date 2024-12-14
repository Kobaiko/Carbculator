import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export function ThemeToggle() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg transition-colors dark:bg-brand-800/50 bg-brand-50 hover:bg-brand-100 dark:hover:bg-brand-800"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-brand-200" />
      ) : (
        <Moon className="h-5 w-5 text-brand-600" />
      )}
    </button>
  );
}