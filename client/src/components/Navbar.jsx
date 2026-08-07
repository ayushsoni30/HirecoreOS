/**
 * File: client/src/components/Navbar.jsx
 * Description: Top navigation bar component. Displays a toggle for Dark/Light mode,
 *              and general layout options.
 */

import { useTheme } from './ThemeContext';
import { Sun, Moon, Menu, Sparkles, LayoutDashboard, FileText, Code2, UserCheck, MessageSquare } from 'lucide-react';

const Navbar = ({ onMenuClick, title }) => {
  const { theme, toggleTheme } = useTheme();

  // Pick small header indicator icon based on current title
  const getHeaderIcon = () => {
    const t = title?.toLowerCase() || '';
    if (t.includes('dashboard')) return <LayoutDashboard className="h-4 w-4 text-accent" />;
    if (t.includes('resume analyzer')) return <FileText className="h-4 w-4 text-primary" />;
    if (t.includes('practice')) return <Code2 className="h-4 w-4 text-secondary" />;
    if (t.includes('resume-based')) return <UserCheck className="h-4 w-4 text-cyanAccent" />;
    if (t.includes('buddy')) return <MessageSquare className="h-4 w-4 text-accent" />;
    return <Sparkles className="h-4 w-4 text-accent" />;
  };

  return (
    <nav className="h-16 px-6 flex items-center justify-between border-b border-navy-800/80 bg-navy-950/70 backdrop-blur-md text-text-dark transition-colors duration-300 light:bg-white/70 light:border-navy-100 light:text-text-light sticky top-0 z-20">
      
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-navy-900 light:hover:bg-navy-100 text-navy-400 light:text-navy-500 active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-7 w-7 rounded-lg bg-navy-900/80 light:bg-navy-50 border border-navy-800/60 light:border-navy-100 items-center justify-center">
            {getHeaderIcon()}
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight capitalize bg-gradient-to-r from-white via-white to-navy-300 light:from-navy-900 light:to-navy-700 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      </div>

      {/* Theme Toggle & General Settings */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-navy-900 light:hover:bg-navy-100 transition-all text-navy-400 light:text-navy-500 hover:text-accent light:hover:text-accent hover:rotate-12 active:scale-90 border border-transparent hover:border-navy-800/60 light:hover:border-navy-100"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
