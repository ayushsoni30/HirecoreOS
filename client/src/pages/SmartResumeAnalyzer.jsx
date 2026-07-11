/**
 * File: client/src/pages/SmartResumeAnalyzer.jsx
 * Description: Interface to upload a resume PDF and paste a job description.
 *              Submits inputs for Gemini analysis and displays scores, pros, and cons.
 */

import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { FileUp, FileText, CheckCircle2, AlertOctagon, Loader2, Sparkles, RefreshCw } from 'lucide-react';
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

    // Formulate multipart form data
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
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-slide-in">
      
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Smart Resume Analyzer</h2>
        <p className="text-sm text-navy-400 light:text-navy-500">
          Upload your resume and paste a target Job Description. Our AI parses the contents, scores the alignment, and outlines key recommendations.
        </p>
      </div>

      {!result ? (
        /* Input Form */
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="text-sm font-semibold tracking-wide uppercase text-navy-400">
              Step 1: Upload Resume
            </label>
            <div className={`
              border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[300px]
              ${file 
                ? 'border-accent bg-accent/5' 
                : 'border-navy-800 bg-navy-900/40 hover:border-accent/40 light:border-navy-200 light:bg-white light:hover:border-accent/40'
              }
            `}>
              <input
                type="file"
                id="resume-file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="resume-file" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4 py-8">
                {file ? (
                  <>
                    <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-semibold text-base line-clamp-1 px-4">{file.name}</p>
                      <p className="text-xs text-navy-500 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                      </p>
                    </div>
                    <span className="text-xs text-accent hover:underline mt-2">
                      Replace File
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-14 w-14 rounded-full bg-navy-850 light:bg-navy-50 flex items-center justify-center text-navy-400 light:text-navy-500">
                      <FileUp className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Drag and drop or click to browse</p>
                      <p className="text-xs text-navy-500 mt-1">Supports PDF format up to 10MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-4 flex flex-col">
            <label htmlFor="job-description" className="text-sm font-semibold tracking-wide uppercase text-navy-400">
              Step 2: Paste Job Description
            </label>
            <textarea
              id="job-description"
              className="flex-1 w-full p-4 rounded-xl border border-navy-800 bg-navy-900 text-text-dark focus:border-accent focus:outline-none transition-all duration-300 light:bg-white light:border-navy-200 light:text-text-light resize-none min-h-[300px] text-sm leading-relaxed"
              placeholder="Paste the target job requirements, roles, skills, and qualifications here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Action Row */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-accent text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-accent/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-slide-in text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Score Card */}
            <div className="p-6 rounded-2xl border border-navy-800 bg-navy-900 light:bg-white light:border-navy-100 shadow-xl flex flex-col items-center justify-center text-center gap-4">
              <h3 className="font-semibold text-lg">Overall Match Score</h3>
              <div className="h-32 w-32 my-2">
                <CircularProgressbar
                  value={result.score}
                  text={`${result.score}%`}
                />
              </div>
              <p className="text-xs text-navy-400 light:text-navy-500 max-w-[200px]">
                This score represents the semantic alignment between your resume contents and the job description.
              </p>
            </div>

            {/* Pros and Cons Column wrapper */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Pros list */}
              <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 light:bg-emerald-500/5 light:border-emerald-500/10 shadow-sm flex flex-col text-left">
                <h4 className="font-semibold text-emerald-400 light:text-emerald-700 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Key Strengths (Pros)
                </h4>
                {result.pros && result.pros.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {result.pros.map((pro, index) => (
                      <li key={index} className="text-sm leading-relaxed flex items-start gap-2.5">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-500 flex-1">No major highlights identified.</p>
                )}
              </div>

              {/* Cons list */}
              <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 light:bg-red-500/5 light:border-red-500/10 shadow-sm flex flex-col text-left">
                <h4 className="font-semibold text-red-400 light:text-red-700 flex items-center gap-2 mb-4">
                  <AlertOctagon className="h-5 w-5 shrink-0" />
                  Gaps & Weaknesses (Cons)
                </h4>
                {result.cons && result.cons.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {result.cons.map((con, index) => (
                      <li key={index} className="text-sm leading-relaxed flex items-start gap-2.5">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-500 flex-1">No critical gaps detected!</p>
                )}
              </div>

            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-navy-800 hover:bg-navy-850 light:border-navy-200 light:hover:bg-navy-50 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Resume
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default SmartResumeAnalyzer;
