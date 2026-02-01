// Toast context definition - separate file for fast refresh compatibility
import { createContext } from 'react';

export interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
