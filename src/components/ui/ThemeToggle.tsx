'use client';

import React from 'react';
import { useTheme } from '@/app/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--border)]/30 hover:bg-[var(--border)] transition-colors text-[var(--foreground)]"
      title="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
