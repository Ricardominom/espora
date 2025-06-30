import React from 'react';
import { Sun, Moon } from 'lucide-react';
import '../styles/theme-toggle.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={onToggle}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDarkMode ? (
            <Moon size={14} className="toggle-icon" />
          ) : (
            <Sun size={14} className="toggle-icon" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;