// Toast notification component with GSAP animations
// Supports success, error, warning, and info types

import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const typeStyles: Record<ToastType, { bg: string; icon: string; border: string; iconBg: string }> = {
  success: {
    bg: 'bg-white',
    icon: 'text-emerald-500',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100'
  },
  error: {
    bg: 'bg-white',
    icon: 'text-red-500',
    border: 'border-red-200',
    iconBg: 'bg-red-100'
  },
  warning: {
    bg: 'bg-white',
    icon: 'text-amber-500',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100'
  },
  info: {
    bg: 'bg-white',
    icon: 'text-blue-500',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100'
  }
};

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  title,
  duration = 5000,
  onClose
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    gsap.to(toastRef.current, {
      opacity: 0,
      x: 100,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => onClose(id)
    });
  }, [id, onClose]);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      toastRef.current,
      { opacity: 0, x: 100, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
    );

    // Progress bar animation
    gsap.fromTo(
      progressRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: duration / 1000, ease: 'none' }
    );

    // Auto close
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const styles = typeStyles[type];

  return (
    <div
      ref={toastRef}
      className={`${styles.bg} rounded-xl shadow-lg border ${styles.border} overflow-hidden min-w-[320px] max-w-md`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`${styles.iconBg} ${styles.icon} p-2 rounded-lg flex-shrink-0`}>
          {icons[type]}
        </div>

        {/* Content */}
        <div className="flex-1 pt-0.5">
          {title && (
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
          )}
          <p className={`text-gray-600 text-sm ${title ? 'mt-1' : ''}`}>{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className={`h-1 ${styles.icon.replace('text-', 'bg-')} origin-left`}
      />
    </div>
  );
};

// Toast Container for managing multiple toasts
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          title={toast.title}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
