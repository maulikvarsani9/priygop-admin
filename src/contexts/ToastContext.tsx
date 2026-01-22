import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description?: string; type: 'success' | 'error' }>>([]);

  const showSuccess = useCallback((title: string, description?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, type: 'success' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const showError = useCallback((title: string, description?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, type: 'error' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

