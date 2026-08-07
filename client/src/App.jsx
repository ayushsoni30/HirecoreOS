/**
 * File: client/src/App.jsx
 * Description: Primary React application component. Sets up routing paths,
 *              mounts global page layouts, scroll resets, and displays a
 *              premium 2.5-second brand introduction splash screen on launch.
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages imports
import Dashboard from './pages/Dashboard';
import SmartResumeAnalyzer from './pages/SmartResumeAnalyzer';
import TechInterviewPractice from './pages/TechInterviewPractice';
import ResumeBasedInterview from './pages/ResumeBasedInterview';
import TechBuddy from './pages/TechBuddy';

// Scroll to top helper on page switch
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Trigger introduction splash screen on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Determine active page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/resume-analyzer':
        return 'Smart Resume Analyzer';
      case '/tech-interview':
        return 'Tech Interview Practice';
      case '/resume-interview':
        return 'Resume-Based Interview';
      case '/tech-buddy':
        return 'Tech Buddy';
      default:
        return 'SuccessBuddy AI';
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isAppLoading ? (
          /* Premium Brand Splash Screen */
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-navy-950 text-white overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative flex flex-col items-center max-w-sm px-6 text-center select-none">
              {/* Logo Icon with dynamic pulse and scaling */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-accent via-secondary to-cyanAccent p-[2px] shadow-2xl shadow-accent/25">
                  <div className="h-full w-full rounded-2xl bg-navy-950 flex items-center justify-center">
                    <svg className="h-10 w-10 animate-splash-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="sb-splash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M20 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H16L22 22V4C22 2.9 21.1 2 20 2Z" 
                        stroke="url(#sb-splash-gradient)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      <path 
                        d="M8 11L11 14L16 8" 
                        stroke="url(#sb-splash-gradient)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Title & Slogan */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl font-black tracking-tight bg-gradient-to-r from-accent via-secondary to-cyanAccent bg-clip-text text-transparent mb-2"
              >
                SuccessBuddy AI
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xs text-navy-400 font-medium tracking-wider uppercase mb-8"
              >
                Next-Gen Career Launchpad
              </motion.p>

              {/* Loading progress bar indicator */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="relative w-48 h-[3px] bg-navy-800 rounded-full overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-secondary to-cyanAccent w-full rounded-full animate-progress-shimmer" />
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="min-h-screen flex bg-navy-950 text-white light:bg-navy-50 light:text-navy-900 transition-colors duration-300">
        <ScrollToTop />
        
        {/* Sidebar Navigation */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Workspace Scroll Frame */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Top Header Bar */}
          <Navbar 
            title={getPageTitle()}
            onMenuClick={() => setSidebarOpen(true)} 
          />

          {/* Dashboard Pages Scroll Container */}
          <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-900/40 via-navy-950 to-navy-950 light:from-white light:to-navy-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume-analyzer" element={<SmartResumeAnalyzer />} />
                  <Route path="/tech-interview" element={<TechInterviewPractice />} />
                  <Route path="/resume-interview" element={<ResumeBasedInterview />} />
                  <Route path="/tech-buddy" element={<TechBuddy />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
