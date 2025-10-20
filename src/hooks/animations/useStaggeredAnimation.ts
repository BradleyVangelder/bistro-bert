/**
 * Advanced hook for managing staggered animations
 * Provides scroll-triggered animations, performance monitoring, and accessibility controls
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Variants, TargetAndTransition, Transition } from 'framer-motion';
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  DIRECTIONS,
  SCALES,
  ANIMATION_PRIORITIES 
} from '@/utils/animations/constants';
import { 
  AccessibilityAnimationAdapter,
  AccessibilityAnimationConfig 
} from '@/utils/animations/accessibility';
import { 
  performanceMonitor,
  PerformanceOptimizer 
} from '@/utils/animations/performance';

// Staggered animation configuration
export interface StaggeredAnimationConfig {
  // Timing
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  ease?: string | number[];
  
  // Direction
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  
  // Scroll trigger
  triggerOnScroll?: boolean;
  scrollOffset?: number;
  threshold?: number;
  rootMargin?: string;
  
  // Performance
  priority?: keyof typeof ANIMATION_PRIORITIES;
  enablePerformanceMonitoring?: boolean;
  throttleAnimations?: boolean;
  
  // Accessibility
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  
  // Callbacks
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onScrollTrigger?: () => void;
}

// Staggered animation state
export interface StaggeredAnimationState {
  isVisible: boolean;
  hasAnimated: boolean;
  isAnimating: boolean;
  progress: number;
  performanceMetrics?: ReturnType<typeof performanceMonitor.getInsights>;
}

// Staggered animation return value
export interface UseStaggeredAnimationReturn {
  // State
  state: StaggeredAnimationState;
  
  // Animation props
  containerProps: {
    ref: React.RefObject<HTMLElement | null>;
    variants: Variants;
    initial: string;
    animate: string;
    onAnimationComplete?: () => void;
  };
  
  itemProps: (index: number) => {
    variants: Variants;
    custom?: number;
  };
  
  // Controls
  trigger: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  
  // Utilities
  getProgress: () => number;
  getPerformanceMetrics: () => ReturnType<typeof performanceMonitor.getInsights> | null;
  updateConfig: (config: Partial<StaggeredAnimationConfig>) => void;
}

// Default configuration
const DEFAULT_CONFIG: Required<Omit<StaggeredAnimationConfig, 'onAnimationStart' | 'onAnimationComplete' | 'onScrollTrigger'>> = {
  staggerDelay: ANIMATION_DELAYS.sequential,
  initialDelay: ANIMATION_DELAYS.short,
  duration: ANIMATION_DURATIONS.normal,
  ease: EASING.luxury,
  direction: 'up',
  triggerOnScroll: false,
  scrollOffset: 100,
  threshold: 0.1,
  rootMargin: '50px',
  priority: 'normal',
  enablePerformanceMonitoring: true,
  throttleAnimations: true,
  accessibilityConfig: {},
};

// Main hook
export function useStaggeredAnimation(
  config: StaggeredAnimationConfig = {}
): UseStaggeredAnimationReturn {
  // Merge with defaults
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<StaggeredAnimationState>({
    isVisible: !finalConfig.triggerOnScroll,
    hasAnimated: !finalConfig.triggerOnScroll,
    isAnimating: false,
    progress: 0,
  });
  
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const animationName = useRef(`staggered-${Date.now()}-${Math.random()}`);
  const configRef = useRef(finalConfig);
  
  // Update config ref when config changes
  useEffect(() => {
    configRef.current = { ...configRef.current, ...config };
  }, [config]);
  
  // Get animation variants based on direction
  const getVariants = useCallback((direction: string, duration: number, ease: string | number[]): Variants => {
    const transition: Transition = { 
      duration: duration / 1000, 
      ease: ease as unknown as Transition['ease']
    };
    
    switch (direction) {
      case 'up':
        return {
          initial: { opacity: 0, y: DIRECTIONS.up.y },
          animate: { opacity: 1, y: 0, transition },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: DIRECTIONS.down.y },
          animate: { opacity: 1, y: 0, transition },
        };
      case 'left':
        return {
          initial: { opacity: 0, x: DIRECTIONS.left.x },
          animate: { opacity: 1, x: 0, transition },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: DIRECTIONS.right.x },
          animate: { opacity: 1, x: 0, transition },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: SCALES.medium },
          animate: { opacity: 1, scale: 1, transition },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition },
        };
    }
  }, []);
  
  // Container variants
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: finalConfig.staggerDelay / 1000,
        delayChildren: finalConfig.initialDelay / 1000,
      },
    },
  };
  
  // Item variants
  const itemVariants = getVariants(finalConfig.direction, finalConfig.duration, finalConfig.ease);
  
  // Apply accessibility adaptations
  const adaptedContainerVariants = AccessibilityAnimationAdapter.adaptAnimation(
    { variants: containerVariants },
    finalConfig.accessibilityConfig
  ).variants as Variants;
  
  const adaptedItemVariants = AccessibilityAnimationAdapter.adaptAnimation(
    { variants: itemVariants },
    finalConfig.accessibilityConfig
  ).variants as Variants;
  
  // Intersection observer for scroll trigger
  useEffect(() => {
    if (!finalConfig.triggerOnScroll || !containerRef.current) return;
    
    const element = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !state.hasAnimated) {
          setState(prev => ({
            ...prev,
            isVisible: true,
            hasAnimated: true,
            isAnimating: true,
          }));
          
          finalConfig.onScrollTrigger?.();
          finalConfig.onAnimationStart?.();
          
          // Start performance monitoring
          if (finalConfig.enablePerformanceMonitoring) {
            performanceMonitor.startMonitoring(animationName.current, finalConfig.priority);
          }
        }
      },
      {
        threshold: finalConfig.threshold,
        rootMargin: finalConfig.rootMargin,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [
    finalConfig.triggerOnScroll,
    finalConfig.threshold,
    finalConfig.rootMargin,
    finalConfig.onScrollTrigger,
    finalConfig.onAnimationStart,
    finalConfig.enablePerformanceMonitoring,
    finalConfig.priority,
    state.hasAnimated,
  ]);
  
  // Performance monitoring
  useEffect(() => {
    if (state.isAnimating && finalConfig.enablePerformanceMonitoring) {
      const interval = setInterval(() => {
        const metrics = performanceMonitor.getInsights();
        setState(prev => ({ ...prev, performanceMetrics: metrics }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.isAnimating, finalConfig.enablePerformanceMonitoring]);
  
  // Animation completion handler
  const handleAnimationComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAnimating: false,
      progress: 1,
    }));
    
    // Stop performance monitoring
    if (finalConfig.enablePerformanceMonitoring) {
      performanceMonitor.stopMonitoring(animationName.current);
    }
    
    finalConfig.onAnimationComplete?.();
  }, [finalConfig.onAnimationComplete, finalConfig.enablePerformanceMonitoring]);
  
  // Control functions
  const trigger = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: true,
      hasAnimated: true,
      isAnimating: true,
    }));
    
    finalConfig.onAnimationStart?.();
    
    if (finalConfig.enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring(animationName.current, finalConfig.priority);
    }
  }, [finalConfig.onAnimationStart, finalConfig.enablePerformanceMonitoring, finalConfig.priority]);
  
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: !finalConfig.triggerOnScroll,
      hasAnimated: !finalConfig.triggerOnScroll,
      isAnimating: false,
      progress: 0,
    }));
    
    if (finalConfig.enablePerformanceMonitoring) {
      performanceMonitor.stopMonitoring(animationName.current);
    }
  }, [finalConfig.triggerOnScroll, finalConfig.enablePerformanceMonitoring]);
  
  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isAnimating: false }));
  }, []);
  
  const resume = useCallback(() => {
    if (state.isVisible && state.hasAnimated && !state.isAnimating) {
      setState(prev => ({ ...prev, isAnimating: true }));
    }
  }, [state.isVisible, state.hasAnimated, state.isAnimating]);
  
  // Utility functions
  const getProgress = useCallback(() => state.progress, [state.progress]);
  
  const getPerformanceMetrics = useCallback(() => {
    if (finalConfig.enablePerformanceMonitoring) {
      return performanceMonitor.getInsights();
    }
    return null;
  }, [finalConfig.enablePerformanceMonitoring]);
  
  const updateConfig = useCallback((newConfig: Partial<StaggeredAnimationConfig>) => {
    configRef.current = { ...configRef.current, ...newConfig };
  }, []);
  
  // Container props
  const containerProps = {
    ref: containerRef,
    variants: adaptedContainerVariants,
    initial: "initial",
    animate: state.isVisible ? "animate" : "initial",
    onAnimationComplete: handleAnimationComplete,
  };
  
  // Item props generator
  const itemProps = useCallback((index: number) => ({
    variants: adaptedItemVariants,
    custom: index,
  }), [adaptedItemVariants]);
  
  return {
    state,
    containerProps,
    itemProps,
    trigger,
    reset,
    pause,
    resume,
    getProgress,
    getPerformanceMetrics,
    updateConfig,
  };
}

// Simplified hook for basic staggered animations
export function useSimpleStagger(
  itemCount: number,
  config: StaggeredAnimationConfig = {}
) {
  const staggered = useStaggeredAnimation(config);
  
  return {
    ...staggered,
    itemProps: staggered.itemProps,
    items: Array.from({ length: itemCount }, (_, index) => ({
      ...staggered.itemProps(index),
      key: index,
    })),
  };
}

// Hook for scroll-triggered staggered animations
export function useScrollStagger(
  config: StaggeredAnimationConfig = {}
) {
  return useStaggeredAnimation({
    ...config,
    triggerOnScroll: true,
  });
}

// Hook for performance-optimized staggered animations
export function useOptimizedStagger(
  config: StaggeredAnimationConfig = {}
) {
  const optimizedConfig = PerformanceOptimizer.optimizeForDevice({
    duration: config.duration || DEFAULT_CONFIG.duration,
    complexity: 5, // Medium complexity for staggered animations
  });
  
  return useStaggeredAnimation({
    ...config,
    duration: optimizedConfig.duration,
    enablePerformanceMonitoring: true,
    throttleAnimations: true,
    accessibilityConfig: {
      ...config.accessibilityConfig,
      respectReducedMotion: true,
      disableComplexAnimations: optimizedConfig.reducedMotion,
    },
  });
}

export default useStaggeredAnimation;