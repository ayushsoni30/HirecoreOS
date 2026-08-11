/**
 * File: client/src/pages/LandingPage.jsx
 * Description: Left-aligned, highly detailed scholarly editorial landing page for HireCore OS.
 *              Showcases system architecture, comprehensive feature breakdown, performance models,
 *              and lead engineer directory with vintage academic elegance.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import HcLogo from '../components/HcLogo';
import { 
  FileText, 
  Cpu, 
  HelpCircle, 
  Bot, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Terminal, 
  CheckCircle2
} from 'lucide-react';

const GithubIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LandingPage = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 md:pt-16 pb-16 space-y-20 text-left font-serif text-paper-50 light:text-paper-900 select-none">
      
      {/* Hero Section - Strict Alignment & Scholarly Layout */}
      <section className="space-y-8 border-b border-paper-800 light:border-paper-200 pb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
          <Terminal className="h-3.5 w-3.5" />
          <span>[SYSTEM_MANIFEST // HIRECORE OS v1.0]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Title & Description Column */}
          <div className="lg:col-span-8 space-y-5 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif font-normal tracking-tight leading-[1.15] text-paper-50 light:text-paper-900">
              The Academic Engine for Technical Evaluation & Career Mastery.
            </h1>
            <p className="text-base sm:text-lg text-paper-300 light:text-paper-600 leading-relaxed font-serif max-w-2xl">
              HireCore OS is an open-standard, AI-driven assessment operating system. Designed with rigorous scholarly standards, it unifies curriculum vitae analysis, subject-based technical examinations, resume-contextual interviews, and real-time candidate metrics.
            </p>
          </div>

          {/* Right Status Card Column */}
          <div className="lg:col-span-4 p-5 border border-paper-800 light:border-paper-200 bg-paper-900/60 light:bg-paper-100/60 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <HcLogo className="h-9 w-9 text-accent shrink-0" />
              <div>
                <span className="font-serif font-bold text-sm text-paper-50 light:text-paper-900 block leading-tight">HireCore OS</span>
                <span className="font-mono text-[9px] text-paper-400 light:text-paper-500 uppercase tracking-widest block">v1.0 Scholarly Suite</span>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs border-y border-paper-800/80 light:border-paper-200 py-3 my-1">
              <div className="flex justify-between items-center">
                <span className="text-paper-500 text-[11px]">System Status</span>
                <span className="text-success font-medium text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-success inline-block"></span>
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-paper-500 text-[11px]">AI Inference</span>
                <span className="text-paper-200 light:text-paper-800 text-[11px]">Cerebras GPT-OSS-120B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-paper-500 text-[11px]">Security</span>
                <span className="text-paper-200 light:text-paper-800 text-[11px]">JWT + Google OAuth</span>
              </div>
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full py-2.5 px-4 border border-accent bg-accent text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent/90 transition-all text-center"
            >
              {user ? 'Enter Dashboard' : 'Get Started / Sign In'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Feature Index Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 font-mono text-xs">
          {[
            { tag: '[01]', name: 'Resume Analyzer' },
            { tag: '[02]', name: 'Tech Interviews' },
            { tag: '[03]', name: 'CV Oral Exams' },
            { tag: '[04]', name: 'Tech Buddy AI' },
            { tag: '[05]', name: 'Live Analytics' },
            { tag: '[06]', name: 'Google OAuth' },
          ].map((item) => (
            <div key={item.tag} className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50 text-paper-300 light:text-paper-600 flex items-center gap-2 transition-colors hover:border-paper-700">
              <span className="text-accent font-bold shrink-0">{item.tag}</span>
              <span className="truncate text-[11px]">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Breakdown - In-Depth Detailed Sections */}
      <section className="space-y-10">
        <div className="space-y-2 border-l-2 border-accent pl-4">
          <span className="font-mono text-xs text-accent uppercase tracking-widest block">[SYSTEM_CAPABILITIES]</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Core Functional Architecture</h2>
          <p className="text-sm text-paper-400 light:text-paper-600">Every module in HireCore OS is engineered for maximum accuracy, transparency, and academic rigor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Feature 1: Smart Resume Analyzer */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_01]</span>
                <h3 className="text-lg font-serif font-bold">Smart Resume Analyzer</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Performs structural PDF extraction using <code className="font-mono text-accent">pdf-parse</code> and processes candidate experience against target job descriptions using Cerebras AI models. Generates a precise 0-100 match percentage score alongside a critical missing skills matrix and actionable feedback.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Multi-format PDF Parsing & Keyword Extraction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Detailed Skill Breakdown & Missing Requirement List
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Live Historical Archiving into MongoDB
              </li>
            </ul>
          </div>

          {/* Feature 2: Tech Interview Practice */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_02]</span>
                <h3 className="text-lg font-serif font-bold">Tech Interview Practice</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Subject-driven technical examination generator tailored across Computer Science core domains (Data Structures, OS, DBMS, Web Development, System Design). Delivers 5 challenging questions per session with automated scoring and constructive evaluation.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Domain-Specific Question Synthesis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Instant Subject Feedback & Ideal Sample Answers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Zero Emoji Academic Clean Markdown Rendering
              </li>
            </ul>
          </div>

          {/* Feature 3: Resume-Based Contextual Interview */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_03]</span>
                <h3 className="text-lg font-serif font-bold">Resume-Based Contextual Interview</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Ingests candidate CV files to synthesize deeply personalized interview questions based on the candidate's actual projects, tech stack, and listed experience. Tests practical depth and project ownership.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Project & Stack Deep Dive Ingestion
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> 5 Custom Contextual Examination Questions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Multi-turn Answer Evaluation & Score Archiving
              </li>
            </ul>
          </div>

          {/* Feature 4: Tech Buddy AI Assistant */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_04]</span>
                <h3 className="text-lg font-serif font-bold">Tech Buddy AI Assistant</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Interactive companion powered by Cerebras AI models with persistent MongoDB chat history. Provides instant code debugging, system architecture advice, algorithmic explanations, and career guidance.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Tailwind Typography Prose Markdown Rendering
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Persistent Session Chat Thread Archiving
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Ultra-Fast Inference via Cerebras GPT-OSS Engine
              </li>
            </ul>
          </div>

          {/* Feature 5: Overview Dashboard */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_05]</span>
                <h3 className="text-lg font-serif font-bold">Live Performance Analytics</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Central command dashboard displaying live candidate metrics: match percentage averages, overall technical scores, evaluation counts, active history logs, and theme-adaptive circular progress displays.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Dynamic Theme-Aware Contrast (Dark & Light Mode)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> MongoDB Normalized Aggregation Pipelines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Instant Assessment Activity Feed
              </li>
            </ul>
          </div>

          {/* Feature 6: Security & OAuth */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-4">
            <div className="flex items-center gap-3 border-b border-paper-800 light:border-paper-200 pb-3">
              <div className="p-2 border border-accent bg-accent/10 text-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[MODULE_06]</span>
                <h3 className="text-lg font-serif font-bold">Google OAuth & Account Security</h3>
              </div>
            </div>
            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Enterprise-grade authentication system combining traditional email/password verification with Google OAuth single sign-on. Features multi-provider account linking and HTTP-Only JWT cookie session security.
            </p>
            <ul className="space-y-1.5 font-mono text-[11px] text-paper-400 light:text-paper-500 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> HTTP-Only Secure Cookie Session Storage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Server-side Token Verification (`google-auth-library`)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> Dual Provider Account Linking (`local` & `google`)
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Developer Showcase Section */}
      <section className="space-y-8 border-t border-paper-800 light:border-paper-200 pt-12">
        <div className="space-y-2 border-l-2 border-accent pl-4">
          <span className="font-mono text-xs text-accent uppercase tracking-widest block">[CORE_ENGINEERS]</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">System Architects & Lead Developers</h2>
          <p className="text-sm text-paper-400 light:text-paper-600">The engineering minds behind HireCore OS platform design and infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Rishabh Sharma Card */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/60 light:bg-paper-100/60 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-800 light:border-paper-200 pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent block">[LEAD_BACKEND_ENGINEER]</span>
                <h3 className="text-xl font-serif font-bold text-paper-50 light:text-paper-900">Rishabh Sharma</h3>
              </div>
              <span className="px-2 py-0.5 border border-accent/40 bg-accent/10 font-mono text-[9px] text-accent uppercase">
                Backend & AI Systems
              </span>
            </div>

            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Backend Engineer focusing on high-performance REST APIs, AI integration, and cloud infrastructure. Creator of LayerZero and KaushalAI.
            </p>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="https://github.com/rishhbh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 hover:bg-paper-800 text-paper-200 light:text-paper-800 transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5 text-accent" /> /rishhbh
              </a>
              <a
                href="https://rishabhh.is-a.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 hover:bg-paper-800 text-paper-200 light:text-paper-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-accent" /> Portfolio
              </a>
            </div>
          </div>

          {/* Ayush Soni Card */}
          <div className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/60 light:bg-paper-100/60 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-800 light:border-paper-200 pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent block">[LEAD_FULLSTACK_ENGINEER]</span>
                <h3 className="text-xl font-serif font-bold text-paper-50 light:text-paper-900">Ayush Soni</h3>
              </div>
              <span className="px-2 py-0.5 border border-accent/40 bg-accent/10 font-mono text-[9px] text-accent uppercase">
                Full Stack & GenAI
              </span>
            </div>

            <p className="text-xs text-paper-300 light:text-paper-600 leading-relaxed font-serif">
              Full Stack Developer specializing in React, Node.js, GenAI, RAG pipelines, and AI Agents. Dedicated to building useful, intuitive products.
            </p>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="https://github.com/ayushsoni30"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 hover:bg-paper-800 text-paper-200 light:text-paper-800 transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5 text-accent" /> /ayushsoni30
              </a>
              <a
                href="https://myport-pi-two.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 hover:bg-paper-800 text-paper-200 light:text-paper-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-accent" /> Portfolio
              </a>
            </div>
          </div>

        </div>

        <div className="pt-4 flex justify-start">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-4 py-2 border border-accent/50 bg-accent/10 text-accent font-serif font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
          >
            Read Complete Team Dossier & About Page <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-paper-800 light:border-paper-200 pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-paper-500 light:text-paper-400">
        <div>
          <span className="text-paper-300 light:text-paper-700 font-bold font-serif text-sm block">HireCore OS — Scholarly Career Engine</span>
          <span>© 2026 HireCore Open Source Initiative. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-accent transition-colors">/about</Link>
          <Link to="/dashboard" className="hover:text-accent transition-colors">/dashboard</Link>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
