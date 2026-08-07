/**
 * File: client/src/pages/Dashboard.jsx
 * Description: Landing page dashboard showing user profile overview, quick links to features,
 *              and recent resume/interview scores.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { FileText, Code2, UserCheck, MessageSquare, ArrowUpRight, Award, Loader2, Sparkles } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const user = {
    name: 'Developer',
    picture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  };
  const api = useApi();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState({
    resumeAnalysis: null,
    techInterview: null,
    resumeInterview: null
  });
  const [loading, setLoading] = useState(true);

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

  const features = [
    {
      name: 'Smart Resume Analyzer',
      desc: 'Match your resume against any Job Description to discover strengths, weaknesses, and score.',
      icon: FileText,
      path: '/resume-analyzer',
      iconColor: 'text-blue-400 light:text-blue-600',
      iconBg: 'bg-blue-500/10 border border-blue-500/20',
      shadowGlow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:border-blue-500/30'
    },
    {
      name: 'Tech Interview Practice',
      desc: 'Answer topic-specific questions and get detailed, senior-interviewer suggestions.',
      icon: Code2,
      path: '/tech-interview',
      iconColor: 'text-violet-400 light:text-violet-600',
      iconBg: 'bg-violet-500/10 border border-violet-500/20',
      shadowGlow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:border-violet-500/30'
    },
    {
      name: 'Resume-Based Interview',
      desc: 'Simulate an interview with questions derived directly from your resume achievements.',
      icon: UserCheck,
      path: '/resume-interview',
      iconColor: 'text-cyan-400 light:text-cyan-600',
      iconBg: 'bg-cyan-500/10 border border-cyan-500/20',
      shadowGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-500/30'
    },
    {
      name: 'Tech Buddy',
      desc: 'Chat with an AI mentor for roadmaps, debugging tips, and tech career planning.',
      icon: MessageSquare,
      path: '/tech-buddy',
      iconColor: 'text-emerald-400 light:text-emerald-600',
      iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
      shadowGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-500/30'
    }
  ];

  // Container motion animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Welcome banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-navy-800/80 light:border-navy-100 bg-gradient-to-tr from-[#131930] via-navy-950 to-[#1b2342] light:from-white light:via-navy-50 light:to-white shadow-xl p-8 transition-all duration-500 group"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -mr-24 -mt-24 group-hover:bg-accent/15 transition-all duration-500 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              {/* Animated pulse halo for profile picture */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-accent via-secondary to-cyanAccent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={user?.picture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                alt="Profile"
                className="relative h-20 w-20 rounded-full object-cover border-2 border-navy-950 bg-navy-900"
              />
              <span className="absolute bottom-0.5 right-0.5 h-4.5 w-4.5 rounded-full bg-success border-3 border-navy-950" title="Online" />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-navy-300 light:from-navy-900 light:to-navy-700 bg-clip-text text-transparent">
                  {getGreeting()}, {user?.name || 'Developer'}!
                </h2>
                <span className="px-3 py-0.5 text-[10px] font-extrabold tracking-wide uppercase rounded-full bg-accent/10 text-accent border border-accent/25 light:bg-accent/5">
                  Pro Candidate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-navy-400 light:text-navy-500 max-w-xl font-normal leading-relaxed">
                Your AI preparation companion is ready. Analyze resumes, practice technical questions, and refine your skills to land your dream IT role.
              </p>
            </div>
          </div>
          
          {/* Quick stats on banner */}
          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-navy-800/80 light:border-navy-100/80 pt-4 sm:pt-0 sm:pl-8 shrink-0 w-full md:w-auto justify-around md:justify-end">
            <div className="text-center md:text-right">
              <span className="block text-[10px] font-extrabold text-navy-500 light:text-navy-400 uppercase tracking-widest">Preparation Status</span>
              <span className="block text-lg font-black mt-1 text-accent flex items-center justify-center md:justify-end gap-1.5">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Active Prep
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid containing Quick Links & Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Quick Links / Feature Cards */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-extrabold tracking-tight text-left">Explore Career Tools</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  key={feat.name}
                  onClick={() => navigate(feat.path)}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-100 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden text-left ${feat.shadowGlow}`}
                >
                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-xl ${feat.iconBg} flex items-center justify-center ${feat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-text-dark light:text-text-light group-hover:text-accent transition-colors">
                        {feat.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-navy-400 light:text-navy-500 mt-2 leading-relaxed font-normal">
                        {feat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-accent text-xs sm:text-sm font-extrabold mt-6 group-hover:gap-2.5 transition-all">
                    Start Session
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity panel */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            <h3 className="text-lg font-extrabold tracking-tight text-left">Recent Activity</h3>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="p-6 rounded-2xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-100 shadow-sm space-y-6"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="text-xs text-navy-400">Loading performance data...</p>
              </div>
            ) : !stats.resumeAnalysis && !stats.techInterview && !stats.resumeInterview ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-navy-400">
                <Award className="h-10 w-10 text-navy-700 mb-3" />
                <p className="font-bold text-sm">No activity recorded yet</p>
                <p className="text-xs text-navy-500 mt-1 max-w-[200px] leading-relaxed">
                  Complete a resume analysis or interview practice to see scores.
                </p>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                {/* Last Resume Score */}
                {stats.resumeAnalysis && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-navy-950/40 light:bg-navy-50/50 border border-navy-800/60 light:border-navy-100/80 hover:bg-navy-850/40 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[10px] text-navy-500 light:text-navy-400 font-extrabold tracking-widest uppercase">
                        Last Resume Match
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-text-dark light:text-text-light">Job Match Score</p>
                      <p className="text-[10px] text-navy-500 font-medium">
                        {new Date(stats.resumeAnalysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-12 w-12 font-bold shrink-0">
                      <CircularProgressbar
                        value={stats.resumeAnalysis.score}
                        text={`${stats.resumeAnalysis.score}%`}
                      />
                    </div>
                  </div>
                )}

                {/* Last Tech Practice Score */}
                {stats.techInterview && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-navy-950/40 light:bg-navy-50/50 border border-navy-800/60 light:border-navy-100/80 hover:bg-navy-850/40 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[10px] text-navy-500 light:text-navy-400 font-extrabold tracking-widest uppercase">
                        Tech Practice Interview
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-text-dark light:text-text-light line-clamp-1">{stats.techInterview.technology}</p>
                      <p className="text-[10px] text-navy-500 font-medium">
                        {new Date(stats.techInterview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-12 w-12 font-bold shrink-0">
                      <CircularProgressbar
                        value={stats.techInterview.score}
                        text={`${stats.techInterview.score}%`}
                      />
                    </div>
                  </div>
                )}

                {/* Last Resume Interview Score */}
                {stats.resumeInterview && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-navy-950/40 light:bg-navy-50/50 border border-navy-800/60 light:border-navy-100/80 hover:bg-navy-850/40 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[10px] text-navy-500 light:text-navy-400 font-extrabold tracking-widest uppercase">
                        Resume Interview
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-text-dark light:text-text-light">Personalized Score</p>
                      <p className="text-[10px] text-navy-500 font-medium">
                        {new Date(stats.resumeInterview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-12 w-12 font-bold shrink-0">
                      <CircularProgressbar
                        value={stats.resumeInterview.score}
                        text={`${stats.resumeInterview.score}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
