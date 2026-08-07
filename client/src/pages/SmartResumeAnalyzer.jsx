/**
 * File: client/src/pages/SmartResumeAnalyzer.jsx
 * Description: Interface to upload a resume PDF and paste a job description.
 *              Submits inputs for Gemini analysis and displays scores, pros, and cons.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { FileUp, FileText, CheckCircle2, AlertOctagon, Loader2, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SmartResumeAnalyzer = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        showToast('Please upload a valid PDF document.', 'warning');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast('Please upload your resume PDF.', 'warning');
      return;
    }

    if (!jobDescription || jobDescription.trim() === '') {
      showToast('Please paste the Job Description.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await api.post('/resume-analyzer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        setResult(response);
        showToast('Resume analyzed successfully!', 'success');
      } else {
        throw new Error(response.message || 'Analysis failed.');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      showToast(err.message || 'Failed to complete resume analysis.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Smart Resume Analyzer</h2>
        <p className="text-xs sm:text-sm text-navy-400 light:text-navy-500 font-normal leading-relaxed">
          Upload your resume and paste a target Job Description. Our AI parses the contents, scores the alignment, and outlines key recommendations.
        </p>
      </div>

      {!result ? (
        /* Input Form */
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleAnalyze} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="text-xs font-bold tracking-widest uppercase text-navy-400">
              Step 1: Upload Resume
            </label>
            
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className={`
                border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[300px] relative overflow-hidden
                ${file 
                  ? 'border-accent bg-accent/5' 
                  : 'border-navy-800 bg-navy-900/20 hover:border-accent/40 light:border-navy-200 light:bg-white light:hover:border-accent/40 shadow-inner'
                }
              `}
            >
              <input
                type="file"
                id="resume-file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="resume-file" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4 py-8 select-none">
                {file ? (
                  <>
                    <div className="h-14 w-14 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shadow-glow-primary border border-accent/25">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-sm sm:text-base text-text-dark light:text-text-light line-clamp-1 px-4">{file.name}</p>
                      <p className="text-[10px] text-navy-400 font-semibold mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                      </p>
                    </div>
                    <span className="text-xs text-accent font-extrabold hover:underline mt-2">
                      Replace File
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-14 w-14 rounded-2xl bg-navy-900/60 light:bg-navy-50 flex items-center justify-center text-navy-400 light:text-navy-500 border border-navy-800/80 light:border-navy-100 shadow-sm animate-pulse">
                      <FileUp className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base text-text-dark light:text-text-light">Drag and drop or click to browse</p>
                      <p className="text-[10px] text-navy-500 mt-1.5 font-medium">Supports PDF format up to 10MB</p>
                    </div>
                  </>
                )}
              </label>
            </motion.div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-4 flex flex-col">
            <label htmlFor="job-description" className="text-xs font-bold tracking-widest uppercase text-navy-400">
              Step 2: Paste Job Description
            </label>
            <textarea
              id="job-description"
              className="flex-1 w-full p-4 rounded-2xl border border-navy-800/85 bg-navy-900/40 text-text-dark focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 light:bg-white light:border-navy-200 light:text-text-light resize-none min-h-[300px] text-xs sm:text-sm leading-relaxed"
              placeholder="Paste the target job requirements, roles, skills, and qualifications here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Action Row */}
          <div className="md:col-span-2 flex justify-end">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-white font-extrabold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-accent/25 text-xs sm:text-sm tracking-wide uppercase"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  Analyze Match
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      ) : (
        /* Results View */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Score Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-100 shadow-xl flex flex-col items-center justify-center text-center gap-4 hover:shadow-glow-primary transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg">Overall Match Score</h3>
              <div className="h-32 w-32 my-2 relative font-black">
                <CircularProgressbar
                  value={result.score}
                  text={`${result.score}%`}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-navy-400 light:text-navy-500 max-w-[200px] leading-relaxed">
                This score represents the semantic alignment between your resume contents and the job description.
              </p>
            </motion.div>

            {/* Pros and Cons Column wrapper */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Pros list */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col text-left"
              >
                <h4 className="font-extrabold text-emerald-400 light:text-emerald-700 flex items-center gap-2 mb-4 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Key Strengths (Pros)
                </h4>
                {result.pros && result.pros.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {result.pros.map((pro, index) => (
                      <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 text-navy-200 light:text-navy-800">
                        <span className="text-emerald-500 mt-1 text-base leading-none">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-navy-500 flex-1 font-medium">No major highlights identified.</p>
                )}
              </motion.div>

              {/* Cons list */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 shadow-sm hover:shadow-[0_0_25px_rgba(239,68,68,0.1)] transition-all duration-300 flex flex-col text-left"
              >
                <h4 className="font-extrabold text-red-400 light:text-red-700 flex items-center gap-2 mb-4 text-sm sm:text-base">
                  <AlertOctagon className="h-5 w-5 shrink-0" />
                  Gaps & Weaknesses (Cons)
                </h4>
                {result.cons && result.cons.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {result.cons.map((con, index) => (
                      <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 text-navy-200 light:text-navy-800">
                        <span className="text-red-500 mt-1 text-base leading-none">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-navy-500 flex-1 font-medium">No critical gaps detected!</p>
                )}
              </motion.div>

            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-navy-800/80 hover:bg-navy-850/60 light:border-navy-200 light:hover:bg-navy-50 font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Resume
            </motion.button>
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default SmartResumeAnalyzer;
