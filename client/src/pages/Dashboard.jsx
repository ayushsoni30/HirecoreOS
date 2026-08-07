/**
 * File: client/src/pages/Dashboard.jsx
 * Description: Main academic dashboard displaying candidate profile status, user details,
 *              career tool links, account deletion controls, and recent examination results.
 *              Redesigned with Libertinus Serif, sharp 0px corners, and scholarly paper styling.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../components/AuthContext';
import { useTheme } from '../components/ThemeContext';
import { useToast } from '../components/ToastContext';
import { FileText, Code2, UserCheck, MessageSquare, ArrowUpRight, Award, Loader2, BookOpen, Trash2, ShieldAlert, User as UserIcon } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const { user, deleteAccount } = useAuth();
  const { theme } = useTheme();
  const api = useApi();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState({
    resumeAnalysis: null,
    techInterview: null,
    resumeInterview: null
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.get('/dashboard/summary');
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        showToast(err.message || 'Failed to load recent activity.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [api, showToast]);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      showToast('Your candidate account and data have been permanently deleted.', 'success');
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      showToast(err.message || 'Failed to delete account.', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const features = [
    {
      idx: '[TOOL_01]',
      name: 'Smart Resume Analyzer',
      desc: 'Evaluate CV relevance against target Job Descriptions to analyze match percentage and feedback.',
      icon: FileText,
      path: '/resume-analyzer'
    },
    {
      idx: '[TOOL_02]',
      name: 'Tech Interview Practice',
      desc: 'Conduct topic-focused technical examinations with structured senior-level evaluations.',
      icon: Code2,
      path: '/tech-interview'
    },
    {
      idx: '[TOOL_03]',
      name: 'Resume-Based Interview',
      desc: 'Engage in contextual mock interviews tailored specifically to your resume achievements.',
      icon: UserCheck,
      path: '/resume-interview'
    },
    {
      idx: '[TOOL_04]',
      name: 'Tech Buddy',
      desc: 'Consult your 24/7 AI technical mentor for architecture patterns, roadmaps, and guidance.',
      icon: MessageSquare,
      path: '/tech-buddy'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Safe metric extractors
  const cvScore = stats.resumeAnalysis?.score ?? stats.resumeAnalysis?.matchPercentage;
  const techScore = stats.techInterview?.score ?? stats.techInterview?.overallScore;
  const resumeIntScore = stats.resumeInterview?.score ?? stats.resumeInterview?.overallScore;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-serif text-left"
    >
      {/* Editorial Candidate Hero Banner */}
      <motion.div 
        variants={itemVariants}
        className="border border-paper-800 light:border-paper-200 bg-paper-900 light:bg-paper-100 p-6 md:p-8 space-y-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Candidate Sharp Square Profile Container */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 border-2 border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 p-1 overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name || 'Candidate'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-paper-900 light:bg-paper-100 text-accent">
                    <UserIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 font-mono text-[9px] px-1 bg-success text-white">
                [ACTIVE]
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-paper-50 light:text-paper-900">
                  {getGreeting()}, {user?.name || 'Developer Candidate'}
                </h2>
                <span className="px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent font-bold">
                  Candidate Docket
                </span>
                <span className="px-2 py-0.5 font-mono text-[9px] text-paper-400 light:text-paper-700 border border-paper-800 light:border-paper-300 bg-paper-950 light:bg-paper-200 uppercase tracking-widest">
                  {user?.course || 'B.Tech'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-paper-400 light:text-paper-600">
                <span>[EMAIL: {user?.email || 'N/A'}]</span>
                <span>•</span>
                <span>[TIER: {user?.tier?.toUpperCase() || 'FREE'}]</span>
              </div>

              <p className="text-sm text-paper-400 light:text-paper-600 max-w-2xl font-normal leading-relaxed">
                Welcome to HireCore OS. Select an academic career tool below to analyze resumes, practice technical subjects, or consult your AI mentor.
              </p>
            </div>
          </div>
          
          {/* Action & Context Area */}
          <div className="border-t md:border-t-0 md:border-l border-paper-800 light:border-paper-200 pt-4 md:pt-0 md:pl-8 shrink-0 w-full md:w-auto flex md:flex-col justify-between md:justify-start gap-4">
            <div className="font-mono text-[11px] space-y-1">
              <span className="text-paper-500 uppercase tracking-widest block">System Context</span>
              <span className="text-paper-300 light:text-paper-700 block font-bold">MODE: PREPARATION</span>
              <span className="text-accent block">[STUDY_SUITE_READY]</span>
            </div>

            {/* Account Deletion Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 border border-red-900/60 light:border-red-300 hover:border-red-600 bg-red-950/20 light:bg-red-50 hover:bg-red-950/50 text-red-400 light:text-red-700 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 transition-colors self-end md:self-start"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Tools & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Career Tools Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-paper-800 light:border-paper-200 pb-3">
            <h3 className="text-lg font-serif font-normal tracking-tight text-paper-50 light:text-paper-900 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-accent" />
              Examination Modules
            </h3>
            <span className="font-mono text-[10px] text-paper-500 uppercase tracking-widest">
              [AVAILABLE_TOOLS: 04]
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  key={feat.name}
                  onClick={() => navigate(feat.path)}
                  className="group flex flex-col justify-between p-6 border border-paper-800 light:border-paper-200 bg-paper-900/60 light:bg-white hover:border-accent light:hover:border-accent transition-all duration-200 cursor-pointer space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                        {feat.idx}
                      </span>
                      <div className="p-2 border border-paper-800 light:border-paper-200 group-hover:border-accent/40 transition-colors">
                        <Icon className="h-5 w-5 text-paper-300 light:text-paper-700 group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-base font-serif font-bold text-paper-50 light:text-paper-900 group-hover:text-accent transition-colors">
                        {feat.name}
                      </h4>
                      <p className="text-xs text-paper-400 light:text-paper-600 font-normal leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-paper-800/60 light:border-paper-200/60 font-mono text-[11px] text-paper-400 light:text-paper-600 group-hover:text-paper-50 light:group-hover:text-paper-900">
                    <span>LAUNCH_MODULE</span>
                    <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Performance Analytics Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-paper-800 light:border-paper-200 pb-3">
            <h3 className="text-lg font-serif font-normal tracking-tight text-paper-50 light:text-paper-900 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-accent" />
              Academic Performance
            </h3>
            <span className="font-mono text-[10px] text-paper-500 uppercase tracking-widest">
              [LOGS]
            </span>
          </div>

          <div className="border border-paper-800 light:border-paper-200 bg-paper-900/60 light:bg-white p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-6 w-6 text-accent animate-spin" />
                <span className="font-mono text-xs text-paper-400 light:text-paper-600">Loading performance dockets...</span>
              </div>
            ) : (
              <>
                {/* Resume Score gauge */}
                <div className="border border-paper-800 light:border-paper-200 p-4 space-y-3 bg-paper-950/40 light:bg-paper-100/60">
                  <span className="font-mono text-[10px] text-paper-400 light:text-paper-600 uppercase tracking-widest block">
                    [LATEST_CV_SCORE]
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-paper-50 light:text-paper-900">
                        {cvScore !== undefined && cvScore !== null ? `${cvScore}%` : 'N/A'}
                      </p>
                      <p className="text-xs text-paper-400 light:text-paper-600 font-normal">CV / Job Description Alignment</p>
                    </div>
                    <div className="w-12 h-12">
                      <CircularProgressbar
                        value={cvScore ?? 0}
                        text={cvScore !== undefined && cvScore !== null ? `${cvScore}%` : '0%'}
                        styles={{
                          path: { stroke: '#9A3412', strokeLinecap: 'square' },
                          trail: { stroke: theme === 'dark' ? '#25221F' : '#E5E0D8' },
                          text: { fill: theme === 'dark' ? '#ECE8E1' : '#1C1917', fontSize: '24px', fontFamily: 'Libertinus Serif' }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tech Practice Score */}
                <div className="border border-paper-800 light:border-paper-200 p-4 space-y-3 bg-paper-950/40 light:bg-paper-100/60">
                  <span className="font-mono text-[10px] text-paper-400 light:text-paper-600 uppercase tracking-widest block">
                    [TECH_PRACTICE_RESULT]
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-paper-50 light:text-paper-900">
                        {techScore !== undefined && techScore !== null ? `${techScore}/100` : 'N/A'}
                      </p>
                      <p className="text-xs text-paper-400 light:text-paper-600 font-normal">
                        {stats.techInterview?.technology ? `Domain: ${stats.techInterview.technology}` : 'Technical Domain Mastery'}
                      </p>
                    </div>
                    <div className="w-12 h-12">
                      <CircularProgressbar
                        value={techScore ?? 0}
                        text={techScore !== undefined && techScore !== null ? `${techScore}` : '0'}
                        styles={{
                          path: { stroke: '#854F2B', strokeLinecap: 'square' },
                          trail: { stroke: theme === 'dark' ? '#25221F' : '#E5E0D8' },
                          text: { fill: theme === 'dark' ? '#ECE8E1' : '#1C1917', fontSize: '24px', fontFamily: 'Libertinus Serif' }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Interview Score */}
                <div className="border border-paper-800 light:border-paper-200 p-4 space-y-3 bg-paper-950/40 light:bg-paper-100/60">
                  <span className="font-mono text-[10px] text-paper-400 light:text-paper-600 uppercase tracking-widest block">
                    [RESUME_MOCK_INTERVIEW]
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-paper-50 light:text-paper-900">
                        {resumeIntScore !== undefined && resumeIntScore !== null ? `${resumeIntScore}/100` : 'N/A'}
                      </p>
                      <p className="text-xs text-paper-400 light:text-paper-600 font-normal">Contextual Resume Inquiry</p>
                    </div>
                    <div className="w-12 h-12">
                      <CircularProgressbar
                        value={resumeIntScore ?? 0}
                        text={resumeIntScore !== undefined && resumeIntScore !== null ? `${resumeIntScore}` : '0'}
                        styles={{
                          path: { stroke: '#D97706', strokeLinecap: 'square' },
                          trail: { stroke: theme === 'dark' ? '#25221F' : '#E5E0D8' },
                          text: { fill: theme === 'dark' ? '#ECE8E1' : '#1C1917', fontSize: '24px', fontFamily: 'Libertinus Serif' }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-paper-950/90 light:bg-paper-900/60 backdrop-blur-sm select-none font-serif">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md border border-red-900/80 light:border-red-300 bg-paper-900 light:bg-white p-6 space-y-6 text-left relative shadow-academic"
          >
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="h-8 w-8 border border-red-600 bg-red-950/40 light:bg-red-50 flex items-center justify-center text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-500 block">
                  [DANGER_ZONE]
                </span>
                <h3 className="text-lg font-serif font-bold text-paper-50 light:text-paper-900">
                  Delete Account Permanently
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-paper-300 light:text-paper-700">
              <p>
                Are you sure you want to permanently delete your candidate profile (<strong className="text-paper-50 light:text-paper-900">{user?.email}</strong>)?
              </p>
              <p className="text-xs text-paper-400 light:text-paper-600 leading-relaxed border-l-2 border-red-800 light:border-red-400 pl-3">
                This action is irreversible. All of your saved resume evaluations, technical practice records, and AI chat histories will be permanently wiped from HireCore OS.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-paper-800 light:border-paper-200">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-100 text-paper-300 light:text-paper-700 hover:text-paper-50 light:hover:text-paper-900 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="px-4 py-2 border border-red-600 bg-red-950 light:bg-red-600 hover:bg-red-900 light:hover:bg-red-700 text-red-200 light:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Confirm Deletion
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
