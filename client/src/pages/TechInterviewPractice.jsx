/**
 * File: client/src/pages/TechInterviewPractice.jsx
 * Description: Technical interview wizard. Generates topic-specific questions,
 *              guides user through answers, evaluates submissions, and lists per-question feedback.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { 
  Code, ArrowRight, ArrowLeft, Send, Loader2, 
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Terminal, Clock, Star
} from 'lucide-react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TECHS = [
  'Python', 'JavaScript', 'MERN Full Stack', 'DevOps', 'Java',
  'React', 'Node.js', 'SQL', 'Docker', 'AWS', 'Data Structures & Algorithms'
];

const TechInterviewPractice = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [selectedTech, setSelectedTech] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState('select'); // 'select' | 'loading-questions' | 'interview' | 'loading-evaluation' | 'results'
  const [evaluation, setEvaluation] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Trigger questions generation
  const handleStartInterview = async (tech) => {
    setSelectedTech(tech);
    setStep('loading-questions');
    try {
      const response = await api.post('/interview/generate', { technology: tech });
      if (response.success && response.questions) {
        setQuestions(response.questions);
        setAnswers(new Array(response.questions.length).fill(''));
        setCurrentIdx(0);
        setStep('interview');
        showToast(`Loaded ${response.questions.length} questions for ${tech}!`, 'success');
      } else {
        throw new Error('Could not fetch questions.');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to start interview practice.', 'error');
      setStep('select');
    }
  };

  const handleAnswerChange = (val) => {
    const updated = [...answers];
    updated[currentIdx] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Submit interview responses
  const handleSubmit = async () => {
    setStep('loading-evaluation');
    try {
      const responses = questions.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));

      const evaluationData = await api.post('/interview/evaluate', {
        technology: selectedTech,
        responses
      });

      if (evaluationData.success) {
        setEvaluation(evaluationData);
        setStep('results');
        showToast('Interview evaluated successfully!', 'success');
      } else {
        throw new Error('Evaluation failed.');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to evaluate interview answers.', 'error');
      setStep('interview');
    }
  };

  const resetPractice = () => {
    setSelectedTech('');
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
    setEvaluation(null);
    setStep('select');
    setActiveAccordion(null);
  };

  const toggleAccordion = (idx) => {
    setActiveAccordion(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Tech Interview Practice</h2>
        <p className="text-xs sm:text-sm text-navy-400 light:text-navy-500 font-normal leading-relaxed">
          Prepare for real-world technical assessments. Choose a technology to start a simulated Q&A flow and get detailed feedback.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT TECHNOLOGY */}
        {step === 'select' && (
          <motion.div 
            key="select-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-left"
          >
            <div className="flex items-center gap-2 border-b border-navy-800/60 light:border-navy-100 pb-3">
              <Terminal className="h-5 w-5 text-accent" />
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Select a Technology</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TECHS.map((tech) => (
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={tech}
                  onClick={() => handleStartInterview(tech)}
                  className="flex items-center justify-between p-5 rounded-2xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-200 text-left hover:border-accent hover:bg-navy-850/50 light:hover:bg-navy-50/50 transition-all duration-300 group shadow-sm hover:shadow-glow-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-navy-950/80 light:bg-navy-50 flex items-center justify-center text-navy-400 light:text-navy-600 group-hover:text-accent border border-navy-800/60 light:border-navy-100 transition-colors">
                      <Code className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm">{tech}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-navy-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* LOADING STATES */}
        {step === 'loading-questions' && (
          <motion.div 
            key="loading-q"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full border-4 border-accent/20 animate-pulse" />
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="font-extrabold text-base sm:text-lg">Generating Questions</h3>
              <p className="text-xs text-navy-400 max-w-[280px]">Curating targeted interview queries for {selectedTech} using Gemini AI...</p>
            </div>
          </motion.div>
        )}

        {step === 'loading-evaluation' && (
          <motion.div 
            key="loading-eval"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full border-4 border-secondary/20 animate-pulse" />
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="font-extrabold text-base sm:text-lg">Evaluating Responses</h3>
              <p className="text-xs text-navy-400 max-w-[280px]">Grading answers and drafting senior reviewer suggestions...</p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: RUN INTERVIEW WIZARD */}
        {step === 'interview' && (
          <motion.div 
            key="interview-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8 rounded-3xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-200 shadow-xl space-y-6 text-left relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Progress Header */}
            <div className="flex justify-between items-center border-b border-navy-800/80 light:border-navy-100 pb-4 relative z-10">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-accent/15 text-accent border border-accent/20 rounded-full">
                  {selectedTech} Mock
                </span>
                <h3 className="text-base sm:text-lg font-extrabold mt-2">
                  Question {currentIdx + 1} of {questions.length}
                </h3>
              </div>
              <span className="text-xs sm:text-sm text-navy-400 font-bold">
                {Math.round(((currentIdx + 1) / questions.length) * 100)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-navy-950 light:bg-navy-100 h-1.5 rounded-full overflow-hidden relative z-10">
              <div 
                className="bg-gradient-to-r from-accent to-secondary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text in Code Terminal Frame */}
            <div className="p-5 rounded-2xl bg-navy-950/80 light:bg-navy-50 border border-navy-800/80 light:border-navy-100 relative z-10">
              <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-navy-800/40 light:border-navy-100">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-navy-500 font-semibold font-mono ml-2">interviewer_question.md</span>
              </div>
              <p className="text-sm sm:text-base font-bold leading-relaxed text-text-dark light:text-text-light">
                {questions[currentIdx]}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-2 relative z-10">
              <label htmlFor="answer-input" className="text-[10px] font-extrabold text-navy-400 uppercase tracking-widest">
                Your Response
              </label>
              <textarea
                id="answer-input"
                className="w-full p-4 rounded-2xl border border-navy-800/80 bg-navy-950/40 text-text-dark focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 light:bg-white light:border-navy-200 light:text-text-light min-h-[160px] text-xs sm:text-sm leading-relaxed"
                placeholder="Type your detailed answer here... (Take your time, describe concepts clearly with details)"
                value={answers[currentIdx]}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-navy-800/80 light:border-navy-100 relative z-10">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 rounded-xl border border-navy-800/80 light:border-navy-200 hover:bg-navy-850/60 light:hover:bg-navy-50 flex items-center gap-2 font-extrabold text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {currentIdx === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/15 active:scale-95 uppercase tracking-wide"
                >
                  Submit Interview
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-accent text-white hover:bg-blue-600 flex items-center gap-2 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-accent/20 active:scale-95 uppercase tracking-wide"
                >
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: RESULTS PANEL */}
        {step === 'results' && evaluation && (
          <motion.div 
            key="results-step"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 animate-slide-in text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Score circle */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-navy-800/80 bg-navy-900/60 light:bg-white light:border-navy-200 shadow-xl flex flex-col items-center justify-center text-center gap-4 hover:shadow-glow-primary transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg">Assessment Result</h3>
                <div className="h-32 w-32 my-2 relative font-black">
                  <CircularProgressbar
                    value={evaluation.score}
                    text={`${evaluation.score}%`}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-navy-400 light:text-navy-500 max-w-[220px] leading-relaxed">
                  Calculated based on technical accuracy, concept clarity, and complete explanations.
                </p>
              </motion.div>

              {/* Strengths & Weaknesses */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                
                {/* Strengths */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col"
                >
                  <h4 className="font-extrabold text-emerald-400 light:text-emerald-700 flex items-center gap-2 mb-4 text-sm sm:text-base">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    Overall Strengths
                  </h4>
                  {evaluation.pros && evaluation.pros.length > 0 ? (
                    <ul className="space-y-2 flex-1">
                      {evaluation.pros.map((pro, index) => (
                        <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-navy-200 light:text-navy-800">
                          <span className="text-emerald-500 mt-0.5 text-base">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-navy-500 flex-1 font-medium">No major highlights identified.</p>
                  )}
                </motion.div>

                {/* Weaknesses */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 shadow-sm hover:shadow-[0_0_25px_rgba(239,68,68,0.1)] transition-all duration-300 flex flex-col"
                >
                  <h4 className="font-extrabold text-red-400 light:text-red-700 flex items-center gap-2 mb-4 text-sm sm:text-base">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    Areas to Improve
                  </h4>
                  {evaluation.cons && evaluation.cons.length > 0 ? (
                    <ul className="space-y-2 flex-1">
                      {evaluation.cons.map((con, index) => (
                        <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-navy-200 light:text-navy-800">
                          <span className="text-red-500 mt-0.5 text-base">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-navy-500 flex-1 font-medium">Excellent job! No massive gaps highlighted.</p>
                  )}
                </motion.div>

              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold">Detailed Question Review</h3>
              <div className="space-y-3">
                {evaluation.feedback && evaluation.feedback.map((item, index) => {
                  const isOpen = activeAccordion === index;
                  const isCorrect = item.verdict?.toLowerCase() === 'correct';
                  const isPartial = item.verdict?.toLowerCase() === 'partial';

                  let VerdictIcon = XCircle;
                  let verdictColor = 'text-red-500';
                  let bgBorder = 'border-navy-800/80';
                  let verdictText = 'Needs Review';

                  if (isCorrect) {
                    VerdictIcon = CheckCircle2;
                    verdictColor = 'text-emerald-500';
                    verdictText = 'Correct';
                  } else if (isPartial) {
                    VerdictIcon = AlertTriangle;
                    verdictColor = 'text-amber-500';
                    verdictText = 'Partial Answer';
                  }

                  return (
                    <div 
                      key={index}
                      className={`rounded-2xl border bg-navy-900/60 light:bg-white transition-all duration-300 overflow-hidden ${isOpen ? 'border-accent/40 shadow-sm' : bgBorder}`}
                    >
                      {/* Header bar */}
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full p-5 flex items-center justify-between text-left gap-4 hover:bg-navy-850/30 light:hover:bg-navy-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <VerdictIcon className={`h-5 w-5 shrink-0 ${verdictColor} mt-0.5`} />
                          <div className="space-y-1">
                            <span className="font-extrabold text-xs sm:text-sm leading-snug text-text-dark light:text-text-light">
                              {item.question}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-extrabold uppercase tracking-wide ${verdictColor}`}>
                                {verdictText}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-navy-500 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-navy-500 shrink-0" />
                        )}
                      </button>

                      {/* Body contents */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-navy-800/40 light:border-navy-100 space-y-4 text-xs sm:text-sm leading-relaxed bg-navy-950/20 light:bg-navy-50/20">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy-500 mb-1.5">
                              Your Answer
                            </p>
                            <p className="p-3.5 rounded-xl bg-navy-950/80 light:bg-navy-100/40 font-medium text-navy-200 light:text-navy-800 border border-navy-800/40 light:border-navy-200/50">
                              {item.userAnswer || '[No Answer Provided]'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent mb-1.5 flex items-center gap-1.5">
                              <Code className="h-3.5 w-3.5" />
                              Senior Interviewer's Suggestions
                            </p>
                            <p className="p-3.5 rounded-xl bg-navy-950/80 light:bg-navy-100/40 font-medium text-navy-200 light:text-navy-800 border border-navy-800/40 light:border-navy-200/50">
                              {item.suggestion}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end gap-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={resetPractice}
                className="px-6 py-3 rounded-xl bg-accent text-white hover:bg-blue-600 font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 text-xs sm:text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Practice Another Topic
              </motion.button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TechInterviewPractice;
