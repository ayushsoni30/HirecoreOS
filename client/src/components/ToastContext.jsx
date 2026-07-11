/**
 * File: client/src/components/ToastContext.jsx
 * Description: Global Toast provider that manages snackbar notifications.
 *              Supports success, error, warning, and info notification types.
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove toast from the queue
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add a new toast notification to the queue
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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-navy-800 text-white border-navy-700';
          let Icon = Info;
          let iconColor = 'text-accent';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-950 text-emerald-100 border-emerald-800';
            Icon = CheckCircle;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-red-950 text-red-100 border-red-900';
            Icon = AlertCircle;
            iconColor = 'text-red-400';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-950 text-amber-100 border-amber-900';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-lg border shadow-xl transition-all duration-300 animate-slide-in ${bgClass}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${iconColor} mt-0.5`} />
              <div className="flex-1 text-sm font-medium text-left leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-navy-400 hover:text-white transition-colors p-0.5 rounded-md hover:bg-navy-900/40"
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
