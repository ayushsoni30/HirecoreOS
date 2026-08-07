/**
 * File: client/src/pages/TechBuddy.jsx
 * Description: Chatbot interface for Tech Buddy.
 *              Integrates message history, remark-gfm and rehype-highlight markdown parsing, and session reset.
 *              Redesigned with Libertinus Serif, sharp 0px corners, and academic paper layout.
 */

import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { Send, Plus, Loader2, Sparkles, MessageSquare, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto p-4 sm:p-6 font-serif text-left relative overflow-hidden">
      
      {/* Buddy Header */}
      <div className="flex justify-between items-center border-b border-paper-800 light:border-paper-200 pb-3 shrink-0">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent block">
            [MODULE_05 // CONSULTATION_AGENT]
          </span>
          <h2 className="text-lg sm:text-xl font-serif font-normal tracking-tight text-paper-50 light:text-paper-900 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-accent" />
            Tech Buddy AI
          </h2>
        </div>
        <button
          onClick={handleNewChat}
          disabled={loading || messages.length === 0}
          className="px-3.5 py-1.5 border border-paper-800 light:border-paper-300 hover:bg-paper-800/40 light:hover:bg-paper-100 flex items-center gap-1.5 font-serif font-bold text-xs uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Session
        </button>
      </div>

      {/* Chat Messages Logs */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 min-h-0">
        {fetchingHistory ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="font-mono text-xs text-paper-400">Loading archived dialogue...</p>
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Interface with Suggestion Pills */
          <div className="flex flex-col items-center justify-center py-10 md:py-16 max-w-lg mx-auto text-center">
            <div className="h-12 w-12 border border-paper-800 bg-paper-950 flex items-center justify-center text-accent mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="font-serif font-bold text-base text-paper-50 light:text-paper-900">Initiate Dialogue</p>
            <p className="font-serif text-xs text-paper-400 light:text-paper-600 mt-1 max-w-[320px] leading-relaxed">
              Inquire regarding technical roadmaps, system architecture design, or algorithm concepts.
            </p>

            {/* Quick Suggestion Pills */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSend(e, s.query)}
                  className="flex items-center gap-2.5 p-3 border border-paper-800 bg-paper-900/60 hover:border-accent light:bg-white light:border-paper-200 text-left text-xs transition-colors group"
                >
                  <Terminal className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="font-serif font-bold text-paper-200 light:text-paper-800 line-clamp-2 leading-tight group-hover:text-accent">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-4 text-xs sm:text-sm font-serif leading-relaxed text-left border
                    ${isUser 
                      ? 'bg-accent/10 border-accent/40 text-paper-50 light:text-paper-900' 
                      : 'bg-paper-900/70 border-paper-800 text-paper-100 light:bg-white light:border-paper-200 light:text-paper-900'
                    }
                  `}>
                    <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-2">
                      {isUser ? '[CANDIDATE]' : '[TECH_BUDDY_AI]'}
                    </span>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-green dark:prose-invert max-w-none text-xs sm:text-sm font-serif">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <h1 className="text-base font-serif font-bold my-3 pb-1 border-b border-paper-800 text-paper-50 light:text-paper-900" {...rest} />;
                            },
                            h2: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <h2 className="text-sm font-serif font-bold my-2 text-accent" {...rest} />;
                            },
                            code: ({ className, children, ...rest }) => {
                              const cleanProps = { ...rest };
                              delete cleanProps.node;
                              const match = /language-(\w+)/.exec(className || '');
                              return !match 
                                ? <code className="bg-paper-950 px-1.5 py-0.5 border border-paper-800 font-mono text-[11px] text-accent" {...cleanProps}>{children}</code> 
                                : <div className="my-3 border border-paper-800 bg-paper-950">
                                    <div className="flex items-center justify-between px-3 py-1 bg-paper-900 border-b border-paper-800 font-mono text-[9px] text-paper-400">
                                      <span>[CODE_FRAMEWORK]</span>
                                      <span>{match[1].toUpperCase()}</span>
                                    </div>
                                    <pre className="p-3 overflow-x-auto font-mono text-[11px] text-accent leading-relaxed">
                                      <code className={className}>{children}</code>
                                    </pre>
                                  </div>;
                            },
                            ul: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <ul className="list-disc pl-5 my-2 space-y-1 font-serif text-paper-200 light:text-paper-800" {...rest} />;
                            },
                            ol: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <ol className="list-decimal pl-5 my-2 space-y-1 font-serif text-paper-200 light:text-paper-800" {...rest} />;
                            },
                            p: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <p className="mb-2 last:mb-0 font-serif leading-relaxed text-paper-200 light:text-paper-800" {...rest} />;
                            },
                            table: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <div className="overflow-x-auto my-3 border border-paper-800"><table className="w-full text-left font-serif border-collapse text-xs" {...rest} /></div>;
                            },
                            th: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <th className="border-b border-paper-800 bg-paper-950 p-2 font-mono text-[10px] uppercase text-accent font-bold" {...rest} />;
                            },
                            td: (props) => {
                              const rest = { ...props };
                              delete rest.node;
                              return <td className="border-b border-paper-800/50 p-2 font-serif text-paper-200 light:text-paper-800" {...rest} />;
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bot Typing indicator */}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[85%] p-3.5 border border-paper-800 bg-paper-900/60 flex items-center gap-2 font-mono text-[11px] text-paper-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
              <span>Formulating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Query Entry Box */}
      <form onSubmit={handleSend} className="pt-3 shrink-0">
        <div className="flex items-center gap-2 p-1 border border-paper-800 bg-paper-900/80 light:bg-white light:border-paper-300">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 bg-transparent text-paper-50 light:text-paper-900 font-serif text-xs sm:text-sm focus:outline-none placeholder-paper-500"
            placeholder={loading ? 'Formulating response...' : 'Type your query regarding code, architecture, or roadmaps...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || fetchingHistory}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || fetchingHistory}
            className="px-4 py-2.5 border border-accent bg-accent text-white font-serif font-bold text-xs uppercase tracking-wider hover:bg-accent/90 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
};

export default TechBuddy;
