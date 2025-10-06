/**
 * Modal animation management hook for Bistro Bert
 * Provides sophisticated modal state management with animations and accessibility
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_PRIORITIES, 
  ANIMATION_STATES 
} from '@/utils/animations/constants';
import { 
  performanceMonitor, 
  PerformanceOptimizer 
} from '@/utils/animations/performance';
import { 
  AccessibilityAnimationAdapter,
  AccessibilityAnimationConfig,
  SafeAnimationProps 
} from '@/utils/animations/accessibility';

// Modal variant types
export type ModalVariant = 'elegant' | 'immersive' | 'minimal';

// Modal state interface
export interface ModalState {
  isOpen: boolean;
  isAnimating: boolean;
  variant: ModalVariant;
  hasInteracted: boolean;
  triggerElement: HTMLElement | null;
}

// Modal options interface
export interface ModalOptions {
  variant?: ModalVariant;
  enablePerformanceMonitoring?: boolean;
  enableAccessibility?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  preventBodyScroll?: boolean;
  restoreFocus?: boolean;
  animationDuration?: number;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  onOpen?: () => void;
  onClose?: () => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

// Modal animation variants
export interface ModalAnimationVariants {
  backdrop: SafeAnimationProps;
  modal: SafeAnimationProps;
  content: SafeAnimationProps;
}

// Modal return value interface
export interface UseModalReturn {
  // State
  state: ModalState;
  
  // Controls
  open: (triggerElement?: HTMLElement) => void;
  close: () => void;
  toggle: (triggerElement?: HTMLElement) => void;
  
  // Animation props
  getBackdropProps: () => SafeAnimationProps;
  getModalProps: () => SafeAnimationProps;
  getContentProps: () => SafeAnimationProps;
  
  // Refs
  modalRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  
  // Utilities
  getAnimationVariants: () => ModalAnimationVariants;
  updateAccessibilityConfig: (config: Partial<AccessibilityAnimationConfig>) => void;
  
  // Performance
  getPerformanceMetrics: () => ReturnType<typeof performanceMonitor.getInsights> | null;
}

// Main modal hook
export function useModal(options: ModalOptions = {}): UseModalReturn {
  const {
    variant = 'elegant',
    enablePerformanceMonitoring = true,
    enableAccessibility = true,
    closeOnEscape = true,
    closeOnBackdrop = true,
    preventBodyScroll = true,
    restoreFocus = true,
    animationDuration = ANIMATION_DURATIONS.content,
    accessibilityConfig = {},
    onOpen,
    onClose,
    onAnimationStart,
    onAnimationComplete,
  } = options;

  // State management
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    isAnimating: false,
    variant,
    hasInteracted: false,
    triggerElement: null,
  });

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const accessibilityConfigRef = useRef<Partial<AccessibilityAnimationConfig>>(accessibilityConfig);

  // Get animation variants based on modal variant
  const getAnimationVariants = useCallback((): ModalAnimationVariants => {
    const baseTransition = {
      duration: animationDuration / 1000,
      ease: [0.22, 1, 0.36, 1] as const,
    };

    switch (state.variant) {
      case 'elegant':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.3 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.2 } },
          },
          modal: {
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: baseTransition
            },
            exit: { 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              transition: baseTransition
            },
          },
          content: {
            initial: { opacity: 0, y: 10 },
            animate: { 
              opacity: 1, 
              y: 0,
              transition: { ...baseTransition, delay: 0.1 }
            },
            exit: { 
              opacity: 0, 
              y: -10,
              transition: { ...baseTransition, duration: 0.2 }
            },
          },
        };

      case 'immersive':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.5 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.4 } },
          },
          modal: {
            initial: { opacity: 0, scale: 0.9, y: 50 },
            animate: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { ...baseTransition, duration: 0.6 }
            },
            exit: { 
              opacity: 0, 
              scale: 0.9, 
              y: 50,
              transition: { ...baseTransition, duration: 0.4 }
            },
          },
          content: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { 
              opacity: 1, 
              scale: 1,
              transition: { ...baseTransition, delay: 0.2, duration: 0.5 }
            },
            exit: { 
              opacity: 0, 
              scale: 0.95,
              transition: { ...baseTransition, duration: 0.3 }
            },
          },
        };

      case 'minimal':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.2 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.15 } },
          },
          modal: {
            initial: { opacity: 0, y: -20 },
            animate: { 
              opacity: 1, 
              y: 0,
              transition: { ...baseTransition, duration: 0.25 }
            },
            exit: { 
              opacity: 0, 
              y: -20,
              transition: { ...baseTransition, duration: 0.2 }
            },
          },
          content: {
            initial: { opacity: 0 },
            animate: { 
              opacity: 1,
              transition: { ...baseTransition, delay: 0.05, duration: 0.2 }
            },
            exit: { 
              opacity: 0,
              transition: { ...baseTransition, duration: 0.15 }
            },
          },
        };

      default:
        return getAnimationVariants();
    }
  }, [state.variant, animationDuration]);

  // Get animation props with accessibility and performance optimizations
  const getAnimationProps = useCallback((variantType: keyof ModalAnimationVariants): SafeAnimationProps => {
    const variants = getAnimationVariants();
    let props = variants[variantType];

    // Apply accessibility adaptations if enabled
    if (enableAccessibility) {
      props = AccessibilityAnimationAdapter.adaptAnimation(
        props,
        accessibilityConfigRef.current
      );
    }

    // Apply performance optimizations if enabled
    if (enablePerformanceMonitoring) {
      const optimizedProps = { ...props };
      if (optimizedProps.transition && typeof optimizedProps.transition === 'object') {
        optimizedProps.transition = {
          ...optimizedProps.transition,
          duration: (optimizedProps.transition.duration || animationDuration / 1000) * 0.9,
        };
      }
      props = optimizedProps;
    }

    return props;
  }, [getAnimationVariants, enableAccessibility, enablePerformanceMonitoring, animationDuration]);

  // Individual animation prop getters
  const getBackdropProps = useCallback(() => getAnimationProps('backdrop'), [getAnimationProps]);
  const getModalProps = useCallback(() => getAnimationProps('modal'), [getAnimationProps]);
  const getContentProps = useCallback(() => getAnimationProps('content'), [getAnimationProps]);

  // Open modal
  const open = useCallback((triggerElement?: HTMLElement) => {
    if (state.isOpen) return;

    setState(prev => ({
      ...prev,
      isOpen: true,
      isAnimating: true,
      triggerElement: triggerElement || null,
    }));

    // Store current focus element
    if (restoreFocus && triggerElement) {
      previousFocusRef.current = triggerElement;
    }

    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring('modal-open', 'important');
    }

    // Prevent body scroll
    if (preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }

    // Call callbacks
    onAnimationStart?.();
    onOpen?.();

    // Set animation complete after duration
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
      onAnimationComplete?.();
      
      // Stop performance monitoring
      if (enablePerformanceMonitoring) {
        const metrics = performanceMonitor.stopMonitoring('modal-open');
        if (metrics && metrics.frameRate < 30) {
          console.warn('Low frame rate detected during modal open:', metrics);
        }
      }
    }, animationDuration);
  }, [state.isOpen, restoreFocus, enablePerformanceMonitoring, preventBodyScroll, animationDuration, onAnimationStart, onAnimationComplete, onOpen]);

  // Close modal
  const close = useCallback(() => {
    if (!state.isOpen) return;

    setState(prev => ({
      ...prev,
      isOpen: false,
      isAnimating: true,
    }));

    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring('modal-close', 'important');
    }

    // Restore body scroll
    if (preventBodyScroll) {
      document.body.style.overflow = '';
    }

    // Call callbacks
    onAnimationStart?.();
    onClose?.();

    // Set animation complete after duration
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
      onAnimationComplete?.();
      
      // Restore focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Stop performance monitoring
      if (enablePerformanceMonitoring) {
        const metrics = performanceMonitor.stopMonitoring('modal-close');
        if (metrics && metrics.frameRate < 30) {
          console.warn('Low frame rate detected during modal close:', metrics);
        }
      }
    }, animationDuration);
  }, [state.isOpen, enablePerformanceMonitoring, preventBodyScroll, restoreFocus, animationDuration, onAnimationStart, onAnimationComplete, onClose]);

  // Toggle modal
  const toggle = useCallback((triggerElement?: HTMLElement) => {
    if (state.isOpen) {
      close();
    } else {
      open(triggerElement);
    }
  }, [state.isOpen, open, close]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !state.isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, state.isOpen, close]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      close();
    }
  }, [closeOnBackdrop, close]);

  // Update accessibility config
  const updateAccessibilityConfig = useCallback((config: Partial<AccessibilityAnimationConfig>) => {
    accessibilityConfigRef.current = { ...accessibilityConfigRef.current, ...config };
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (enablePerformanceMonitoring) {
      return performanceMonitor.getInsights();
    }
    return null;
  }, [enablePerformanceMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Restore body scroll
      if (preventBodyScroll && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
      
      // Stop any ongoing performance monitoring
      if (enablePerformanceMonitoring) {
        performanceMonitor.stopMonitoring('modal-open');
        performanceMonitor.stopMonitoring('modal-close');
      }
    };
  }, [preventBodyScroll, enablePerformanceMonitoring]);

  return {
    state,
    open,
    close,
    toggle,
    getBackdropProps,
    getModalProps,
    getContentProps,
    modalRef,
    contentRef,
    getAnimationVariants,
    updateAccessibilityConfig,
    getPerformanceMetrics,
  };
}

export default useModal;