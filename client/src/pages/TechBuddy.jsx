/**
 * File: client/src/pages/TechBuddy.jsx
 * Description: ChatGPT-like conversational UI for Tech Buddy.
 *              Integrates message history, markdown response parsing, and a clear session button.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { Send, Plus, Loader2, Sparkles, MessageSquare, Terminal, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TechBuddy = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Quick suggestion pills for career assistance
  const suggestions = [
    { label: 'Explain Recursion in DSA', query: 'Can you explain recursion in DSA with a simple JavaScript example?' },
    { label: 'DevOps Learning Roadmap', query: 'What is a practical learning roadmap to transition into a DevOps role?' },
    { label: 'Design Rate-Limiter API', query: 'Write a clean Node.js Express rate-limiter setup code snippet.' },
    { label: 'Common System Design Qs', query: 'What are the top 3 system design questions asked in senior engineer interviews?' }
  ];

  // Auto-scroll chat console to bottom on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat session on page load
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await api.get('/tech-buddy/history');
        if (response.success && response.history) {
          setMessages(response.history);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        showToast('Failed to load past chat logs.', 'error');
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchChatHistory();
  }, [api, showToast]);

  // Post user message to Tech Buddy
  const handleSend = async (e, customQuery = '') => {
    if (e) e.preventDefault();
    
    const queryToSend = customQuery || input;
    if (!queryToSend || queryToSend.trim() === '' || loading) return;

    const userQuery = queryToSend.trim();
    setInput('');
    setLoading(true);

    // Optimistically update the UI with user turn
    const updatedMessages = [...messages, { role: 'user', content: userQuery, timestamp: new Date() }];
    setMessages(updatedMessages);

    try {
      const response = await api.post('/tech-buddy/chat', { message: userQuery });
      if (response.success && response.history) {
        setMessages(response.history);
      } else {
        throw new Error(response.message || 'Chat transmission failed.');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to exchange message with Tech Buddy.', 'error');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  // Archive current chat session and start empty fresh context
  const handleNewChat = async () => {
    if (loading) return;
    try {
      const response = await api.post('/tech-buddy/clear');
      if (response.success) {
        setMessages([]);
        showToast('Started a fresh chat session.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not reset chat session.', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto p-4 sm:p-6 text-left relative overflow-hidden">
      
      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Buddy Header */}
      <div className="flex justify-between items-center border-b border-navy-800/80 light:border-navy-100 pb-4 shrink-0 relative z-10">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            Tech Buddy
          </h2>
          <p className="text-[10px] sm:text-xs text-navy-400 light:text-navy-500 mt-1 font-medium">
            IT Guide. Ask anything about programming, code design, frameworks, or career roadmaps.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNewChat}
          disabled={loading || messages.length === 0}
          className="px-4 py-2 rounded-xl border border-navy-800/80 light:border-navy-200 hover:bg-navy-850/60 light:hover:bg-navy-50 flex items-center gap-1.5 text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
          New Session
        </motion.button>
      </div>

      {/* Chat Messages Logs */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2 min-h-0 relative z-10 scrollbar-thin">
        {fetchingHistory ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-[10px] text-navy-500 font-semibold tracking-wider uppercase">Retrieving past chat context...</p>
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Interface with Suggestion Pills */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 md:py-16 max-w-lg mx-auto text-center"
          >
            <div className="h-12 w-12 rounded-2xl bg-navy-900/80 light:bg-navy-50 border border-navy-800/60 light:border-navy-100 flex items-center justify-center text-navy-500 light:text-navy-400 mb-5 shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="font-extrabold text-sm sm:text-base text-text-dark light:text-text-light">Start a Conversation</p>
            <p className="text-xs text-navy-400 mt-1 max-w-[280px] leading-relaxed">
              Ask Tech Buddy career roadmap strategies, system design concepts, or code debug questions.
            </p>

            {/* Quick Suggestion Pills */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSend(e, s.query)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-navy-800/80 bg-navy-900/30 hover:bg-navy-850/40 hover:border-accent/40 light:bg-white light:border-navy-100 light:hover:bg-navy-50 text-left text-xs text-navy-300 light:text-navy-700 transition-all duration-300 hover:scale-[1.01]"
                >
                  <Terminal className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="font-semibold line-clamp-2 leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={index}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] rounded-2xl px-5 py-3.5 text-xs sm:text-sm shadow-sm text-left leading-relaxed relative overflow-hidden
                    ${isUser 
                      ? 'bg-gradient-to-tr from-accent to-indigo-600 text-white rounded-tr-none font-medium' 
                      : 'bg-navy-900/60 text-text-dark border border-navy-800/80 light:bg-white light:border-navy-100 light:text-text-light rounded-tl-none font-normal'
                    }
                  `}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          h1: (props) => {
                            const rest = { ...props };
                            delete rest.node;
                            return <h1 className="text-base font-extrabold my-3 pb-1 border-b border-navy-800/40 text-text-dark" {...rest} />;
                          },
                          h2: (props) => {
                            const rest = { ...props };
                            delete rest.node;
                            return <h2 className="text-sm font-extrabold my-2.5 text-accent" {...rest} />;
                          },
                          code: (props) => {
                            const { className, children, node, ...rest } = props;
                            const match = /language-(\w+)/.exec(className || '');
                            return !match 
                              ? <code className="bg-navy-950/80 light:bg-navy-50 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-accent" {...rest}>{children}</code> 
                              : <div className="rounded-xl overflow-hidden my-3 border border-navy-800/80 text-text-dark bg-navy-950">
                                  <div className="flex items-center justify-between px-4 py-1.5 bg-navy-900 border-b border-navy-800 text-[10px] text-navy-400 font-mono font-bold">
                                    <span>CODE PLAYGROUND</span>
                                    <span>{match[1].toUpperCase()}</span>
                                  </div>
                                  <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed"><code className={`text-[11px] font-mono text-left block text-sky-400 ${className || ''}`} {...rest}>{children}</code></pre>
                                </div>;
                          },
                          ul: (props) => {
                            const rest = { ...props };
                            delete rest.node;
                            return <ul className="list-disc pl-5 my-2 space-y-1.5 text-navy-200 light:text-navy-800 font-medium" {...rest} />;
                          },
                          ol: (props) => {
                            const rest = { ...props };
                            delete rest.node;
                            return <ol className="list-decimal pl-5 my-2 space-y-1.5 text-navy-200 light:text-navy-800 font-medium" {...rest} />;
                          },
                          p: (props) => {
                            const rest = { ...props };
                            delete rest.node;
                            return <p className="mb-2.5 last:mb-0 text-navy-200 light:text-navy-800 font-medium leading-relaxed" {...rest} />;
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bot Typing indicator */}
        {loading && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none px-5 py-3.5 bg-navy-900/60 border border-navy-800/80 light:bg-white light:border-navy-100 text-left flex items-center gap-2.5 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">
                Tech Buddy is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Query Entry Box (Floating Pill Style) */}
      <form onSubmit={handleSend} className="pt-4 shrink-0 relative z-10 select-none">
        <div className="flex items-center gap-3 p-1.5 rounded-2xl border border-navy-800/80 bg-navy-900/60 backdrop-blur-md light:bg-white light:border-navy-200 focus-within:border-accent/65 focus-within:shadow-glow-primary transition-all duration-300">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-transparent text-text-dark light:text-text-light text-xs sm:text-sm focus:outline-none placeholder-navy-500 font-medium"
            placeholder={loading ? 'Please wait for response...' : 'Ask about code, frameworks, roadmaps...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || fetchingHistory}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !input.trim() || fetchingHistory}
            className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </form>

    </div>
  );
};

export default TechBuddy;
