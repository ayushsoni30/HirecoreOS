/**
 * File: client/src/App.jsx
 * Description: Primary React application component. Sets up routing paths,
 *              mounts global page layouts, and triggers ScrollToTop.
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

  // Main Workspace Layout (rendered immediately since auth is removed)
  return (
    <div className="min-h-screen flex bg-navy-950 text-white light:bg-navy-50 light:text-navy-900 transition-colors duration-300">
      <ScrollToTop />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <Navbar 
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* Dashboard Pages Scroll Container */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-analyzer" element={<SmartResumeAnalyzer />} />
            <Route path="/tech-interview" element={<TechInterviewPractice />} />
            <Route path="/resume-interview" element={<ResumeBasedInterview />} />
            <Route path="/tech-buddy" element={<TechBuddy />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
