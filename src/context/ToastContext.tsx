// Toast provider component
// Uses context from separate file for fast refresh compatibility

import React, { useState, useCallback } from 'react';
import { ToastContainer, type ToastType } from '../components/Toast';
import { ToastContext, type ToastContextType } from './toastContextDef';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export type { ToastContextType };
export { ToastContext };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string) => showToast('success', message, title),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) => showToast('error', message, title),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => showToast('warning', message, title),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) => showToast('info', message, title),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
