/**
 * File: client/src/App.jsx
 * Description: Primary React application component. Sets up routing paths,
 *              mounts global page layouts, CustomCursor, AuthProvider, AuthModal,
 *              and an academic brand introduction splash screen.
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './components/AuthContext';
import AuthModal from './pages/AuthModal';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';


import HcLogo from './components/HcLogo';

// Pages imports
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
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

const MainContent = () => {
  const location = useLocation();
  const { user, loading, isAuthModalOpen } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Trigger introduction splash screen on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Public non-authenticated paths
  const PUBLIC_PATHS = ['/landing', '/about', '/privacy', '/terms'];
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  const shouldShowAuthModal = isAuthModalOpen || (!loading && !user && !isPublicPath);

  // Determine active page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/landing':
        return 'System Overview';
      case '/about':
        return 'About Team';
      case '/dashboard':
        return 'Dashboard';
      case '/resume-analyzer':
        return 'Resume Analyzer';
      case '/tech-interview':
        return 'Tech Practice';
      case '/resume-interview':
        return 'CV Oral Exam';
      case '/tech-buddy':
        return 'Tech Buddy AI';
      case '/privacy':
        return 'Privacy Policy';
      case '/terms':
        return 'Terms of Service';
      default:
        return 'HireCore OS';
    }
  };

  return (
    <>


      {/* Auth Modal overlay if user is unauthenticated on protected routes or explicitly opened */}
      {shouldShowAuthModal && <AuthModal />}

      <AnimatePresence mode="wait">
        {isAppLoading ? (
          /* Scholarly Editorial Splash Screen */
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-paper-950 text-paper-50 select-none border-4 border-paper-800"
          >
            <div className="relative flex flex-col items-center max-w-md px-8 py-10 border border-paper-800 bg-paper-900 text-center space-y-6">
              
              {/* Monospaced Academic Header Tag */}
              <div className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] uppercase tracking-widest">
                [SYS_INIT // HIRECORE OS v1.0]
              </div>

              {/* Logo / Crest SVG */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <HcLogo className="w-16 h-16 text-accent" />
              </motion.div>

              {/* Title & Description */}
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl font-serif font-normal tracking-tight text-paper-50"
                >
                  HireCore OS
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xs text-paper-400 font-mono tracking-wider uppercase"
                >
                  Scholarly Career & Interview Engine
                </motion.p>
              </div>

              {/* Sharp Line Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-full h-1 bg-paper-800 relative overflow-hidden"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1.3, ease: "easeInOut" }}
                  className="h-full bg-accent"
                />
              </motion.div>

              <div className="font-mono text-[10px] text-paper-500 uppercase tracking-widest pt-2">
                Preparing Knowledge Context...
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="min-h-screen flex bg-paper-950 text-paper-50 light:bg-paper-50 light:text-paper-900 transition-colors duration-200 font-serif">
        <ScrollToTop />
        
        {/* Sidebar Navigation - Hidden on public landing and about pages */}
        {!isPublicPath && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}

        {/* Main Workspace Scroll Frame */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-paper-800 light:border-paper-200">
          
          {/* Top Header Bar */}
          <Navbar 
            title={getPageTitle()}
            onMenuClick={() => setSidebarOpen(true)}
            isPublic={isPublicPath}
          />

          {/* Dashboard Pages Scroll Container */}
          <main className="flex-1 overflow-y-auto relative bg-paper-950 light:bg-paper-50 selection:bg-accent/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/landing" replace />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/resume-analyzer" element={<SmartResumeAnalyzer />} />
                  <Route path="/tech-interview" element={<TechInterviewPractice />} />
                  <Route path="/resume-interview" element={<ResumeBasedInterview />} />
                  <Route path="/tech-buddy" element={<TechBuddy />} />
                  <Route path="*" element={<Navigate to="/landing" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <MainContent />
  </AuthProvider>
);

export default App;
