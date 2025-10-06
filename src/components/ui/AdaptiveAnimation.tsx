'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePerformanceOptimization } from '@/hooks/animations/usePerformanceOptimization';
import { AnimationOptimizer } from '@/utils/animations/optimization';
import { AnimationQualitySettings } from '@/utils/animations/performance';

interface AdaptiveAnimationProps {
  children: React.ReactNode;
  animationType: 'fade' | 'slide' | 'scale' | 'rotate' | 'complex' | 'custom';
  keyframes?: Keyframe[];
  options?: KeyframeAnimationOptions;
  trigger?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  fallback?: React.ReactNode;
  disabled?: boolean;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}

interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  quality: AnimationQualitySettings | null;
  isOptimized: boolean;
  hasError: boolean;
}

export const AdaptiveAnimation: React.FC<AdaptiveAnimationProps> = ({
  children,
  animationType,
  keyframes,
  options,
  trigger = true,
  onProgress,
  onComplete,
  fallback,
  disabled = false,
  priority = 'medium',
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const progressRef = useRef<number>(0);
  
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    progress: 0,
    quality: null,
    isOptimized: false,
    hasError: false,
  });
  
  const {
    currentQuality,
    shouldEnableAnimation,
    getOptimizedAnimationProps,
    getPerformanceVariants,
    deviceCapabilities,
  } = usePerformanceOptimization({
    enableAutoOptimization: true,
    enableDeviceDetection: true,
    onQualityChange: (quality) => {
      setAnimationState(prev => ({ ...prev, quality }));
    },
  });
  
  // Get default keyframes based on animation type
  const getDefaultKeyframes = useCallback((): Keyframe[] => {
    const quality = currentQuality?.quality || 'medium';
    
    switch (animationType) {
      case 'fade':
        return [
          { opacity: 0 },
          { opacity: 1 },
        ];
      
      case 'slide':
        return quality === 'low' ? [
          { transform: 'translateX(0)' },
          { transform: 'translateX(20px)' },
        ] : [
          { transform: 'translateX(-100px)' },
          { transform: 'translateX(0)' },
        ];
      
      case 'scale':
        return quality === 'low' ? [
          { transform: 'scale(0.95)' },
          { transform: 'scale(1)' },
        ] : [
          { transform: 'scale(0.8)' },
          { transform: 'scale(1)' },
        ];
      
      case 'rotate':
        return quality === 'low' ? [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(5deg)' },
        ] : [
          { transform: 'rotate(-10deg)' },
          { transform: 'rotate(0deg)' },
        ];
      
      case 'complex':
        return quality === 'low' ? [
          { 
            transform: 'translateY(0) scale(1)',
            opacity: 0,
          },
          { 
            transform: 'translateY(0) scale(1)',
            opacity: 1,
          },
        ] : [
          { 
            transform: 'translateY(30px) scale(0.9)',
            opacity: 0,
          },
          { 
            transform: 'translateY(0) scale(1)',
            opacity: 1,
          },
        ];
      
      default:
        return keyframes || [
          { opacity: 0 },
          { opacity: 1 },
        ];
    }
  }, [animationType, currentQuality?.quality, keyframes]);
  
  // Get optimized animation options
  const getOptimizedOptions = useCallback((): KeyframeAnimationOptions => {
    const baseDuration = typeof options?.duration === 'number' ? options.duration : 500;
    const baseOptions = {
      duration: baseDuration,
      easing: options?.easing || 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: options?.delay || 0,
      fill: options?.fill || 'both' as FillMode,
      direction: options?.direction || 'normal' as PlaybackDirection,
      iterations: options?.iterations || 1,
    };
    
    if (!currentQuality) return baseOptions;
    
    const optimizedProps = getOptimizedAnimationProps({
      duration: baseDuration,
      easing: baseOptions.easing,
      delay: baseOptions.delay,
    });
    
    return {
      ...baseOptions,
      duration: optimizedProps.duration,
      easing: optimizedProps.easing,
      delay: optimizedProps.delay,
    };
  }, [options, currentQuality, getOptimizedAnimationProps]);
  
  // Start animation
  const startAnimation = useCallback(() => {
    if (!elementRef.current || !currentQuality || disabled) return;
    
    // Check if animation should be enabled
    const complexity = animationType === 'complex' ? 8 : 
                      animationType === 'custom' ? 6 : 3;
    
    if (!shouldEnableAnimation(complexity)) {
      setAnimationState(prev => ({ ...prev, hasError: true }));
      return;
    }
    
    try {
      // Apply hardware acceleration
      AnimationOptimizer.applyHardwareAcceleration(elementRef.current, currentQuality);
      
      // Get optimized keyframes and options
      const optimizedKeyframes = AnimationOptimizer.optimizeKeyframes(
        getDefaultKeyframes(),
        currentQuality
      );
      
      const optimizedOptions = getOptimizedOptions();
      
      // Create animation
      const animation = AnimationOptimizer.createOptimizedAnimation(
        elementRef.current,
        optimizedKeyframes,
        optimizedOptions,
        currentQuality,
        animationType
      );
      
      if (!animation) {
        setAnimationState(prev => ({ ...prev, hasError: true }));
        return;
      }
      
      animationRef.current = animation;
      
      // Set up animation event handlers
      animation.addEventListener('finish', () => {
        setAnimationState(prev => ({
          ...prev,
          isPlaying: false,
          progress: 100,
        }));
        
        if (onComplete) {
          onComplete();
        }
        
        // Clean up hardware acceleration
        if (elementRef.current) {
          AnimationOptimizer.removeHardwareAcceleration(elementRef.current);
        }
      });
      
      // Set up progress tracking
      const updateProgress = () => {
        if (animationRef.current && !animationRef.current.finished) {
          const currentTime = animationRef.current.currentTime || 0;
          const timing = animationRef.current.effect?.getTiming();
          const duration = typeof timing?.duration === 'number' ? timing.duration : 500;
          const progress = Math.min((Number(currentTime) / duration) * 100, 100);
          
          progressRef.current = progress;
          setAnimationState(prev => ({ ...prev, progress }));
          
          if (onProgress) {
            onProgress(progress);
          }
          
          if (!animationRef.current?.finished) {
            AnimationOptimizer.requestAnimationFrame(updateProgress);
          }
        }
      };
      
      updateProgress();
      
      setAnimationState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        hasError: false,
        isOptimized: currentQuality.quality !== 'high',
      }));
      
    } catch (error) {
      console.error('Animation error:', error);
      setAnimationState(prev => ({ ...prev, hasError: true }));
    }
  }, [
    currentQuality,
    disabled,
    animationType,
    shouldEnableAnimation,
    getDefaultKeyframes,
    getOptimizedOptions,
    onComplete,
    onProgress,
  ]);
  
  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
    
    if (elementRef.current) {
      AnimationOptimizer.removeHardwareAcceleration(elementRef.current);
    }
    
    setAnimationState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
    }));
  }, []);
  
  // Pause animation
  const pauseAnimation = useCallback(() => {
    if (animationRef.current && animationRef.current.playState === 'running') {
      animationRef.current.pause();
      setAnimationState(prev => ({ ...prev, isPaused: true }));
    }
  }, []);
  
  // Resume animation
  const resumeAnimation = useCallback(() => {
    if (animationRef.current && animationRef.current.playState === 'paused') {
      animationRef.current.play();
      setAnimationState(prev => ({ ...prev, isPaused: false }));
    }
  }, []);
  
  // Handle trigger changes
  useEffect(() => {
    if (trigger && currentQuality && !disabled) {
      startAnimation();
    } else if (!trigger) {
      stopAnimation();
    }
  }, [trigger, currentQuality, disabled, startAnimation, stopAnimation]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);
  
  // If animation is disabled or has error, show fallback
  if (disabled || animationState.hasError || !shouldEnableAnimation()) {
    return <>{fallback || <div className={className}>{children}</div>}</>;
  }
  
  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        // Apply performance-optimized styles
        willChange: currentQuality?.useHardwareAcceleration ? 'transform, opacity' : 'auto',
        backfaceVisibility: currentQuality?.useHardwareAcceleration ? 'hidden' : 'visible',
      }}
    >
      {children}
      
      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 bg-black/50 text-white text-xs p-1 rounded">
          <div>Quality: {currentQuality?.quality}</div>
          <div>Progress: {Math.round(animationState.progress)}%</div>
          <div>Optimized: {animationState.isOptimized ? 'Yes' : 'No'}</div>
          <div>Device: {deviceCapabilities?.memoryTier}</div>
        </div>
      )}
    </div>
  );
};

// Hook for imperative control
export const useAdaptiveAnimation = () => {
  const controlsRef = useRef<{
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    getState: () => AnimationState;
  } | null>(null);
  
  const registerControls = useCallback((controls: {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    getState: () => AnimationState;
  }) => {
    controlsRef.current = controls;
  }, []);
  
  const start = useCallback(() => {
    controlsRef.current?.start();
  }, []);
  
  const stop = useCallback(() => {
    controlsRef.current?.stop();
  }, []);
  
  const pause = useCallback(() => {
    controlsRef.current?.pause();
  }, []);
  
  const resume = useCallback(() => {
    controlsRef.current?.resume();
  }, []);
  
  const getState = useCallback(() => {
    return controlsRef.current?.getState() || {
      isPlaying: false,
      isPaused: false,
      progress: 0,
      quality: null,
      isOptimized: false,
      hasError: false,
    };
  }, []);
  
  return {
    registerControls,
    start,
    stop,
    pause,
    resume,
    getState,
  };
};

export default AdaptiveAnimation;