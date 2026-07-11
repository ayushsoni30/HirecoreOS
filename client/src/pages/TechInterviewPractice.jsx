/**
 * File: client/src/pages/TechInterviewPractice.jsx
 * Description: Technical interview wizard. Generates topic-specific questions,
 *              guides user through answers, evaluates submissions, and lists per-question feedback.
 */

import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { 
  Code, ArrowRight, ArrowLeft, Send, Loader2, 
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, RefreshCw 
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
        // Pre-fill answers array with empty strings
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
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-slide-in">
      
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight font-sans">Tech Interview Practice</h2>
        <p className="text-sm text-navy-400 light:text-navy-500">
          Prepare for real-world technical assessments. Choose a technology to start a simulated Q&A flow and get detailed feedback.
        </p>
      </div>

      {/* STEP 1: SELECT TECHNOLOGY */}
      {step === 'select' && (
        <div className="space-y-6 text-left">
          <h3 className="text-lg font-semibold">Select a Technology</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TECHS.map((tech) => (
              <button
                key={tech}
                onClick={() => handleStartInterview(tech)}
                className="flex items-center justify-between p-5 rounded-xl border border-navy-800 bg-navy-900 light:bg-white light:border-navy-200 text-left hover:border-accent hover:bg-navy-850/50 light:hover:bg-navy-50/50 transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-navy-800 light:bg-navy-100 flex items-center justify-center text-navy-400 light:text-navy-600 group-hover:text-accent transition-colors">
                    <Code className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{tech}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-navy-500 group-hover:text-accent group-hover:translate-x-1.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LOADING STATES */}
      {step === 'loading-questions' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-slide-in">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Generating Interview Questions</h3>
            <p className="text-sm text-navy-400">Curating top questions for {selectedTech} using Gemini AI...</p>
          </div>
        </div>
      )}

      {step === 'loading-evaluation' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-slide-in">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Evaluating Your Answers</h3>
            <p className="text-sm text-navy-400">Grading responses and generating senior feedback recommendations...</p>
          </div>
        </div>
      )}

      {/* STEP 2: RUN INTERVIEW WIZARD */}
      {step === 'interview' && (
        <div className="p-6 md:p-8 rounded-2xl border border-navy-800 bg-navy-900 light:bg-white light:border-navy-200 shadow-xl space-y-6 text-left animate-slide-in">
          
          {/* Progress Header */}
          <div className="flex justify-between items-center border-b border-navy-800 light:border-navy-100 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {selectedTech} Mock Interview
              </span>
              <h3 className="text-lg font-bold mt-0.5">
                Question {currentIdx + 1} of {questions.length}
              </h3>
            </div>
            <span className="text-sm text-navy-400 font-medium">
              {Math.round(((currentIdx + 1) / questions.length) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-navy-950 light:bg-navy-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-accent h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-xl bg-navy-950 light:bg-navy-50 border border-navy-850 light:border-navy-100">
            <p className="text-base sm:text-lg font-medium leading-relaxed">
              {questions[currentIdx]}
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label htmlFor="answer-input" className="text-xs font-semibold text-navy-400 uppercase tracking-wider">
              Your Answer
            </label>
            <textarea
              id="answer-input"
              className="w-full p-4 rounded-xl border border-navy-800 bg-navy-900 text-text-dark focus:border-accent focus:outline-none transition-all duration-300 light:bg-white light:border-navy-200 light:text-text-light min-h-[160px] text-sm leading-relaxed"
              placeholder="Type your detailed answer here... (take your time, try to explain concepts clearly)"
              value={answers[currentIdx]}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-navy-800 light:border-navy-100">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-lg border border-navy-800 light:border-navy-200 hover:bg-navy-850 light:hover:bg-navy-50 flex items-center gap-2 font-medium disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-semibold transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
              >
                Submit Interview
                <Send className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-blue-600 flex items-center gap-2 font-semibold transition-all shadow-lg shadow-accent/15"
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS PANEL */}
      {step === 'results' && evaluation && (
        <div className="space-y-8 animate-slide-in text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Score circle */}
            <div className="p-6 rounded-2xl border border-navy-800 bg-navy-900 light:bg-white light:border-navy-200 shadow-xl flex flex-col items-center justify-center text-center gap-4">
              <h3 className="font-semibold text-lg">Interview Result</h3>
              <div className="h-32 w-32 my-2">
                <CircularProgressbar
                  value={evaluation.score}
                  text={`${evaluation.score}%`}
                />
              </div>
              <p className="text-xs text-navy-400 light:text-navy-500 max-w-[220px]">
                Calculated based on technical accuracy, concept clarity, and complete explanations.
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Strengths */}
              <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 light:bg-emerald-500/5 light:border-emerald-500/10 shadow-sm flex flex-col">
                <h4 className="font-semibold text-emerald-400 light:text-emerald-700 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Overall Strengths
                </h4>
                {evaluation.pros && evaluation.pros.length > 0 ? (
                  <ul className="space-y-2 flex-1">
                    {evaluation.pros.map((pro, index) => (
                      <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-500 flex-1">No major highlights identified.</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 light:bg-red-500/5 light:border-red-500/10 shadow-sm flex flex-col">
                <h4 className="font-semibold text-red-400 light:text-red-700 flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  Areas to Improve
                </h4>
                {evaluation.cons && evaluation.cons.length > 0 ? (
                  <ul className="space-y-2 flex-1">
                    {evaluation.cons.map((con, index) => (
                      <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-500 flex-1">Excellent job! No massive gaps highlighted.</p>
                )}
              </div>

            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Detailed Question Review</h3>
            <div className="space-y-3">
              {evaluation.feedback && evaluation.feedback.map((item, index) => {
                const isOpen = activeAccordion === index;
                const isCorrect = item.verdict?.toLowerCase() === 'correct';
                const isPartial = item.verdict?.toLowerCase() === 'partial';

                let VerdictIcon = XCircle;
                let verdictColor = 'text-red-500';
                let bgBorder = 'border-navy-800';

                if (isCorrect) {
                  VerdictIcon = CheckCircle2;
                  verdictColor = 'text-emerald-500';
                } else if (isPartial) {
                  VerdictIcon = AlertTriangle;
                  verdictColor = 'text-amber-500';
                }

                return (
                  <div 
                    key={index}
                    className={`rounded-xl border bg-navy-900 light:bg-white transition-colors duration-300 ${isOpen ? 'border-accent/40' : bgBorder}`}
                  >
                    {/* Header bar */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full p-5 flex items-center justify-between text-left gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <VerdictIcon className={`h-5 w-5 shrink-0 ${verdictColor} mt-0.5`} />
                        <span className="font-semibold text-sm sm:text-base leading-snug">
                          {item.question}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-navy-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy-500 shrink-0" />
                      )}
                    </button>

                    {/* Body contents */}
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-navy-850 light:border-navy-100 space-y-4 text-sm leading-relaxed">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-1">
                            Your Answer
                          </p>
                          <p className="p-3.5 rounded-lg bg-navy-950 light:bg-navy-50 font-medium">
                            {item.userAnswer || '[No Answer Provided]'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                            Senior Interviewer's Suggestions
                          </p>
                          <p className="p-3.5 rounded-lg bg-navy-950 light:bg-navy-50 font-medium">
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
            <button
              onClick={resetPractice}
              className="px-6 py-3 rounded-lg bg-accent text-white hover:bg-blue-600 font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-accent/20"
            >
              <RefreshCw className="h-4 w-4" />
              Practice Another Topic
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default TechInterviewPractice;
