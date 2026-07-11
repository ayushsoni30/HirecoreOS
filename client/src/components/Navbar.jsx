/**
 * File: client/src/components/Navbar.jsx
 * Description: Top navigation bar component. Displays a toggle for Dark/Light mode,
 *              and general layout options.
 */

import { useTheme } from './ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick, title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="h-16 px-6 flex items-center justify-between border-b border-navy-800 bg-navy-900 text-text-dark transition-colors duration-300 light:bg-white light:border-navy-100 light:text-text-light sticky top-0 z-20">
      
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-navy-800 light:hover:bg-navy-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight capitalize">
          {title}
        </h1>
      </div>

      {/* Theme Toggle & General Settings */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-navy-800 light:hover:bg-navy-100 transition-colors text-navy-400 light:text-navy-600 hover:text-accent"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
