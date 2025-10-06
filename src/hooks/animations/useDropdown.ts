/**
 * Dropdown animation management hook for Bistro Bert
 * Provides sophisticated dropdown state management with animations and positioning
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

// Dropdown variant types
export type DropdownVariant = 'elegant' | 'slide' | 'scale';

// Dropdown position types
export type DropdownPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center';

// Dropdown state interface
export interface DropdownState {
  isOpen: boolean;
  isAnimating: boolean;
  variant: DropdownVariant;
  position: DropdownPosition;
  hasInteracted: boolean;
  triggerElement: HTMLElement | null;
  viewportBounds: DOMRect | null;
}

// Dropdown options interface
export interface DropdownOptions {
  variant?: DropdownVariant;
  position?: DropdownPosition;
  enablePerformanceMonitoring?: boolean;
  enableAccessibility?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  autoPosition?: boolean;
  offset?: { x: number; y: number };
  viewportPadding?: number;
  animationDuration?: number;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  onOpen?: () => void;
  onClose?: () => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onPositionChange?: (position: DropdownPosition) => void;
}

// Dropdown animation variants
export interface DropdownAnimationVariants {
  dropdown: SafeAnimationProps;
  items: SafeAnimationProps;
  backdrop: SafeAnimationProps;
}

// Dropdown return value interface
export interface UseDropdownReturn {
  // State
  state: DropdownState;
  
  // Controls
  open: (triggerElement?: HTMLElement) => void;
  close: () => void;
  toggle: (triggerElement?: HTMLElement) => void;
  
  // Animation props
  getDropdownProps: () => SafeAnimationProps;
  getItemsProps: () => SafeAnimationProps;
  getBackdropProps: () => SafeAnimationProps;
  
  // Refs
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  
  // Positioning
  getPosition: () => { x: number; y: number } | null;
  updatePosition: () => void;
  
  // Utilities
  getAnimationVariants: () => DropdownAnimationVariants;
  updateAccessibilityConfig: (config: Partial<AccessibilityAnimationConfig>) => void;
  
  // Performance
  getPerformanceMetrics: () => ReturnType<typeof performanceMonitor.getInsights> | null;
}

// Main dropdown hook
export function useDropdown(options: DropdownOptions = {}): UseDropdownReturn {
  const {
    variant = 'elegant',
    position = 'bottom-left',
    enablePerformanceMonitoring = true,
    enableAccessibility = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    autoPosition = true,
    offset = { x: 0, y: 8 },
    viewportPadding = 16,
    animationDuration = ANIMATION_DURATIONS.fast,
    accessibilityConfig = {},
    onOpen,
    onClose,
    onAnimationStart,
    onAnimationComplete,
    onPositionChange,
  } = options;

  // State management
  const [state, setState] = useState<DropdownState>({
    isOpen: false,
    isAnimating: false,
    variant,
    position,
    hasInteracted: false,
    triggerElement: null,
    viewportBounds: null,
  });

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const accessibilityConfigRef = useRef<Partial<AccessibilityAnimationConfig>>(accessibilityConfig);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Calculate optimal position based on viewport
  const calculateOptimalPosition = useCallback((): DropdownPosition => {
    if (!triggerRef.current || !dropdownRef.current) return position;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Check if dropdown fits below trigger
    const fitsBelow = triggerRect.bottom + dropdownRect.height + viewportPadding <= viewport.height;
    // Check if dropdown fits above trigger
    const fitsAbove = triggerRect.top - dropdownRect.height - viewportPadding >= 0;
    // Check if dropdown fits to the right
    const fitsRight = triggerRect.right + dropdownRect.width - viewportPadding <= viewport.width;
    // Check if dropdown fits to the left
    const fitsLeft = triggerRect.left - dropdownRect.width + viewportPadding >= 0;

    // Determine vertical position
    let verticalPosition: 'top' | 'bottom' = 'bottom';
    if (!fitsBelow && fitsAbove) {
      verticalPosition = 'top';
    }

    // Determine horizontal position
    let horizontalPosition: 'left' | 'right' | 'center' = 'left';
    if (!fitsRight && fitsLeft) {
      horizontalPosition = 'right';
    } else if (!fitsRight && !fitsLeft) {
      horizontalPosition = 'center';
    }

    return `${verticalPosition}-${horizontalPosition}` as DropdownPosition;
  }, [position, viewportPadding]);

  // Get dropdown position coordinates
  const getPosition = useCallback((): { x: number; y: number } | null => {
    if (!triggerRef.current) return null;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current?.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    // Calculate position based on current position state
    switch (state.position) {
      case 'bottom-left':
        x = triggerRect.left + offset.x;
        y = triggerRect.bottom + offset.y;
        break;
      case 'bottom-right':
        x = triggerRect.right - (dropdownRect?.width || 0) + offset.x;
        y = triggerRect.bottom + offset.y;
        break;
      case 'top-left':
        x = triggerRect.left + offset.x;
        y = triggerRect.top - (dropdownRect?.height || 0) + offset.y;
        break;
      case 'top-right':
        x = triggerRect.right - (dropdownRect?.width || 0) + offset.x;
        y = triggerRect.top - (dropdownRect?.height || 0) + offset.y;
        break;
      case 'center':
        x = triggerRect.left + (triggerRect.width / 2) - ((dropdownRect?.width || 0) / 2) + offset.x;
        y = triggerRect.bottom + offset.y;
        break;
    }

    // Ensure dropdown stays within viewport bounds
    if (dropdownRect) {
      const maxX = viewport.width - dropdownRect.width - viewportPadding;
      const maxY = viewport.height - dropdownRect.height - viewportPadding;
      
      x = Math.max(viewportPadding, Math.min(x, maxX));
      y = Math.max(viewportPadding, Math.min(y, maxY));
    }

    return { x, y };
  }, [state.position, offset, viewportPadding]);

  // Update dropdown position
  const updatePosition = useCallback(() => {
    if (!autoPosition) return;

    const newPosition = calculateOptimalPosition();
    if (newPosition !== state.position) {
      setState(prev => ({ ...prev, position: newPosition }));
      onPositionChange?.(newPosition);
    }
  }, [autoPosition, calculateOptimalPosition, state.position, onPositionChange]);

  // Get animation variants based on dropdown variant
  const getAnimationVariants = useCallback((): DropdownAnimationVariants => {
    const baseTransition = {
      duration: animationDuration / 1000,
      ease: [0.22, 1, 0.36, 1] as const,
    };

    switch (state.variant) {
      case 'elegant':
        return {
          dropdown: {
            initial: { opacity: 0, scale: 0.95, y: -10 },
            animate: { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: baseTransition
            },
            exit: { 
              opacity: 0, 
              scale: 0.95, 
              y: -10,
              transition: baseTransition
            },
          },
          items: {
            initial: { opacity: 0, y: 5 },
            animate: { 
              opacity: 1, 
              y: 0,
              transition: { ...baseTransition, delay: 0.05 }
            },
            exit: { 
              opacity: 0, 
              y: -5,
              transition: { ...baseTransition, duration: (animationDuration / 1000) * 0.8 }
            },
          },
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.2 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.15 } },
          },
        };

      case 'slide':
        return {
          dropdown: {
            initial: { opacity: 0, y: -20 },
            animate: { 
              opacity: 1, 
              y: 0,
              transition: { ...baseTransition, ease: [0.23, 1, 0.32, 1] as const }
            },
            exit: { 
              opacity: 0, 
              y: -20,
              transition: { ...baseTransition, ease: [0.23, 1, 0.32, 1] as const }
            },
          },
          items: {
            initial: { opacity: 0, x: -10 },
            animate: { 
              opacity: 1, 
              x: 0,
              transition: { 
                ...baseTransition, 
                delay: 0.03,
                staggerChildren: 0.02
              }
            },
            exit: { 
              opacity: 0, 
              x: -10,
              transition: { ...baseTransition, duration: (animationDuration / 1000) * 0.7 }
            },
          },
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.15 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.1 } },
          },
        };

      case 'scale':
        return {
          dropdown: {
            initial: { opacity: 0, scale: 0.8, transformOrigin: 'top' },
            animate: { 
              opacity: 1, 
              scale: 1,
              transformOrigin: 'top',
              transition: { ...baseTransition, ease: [0.175, 0.885, 0.32, 1.275] as const }
            },
            exit: { 
              opacity: 0, 
              scale: 0.8,
              transformOrigin: 'top',
              transition: { ...baseTransition, ease: [0.175, 0.885, 0.32, 1.275] as const }
            },
          },
          items: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { 
              opacity: 1, 
              scale: 1,
              transition: { 
                ...baseTransition, 
                delay: 0.05,
                staggerChildren: 0.03
              }
            },
            exit: { 
              opacity: 0, 
              scale: 0.9,
              transition: { ...baseTransition, duration: (animationDuration / 1000) * 0.6 }
            },
          },
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { ...baseTransition, duration: 0.1 } },
            exit: { opacity: 0, transition: { ...baseTransition, duration: 0.08 } },
          },
        };

      default:
        return getAnimationVariants();
    }
  }, [state.variant, animationDuration]);

  // Get animation props with accessibility and performance optimizations
  const getAnimationProps = useCallback((variantType: keyof DropdownAnimationVariants): SafeAnimationProps => {
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
  const getDropdownProps = useCallback(() => getAnimationProps('dropdown'), [getAnimationProps]);
  const getItemsProps = useCallback(() => getAnimationProps('items'), [getAnimationProps]);
  const getBackdropProps = useCallback(() => getAnimationProps('backdrop'), [getAnimationProps]);

  // Open dropdown
  const open = useCallback((triggerElement?: HTMLElement) => {
    if (state.isOpen) return;

    setState(prev => ({
      ...prev,
      isOpen: true,
      isAnimating: true,
      triggerElement: triggerElement || null,
      viewportBounds: new DOMRect(0, 0, window.innerWidth, window.innerHeight),
    }));

    // Store current focus element
    if (triggerElement) {
      previousFocusRef.current = triggerElement;
    }

    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring('dropdown-open', 'important');
    }

    // Update position after a brief delay to ensure dropdown is rendered
    setTimeout(() => {
      updatePosition();
    }, 10);

    // Call callbacks
    onAnimationStart?.();
    onOpen?.();

    // Set animation complete after duration
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
      onAnimationComplete?.();
      
      // Stop performance monitoring
      if (enablePerformanceMonitoring) {
        const metrics = performanceMonitor.stopMonitoring('dropdown-open');
        if (metrics && metrics.frameRate < 30) {
          console.warn('Low frame rate detected during dropdown open:', metrics);
        }
      }
    }, animationDuration);
  }, [state.isOpen, updatePosition, enablePerformanceMonitoring, animationDuration, onAnimationStart, onAnimationComplete, onOpen]);

  // Close dropdown
  const close = useCallback(() => {
    if (!state.isOpen) return;

    setState(prev => ({
      ...prev,
      isOpen: false,
      isAnimating: true,
    }));

    // Start performance monitoring
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring('dropdown-close', 'important');
    }

    // Call callbacks
    onAnimationStart?.();
    onClose?.();

    // Restore focus
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }

    // Set animation complete after duration
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
      onAnimationComplete?.();
      
      // Stop performance monitoring
      if (enablePerformanceMonitoring) {
        const metrics = performanceMonitor.stopMonitoring('dropdown-close');
        if (metrics && metrics.frameRate < 30) {
          console.warn('Low frame rate detected during dropdown close:', metrics);
        }
      }
    }, animationDuration);
  }, [state.isOpen, enablePerformanceMonitoring, animationDuration, onAnimationStart, onAnimationComplete, onClose]);

  // Toggle dropdown
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

  // Handle outside click
  useEffect(() => {
    if (!closeOnOutsideClick || !state.isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnOutsideClick, state.isOpen, close]);

  // Handle scroll and resize
  useEffect(() => {
    if (!state.isOpen) return;

    const handleScroll = () => {
      close();
    };

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [state.isOpen, close, updatePosition]);

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
      // Stop any ongoing performance monitoring
      if (enablePerformanceMonitoring) {
        performanceMonitor.stopMonitoring('dropdown-open');
        performanceMonitor.stopMonitoring('dropdown-close');
      }
      
      // Clean up resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [enablePerformanceMonitoring]);

  return {
    state,
    open,
    close,
    toggle,
    getDropdownProps,
    getItemsProps,
    getBackdropProps,
    dropdownRef,
    triggerRef,
    getPosition,
    updatePosition,
    getAnimationVariants,
    updateAccessibilityConfig,
    getPerformanceMetrics,
  };
}

export default useDropdown;