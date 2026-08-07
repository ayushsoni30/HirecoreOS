/**
 * File: client/src/components/Sidebar.jsx
 * Description: Left-hand navigation sidebar. Minimalist academic sidebar with sharp corners,
 *              monospaced index markers [01]-[05], Libertinus Serif typography, candidate profile info,
 *              [FREE TIER] badge, and session logout controls.
 */

import { NavLink, Link } from 'react-router-dom';
import { X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from './AuthContext';

import HcLogo from './HcLogo';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, openAuthModal } = useAuth();

  const menuItems = [
    {
      idx: '[00]',
      path: '/landing',
      name: 'System Overview',
      desc: 'Architecture & capabilities'
    },
    {
      idx: '[01]',
      path: '/dashboard',
      name: 'Overview Dashboard',
      desc: 'System summary & recent logs'
    },
    {
      idx: '[02]',
      path: '/resume-analyzer',
      name: 'Smart Resume Analyzer',
      desc: 'Curriculum Vitae & JD alignment'
    },
    {
      idx: '[03]',
      path: '/tech-interview',
      name: 'Tech Interview Practice',
      desc: 'Subject examination & feedback'
    },
    {
      idx: '[04]',
      path: '/resume-interview',
      name: 'Resume-Based Interview',
      desc: 'Contextual candidate questioning'
    },
    {
      idx: '[05]',
      path: '/tech-buddy',
      name: 'Tech Buddy',
      desc: 'Interactive AI research assistant'
    },
    {
      idx: '[06]',
      path: '/about',
      name: 'About Team & Faculty',
      desc: 'Lead engineering dossier'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-paper-950/90 z-30 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-paper-950 text-paper-50 border-r border-paper-800
        light:bg-paper-50 light:border-paper-200 light:text-paper-900
        z-40 transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:shadow-none'}
      `}>
        
        {/* Sidebar Header Logo */}
        <div className="h-16 px-6 border-b border-paper-800 light:border-paper-200 flex items-center justify-between">
          <Link to="/landing" onClick={onClose} className="flex items-center gap-3 group">
            <HcLogo className="h-8 w-8 text-accent group-hover:scale-105 transition-transform" />
            <div className="text-left">
              <span className="text-base font-serif font-bold tracking-tight text-paper-50 light:text-paper-900 block leading-tight group-hover:text-accent transition-colors">
                HireCore OS
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-paper-400 light:text-paper-500 block">
                Scholarly Suite
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 border border-paper-800 light:border-paper-200 text-paper-400 hover:text-paper-50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-2">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-start gap-3 p-3 transition-all duration-150 border text-left block
                  ${isActive 
                    ? 'border-accent bg-accent/10 text-paper-50 light:text-paper-900 light:bg-accent/5' 
                    : 'border-transparent text-paper-400 hover:text-paper-50 hover:border-paper-800 hover:bg-paper-900/50 light:text-paper-600 light:hover:text-paper-900 light:hover:bg-paper-100 light:hover:border-paper-200'
                  }
                `}
              >
                <span className="font-mono text-[11px] text-accent font-bold mt-0.5 shrink-0">
                  {item.idx}
                </span>
                <div>
                  <p className="text-sm font-serif font-bold leading-tight tracking-tight">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-paper-500 light:text-paper-400 mt-1 line-clamp-1 font-serif font-normal">
                    {item.desc}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Candidate Profile / Academic Context Footer */}
        <div className="p-4 border-t border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-3">
          {user ? (
            <div className="flex items-center gap-3 p-3 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50">
              {/* Candidate Sharp Profile Picture */}
              <div className="w-10 h-10 border border-accent bg-paper-900 shrink-0 overflow-hidden flex items-center justify-center">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name || 'Candidate'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5 text-accent" />
                )}
              </div>

              {/* Candidate Details */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-serif font-bold text-paper-50 light:text-paper-900 truncate">
                    {user?.name || 'Candidate'}
                  </p>
                  <span className="font-mono text-[8px] text-paper-400 bg-paper-900 border border-paper-800 px-1 py-0.2 shrink-0 ml-1">
                    {user?.course || 'B.Tech'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                    [FREE TIER]
                  </span>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="text-paper-400 hover:text-red-400 transition-colors p-0.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="w-full py-2.5 px-3 border border-accent bg-accent text-white font-serif font-bold text-xs uppercase tracking-wider hover:bg-accent/90 transition-colors block text-center"
            >
              Sign In / Register
            </button>
          )}

          <p className="text-[10px] font-mono text-paper-500 light:text-paper-400 text-center uppercase tracking-widest">
            HireCore OS v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
