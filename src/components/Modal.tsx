// Enhanced Modal component with GSAP animations
// Supports different types: default, success, warning, danger, info

import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export type ModalVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: ModalVariant;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ModalVariant, { iconBg: string; iconColor: string; borderColor: string }> = {
  default: {
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-200'
  },
  success: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200'
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200'
  },
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  info: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  }
};

const defaultIcons: Record<ModalVariant, React.ReactNode> = {
  default: null,
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  danger: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  icon
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    
    // GSAP exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      }
    });
    tl.to(modalRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in' });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.15 }, '-=0.1');
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isClosingRef.current) {
        handleClose();
      }
    };

    if (isOpen) {
      isClosingRef.current = false;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // GSAP entrance animation
      const tl = gsap.timeline();
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      tl.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' },
        '-=0.1'
      );
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  const styles = variantStyles[variant];
  const displayIcon = icon ?? defaultIcons[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? handleClose : undefined}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl transform`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Header with Icon */}
          {(title || displayIcon) && (
            <div className={`p-6 pb-0 ${title ? '' : 'pt-10'}`}>
              {displayIcon && (
                <div className={`w-14 h-14 ${styles.iconBg} ${styles.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {displayIcon}
                </div>
              )}
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  {title}
                </h3>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
