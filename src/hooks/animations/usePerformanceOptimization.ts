'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  AnimationPerformanceMonitor, 
  DeviceCapabilities, 
  AnimationQualitySettings,
  PerformanceBudget 
} from '@/utils/animations/performance';

interface UsePerformanceOptimizationOptions {
  enableAutoOptimization?: boolean;
  enableDeviceDetection?: boolean;
  performanceThreshold?: number;
  updateInterval?: number;
  onQualityChange?: (quality: AnimationQualitySettings) => void;
  onPerformanceIssue?: (issue: string) => void;
}

interface PerformanceOptimizationState {
  deviceCapabilities: DeviceCapabilities | null;
  currentQuality: AnimationQualitySettings | null;
  performanceBudget: PerformanceBudget | null;
  isOptimizing: boolean;
  performanceScore: number;
  frameRate: number;
  memoryUsage: number;
  isPerformanceDegraded: boolean;
  recommendations: string[];
}

export const usePerformanceOptimization = ({
  enableAutoOptimization = true,
  enableDeviceDetection = true,
  performanceThreshold = 50,
  updateInterval = 1000,
  onQualityChange,
  onPerformanceIssue,
}: UsePerformanceOptimizationOptions = {}) => {
  const [state, setState] = useState<PerformanceOptimizationState>({
    deviceCapabilities: null,
    currentQuality: null,
    performanceBudget: null,
    isOptimizing: false,
    performanceScore: 100,
    frameRate: 60,
    memoryUsage: 0,
    isPerformanceDegraded: false,
    recommendations: [],
  });
  
  const monitorRef = useRef<AnimationPerformanceMonitor | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastOptimizationRef = useRef<number>(0);
  const optimizationCooldownRef = useRef<number>(2000); // 2 seconds between optimizations
  
  // Initialize performance monitor
  useEffect(() => {
    monitorRef.current = AnimationPerformanceMonitor.getInstance();
    
    // Start monitoring
    monitorRef.current.startMonitoring('performance-optimization');
    
    // Get initial device capabilities and quality settings
    if (enableDeviceDetection) {
      const insights = monitorRef.current.getInsights();
      const quality = monitorRef.current.getCurrentQuality();
      const budget = monitorRef.current.getCurrentBudgetUsage();
      
      setState(prev => ({
        ...prev,
        deviceCapabilities: insights.deviceCapabilities,
        currentQuality: quality,
        performanceBudget: budget,
      }));
    }
    
    return () => {
      if (monitorRef.current) {
        monitorRef.current.stopMonitoring('performance-optimization');
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [enableDeviceDetection]);
  
  // Update performance metrics
  const updateMetrics = useCallback(() => {
    if (!monitorRef.current) return;
    
    const insights = monitorRef.current.getInsights();
    const quality = monitorRef.current.getCurrentQuality();
    const budget = monitorRef.current.getCurrentBudgetUsage();
    const frameRate = monitorRef.current.getCurrentFrameRate();
    const memoryUsage = monitorRef.current.getMemoryUsage();
    const isDegraded = monitorRef.current.isPerformanceDegraded();
    
    setState(prev => ({
      ...prev,
      performanceScore: insights.performanceScore,
      frameRate,
      memoryUsage,
      isPerformanceDegraded: isDegraded,
      currentQuality: quality,
      performanceBudget: budget,
      recommendations: insights.recommendations,
    }));
    
    // Check for performance issues
    if (isDegraded && onPerformanceIssue) {
      onPerformanceIssue('Performance degraded detected');
    }
    
    // Auto-optimize if enabled and performance is below threshold
    if (enableAutoOptimization && insights.performanceScore < performanceThreshold) {
      optimizePerformance();
    }
  }, [enableAutoOptimization, performanceThreshold, onPerformanceIssue]);
  
  // Set up periodic updates
  useEffect(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
    
    updateIntervalRef.current = setInterval(updateMetrics, updateInterval);
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [updateMetrics, updateInterval]);
  
  // Optimize performance based on current metrics
  const optimizePerformance = useCallback(() => {
    if (!monitorRef.current || !enableAutoOptimization) return;
    
    const now = performance.now();
    if (now - lastOptimizationRef.current < optimizationCooldownRef.current) {
      return; // Skip optimization if cooldown hasn't passed
    }
    
    setState(prev => ({ ...prev, isOptimizing: true }));
    
    try {
      const newQuality = monitorRef.current.adjustQualityAutomatically();
      const oldQuality = monitorRef.current.getCurrentQuality();
      
      // Only trigger callback if quality actually changed
      if (oldQuality.quality !== newQuality.quality && onQualityChange) {
        onQualityChange(newQuality);
      }
      
      setState(prev => ({
        ...prev,
        currentQuality: newQuality,
      }));
      
      lastOptimizationRef.current = now;
    } finally {
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [enableAutoOptimization, onQualityChange]);
  
  // Manually set quality level
  const setQuality = useCallback((quality: 'low' | 'medium' | 'high') => {
    if (!monitorRef.current) return;
    
    monitorRef.current.setQuality(quality);
    const newQuality = monitorRef.current.getCurrentQuality();
    
    setState(prev => ({
      ...prev,
      currentQuality: newQuality,
    }));
    
    if (onQualityChange) {
      onQualityChange(newQuality);
    }
  }, [onQualityChange]);
  
  // Get optimized animation properties
  const getOptimizedAnimationProps = useCallback((baseProps: {
    duration?: number;
    easing?: string;
    delay?: number;
    complexity?: number;
  }) => {
    if (!state.currentQuality) return baseProps;
    
    const quality = state.currentQuality;
    const durationMultiplier = quality.quality === 'low' ? 0.7 : 
                              quality.quality === 'medium' ? 0.85 : 1;
    
    return {
      duration: (baseProps.duration || 0.5) * durationMultiplier,
      easing: baseProps.easing || quality.easing,
      delay: baseProps.delay || 0,
      complexity: Math.min(baseProps.complexity || 5, quality.complexity),
      useHardwareAcceleration: quality.useHardwareAcceleration,
      enableParticles: quality.enableParticles,
      enableBlur: quality.enableBlur,
      enableShadows: quality.enableShadows,
    };
  }, [state.currentQuality]);
  
  // Check if animation should be enabled based on performance
  const shouldEnableAnimation = useCallback((complexity: number = 5) => {
    if (!state.currentQuality || !state.performanceBudget) return true;
    
    return (
      state.performanceScore > performanceThreshold &&
      complexity <= state.currentQuality.complexity &&
      state.performanceBudget.currentUsage.concurrent < state.performanceBudget.concurrentAnimationBudget
    );
  }, [state.currentQuality, state.performanceBudget, performanceThreshold]);
  
  // Get performance-based animation variants
  const getPerformanceVariants = useCallback((
    variants: Record<string, {
      transition?: {
        duration?: number;
        type?: string;
        [key: string]: unknown;
      };
      filter?: string;
      backdropFilter?: string;
      [key: string]: unknown;
    }>
  ) => {
    if (!state.currentQuality) return variants;
    
    const quality = state.currentQuality.quality;
    
    // Create simplified variants for lower quality settings
    if (quality === 'low') {
      const simplifiedVariants: Record<string, {
        transition?: {
          duration?: number;
          type?: string;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      }> = {};
      
      Object.keys(variants).forEach(key => {
        const variant = variants[key];
        simplifiedVariants[key] = {
          ...variant,
          transition: {
            ...variant.transition,
            duration: (variant.transition?.duration || 0.3) * 0.7,
            type: 'tween', // Use simpler easing
          },
        };
        
        // Remove complex properties
        if ('filter' in simplifiedVariants[key]) {
          delete (simplifiedVariants[key] as { filter?: unknown }).filter;
        }
        if ('backdropFilter' in simplifiedVariants[key]) {
          delete (simplifiedVariants[key] as { backdropFilter?: unknown }).backdropFilter;
        }
      });
      
      return simplifiedVariants;
    }
    
    return variants;
  }, [state.currentQuality]);
  
  // Reset performance metrics
  const resetMetrics = useCallback(() => {
    if (!monitorRef.current) return;
    
    monitorRef.current.resetMetrics();
    updateMetrics();
  }, [updateMetrics]);
  
  // Force performance optimization
  const forceOptimization = useCallback(() => {
    if (!monitorRef.current) return;
    
    // Set to low quality temporarily
    monitorRef.current.setQuality('low');
    const lowQuality = monitorRef.current.getCurrentQuality();
    
    setState(prev => ({
      ...prev,
      currentQuality: lowQuality,
    }));
    
    if (onQualityChange) {
      onQualityChange(lowQuality);
    }
    
    // Gradually improve quality after a delay
    setTimeout(() => {
      optimizePerformance();
    }, 2000);
  }, [optimizePerformance, onQualityChange]);
  
  return {
    // State
    ...state,
    
    // Actions
    optimizePerformance,
    setQuality,
    resetMetrics,
    forceOptimization,
    
    // Utilities
    getOptimizedAnimationProps,
    shouldEnableAnimation,
    getPerformanceVariants,
    
    // Raw monitor access for advanced usage
    monitor: monitorRef.current,
  };
};

export default usePerformanceOptimization;