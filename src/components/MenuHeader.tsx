import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import UserAvatar from './UserAvatar';
import ThemeToggle from './ThemeToggle';

interface MenuHeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ 
  isDarkMode, 
  onThemeToggle 
}) => {
  return (
    <div className="menu-header">
      <div className="header-content">
        <Logo />
        <div className="flex items-center gap-4">
          <UserAvatar showName size="md" />
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={onThemeToggle} 
          />
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;