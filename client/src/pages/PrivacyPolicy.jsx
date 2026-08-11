/**
 * File: client/src/pages/PrivacyPolicy.jsx
 * Description: Privacy Policy page for HireCore OS. Renders the full privacy policy
 *              document in the established academic editorial design language.
 */

import { Shield, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>Depending on how you use HireCore OS, we may collect:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Name and email address associated with your account.',
            'Account authentication information.',
            'Profile information that you voluntarily provide.',
            'Resumes and other documents that you upload for analysis.',
            'Job descriptions submitted for resume matching.',
            'Technical interview questions and answers.',
            'Interview and resume evaluation results.',
            'Messages sent to the Tech Buddy AI assistant.',
            'Basic application and activity information required to operate the service.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-paper-400 light:text-paper-600 text-xs font-mono border-l-2 border-accent/40 pl-3 mt-3">
          We do not collect Google account information beyond what is necessary to authenticate and create or maintain your HireCore OS account.
        </p>
      </div>
    ),
  },
  {
    id: 'google-sign-in',
    title: '2. Google Sign-In',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS provides Google Sign-In as an authentication option.</p>
        <p>When you choose to sign in with Google, HireCore OS uses Google's authentication services to verify your identity. We may receive basic account information made available through the authentication process, such as your name, email address, and profile information.</p>
        <p>Google Sign-In is used solely for authentication and account management.</p>
        <div className="p-3 border border-accent/20 bg-accent/5 font-mono text-xs text-paper-300 light:text-paper-600 space-y-1.5">
          <p className="text-accent font-bold uppercase tracking-wider text-[10px]">[EXPLICIT COMMITMENT]</p>
          <p>HireCore OS does <strong className="text-paper-100 light:text-paper-800">not</strong> request access to or read your Gmail, Google Drive, Google Calendar, YouTube, contacts, or other Google services.</p>
          <p>We do not use Google account data for advertising or sell Google user data to third parties.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'how-we-use-information',
    title: '3. How We Use Information',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>Information collected by HireCore OS may be used to:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Create and authenticate your account.',
            'Provide resume analysis and job-description matching.',
            'Generate and evaluate technical interview exercises.',
            'Provide personalized interview practice.',
            'Provide AI-assisted technical assistance.',
            'Save your analysis, interview, and chat history.',
            'Maintain application security and prevent abuse.',
            'Improve the functionality and reliability of the application.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'ai-processing',
    title: '4. AI Processing',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS uses third-party AI infrastructure to provide features such as resume analysis, interview question generation, answer evaluation, and technical assistance.</p>
        <p>Information submitted to these features may be processed by the AI service providers necessary to provide the requested functionality.</p>
        <p className="text-paper-400 light:text-paper-600 text-xs font-mono border-l-2 border-accent/40 pl-3">
          We do not use your information to train our own AI models.
        </p>
      </div>
    ),
  },
  {
    id: 'data-storage',
    title: '5. Data Storage',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>Account and application information may be stored in databases and storage services used to operate HireCore OS.</p>
        <p>Uploaded files, such as resumes or profile images, may be processed and stored using third-party infrastructure required by the application.</p>
        <p>We take reasonable technical measures to protect stored information, but no internet-based service can guarantee absolute security.</p>
      </div>
    ),
  },
  {
    id: 'data-sharing',
    title: '6. Data Sharing',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p className="font-bold text-paper-100 light:text-paper-900">We do not sell your personal information.</p>
        <p>Information may be shared with service providers only when necessary to operate HireCore OS, such as:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Database and storage providers.',
            'AI inference providers.',
            'Authentication providers.',
            'Infrastructure and hosting providers.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>These providers receive information only as necessary for the functionality they provide.</p>
      </div>
    ),
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>We retain account and application information for as long as necessary to provide HireCore OS features or until you request deletion.</p>
        <p>You may delete your HireCore OS account using the account deletion functionality provided by the application. Account deletion is intended to remove your account and associated application records.</p>
        <p>Some information may remain temporarily in backups or logs where technically necessary.</p>
      </div>
    ),
  },
  {
    id: 'your-choices',
    title: '8. Your Choices',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>You may:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Stop using HireCore OS at any time.',
            'Choose not to use Google Sign-In.',
            'Request deletion of your account and associated data.',
            'Avoid uploading documents or information you do not want processed by the application.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "9. Children's Privacy",
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is not intended for children under the age required by applicable law to independently use online services. We do not knowingly collect personal information from children without appropriate authorization.</p>
      </div>
    ),
  },
  {
    id: 'changes-to-policy',
    title: '10. Changes to This Policy',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>This Privacy Policy may be updated as HireCore OS develops or its functionality changes. Any updated version will be published at this page with a revised "Last updated" date.</p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '11. Contact',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is a personal project.</p>
        <p>For privacy-related questions or requests concerning your data, contact the project maintainer through the contact information provided on the HireCore OS website.</p>
      </div>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 text-left font-serif text-paper-50 light:text-paper-900 select-none">

      {/* Page Header */}
      <section className="space-y-4 border-b border-paper-800 light:border-paper-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
          <Shield className="h-3.5 w-3.5" />
          <span>[LEGAL // PRIVACY POLICY]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
          Privacy Policy
        </h1>
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-paper-500 light:text-paper-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-paper-800 light:border-paper-200 bg-paper-900/50 light:bg-paper-100">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            Last updated: August 11, 2026
          </span>
          <span className="text-paper-600 light:text-paper-400">HireCore OS</span>
        </div>
        <p className="text-sm text-paper-300 light:text-paper-600 font-serif leading-relaxed max-w-3xl">
          This Privacy Policy explains what information HireCore OS collects, how it is used, and how users can manage or delete their information.
        </p>
      </section>

      {/* Table of Contents */}
      <section className="p-5 border border-paper-800 light:border-paper-200 bg-paper-900/40 light:bg-paper-100/50 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">[ Table of Contents ]</p>
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono text-xs">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-2 text-paper-400 light:text-paper-500 hover:text-accent transition-colors py-0.5 group"
            >
              <ChevronRight className="h-2.5 w-2.5 text-paper-700 group-hover:text-accent transition-colors flex-shrink-0" />
              {section.title}
            </a>
          ))}
        </nav>
      </section>

      {/* Policy Sections */}
      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-6 space-y-4 border-b border-paper-800/50 light:border-paper-200 pb-8 last:border-0"
          >
            <div className="space-y-1 border-l-2 border-accent pl-4">
              <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-paper-50 light:text-paper-900">
                {section.title}
              </h2>
            </div>
            {section.content}
          </section>
        ))}
      </div>

      {/* Footer note */}
      <section className="p-5 border border-paper-800 light:border-paper-200 bg-paper-900/30 light:bg-paper-100/40 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">[ Document End // HIRECORE OS ]</p>
        <p className="text-xs text-paper-400 light:text-paper-500 font-mono">
          This document is effective as of August 11, 2026. For the Terms of Service, visit <a href="/terms" className="text-accent hover:underline">/terms</a>.
        </p>
      </section>

    </div>
  );
};

export default PrivacyPolicy;
