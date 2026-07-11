/**
 * File: client/src/pages/TechBuddy.jsx
 * Description: ChatGPT-like conversational UI for Tech Buddy.
 *              Integrates message history, markdown response parsing, and a clear session button.
 */

import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../components/ToastContext';
import { Send, Plus, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TechBuddy = () => {
  const api = useApi();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  
  const messagesEndRef = useRef(null);

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
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input || input.trim() === '' || loading) return;

    const userQuery = input.trim();
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
      // Remove the optimistic user message if the request failed
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
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto p-4 sm:p-6 animate-slide-in">
      
      {/* Buddy Header */}
      <div className="flex justify-between items-center border-b border-navy-800 light:border-navy-100 pb-4 shrink-0 text-left">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            Tech Buddy
          </h2>
          <p className="text-xs text-navy-400 light:text-navy-500 mt-1">
            IT Guide. Ask anything about programming, code design, frameworks, or career roadmaps.
          </p>
        </div>
        <button
          onClick={handleNewChat}
          disabled={loading || messages.length === 0}
          className="px-4 py-2 rounded-lg border border-navy-800 light:border-navy-200 hover:bg-navy-850 light:hover:bg-navy-50 flex items-center gap-1.5 text-sm font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Chat Messages Logs */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2 min-h-0">
        {fetchingHistory ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-xs text-navy-500">Retrieving chat log context...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-navy-400">
            <div className="h-14 w-14 rounded-2xl bg-navy-900/60 light:bg-navy-50 flex items-center justify-center text-navy-500 light:text-navy-400 mb-4 shadow-inner">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Say hello to Tech Buddy!</p>
            <p className="text-xs text-navy-500 mt-1.5 max-w-[280px] leading-relaxed">
              "How can I transition into a DevOps role?" or "Write a Node.js Express rate-limiter setup" to start.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                <div className={`
                  max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm text-left leading-relaxed
                  ${isUser 
                    ? 'bg-accent text-white rounded-tr-none font-medium' 
                    : 'bg-navy-900 text-text-dark border border-navy-800 light:bg-white light:border-navy-100 light:text-text-light rounded-tl-none font-normal'
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
                          return <h1 className="text-base font-bold my-2" {...rest} />;
                        },
                        h2: (props) => {
                          const rest = { ...props };
                          delete rest.node;
                          return <h2 className="text-sm font-bold my-1.5" {...rest} />;
                        },
                        code: (props) => {
                          const { className, children, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || '');
                          return !match 
                            ? <code className="bg-navy-950 light:bg-navy-100 px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-accent" {...rest}>{children}</code> 
                            : <pre className="bg-navy-950 light:bg-navy-950 p-4 rounded-xl overflow-x-auto my-3 border border-navy-800 text-text-dark"><code className={`text-xs font-mono text-left block ${className || ''}`} {...rest}>{children}</code></pre>;
                        },
                        ul: (props) => {
                          const rest = { ...props };
                          delete rest.node;
                          return <ul className="list-disc pl-5 my-2 space-y-1.5" {...rest} />;
                        },
                        ol: (props) => {
                          const rest = { ...props };
                          delete rest.node;
                          return <ol className="list-decimal pl-5 my-2 space-y-1.5" {...rest} />;
                        },
                        p: (props) => {
                          const rest = { ...props };
                          delete rest.node;
                          return <p className="mb-2 last:mb-0" {...rest} />;
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Bot Typing indicator */}
        {loading && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none px-5 py-4 bg-navy-900 border border-navy-800 light:bg-white light:border-navy-100 text-left flex items-center gap-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                Tech Buddy is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Query Entry Box */}
      <form onSubmit={handleSend} className="pt-4 shrink-0">
        <div className="flex items-center gap-3 p-1.5 rounded-xl border border-navy-800 bg-navy-900 light:bg-white light:border-navy-200 focus-within:border-accent/60 transition-all shadow-lg">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-transparent text-text-dark light:text-text-light text-sm focus:outline-none placeholder-navy-500"
            placeholder={loading ? 'Please wait for response...' : 'Ask about code, frameworks, roadmaps...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || fetchingHistory}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || fetchingHistory}
            className="h-10 w-10 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

    </div>
  );
};

export default TechBuddy;
