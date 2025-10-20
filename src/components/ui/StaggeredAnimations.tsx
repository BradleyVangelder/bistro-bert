/**
 * Sophisticated staggered animation components for Bistro Bert
 * Provides elegant sequential animations for cards, lists, and content
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, TargetAndTransition, Transition } from 'framer-motion';
import { 
  ANIMATION_DURATIONS, 
  ANIMATION_DELAYS, 
  EASING, 
  DIRECTIONS,
  SCALES,
  ANIMATION_STATES 
} from '@/utils/animations/constants';
import { 
  createSafeAnimationProps,
  AccessibilityAnimationConfig 
} from '@/utils/animations/accessibility';
import { performanceMonitor } from '@/utils/animations/performance';

// Staggered container props
export interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
  ease?: string | number[];
  triggerOnScroll?: boolean;
  scrollOffset?: number;
  onAnimationComplete?: () => void;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  enablePerformanceMonitoring?: boolean;
}

// Staggered card props
export interface StaggeredCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
  ease?: string | number[];
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
  onAnimationComplete?: () => void;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
}

// Staggered list props
export interface StaggeredListProps {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
  ease?: string | number[];
  triggerOnScroll?: boolean;
  scrollOffset?: number;
  onAnimationComplete?: () => void;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  enablePerformanceMonitoring?: boolean;
}

// Scroll-triggered animation props
export interface ScrollTriggeredStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
  ease?: string | number[];
  threshold?: number;
  rootMargin?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  enablePerformanceMonitoring?: boolean;
}

// Custom hook for intersection observer
const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Overloaded hook for HTMLDivElement
const useDivIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Get animation variants based on direction
const getVariants = (direction: string, duration: number, ease: string | number[]): Variants => {
  const transition: Transition = {
    duration: duration / 1000,
    ease: ease as unknown as Transition['ease']
  };
  
  switch (direction) {
    case 'up':
      return {
        initial: { opacity: 0, y: DIRECTIONS.up.y },
        animate: { opacity: 1, y: 0, transition },
        exit: { opacity: 0, y: DIRECTIONS.down.y, transition },
      };
    
    case 'down':
      return {
        initial: { opacity: 0, y: DIRECTIONS.down.y },
        animate: { opacity: 1, y: 0, transition },
        exit: { opacity: 0, y: DIRECTIONS.up.y, transition },
      };
    
    case 'left':
      return {
        initial: { opacity: 0, x: DIRECTIONS.left.x },
        animate: { opacity: 1, x: 0, transition },
        exit: { opacity: 0, x: DIRECTIONS.right.x, transition },
      };
    
    case 'right':
      return {
        initial: { opacity: 0, x: DIRECTIONS.right.x },
        animate: { opacity: 1, x: 0, transition },
        exit: { opacity: 0, x: DIRECTIONS.left.x, transition },
      };
    
    case 'scale':
      return {
        initial: { opacity: 0, scale: SCALES.medium },
        animate: { opacity: 1, scale: 1, transition },
        exit: { opacity: 0, scale: SCALES.medium, transition },
      };
    
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition },
        exit: { opacity: 0, transition },
      };
  }
};

// Staggered Container Component
export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  className = '',
  staggerDelay = ANIMATION_DELAYS.sequential,
  initialDelay = ANIMATION_DELAYS.short,
  direction = 'up',
  duration = ANIMATION_DURATIONS.normal,
  ease = EASING.luxury,
  triggerOnScroll = false,
  scrollOffset = 100,
  onAnimationComplete,
  accessibilityConfig,
  enablePerformanceMonitoring = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(!triggerOnScroll);
  const animationName = `staggered-container-${Date.now()}`;

  // Handle scroll trigger
  const { hasIntersected } = useDivIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: `${scrollOffset}px`,
  });

  useEffect(() => {
    if (triggerOnScroll && hasIntersected && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [triggerOnScroll, hasIntersected, shouldAnimate]);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && shouldAnimate) {
      performanceMonitor.startMonitoring(animationName, 'important');
      
      return () => {
        performanceMonitor.stopMonitoring(animationName);
      };
    }
  }, [enablePerformanceMonitoring, shouldAnimate, animationName]);

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: initialDelay / 1000,
      },
    },
  };

  const itemVariants = getVariants(direction, duration, ease);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      variants={containerVariants}
      initial="initial"
      animate={shouldAnimate ? "animate" : "initial"}
      onAnimationComplete={onAnimationComplete}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Staggered Card Component
export const StaggeredCard: React.FC<StaggeredCardProps> = ({
  children,
  className = '',
  index = 0,
  direction = 'up',
  duration = ANIMATION_DURATIONS.content,
  ease = EASING.luxury,
  whileHover,
  whileTap,
  onAnimationComplete,
  accessibilityConfig,
}) => {
  const cardVariants = getVariants(direction, duration, ease);
  
  // Enhanced hover effects for luxury cards
  const defaultHoverEffects: TargetAndTransition = {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: ANIMATION_DURATIONS.fast / 1000,
      ease: EASING.graceful as unknown as Transition['ease'],
    },
  };

  const defaultTapEffects: TargetAndTransition = {
    scale: SCALES.shrink,
    transition: {
      duration: ANIMATION_DURATIONS.instant / 1000,
      ease: EASING.subtle as unknown as Transition['ease'],
    },
  };

  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={whileHover || defaultHoverEffects}
      whileTap={whileTap || defaultTapEffects}
      onAnimationComplete={onAnimationComplete}
      style={{
        originY: 0,
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered List Component
export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  className = '',
  itemClassName = '',
  staggerDelay = ANIMATION_DELAYS.sequential,
  initialDelay = ANIMATION_DELAYS.short,
  direction = 'up',
  duration = ANIMATION_DURATIONS.normal,
  ease = EASING.luxury,
  triggerOnScroll = false,
  scrollOffset = 100,
  onAnimationComplete,
  accessibilityConfig,
  enablePerformanceMonitoring = true,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(!triggerOnScroll);
  const animationName = `staggered-list-${Date.now()}`;

  // Handle scroll trigger
  const { hasIntersected } = useDivIntersectionObserver(listRef, {
    threshold: 0.1,
    rootMargin: `${scrollOffset}px`,
  });

  useEffect(() => {
    if (triggerOnScroll && hasIntersected && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [triggerOnScroll, hasIntersected, shouldAnimate]);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && shouldAnimate) {
      performanceMonitor.startMonitoring(animationName, 'important');
      
      return () => {
        performanceMonitor.stopMonitoring(animationName);
      };
    }
  }, [enablePerformanceMonitoring, shouldAnimate, animationName]);

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: initialDelay / 1000,
      },
    },
  };

  const itemVariants = getVariants(direction, duration, ease);

  return (
    <motion.div
      ref={listRef}
      className={className}
      variants={containerVariants}
      initial="initial"
      animate={shouldAnimate ? "animate" : "initial"}
      onAnimationComplete={onAnimationComplete}
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={itemClassName}
            variants={itemVariants}
            layout
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Scroll-Triggered Staggered Animation Component
export const ScrollTriggeredStagger: React.FC<ScrollTriggeredStaggerProps> = ({
  children,
  className = '',
  staggerDelay = ANIMATION_DELAYS.sequential,
  initialDelay = ANIMATION_DELAYS.short,
  direction = 'up',
  duration = ANIMATION_DURATIONS.content,
  ease = EASING.luxury,
  threshold = 0.1,
  rootMargin = '50px',
  onAnimationStart,
  onAnimationComplete,
  accessibilityConfig,
  enablePerformanceMonitoring = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationName = `scroll-stagger-${Date.now()}`;

  const { isIntersecting } = useDivIntersectionObserver(containerRef, {
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
      onAnimationStart?.();
    }
  }, [isIntersecting, hasAnimated, onAnimationStart]);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && isVisible) {
      performanceMonitor.startMonitoring(animationName, 'important');
      
      return () => {
        performanceMonitor.stopMonitoring(animationName);
      };
    }
  }, [enablePerformanceMonitoring, isVisible, animationName]);

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: initialDelay / 1000,
      },
    },
  };

  const itemVariants = getVariants(direction, duration, ease);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      variants={containerVariants}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      onAnimationComplete={onAnimationComplete}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Luxury staggered reveal for premium content
export const LuxuryStaggeredReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onAnimationComplete?: () => void;
}> = ({ children, className = '', delay = ANIMATION_DELAYS.medium, onAnimationComplete }) => {
  const luxuryVariants: Variants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.98,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: ANIMATION_DURATIONS.showcase / 1000,
        ease: EASING.luxury as unknown as Transition['ease'],
        delay: delay / 1000,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={luxuryVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
};

// Export all components
export default {
  StaggeredContainer,
  StaggeredCard,
  StaggeredList,
  ScrollTriggeredStagger,
  LuxuryStaggeredReveal,
};