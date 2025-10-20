/**
 * Animation controller hook for managing complex animation sequences
 * Provides state management for animations and performance monitoring integration
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Variants, TargetAndTransition, Transition } from 'framer-motion';
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

// Animation sequence step interface
export interface AnimationStep {
  id: string;
  name: string;
  variants?: Variants;
  target?: TargetAndTransition;
  transition?: Transition;
  duration?: number;
  delay?: number;
  priority?: keyof typeof ANIMATION_PRIORITIES;
  onComplete?: () => void;
  onStart?: () => void;
}

// Animation sequence configuration
export interface AnimationSequence {
  id: string;
  name: string;
  steps: AnimationStep[];
  loop?: boolean;
  autoPlay?: boolean;
  priority?: keyof typeof ANIMATION_PRIORITIES;
  accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
}

// Animation controller state
export interface AnimationControllerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  currentStepId: string | null;
  progress: number; // 0-1
  duration: number;
  elapsedTime: number;
  isCompleted: boolean;
  error: string | null;
}

// Animation controller options
export interface AnimationControllerOptions {
  enablePerformanceMonitoring?: boolean;
  enableAccessibility?: boolean;
  throttleAnimations?: boolean;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number, step: AnimationStep) => void;
  onError?: (error: string) => void;
}

// Animation controller return value
export interface UseAnimationControllerReturn {
  // State
  state: AnimationControllerState;
  
  // Controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  goToStep: (stepIndex: number) => void;
  
  // Animation props for current step
  getAnimationProps: () => SafeAnimationProps;
  
  // Utilities
  getCurrentStep: () => AnimationStep | null;
  getTotalSteps: () => number;
  getProgress: () => number;
  
  // Performance
  getPerformanceMetrics: () => ReturnType<typeof performanceMonitor.getInsights> | null;
  
  // Accessibility
  updateAccessibilityConfig: (config: Partial<AccessibilityAnimationConfig>) => void;
}

// Main animation controller hook
export function useAnimationController(
  sequence: AnimationSequence,
  options: AnimationControllerOptions = {}
): UseAnimationControllerReturn {
  const {
    enablePerformanceMonitoring = true,
    enableAccessibility = true,
    throttleAnimations = true,
    onComplete,
    onStepChange,
    onError,
  } = options;

  // State management
  const [state, setState] = useState<AnimationControllerState>({
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    currentStepId: null,
    progress: 0,
    duration: 0,
    elapsedTime: 0,
    isCompleted: false,
    error: null,
  });

  // Refs for managing animation lifecycle
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const currentStepTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const accessibilityConfigRef = useRef<Partial<AccessibilityAnimationConfig>>(
    sequence.accessibilityConfig || {}
  );

  // Calculate total duration of sequence
  const calculateTotalDuration = useCallback(() => {
    return sequence.steps.reduce((total, step) => {
      return total + (step.duration || ANIMATION_DURATIONS.normal) + (step.delay || 0);
    }, 0);
  }, [sequence.steps]);

  // Get current step
  const getCurrentStep = useCallback((): AnimationStep | null => {
    if (state.currentStep >= 0 && state.currentStep < sequence.steps.length) {
      return sequence.steps[state.currentStep];
    }
    return null;
  }, [state.currentStep, sequence.steps]);

  // Get animation props for current step
  const getAnimationProps = useCallback((): SafeAnimationProps => {
    const currentStep = getCurrentStep();
    if (!currentStep) return {};

    let props: SafeAnimationProps = {
      initial: currentStep.variants?.initial as TargetAndTransition,
      animate: (currentStep.variants?.animate || currentStep.target) as TargetAndTransition,
      exit: currentStep.variants?.exit as TargetAndTransition,
      transition: currentStep.transition,
    };

    // Apply accessibility adaptations if enabled
    if (enableAccessibility) {
      props = AccessibilityAnimationAdapter.adaptAnimation(
        props,
        accessibilityConfigRef.current
      );
    }

    // Apply performance optimizations if enabled
    if (throttleAnimations) {
      const optimizedProps = { ...props };
      if (optimizedProps.transition) {
        const throttledTransition = PerformanceOptimizer.throttleAnimation(
          () => optimizedProps.transition,
          currentStep.priority || 'normal'
        );
        // Apply throttling to the transition duration if it exists
        if (optimizedProps.transition && typeof optimizedProps.transition === 'object') {
          optimizedProps.transition = {
            ...optimizedProps.transition,
            duration: (optimizedProps.transition.duration || ANIMATION_DURATIONS.normal) * 0.8,
          };
        }
      }
      props = optimizedProps;
    }

    return props;
  }, [getCurrentStep, enableAccessibility, throttleAnimations]);

  // Start performance monitoring for current step
  const startPerformanceMonitoring = useCallback((step: AnimationStep) => {
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring(
        `${sequence.id}-${step.id}`,
        step.priority || 'normal'
      );
    }
  }, [enablePerformanceMonitoring, sequence.id]);

  // Stop performance monitoring for current step
  const stopPerformanceMonitoring = useCallback((step: AnimationStep) => {
    if (enablePerformanceMonitoring) {
      const metrics = performanceMonitor.stopMonitoring(`${sequence.id}-${step.id}`);
      if (metrics && metrics.frameRate < 30) {
        console.warn(`Low frame rate detected for animation ${step.id}:`, metrics);
      }
    }
  }, [enablePerformanceMonitoring, sequence.id]);

  // Execute step
  const executeStep = useCallback((stepIndex: number) => {
    const step = sequence.steps[stepIndex];
    if (!step) return;

    setState(prev => ({
      ...prev,
      currentStep: stepIndex,
      currentStepId: step.id,
      error: null,
    }));

    // Call step start callback
    step.onStart?.();

    // Notify of step change
    onStepChange?.(stepIndex, step);

    // Start performance monitoring
    startPerformanceMonitoring(step);

    // Calculate step duration
    const stepDuration = (step.duration || ANIMATION_DURATIONS.normal) + (step.delay || 0);

    // Set timeout for step completion
    currentStepTimeoutRef.current = setTimeout(() => {
      // Stop performance monitoring
      stopPerformanceMonitoring(step);

      // Call step complete callback
      step.onComplete?.();

      // Move to next step or complete sequence
      if (stepIndex < sequence.steps.length - 1) {
        executeStep(stepIndex + 1);
      } else {
        // Sequence completed
        if (sequence.loop) {
          executeStep(0);
        } else {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            isCompleted: true,
            progress: 1,
          }));
          onComplete?.();
        }
      }
    }, stepDuration);
  }, [sequence.steps, sequence.loop, onStepChange, onComplete, startPerformanceMonitoring, stopPerformanceMonitoring]);

  // Play animation
  const play = useCallback(() => {
    if (state.isPlaying) return;

    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      error: null,
    }));

    startTimeRef.current = performance.now() - pausedTimeRef.current;

    // Start from current step
    if (state.currentStep === 0 && !state.isPaused) {
      executeStep(0);
    } else if (state.isPaused) {
      // Resume from paused state
      const currentStep = getCurrentStep();
      if (currentStep) {
        executeStep(state.currentStep);
      }
    }
  }, [state.isPlaying, state.isPaused, state.currentStep, getCurrentStep, executeStep]);

  // Pause animation
  const pause = useCallback(() => {
    if (!state.isPlaying || state.isPaused) return;

    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));

    pausedTimeRef.current = performance.now() - startTimeRef.current;

    // Clear current step timeout
    if (currentStepTimeoutRef.current) {
      clearTimeout(currentStepTimeoutRef.current);
    }

    // Stop performance monitoring
    const currentStep = getCurrentStep();
    if (currentStep) {
      stopPerformanceMonitoring(currentStep);
    }
  }, [state.isPlaying, state.isPaused, getCurrentStep, stopPerformanceMonitoring]);

  // Stop animation
  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      progress: 0,
      elapsedTime: 0,
      isCompleted: false,
      error: null,
    }));

    // Clear current step timeout
    if (currentStepTimeoutRef.current) {
      clearTimeout(currentStepTimeoutRef.current);
    }

    // Stop performance monitoring
    const currentStep = getCurrentStep();
    if (currentStep) {
      stopPerformanceMonitoring(currentStep);
    }

    // Reset refs
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, [getCurrentStep, stopPerformanceMonitoring]);

  // Reset animation
  const reset = useCallback(() => {
    stop();
    setState(prev => ({
      ...prev,
      currentStep: 0,
      currentStepId: null,
    }));
  }, [stop]);

  // Go to next step
  const next = useCallback(() => {
    if (state.currentStep < sequence.steps.length - 1) {
      // Clear current timeout
      if (currentStepTimeoutRef.current) {
        clearTimeout(currentStepTimeoutRef.current);
      }

      // Stop performance monitoring for current step
      const currentStep = getCurrentStep();
      if (currentStep) {
        stopPerformanceMonitoring(currentStep);
      }

      // Execute next step
      executeStep(state.currentStep + 1);
    }
  }, [state.currentStep, sequence.steps.length, getCurrentStep, stopPerformanceMonitoring, executeStep]);

  // Go to previous step
  const previous = useCallback(() => {
    if (state.currentStep > 0) {
      // Clear current timeout
      if (currentStepTimeoutRef.current) {
        clearTimeout(currentStepTimeoutRef.current);
      }

      // Stop performance monitoring for current step
      const currentStep = getCurrentStep();
      if (currentStep) {
        stopPerformanceMonitoring(currentStep);
      }

      // Execute previous step
      executeStep(state.currentStep - 1);
    }
  }, [state.currentStep, getCurrentStep, stopPerformanceMonitoring, executeStep]);

  // Go to specific step
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < sequence.steps.length) {
      // Clear current timeout
      if (currentStepTimeoutRef.current) {
        clearTimeout(currentStepTimeoutRef.current);
      }

      // Stop performance monitoring for current step
      const currentStep = getCurrentStep();
      if (currentStep) {
        stopPerformanceMonitoring(currentStep);
      }

      // Execute specified step
      executeStep(stepIndex);
    }
  }, [sequence.steps.length, getCurrentStep, stopPerformanceMonitoring, executeStep]);

  // Update progress
  const updateProgress = useCallback(() => {
    if (state.isPlaying && !state.isPaused) {
      const currentTime = performance.now();
      const elapsed = currentTime - startTimeRef.current;
      const totalDuration = calculateTotalDuration();
      
      setState(prev => ({
        ...prev,
        elapsedTime: elapsed,
        progress: Math.min(elapsed / totalDuration, 1),
      }));

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [state.isPlaying, state.isPaused, calculateTotalDuration]);

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

  // Get total steps
  const getTotalSteps = useCallback(() => {
    return sequence.steps.length;
  }, [sequence.steps.length]);

  // Get progress
  const getProgress = useCallback(() => {
    return state.progress;
  }, [state.progress]);

  // Auto-play if configured
  useEffect(() => {
    if (sequence.autoPlay && sequence.steps.length > 0) {
      executeStep(0);
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [sequence.autoPlay, sequence.steps.length, executeStep]);

  // Update progress tracking
  useEffect(() => {
    if (state.isPlaying && !state.isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.isPaused, updateProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentStepTimeoutRef.current) {
        clearTimeout(currentStepTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      const currentStep = getCurrentStep();
      if (currentStep) {
        stopPerformanceMonitoring(currentStep);
      }
    };
  }, [getCurrentStep, stopPerformanceMonitoring]);

  return {
    state,
    play,
    pause,
    stop,
    reset,
    next,
    previous,
    goToStep,
    getAnimationProps,
    getCurrentStep,
    getTotalSteps,
    getProgress,
    getPerformanceMetrics,
    updateAccessibilityConfig,
  };
}

// Helper hook for creating simple animation sequences
export function useSimpleAnimation(
  variants: Variants,
  options: {
    duration?: number;
    autoPlay?: boolean;
    priority?: keyof typeof ANIMATION_PRIORITIES;
    accessibilityConfig?: Partial<AccessibilityAnimationConfig>;
  } = {}
) {
  const sequence: AnimationSequence = {
    id: 'simple-animation',
    name: 'Simple Animation',
    steps: [
      {
        id: 'main',
        name: 'Main Animation',
        variants,
        duration: options.duration || ANIMATION_DURATIONS.normal,
        priority: options.priority || 'normal',
      },
    ],
    autoPlay: options.autoPlay,
    accessibilityConfig: options.accessibilityConfig,
  };

  return useAnimationController(sequence, {
    enablePerformanceMonitoring: true,
    enableAccessibility: true,
  });
}

export default useAnimationController;