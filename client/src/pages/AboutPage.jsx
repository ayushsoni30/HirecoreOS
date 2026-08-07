/**
 * File: client/src/pages/AboutPage.jsx
 * Description: Dedicated About Page for HireCore OS detailing system objectives,
 *              academic philosophy, and comprehensive engineer profiles for Rishabh Sharma and Ayush Soni.
 */

import { ExternalLink, Terminal } from 'lucide-react';

const GithubIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 text-left font-serif text-paper-50 light:text-paper-900 select-none">
      
      {/* Page Header */}
      <section className="space-y-4 border-b border-paper-800 light:border-paper-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
          <Terminal className="h-3.5 w-3.5" />
          <span>[DOSSIER // SYSTEM ABOUT & LEADERSHIP]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
          About HireCore OS
        </h1>
        <p className="text-base text-paper-300 light:text-paper-600 font-serif leading-relaxed max-w-3xl">
          HireCore OS is built to replace imprecise candidate evaluation with open, structured, AI-assisted methodology. Developed as an institutional-grade platform, it seamlessly bridges resume parsing, subject-based technical testing, contextual oral exams, and real-time candidate metrics.
        </p>
      </section>

      {/* Developers Section Header */}
      <div className="space-y-2 border-l-2 border-accent pl-4">
        <span className="font-mono text-xs text-accent uppercase tracking-widest block">[ENGINEERING_FACULTY]</span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Core Lead Engineers</h2>
      </div>

      {/* Engineer 1: Rishabh Sharma */}
      <section className="p-6 sm:p-8 border border-paper-800 light:border-paper-200 bg-paper-900/50 light:bg-paper-100/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-800 light:border-paper-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-accent bg-accent/10 flex items-center justify-center font-mono font-bold text-accent text-lg">
              RS
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-paper-50 light:text-paper-900">Rishabh Sharma</h3>
              <p className="font-mono text-xs text-accent uppercase tracking-wider">Backend Engineer & AI Systems Lead</p>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
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

        {/* Markdown Bio Content */}
        <div className="prose prose-invert light:prose-neutral max-w-none text-xs sm:text-sm leading-relaxed space-y-4 font-serif">
          <div>
            <h4 className="text-base font-serif font-bold text-paper-50 light:text-paper-900 mb-2">Hi there, I'm Rishabh</h4>
            <p className="text-paper-300 light:text-paper-700">
              Backend Engineer with a strong interest in AI Systems and Cloud Technologies.
            </p>
            <p className="text-paper-300 light:text-paper-700 mt-2">
              I build production-ready backend systems using <strong className="text-paper-50 light:text-paper-900">Node.js, TypeScript, and the MERN stack</strong>, with experience designing secure REST APIs, authentication systems, deployment pipelines, and AI-powered applications. I enjoy solving infrastructure problems just as much as application logic, from Dockerizing services and automating deployments with <strong className="text-paper-50 light:text-paper-900">GitHub Actions</strong> to deploying scalable applications on <strong className="text-paper-50 light:text-paper-900">AWS.</strong>
            </p>
            <p className="text-paper-300 light:text-paper-700 mt-2">
              Notable projects include <strong className="text-accent">LayerZero</strong>, an AI document summarization platform deployed on AWS EC2 with Redis caching and automated CI/CD, and <strong className="text-accent">KaushalAI</strong>, an award-winning AI-powered job marketplace.
            </p>
          </div>

          <div className="p-4 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50 space-y-2 font-mono text-xs">
            <p className="text-paper-300 light:text-paper-700">• Currently building AI-powered applications and backend systems</p>
            <p className="text-paper-300 light:text-paper-700">• Learning more about AWS, distributed systems, and cloud infrastructure</p>
            <p className="text-accent">• Fun fact: Every architecture diagram is optimistic until production traffic arrives.</p>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-base font-serif font-bold text-paper-50 light:text-paper-900">Experience</h4>
            <ul className="list-disc list-inside space-y-1 text-paper-300 light:text-paper-700 font-mono text-xs">
              <li><strong className="text-paper-50 light:text-paper-900">SDE Intern & Tech Lead</strong> @ foundertruth</li>
              <li><strong className="text-paper-50 light:text-paper-900">Backend Dev Intern</strong> @ Decoders Entity</li>
              <li><strong className="text-paper-50 light:text-paper-900">Software Dev Intern</strong> @ Walk Reward</li>
              <li><strong className="text-paper-50 light:text-paper-900">MERN Dev Intern</strong> @ RevLabz</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Engineer 2: Ayush Soni */}
      <section className="p-6 sm:p-8 border border-paper-800 light:border-paper-200 bg-paper-900/50 light:bg-paper-100/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-800 light:border-paper-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-accent bg-accent/10 flex items-center justify-center font-mono font-bold text-accent text-lg">
              AS
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-paper-50 light:text-paper-900">Ayush Soni</h3>
              <p className="font-mono text-xs text-accent uppercase tracking-wider">Full Stack Developer & GenAI Enthusiast</p>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
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

        {/* Ayush Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs border border-paper-800 light:border-paper-200 p-3 bg-paper-950 light:bg-paper-50">
          <div><span className="text-paper-500 block text-[10px] uppercase">Status</span> <span className="text-accent font-bold">Online</span></div>
          <div><span className="text-paper-500 block text-[10px] uppercase">Role</span> <span>Full Stack Dev</span></div>
          <div><span className="text-paper-500 block text-[10px] uppercase">Learning</span> <span>GenAI • RAG • Agents</span></div>
          <div><span className="text-paper-500 block text-[10px] uppercase">Stack</span> <span>MERN + Python</span></div>
        </div>

        {/* Code Block Object & Focus List */}
        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-paper-400 font-bold uppercase tracking-wider block">🧠 About Me</span>
            <pre className="p-4 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50 text-accent font-mono overflow-x-auto text-[11px]">
{`const ayush = {
  code: ["JavaScript", "Python"],
  frontend: ["React", "Tailwind CSS", "HTML", "CSS"],
  backend: ["Node.js", "Express.js"],
  database: ["MongoDB"],
  currentlyLearning: ["GenAI", "RAG", "AI Agents"],
  hobbies: ["Gym", "Anime", "Building Projects"],
  goal: "Turn ideas into products",
};`}
            </pre>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-paper-400 font-bold uppercase tracking-wider block">🚀 Current Focus</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-paper-300 light:text-paper-700">
              <li className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50">🤖 Building AI-powered applications</li>
              <li className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50">📚 Mastering the MERN stack</li>
              <li className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50">🧠 Exploring RAG & AI Agents</li>
              <li className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50">🐍 Sharpening Python fundamentals</li>
              <li className="p-2.5 border border-paper-800 light:border-paper-200 bg-paper-950 light:bg-paper-50 col-span-1 sm:col-span-2">💪 Staying consistent — code and gym both</li>
            </ul>
          </div>
        </div>
      </section>

      {/* System Technical Specifications Footer */}
      <section className="p-6 border border-paper-800 light:border-paper-200 bg-paper-900/30 light:bg-paper-100/40 space-y-3">
        <h4 className="text-sm font-serif font-bold uppercase tracking-widest text-accent">HireCore OS Architecture Principles</h4>
        <p className="text-xs text-paper-300 light:text-paper-600 font-serif leading-relaxed">
          100% Client-Side Rendering with React 19 • Zero-Radius 0px Academic Styling • Express & Mongoose Production API • High-throughput Cerebras AI Inference • Google OAuth & JWT HTTP-Only Auth Security.
        </p>
      </section>

    </div>
  );
};

export default AboutPage;
