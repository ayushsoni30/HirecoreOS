/**
 * File: client/src/components/Sidebar.jsx
 * Description: Left-hand navigation sidebar. Contains links to all application routes,
 *              responsive mobile overlay logic, and active page styling.
 */

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Code2, UserCheck, MessageSquare, X, ShieldAlert, Award } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Overview and recent activity'
    },
    {
      path: '/resume-analyzer',
      name: 'Smart Resume Analyzer',
      icon: FileText,
      desc: 'Match CV with Job Description'
    },
    {
      path: '/tech-interview',
      name: 'Tech Interview Practice',
      icon: Code2,
      desc: 'Mock interview by topic'
    },
    {
      path: '/resume-interview',
      name: 'Resume-Based Interview',
      icon: UserCheck,
      desc: 'Personalized questions from CV'
    },
    {
      path: '/tech-buddy',
      name: 'Tech Buddy',
      icon: MessageSquare,
      desc: '24/7 AI coding assistant'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/80 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-navy-950 text-text-dark border-r border-navy-800/80
        light:bg-white light:border-navy-100 light:text-text-light
        z-40 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        
        {/* Sidebar Header Logo */}
        <div className="h-16 px-6 border-b border-navy-800/80 light:border-navy-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent via-secondary to-cyanAccent p-[1.5px]">
              <div className="h-full w-full rounded-xl bg-navy-950 flex items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="sb-sidebar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M20 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H16L22 22V4C22 2.9 21.1 2 20 2Z" 
                    stroke="url(#sb-sidebar-grad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M8 11L11 14L16 8" 
                    stroke="url(#sb-sidebar-grad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-accent via-secondary to-cyanAccent bg-clip-text text-transparent">
              SuccessBuddy AI
            </span>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-navy-900 light:hover:bg-navy-100 text-navy-400 light:text-navy-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-accent/15 to-accent/5 border-l-4 border-accent text-accent shadow-sm' 
                    : 'text-navy-400 hover:bg-navy-900/50 hover:text-white hover:scale-[1.02] light:text-navy-600 light:hover:bg-navy-50 light:hover:text-navy-900 border-l-4 border-transparent'
                  }
                `}
              >
                <Icon className="h-5 w-5 mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold tracking-tight leading-none">{item.name}</p>
                  <p className="text-[10px] sm:text-xs text-navy-500 light:text-navy-400 mt-1 line-clamp-1 group-hover:text-navy-300 light:group-hover:text-navy-500 font-normal leading-normal">
                    {item.desc}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 border-t border-navy-800/80 light:border-navy-100 bg-navy-900/10 light:bg-navy-50/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/40 light:bg-navy-50/50 border border-navy-800/60 light:border-navy-100">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-text-dark light:text-text-light">Preparation Engine</p>
              <p className="text-[10px] font-semibold text-navy-400 light:text-navy-500">Candidate Mode</p>
            </div>
          </div>
          <p className="text-[10px] text-navy-500 light:text-navy-400 mt-3 text-center font-medium">
            SuccessBuddy AI v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
