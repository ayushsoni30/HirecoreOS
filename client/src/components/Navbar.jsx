/**
 * File: client/src/components/Navbar.jsx
 * Description: Top navigation bar component. Minimalist academic paper styling with
 *              monospaced section tags, Libertinus Serif titles, and sharp theme toggles.
 */

import { Link, NavLink } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import HcLogo from './HcLogo';
import { Sun, Moon, Menu, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = ({ onMenuClick, title, isPublic = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal } = useAuth();

  // Pick monospaced academic section index tag based on title
  const getSectionTag = () => {
    const t = title?.toLowerCase() || '';
    if (t.includes('dashboard')) return '[SYS_OVERVIEW]';
    if (t.includes('resume analyzer')) return '[DOC_ANALYSIS]';
    if (t.includes('practice')) return '[CODE_ASSESSMENT]';
    if (t.includes('resume-based')) return '[CV_INTERVIEW]';
    if (t.includes('buddy')) return '[AI_CONSULTATION]';
    if (t.includes('about')) return '[FACULTY_DOSSIER]';
    return '[ACADEMIC_SUITE]';
  };

  return (
    <nav className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-paper-800 bg-paper-950/90 text-paper-50 light:bg-paper-50/90 light:border-paper-200 light:text-paper-900 sticky top-0 z-20 transition-colors duration-200">
      
      {/* Left Column: Menu Button or Logo & Brand Navigation */}
      <div className="flex items-center gap-4">
        {!isPublic ? (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 border border-paper-800 light:border-paper-200 hover:bg-paper-800/40 text-paper-400 light:text-paper-600 transition-all"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : (
          <Link to="/landing" className="flex items-center gap-3 group">
            <HcLogo className="h-7 w-7 text-accent group-hover:scale-105 transition-transform" />
            <div className="text-left hidden sm:block">
              <span className="text-sm font-serif font-bold tracking-tight text-paper-50 light:text-paper-900 block leading-tight">
                HireCore OS
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-paper-400 light:text-paper-500 block">
                Scholarly Suite
              </span>
            </div>
          </Link>
        )}

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest text-accent uppercase px-2 py-0.5 border border-accent/30 bg-accent/5">
            {getSectionTag()}
          </span>
          <h1 className="text-lg sm:text-xl font-serif font-normal tracking-tight text-paper-50 light:text-paper-900">
            {title}
          </h1>
        </div>

        {/* Public Links */}
        {isPublic && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-paper-800 light:border-paper-200 font-mono text-xs">
            <NavLink
              to="/landing"
              className={({ isActive }) => 
                `px-2.5 py-1 transition-colors border ${
                  isActive 
                    ? 'border-accent text-accent bg-accent/10' 
                    : 'border-transparent text-paper-400 hover:text-paper-50 light:text-paper-600'
                }`
              }
            >
              [00] Overview
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `px-2.5 py-1 transition-colors border ${
                  isActive 
                    ? 'border-accent text-accent bg-accent/10' 
                    : 'border-transparent text-paper-400 hover:text-paper-50 light:text-paper-600'
                }`
              }
            >
              [06] About Team
            </NavLink>
          </div>
        )}
      </div>

      {/* Right Column: User Auth & Theme Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-paper-400 light:text-paper-500 uppercase tracking-wider border-r border-paper-800 light:border-paper-200 pr-4">
          <span className="h-2 w-2 bg-success inline-block"></span>
          STATUS: ONLINE
        </div>

        {user ? (
          <Link
            to="/dashboard"
            className="px-3 py-1.5 border border-accent/50 bg-accent/10 text-accent font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-accent hover:text-white transition-all"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className="px-3 py-1.5 border border-accent bg-accent text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-accent/90 transition-all"
          >
            <LogIn className="h-3.5 w-3.5" /> Sign In
          </button>
        )}

        {/* Theme Toggle Button with Sharp Corners */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-paper-800 light:border-paper-200 hover:bg-paper-800/50 light:hover:bg-paper-200/50 transition-all text-paper-400 light:text-paper-700 hover:text-accent light:hover:text-accent"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-paper-800" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
