/**
 * File: client/src/pages/SmartResumeAnalyzer.jsx
 * Description: Interface to upload a resume PDF and paste a job description.
 *              Submits inputs for Cerebras AI analysis and displays scores, pros, and cons.
 *              Redesigned with Libertinus Serif, sharp 0px corners, and academic paper layout.
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 font-serif text-left">
      {/* Page Header */}
      <div className="border-b border-paper-800 light:border-paper-200 pb-4 space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent block">
          [MODULE_02 // RESUME_EVALUATION]
        </span>
        <h2 className="text-2xl font-serif font-normal tracking-tight text-paper-50 light:text-paper-900">
          Smart Resume Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-paper-400 light:text-paper-600 font-normal leading-relaxed">
          Upload your Curriculum Vitae PDF and paste a target Job Description. Our AI evaluates semantic alignment, scores overall fit, and outlines key strengths and gaps.
        </p>
      </div>

      {!result ? (
        /* Input Form */
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleAnalyze} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="font-mono text-[11px] uppercase tracking-widest text-paper-400 block">
              [STEP_01] Upload Curriculum Vitae (PDF)
            </label>
            
            <div 
              className={`
                border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[300px] relative
                ${file 
                  ? 'border-accent bg-accent/5' 
                  : 'border-paper-800 bg-paper-900/40 hover:border-accent light:border-paper-300 light:bg-paper-100/50'
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
              <label htmlFor="resume-file" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4 py-6 select-none">
                {file ? (
                  <>
                    <div className="h-12 w-12 border border-accent bg-accent/10 flex items-center justify-center text-accent">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="font-serif font-bold text-sm sm:text-base text-paper-50 light:text-paper-900 line-clamp-1 px-4">{file.name}</p>
                      <p className="font-mono text-[10px] text-paper-400 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF DOCUMENT
                      </p>
                    </div>
                    <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider underline mt-2">
                      REPLACE FILE
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 border border-paper-700 bg-paper-950 flex items-center justify-center text-paper-400">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm sm:text-base text-paper-50 light:text-paper-900">Drag & drop or click to select PDF</p>
                      <p className="font-mono text-[10px] text-paper-500 mt-1.5 uppercase tracking-wide">PDF FORMAT UP TO 10MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-3 flex flex-col">
            <label htmlFor="job-description" className="font-mono text-[11px] uppercase tracking-widest text-paper-400 block">
              [STEP_02] Target Job Description
            </label>
            <textarea
              id="job-description"
              className="flex-1 w-full p-4 border border-paper-800 bg-paper-900/60 text-paper-50 focus:border-accent focus:outline-none transition-colors light:bg-white light:border-paper-300 light:text-paper-900 resize-none min-h-[300px] text-xs sm:text-sm font-serif leading-relaxed"
              placeholder="Paste the target job requirements, qualifications, and responsibilities here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Action Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 border border-accent bg-accent text-white font-serif font-bold flex items-center justify-center gap-2.5 hover:bg-accent/90 disabled:opacity-50 disabled:pointer-events-none transition-all text-xs sm:text-sm uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executing Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </motion.form>
      ) : (
        /* Results View */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Score Card */}
            <div className="p-6 border border-paper-800 bg-paper-900/80 light:bg-white light:border-paper-200 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-10 w-10 border border-accent bg-accent/10 flex items-center justify-center text-accent">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[FINAL_SCORE]</span>
                <h3 className="font-serif font-bold text-base text-paper-50 light:text-paper-900">Alignment Rating</h3>
              </div>
              <div className="h-32 w-32 my-2 font-serif font-bold">
                <CircularProgressbar
                  value={result.score}
                  text={`${result.score}%`}
                />
              </div>
              <p className="font-serif text-xs text-paper-400 light:text-paper-600 max-w-[200px] leading-relaxed">
                Calculated semantic alignment between candidate resume and target requirements.
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Strengths */}
              <div className="p-6 border border-emerald-900/60 bg-emerald-950/20 light:bg-emerald-50/50 light:border-emerald-200 flex flex-col text-left">
                <h4 className="font-serif font-bold text-emerald-400 light:text-emerald-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  Key Strengths (Pros)
                </h4>
                {result.pros && result.pros.length > 0 ? (
                  <ul className="space-y-2.5 flex-1 font-serif">
                    {result.pros.map((pro, index) => (
                      <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-paper-200 light:text-paper-800">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-xs text-paper-500 flex-1">No notable highlights recorded.</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="p-6 border border-red-900/60 bg-red-950/20 light:bg-red-50/50 light:border-red-200 flex flex-col text-left">
                <h4 className="font-serif font-bold text-red-400 light:text-red-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
                  <AlertOctagon className="h-4.5 w-4.5 shrink-0" />
                  Identified Gaps (Cons)
                </h4>
                {result.cons && result.cons.length > 0 ? (
                  <ul className="space-y-2.5 flex-1 font-serif">
                    {result.cons.map((con, index) => (
                      <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-paper-200 light:text-paper-800">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-xs text-paper-500 flex-1">No critical gaps identified.</p>
                )}
              </div>

            </div>
          </div>

          {/* Reset Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-paper-800 hover:bg-paper-800/40 light:border-paper-300 light:hover:bg-paper-100 font-serif font-bold flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-paper-50 light:text-paper-900 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Document
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default SmartResumeAnalyzer;
