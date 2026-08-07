/**
 * File: client/src/components/ToastContext.jsx
 * Description: Global Toast provider managing notification popups.
 *              Redesigned with sharp 0px corners, Libertinus Serif typography, and paper/charcoal borders.
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove toast from queue
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add a new toast notification
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-[100000] flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => {
          let bgClass = 'bg-paper-900 text-paper-50 border-paper-700 light:bg-paper-50 light:text-paper-900 light:border-paper-300';
          let tagText = '[NOTICE]';
          let Icon = Info;
          let iconColor = 'text-paper-400';

          if (toast.type === 'success') {
            bgClass = 'bg-paper-900 text-paper-50 border-emerald-700/80 light:bg-paper-50 light:text-paper-900 light:border-emerald-600';
            tagText = '[SUCCESS]';
            Icon = CheckCircle;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            bgClass = 'bg-paper-900 text-paper-50 border-red-800 light:bg-paper-50 light:text-paper-900 light:border-red-600';
            tagText = '[ERROR]';
            Icon = AlertCircle;
            iconColor = 'text-red-500';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-paper-900 text-paper-50 border-amber-800 light:bg-paper-50 light:text-paper-900 light:border-amber-600';
            tagText = '[WARNING]';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3.5 p-4 border shadow-academic transition-all duration-200 animate-slide-in font-serif ${bgClass}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${iconColor} mt-0.5`} />
              <div className="flex-1 text-left">
                <span className="block font-mono text-[10px] text-paper-400 uppercase tracking-widest mb-1">
                  {tagText}
                </span>
                <p className="text-sm font-normal leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-paper-400 hover:text-paper-50 p-1 hover:bg-paper-800/40 border border-transparent hover:border-paper-700 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
