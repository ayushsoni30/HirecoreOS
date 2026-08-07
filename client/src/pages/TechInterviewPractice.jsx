/**
 * File: client/src/pages/TechInterviewPractice.jsx
 * Description: Technical interview wizard. Generates topic-specific questions,
 *              guides user through answers, evaluates submissions, and lists per-question feedback.
 *              Redesigned with Libertinus Serif, sharp 0px corners, and academic paper layout.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { 
  Code, ArrowRight, ArrowLeft, Send, 
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Terminal, Star
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 font-serif text-left">
      
      {/* Page Header */}
      <div className="border-b border-paper-800 light:border-paper-200 pb-4 space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent block">
          [MODULE_03 // SUBJECT_EXAMINATION]
        </span>
        <h2 className="text-2xl font-serif font-normal tracking-tight text-paper-50 light:text-paper-900">
          Tech Interview Practice
        </h2>
        <p className="text-xs sm:text-sm text-paper-400 light:text-paper-600 font-normal leading-relaxed">
          Select a technical discipline to begin a simulated candidate examination. Respond to generated questions and receive a comprehensive academic evaluation.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT TECHNOLOGY */}
        {step === 'select' && (
          <motion.div 
            key="select-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-paper-800 light:border-paper-200 pb-2">
              <Terminal className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-base font-serif font-bold tracking-tight text-paper-50 light:text-paper-900">
                Select Examination Subject
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {TECHS.map((tech, idx) => (
                <button
                  key={tech}
                  onClick={() => handleStartInterview(tech)}
                  className="flex items-center justify-between p-4 border border-paper-800 bg-paper-900/60 hover:border-accent hover:bg-paper-850/60 light:bg-white light:border-paper-200 light:hover:border-accent transition-all duration-150 group text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-accent font-bold">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <span className="font-serif font-bold text-xs sm:text-sm text-paper-50 light:text-paper-900">
                      {tech}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-paper-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </button>
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
            <div className="w-12 h-12 border-2 border-accent border-t-transparent animate-spin" />
            <div className="space-y-1 text-center font-serif">
              <h3 className="font-bold text-base text-paper-50 light:text-paper-900">Generating Questions</h3>
              <p className="font-mono text-xs text-paper-400">Constructing examination queries for {selectedTech}...</p>
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
            <div className="w-12 h-12 border-2 border-secondary border-t-transparent animate-spin" />
            <div className="space-y-1 text-center font-serif">
              <h3 className="font-bold text-base text-paper-50 light:text-paper-900">Evaluating Responses</h3>
              <p className="font-mono text-xs text-paper-400">Analysing answers and formulating reviewer feedback...</p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: RUN INTERVIEW WIZARD */}
        {step === 'interview' && (
          <motion.div 
            key="interview-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-6 md:p-8 border border-paper-800 bg-paper-900/80 light:bg-white light:border-paper-200 space-y-6"
          >
            {/* Progress Header */}
            <div className="flex justify-between items-center border-b border-paper-800 light:border-paper-200 pb-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent px-2 py-0.5">
                  [{selectedTech}_EXAM]
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-paper-50 light:text-paper-900 mt-2">
                  Question {currentIdx + 1} of {questions.length}
                </h3>
              </div>
              <span className="font-mono text-xs text-paper-400">
                PROGRESS: {Math.round(((currentIdx + 1) / questions.length) * 100)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-paper-950 light:bg-paper-100 h-1 relative overflow-hidden">
              <div 
                className="bg-accent h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-5 border border-paper-800 bg-paper-950 light:bg-paper-50 space-y-2">
              <span className="font-mono text-[10px] text-paper-500 uppercase tracking-wider block">
                [EXAMINATION_QUERY]
              </span>
              <p className="text-sm sm:text-base font-serif font-bold leading-relaxed text-paper-50 light:text-paper-900">
                {questions[currentIdx]}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label htmlFor="answer-input" className="font-mono text-[10px] uppercase tracking-widest text-paper-400 block">
                Candidate Answer Submission
              </label>
              <textarea
                id="answer-input"
                className="w-full p-4 border border-paper-800 bg-paper-950/60 text-paper-50 focus:border-accent focus:outline-none transition-colors light:bg-white light:border-paper-300 light:text-paper-900 min-h-[160px] text-xs sm:text-sm font-serif leading-relaxed"
                placeholder="Detail your answer comprehensively with key technical concepts..."
                value={answers[currentIdx]}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-paper-800 light:border-paper-200">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 border border-paper-800 light:border-paper-300 hover:bg-paper-800/40 light:hover:bg-paper-100 flex items-center gap-2 font-serif font-bold text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {currentIdx === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 border border-emerald-600 bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-2 font-serif font-bold text-xs sm:text-sm transition-colors uppercase tracking-wider"
                >
                  Submit Examination
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 border border-accent bg-accent hover:bg-accent/90 text-white flex items-center gap-2 font-serif font-bold text-xs sm:text-sm transition-colors uppercase tracking-wider"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Score circle */}
              <div className="p-6 border border-paper-800 bg-paper-900/80 light:bg-white light:border-paper-200 flex flex-col items-center justify-center text-center gap-4">
                <div className="h-10 w-10 border border-accent bg-accent/10 flex items-center justify-center text-accent">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">[VERDICT]</span>
                  <h3 className="font-serif font-bold text-base text-paper-50 light:text-paper-900">Overall Grade</h3>
                </div>
                <div className="h-32 w-32 my-2 font-serif font-bold">
                  <CircularProgressbar
                    value={evaluation.score}
                    text={`${evaluation.score}%`}
                  />
                </div>
                <p className="font-serif text-xs text-paper-400 light:text-paper-600 max-w-[200px] leading-relaxed">
                  Evaluated based on conceptual accuracy and depth of response.
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="p-6 border border-emerald-900/60 bg-emerald-950/20 light:bg-emerald-50/50 light:border-emerald-200 flex flex-col text-left">
                  <h4 className="font-serif font-bold text-emerald-400 light:text-emerald-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    Key Strengths
                  </h4>
                  {evaluation.pros && evaluation.pros.length > 0 ? (
                    <ul className="space-y-2 flex-1 font-serif">
                      {evaluation.pros.map((pro, index) => (
                        <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-paper-200 light:text-paper-800">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-serif text-xs text-paper-500 flex-1">No notable strengths recorded.</p>
                  )}
                </div>

                {/* Areas for Improvement */}
                <div className="p-6 border border-red-900/60 bg-red-950/20 light:bg-red-50/50 light:border-red-200 flex flex-col text-left">
                  <h4 className="font-serif font-bold text-red-400 light:text-red-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    Areas to Refine
                  </h4>
                  {evaluation.cons && evaluation.cons.length > 0 ? (
                    <ul className="space-y-2 flex-1 font-serif">
                      {evaluation.cons.map((con, index) => (
                        <li key={index} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 text-paper-200 light:text-paper-800">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-serif text-xs text-paper-500 flex-1">No major improvement points listed.</p>
                  )}
                </div>

              </div>
            </div>

            {/* Detailed Review Accordion */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-serif font-bold text-paper-50 light:text-paper-900">
                Detailed Question Breakdown
              </h3>
              <div className="space-y-3">
                {evaluation.feedback && evaluation.feedback.map((item, index) => {
                  const isOpen = activeAccordion === index;
                  const isCorrect = item.verdict?.toLowerCase() === 'correct';
                  const isPartial = item.verdict?.toLowerCase() === 'partial';

                  let VerdictIcon = XCircle;
                  let verdictColor = 'text-red-500';
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
                      className="border border-paper-800 bg-paper-900/60 light:bg-white light:border-paper-200"
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full p-4 flex items-center justify-between text-left gap-4 hover:bg-paper-850/40 light:hover:bg-paper-100 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <VerdictIcon className={`h-4.5 w-4.5 shrink-0 ${verdictColor} mt-0.5`} />
                          <div className="space-y-1">
                            <p className="font-serif font-bold text-xs sm:text-sm text-paper-50 light:text-paper-900">
                              {item.question}
                            </p>
                            <span className={`font-mono text-[9px] uppercase tracking-widest ${verdictColor} block`}>
                              [{verdictText}]
                            </span>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-paper-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-paper-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 border-t border-paper-800 light:border-paper-200 space-y-4 bg-paper-950/40 light:bg-paper-50">
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-paper-500 block mb-1">
                              Submitted Answer
                            </span>
                            <p className="p-3 border border-paper-800 bg-paper-900 font-serif text-xs text-paper-200 light:bg-paper-100 light:text-paper-800 light:border-paper-200">
                              {item.userAnswer || '[No Answer Provided]'}
                            </p>
                          </div>
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-accent block mb-1 flex items-center gap-1">
                              <Code className="h-3 w-3" />
                              Reviewer Suggestions
                            </span>
                            <p className="p-3 border border-paper-800 bg-paper-900 font-serif text-xs text-paper-200 light:bg-paper-100 light:text-paper-800 light:border-paper-200">
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
            <div className="flex justify-end pt-2">
              <button
                onClick={resetPractice}
                className="px-6 py-3 border border-accent bg-accent text-white font-serif font-bold flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Practice Another Subject
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TechInterviewPractice;
