/**
 * File: client/src/pages/TermsOfService.jsx
 * Description: Terms of Service page for HireCore OS. Renders the full ToS document
 *              in the established academic editorial design language.
 */

import { FileText, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'about-hirecore-os',
    title: '1. About HireCore OS',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is a personal software project providing tools for:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Resume analysis and job-description matching.',
            'Technical interview practice.',
            'Resume-based interview practice.',
            'AI-assisted technical research and learning.',
            'Performance and assessment tracking.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>The service is intended to assist users with learning, preparation, and evaluation.</p>
      </div>
    ),
  },
  {
    id: 'accounts',
    title: '2. Accounts',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>Some features require you to create an account.</p>
        <p>You are responsible for providing accurate information and maintaining the security of your account.</p>
        <p>You may authenticate using an email/password account or Google Sign-In.</p>
        <p>You are responsible for activity performed through your account.</p>
      </div>
    ),
  },
  {
    id: 'google-sign-in',
    title: '3. Google Sign-In',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>Google Sign-In is provided solely as an authentication method.</p>
        <p>By using Google Sign-In, you authorize HireCore OS to receive the basic information necessary to authenticate your account through Google's authentication system.</p>
        <div className="p-3 border border-accent/20 bg-accent/5 font-mono text-xs text-paper-300 light:text-paper-600 space-y-1.5">
          <p className="text-accent font-bold uppercase tracking-wider text-[10px]">[EXPLICIT COMMITMENT]</p>
          <p>HireCore OS does <strong className="text-paper-100 light:text-paper-800">not</strong> request access to your Gmail, Google Drive, Calendar, or other Google services.</p>
        </div>
        <p>Your use of Google's authentication service may also be subject to Google's own terms and policies.</p>
      </div>
    ),
  },
  {
    id: 'user-content',
    title: '4. User Content',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>You may submit content such as:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Resumes.',
            'Job descriptions.',
            'Interview answers.',
            'Technical questions.',
            'Messages to the AI assistant.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>You retain ownership of content that you submit.</p>
        <p>You grant HireCore OS permission to process that content solely as necessary to provide the features you request.</p>
        <p>You must not submit content that you do not have the right to use or that violates applicable laws.</p>
      </div>
    ),
  },
  {
    id: 'ai-generated-results',
    title: '5. AI-Generated Results',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS uses artificial intelligence to generate resume analysis, interview questions, evaluations, technical explanations, and other results.</p>
        <div className="p-3 border border-paper-700 light:border-paper-300 bg-paper-950 light:bg-paper-50 font-mono text-xs text-paper-400 light:text-paper-500 space-y-1.5">
          <p className="text-paper-300 light:text-paper-600">AI-generated results may contain mistakes, inaccuracies, omissions, or inappropriate recommendations.</p>
          <p>Results should be treated as <strong className="text-paper-100 light:text-paper-800">assistance rather than guaranteed professional, academic, employment, legal, or technical advice.</strong></p>
        </div>
        <p>You are responsible for reviewing AI-generated information before relying on it.</p>
      </div>
    ),
  },
  {
    id: 'acceptable-use',
    title: '6. Acceptable Use',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>You agree not to:</p>
        <ul className="space-y-1.5 font-mono text-xs text-paper-400 light:text-paper-500">
          {[
            'Use HireCore OS for unlawful purposes.',
            'Attempt to gain unauthorized access to the service or another user\'s account.',
            'Interfere with the operation or security of the service.',
            'Upload malicious software or harmful content.',
            'Abuse automated systems or attempt to circumvent reasonable usage restrictions.',
            'Misrepresent yourself or use the service to impersonate another person.',
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
    id: 'third-party-services',
    title: '7. Third-Party Services',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS relies on third-party services for certain functionality, including authentication, database/storage infrastructure, and AI processing.</p>
        <p>The availability and operation of those third-party services may affect HireCore OS functionality.</p>
        <p>Third-party services may have their own terms and privacy policies.</p>
      </div>
    ),
  },
  {
    id: 'availability',
    title: '8. Availability',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is a personal project and may be changed, interrupted, suspended, or discontinued at any time.</p>
        <p>We do not guarantee that the service will always be available, error-free, secure, or compatible with every device or browser.</p>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    title: '9. Disclaimer',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is provided on an <strong className="text-paper-100 light:text-paper-800">"as is"</strong> and <strong className="text-paper-100 light:text-paper-800">"as available"</strong> basis.</p>
        <p>We make no guarantees regarding the accuracy, reliability, completeness, or suitability of information or AI-generated results provided by the service.</p>
        <p className="text-paper-400 light:text-paper-600 text-xs font-mono border-l-2 border-accent/40 pl-3">
          HireCore OS should not be used as the sole basis for important employment, academic, financial, legal, medical, or other consequential decisions.
        </p>
      </div>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: '10. Limitation of Liability',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>To the maximum extent permitted by applicable law, the project maintainer is not responsible for indirect, incidental, consequential, or other damages arising from your use of or inability to use HireCore OS.</p>
        <p>Nothing in these Terms excludes liability that cannot legally be excluded.</p>
      </div>
    ),
  },
  {
    id: 'account-termination',
    title: '11. Account Termination',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>You may stop using HireCore OS at any time.</p>
        <p>We may suspend or terminate access if an account is used in violation of these Terms, compromises the security of the service, or is used for unlawful activity.</p>
      </div>
    ),
  },
  {
    id: 'changes-to-terms',
    title: '12. Changes to These Terms',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>These Terms may be updated as HireCore OS develops. Updated Terms will be published on this page with a revised "Last updated" date.</p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '13. Contact',
    content: (
      <div className="space-y-3 text-paper-300 light:text-paper-600 font-serif leading-relaxed text-sm">
        <p>HireCore OS is a personal project.</p>
        <p>For questions regarding these Terms, contact the project maintainer through the contact information provided on the HireCore OS website.</p>
      </div>
    ),
  },
];

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 text-left font-serif text-paper-50 light:text-paper-900 select-none">

      {/* Page Header */}
      <section className="space-y-4 border-b border-paper-800 light:border-paper-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
          <FileText className="h-3.5 w-3.5" />
          <span>[LEGAL // TERMS OF SERVICE]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
          Terms of Service
        </h1>
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-paper-500 light:text-paper-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-paper-800 light:border-paper-200 bg-paper-900/50 light:bg-paper-100">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            Last updated: August 11, 2026
          </span>
          <span className="text-paper-600 light:text-paper-400">HireCore OS</span>
        </div>
        <p className="text-sm text-paper-300 light:text-paper-600 font-serif leading-relaxed max-w-3xl">
          These Terms of Service govern your use of HireCore OS. By accessing or using HireCore OS, you agree to these Terms. If you do not agree with them, please do not use the service.
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

      {/* Terms Sections */}
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
          This document is effective as of August 11, 2026. For the Privacy Policy, visit <a href="/privacy" className="text-accent hover:underline">/privacy</a>.
        </p>
      </section>

    </div>
  );
};

export default TermsOfService;
