import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-lg border border-border-primary">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'light' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
        }`}
        aria-label="Light mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'system' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
        }`}
        aria-label="System mode"
      >
        <Monitor size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
        }`}
        aria-label="Dark mode"
      >
        <Moon size={16} />
      </button>
    </div>
  );
};