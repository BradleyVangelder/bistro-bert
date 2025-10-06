/**
 * Performance monitoring utilities for animations
 * Provides frame rate tracking, performance insights, and hardware acceleration helpers
 */

import { PERFORMANCE_SETTINGS, ANIMATION_PRIORITIES } from './constants';

// Performance metrics interface
export interface PerformanceMetrics {
  frameRate: number;
  frameTime: number;
  droppedFrames: number;
  totalFrames: number;
  animationDuration: number;
  memoryUsage?: number;
  cpuUsage?: number;
  gpuUsage?: number;
  renderTime?: number;
}

// Performance insights interface
export interface PerformanceInsights {
  averageFrameRate: number;
  slowAnimations: string[];
  recommendations: string[];
  performanceScore: number; // 0-100
  deviceCapabilities: DeviceCapabilities;
  performanceBudget: PerformanceBudget;
}

// Device capabilities interface
export interface DeviceCapabilities {
  hardwareAcceleration: boolean;
  maxConcurrentAnimations: number;
  preferredFrameRate: number;
  memoryTier: 'low' | 'medium' | 'high';
  processorTier: 'low' | 'medium' | 'high';
  gpuTier: 'low' | 'medium' | 'high';
  recommendedQuality: 'low' | 'medium' | 'high';
}

// Performance budget interface
export interface PerformanceBudget {
  frameTimeBudget: number; // ms per frame
  memoryBudget: number; // MB
  animationComplexityBudget: number; // 1-10 scale
  concurrentAnimationBudget: number;
  currentUsage: {
    frameTime: number;
    memory: number;
    complexity: number;
    concurrent: number;
  };
}

// Animation quality settings
export interface AnimationQualitySettings {
  quality: 'low' | 'medium' | 'high';
  frameRate: number;
  duration: number;
  easing: string;
  complexity: number;
  useHardwareAcceleration: boolean;
  enableParticles: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
}

// Animation performance data
interface AnimationPerformanceData {
  name: string;
  startTime: number;
  endTime?: number;
  frameCount: number;
  droppedFrames: number;
  priority: keyof typeof ANIMATION_PRIORITIES;
  quality: AnimationQualitySettings;
  complexity: number;
  memoryFootprint: number;
}

// Performance monitor class
export class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private metrics: Map<string, AnimationPerformanceData> = new Map();
  private frameRates: number[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private animationFrameId?: number;
  private lastFrameTime = 0;
  private frameCount = 0;
  private droppedFrames = 0;
  private deviceCapabilities: DeviceCapabilities;
  private performanceBudget: PerformanceBudget;
  private currentQuality: AnimationQualitySettings;
  private qualityAdjustmentThreshold = 5; // Frames below threshold before quality adjustment
  private consecutiveLowFrames = 0;
  private performanceHistory: number[] = [];
  private maxHistorySize = 60; // Store last 60 frames for analysis

  static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  private constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.performanceBudget = this.initializePerformanceBudget();
    this.currentQuality = this.getOptimalQualitySettings();
    this.setupPerformanceObservers();
  }

  // Start monitoring animation performance
  startMonitoring(animationName: string, priority: keyof typeof ANIMATION_PRIORITIES = 'normal'): void {
    const data: AnimationPerformanceData = {
      name: animationName,
      startTime: performance.now(),
      frameCount: 0,
      droppedFrames: 0,
      priority,
      quality: this.currentQuality,
      complexity: this.calculateAnimationComplexity(animationName),
      memoryFootprint: this.estimateMemoryUsage(animationName),
    };

    this.metrics.set(animationName, data);
    
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      this.startFrameRateTracking();
    }
  }

  // Stop monitoring and return performance metrics
  stopMonitoring(animationName: string): PerformanceMetrics | null {
    const data = this.metrics.get(animationName);
    if (!data) return null;

    data.endTime = performance.now();
    const duration = data.endTime - data.startTime;

    const metrics: PerformanceMetrics = {
      frameRate: data.frameCount > 0 ? (data.frameCount / duration) * 1000 : 0,
      frameTime: duration / data.frameCount,
      droppedFrames: data.droppedFrames,
      totalFrames: data.frameCount,
      animationDuration: duration,
      memoryUsage: this.getMemoryUsage(),
    };

    this.metrics.delete(animationName);
    
    if (this.metrics.size === 0) {
      this.stopFrameRateTracking();
    }

    return metrics;
  }

  // Get performance insights
  getInsights(): PerformanceInsights {
    const completedAnimations = Array.from(this.metrics.values())
      .filter(data => data.endTime !== undefined);

    const averageFrameRate = this.calculateAverageFrameRate();
    const slowAnimations = this.getSlowAnimations();
    const recommendations = this.generateRecommendations(slowAnimations, averageFrameRate);
    const performanceScore = this.calculatePerformanceScore(averageFrameRate, slowAnimations);

    return {
      averageFrameRate,
      slowAnimations,
      recommendations,
      performanceScore,
      deviceCapabilities: this.deviceCapabilities,
      performanceBudget: this.getCurrentBudgetUsage(),
    };
  }

  // Get current performance budget usage
  getCurrentBudgetUsage(): PerformanceBudget {
    return {
      ...this.performanceBudget,
      currentUsage: {
        frameTime: this.getCurrentFrameTime(),
        memory: this.getMemoryUsage(),
        complexity: this.getCurrentComplexity(),
        concurrent: this.metrics.size,
      },
    };
  }

  // Automatically adjust quality based on performance
  adjustQualityAutomatically(): AnimationQualitySettings {
    const currentFrameRate = this.getCurrentFrameRate();
    const targetFrameRate = this.deviceCapabilities.preferredFrameRate;
    
    if (currentFrameRate < targetFrameRate * 0.8) {
      this.consecutiveLowFrames++;
      
      if (this.consecutiveLowFrames >= this.qualityAdjustmentThreshold) {
        this.currentQuality = this.reduceQuality(this.currentQuality);
        this.consecutiveLowFrames = 0;
      }
    } else if (currentFrameRate > targetFrameRate * 0.95) {
      this.consecutiveLowFrames = 0;
      
      // Gradually increase quality if performance is good
      if (this.currentQuality.quality !== 'high' && Math.random() > 0.8) {
        this.currentQuality = this.increaseQuality(this.currentQuality);
      }
    }
    
    return this.currentQuality;
  }

  // Get current quality settings
  getCurrentQuality(): AnimationQualitySettings {
    return this.currentQuality;
  }

  // Set quality manually
  setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.currentQuality = this.getQualitySettings(quality);
  }

  // Detect device capabilities
  private detectDeviceCapabilities(): DeviceCapabilities {
    const hardwareAcceleration = this.checkHardwareAcceleration();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const memory = this.getMemoryUsage();
    const cores = navigator.hardwareConcurrency || 4;
    
    // Determine memory tier
    let memoryTier: 'low' | 'medium' | 'high' = 'medium';
    if (memory < 100) memoryTier = 'low';
    else if (memory > 500) memoryTier = 'high';
    
    // Determine processor tier
    let processorTier: 'low' | 'medium' | 'high' = 'medium';
    if (cores < 4) processorTier = 'low';
    else if (cores > 8) processorTier = 'high';
    
    // Determine GPU tier (simplified)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    let gpuTier: 'low' | 'medium' | 'high' = 'medium';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Apple')) {
          gpuTier = 'high';
        }
      }
    }
    
    // Determine recommended quality
    let recommendedQuality: 'low' | 'medium' | 'high' = 'medium';
    if (isMobile || memoryTier === 'low' || processorTier === 'low') {
      recommendedQuality = 'low';
    } else if (memoryTier === 'high' && processorTier === 'high' && gpuTier === 'high') {
      recommendedQuality = 'high';
    }
    
    return {
      hardwareAcceleration,
      maxConcurrentAnimations: isMobile ? 3 : 8,
      preferredFrameRate: isMobile ? 30 : 60,
      memoryTier,
      processorTier,
      gpuTier,
      recommendedQuality,
    };
  }

  // Initialize performance budget
  private initializePerformanceBudget(): PerformanceBudget {
    const targetFrameRate = this.deviceCapabilities.preferredFrameRate;
    const frameTimeBudget = 1000 / targetFrameRate;
    
    return {
      frameTimeBudget,
      memoryBudget: this.deviceCapabilities.memoryTier === 'low' ? 50 :
                    this.deviceCapabilities.memoryTier === 'medium' ? 100 : 200,
      animationComplexityBudget: this.deviceCapabilities.processorTier === 'low' ? 3 :
                                 this.deviceCapabilities.processorTier === 'medium' ? 6 : 10,
      concurrentAnimationBudget: this.deviceCapabilities.maxConcurrentAnimations,
      currentUsage: {
        frameTime: 0,
        memory: 0,
        complexity: 0,
        concurrent: 0,
      },
    };
  }

  // Get optimal quality settings
  private getOptimalQualitySettings(): AnimationQualitySettings {
    return this.getQualitySettings(this.deviceCapabilities.recommendedQuality);
  }

  // Get quality settings for specific quality level
  private getQualitySettings(quality: 'low' | 'medium' | 'high'): AnimationQualitySettings {
    const baseSettings = {
      low: {
        frameRate: 30,
        duration: 0.3,
        easing: 'ease-out',
        complexity: 3,
        useHardwareAcceleration: true,
        enableParticles: false,
        enableBlur: false,
        enableShadows: false,
      },
      medium: {
        frameRate: 60,
        duration: 0.5,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        complexity: 6,
        useHardwareAcceleration: true,
        enableParticles: true,
        enableBlur: false,
        enableShadows: true,
      },
      high: {
        frameRate: 60,
        duration: 0.7,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        complexity: 10,
        useHardwareAcceleration: true,
        enableParticles: true,
        enableBlur: true,
        enableShadows: true,
      },
    };
    
    return {
      quality,
      ...baseSettings[quality],
    };
  }

  // Reduce quality settings
  private reduceQuality(current: AnimationQualitySettings): AnimationQualitySettings {
    if (current.quality === 'high') {
      return this.getQualitySettings('medium');
    } else if (current.quality === 'medium') {
      return this.getQualitySettings('low');
    }
    return current;
  }

  // Increase quality settings
  private increaseQuality(current: AnimationQualitySettings): AnimationQualitySettings {
    if (current.quality === 'low') {
      return this.getQualitySettings('medium');
    } else if (current.quality === 'medium') {
      return this.getQualitySettings('high');
    }
    return current;
  }

  // Calculate animation complexity
  private calculateAnimationComplexity(animationName: string): number {
    // Base complexity on animation name patterns
    if (animationName.includes('particle') || animationName.includes('complex')) {
      return 8;
    } else if (animationName.includes('fade') || animationName.includes('slide')) {
      return 3;
    } else if (animationName.includes('scale') || animationName.includes('rotate')) {
      return 5;
    }
    return 5; // Default complexity
  }

  // Estimate memory usage for animation
  private estimateMemoryUsage(animationName: string): number {
    // Rough estimation in MB
    const complexity = this.calculateAnimationComplexity(animationName);
    return complexity * 0.5; // 0.5MB per complexity point
  }

  // Check hardware acceleration support
  private checkHardwareAcceleration(): boolean {
    const testEl = document.createElement('div');
    testEl.style.transform = 'translateZ(0)';
    return testEl.style.transform !== '';
  }

  // Get current frame time
  private getCurrentFrameTime(): number {
    if (this.frameRates.length === 0) return 0;
    return 1000 / this.frameRates[this.frameRates.length - 1];
  }

  // Get current complexity
  private getCurrentComplexity(): number {
    let totalComplexity = 0;
    this.metrics.forEach(data => {
      totalComplexity += data.complexity;
    });
    return totalComplexity;
  }

  // Setup performance observers
  private setupPerformanceObservers(): void {
    if ('PerformanceObserver' in window) {
      // Observe frame timing
      const frameObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('frame')) {
            this.performanceHistory.push(entry.duration);
            if (this.performanceHistory.length > this.maxHistorySize) {
              this.performanceHistory.shift();
            }
          }
        });
      });
      
      frameObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(frameObserver);
    }
  }

  // Start frame rate tracking
  private startFrameRateTracking(): void {
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.droppedFrames = 0;

    const trackFrame = (currentTime: number) => {
      const frameTime = currentTime - this.lastFrameTime;
      this.frameCount++;

      // Check if frame dropped below target threshold
      if (frameTime > this.performanceBudget.frameTimeBudget) {
        this.droppedFrames++;
      }

      this.frameRates.push(1000 / frameTime);
      this.lastFrameTime = currentTime;

      // Update frame count for all active animations
      this.metrics.forEach(data => {
        data.frameCount++;
        if (frameTime > this.performanceBudget.frameTimeBudget) {
          data.droppedFrames++;
        }
      });

      // Automatically adjust quality if needed
      this.adjustQualityAutomatically();

      if (this.isMonitoring) {
        this.animationFrameId = requestAnimationFrame(trackFrame);
      }
    };

    this.animationFrameId = requestAnimationFrame(trackFrame);
  }

  // Stop frame rate tracking
  private stopFrameRateTracking(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  // Calculate average frame rate
  private calculateAverageFrameRate(): number {
    if (this.frameRates.length === 0) return 0;
    const sum = this.frameRates.reduce((acc, rate) => acc + rate, 0);
    return sum / this.frameRates.length;
  }

  // Identify animations dropping below target FPS
  private getSlowAnimations(): string[] {
    const slowAnimations: string[] = [];
    
    this.metrics.forEach((data, name) => {
      if (data.endTime !== undefined) {
        const duration = data.endTime - data.startTime;
        const frameRate = (data.frameCount / duration) * 1000;
        
        if (frameRate < this.deviceCapabilities.preferredFrameRate) {
          slowAnimations.push(name);
        }
      }
    });

    return slowAnimations;
  }

  // Generate performance optimization recommendations
  private generateRecommendations(slowAnimations: string[], averageFrameRate: number): string[] {
    const recommendations: string[] = [];
    const budgetUsage = this.getCurrentBudgetUsage();

    if (averageFrameRate < this.deviceCapabilities.preferredFrameRate) {
      recommendations.push('Consider reducing animation complexity or duration');
    }

    if (slowAnimations.length > 0) {
      recommendations.push(`${slowAnimations.length} animation(s) are dropping below target FPS`);
    }

    if (budgetUsage.currentUsage.memory > budgetUsage.memoryBudget * 0.8) {
      recommendations.push('High memory usage detected - consider optimizing assets');
    }

    if (budgetUsage.currentUsage.complexity > budgetUsage.animationComplexityBudget) {
      recommendations.push('Animation complexity exceeds budget - simplify animations');
    }

    if (budgetUsage.currentUsage.concurrent > budgetUsage.concurrentAnimationBudget) {
      recommendations.push('Too many concurrent animations - consider staggering animations');
    }

    // Check for hardware acceleration opportunities
    if (!this.deviceCapabilities.hardwareAcceleration) {
      recommendations.push('Hardware acceleration not available - use simpler animations');
    }

    // Quality-based recommendations
    if (this.currentQuality.quality === 'high' && averageFrameRate < 50) {
      recommendations.push('Consider reducing animation quality for better performance');
    }

    return recommendations;
  }

  // Calculate overall performance score
  private calculatePerformanceScore(averageFrameRate: number, slowAnimations: string[]): number {
    let score = 100;
    const targetFrameRate = this.deviceCapabilities.preferredFrameRate;
    const budgetUsage = this.getCurrentBudgetUsage();

    // Deduct points for low frame rate
    if (averageFrameRate < targetFrameRate) {
      score -= (targetFrameRate - averageFrameRate) * 2;
    }

    // Deduct points for slow animations
    score -= slowAnimations.length * 10;

    // Deduct points for high memory usage
    if (budgetUsage.currentUsage.memory > budgetUsage.memoryBudget) {
      score -= (budgetUsage.currentUsage.memory - budgetUsage.memoryBudget) * 0.5;
    }

    // Deduct points for exceeding complexity budget
    if (budgetUsage.currentUsage.complexity > budgetUsage.animationComplexityBudget) {
      score -= (budgetUsage.currentUsage.complexity - budgetUsage.animationComplexityBudget) * 5;
    }

    // Deduct points for too many concurrent animations
    if (budgetUsage.currentUsage.concurrent > budgetUsage.concurrentAnimationBudget) {
      score -= (budgetUsage.currentUsage.concurrent - budgetUsage.concurrentAnimationBudget) * 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Get memory usage in MB
  getMemoryUsage(): number {
    if ('memory' in performance) {
      // Type assertion for performance.memory which is a Chrome-specific API
      const perfMemory = performance as Performance & {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      return perfMemory.memory.usedJSHeapSize / (1024 * 1024);
    }
    return 0;
  }

  // Check if performance is degraded
  isPerformanceDegraded(): boolean {
    const currentFrameRate = this.getCurrentFrameRate();
    return currentFrameRate < this.deviceCapabilities.preferredFrameRate * 0.8;
  }

  // Check if within performance budget
  isWithinBudget(): boolean {
    const budgetUsage = this.getCurrentBudgetUsage();
    return (
      budgetUsage.currentUsage.frameTime <= budgetUsage.frameTimeBudget &&
      budgetUsage.currentUsage.memory <= budgetUsage.memoryBudget &&
      budgetUsage.currentUsage.complexity <= budgetUsage.animationComplexityBudget &&
      budgetUsage.currentUsage.concurrent <= budgetUsage.concurrentAnimationBudget
    );
  }

  // Get performance profiling data
  getProfileData(): {
    frameRates: number[];
    performanceHistory: number[];
    qualityChanges: { timestamp: number; quality: string }[];
    budgetUsage: PerformanceBudget;
  } {
    return {
      frameRates: [...this.frameRates],
      performanceHistory: [...this.performanceHistory],
      qualityChanges: [], // Could be implemented to track quality changes
      budgetUsage: this.getCurrentBudgetUsage(),
    };
  }

  // Reset performance metrics
  resetMetrics(): void {
    this.metrics.clear();
    this.frameRates = [];
    this.performanceHistory = [];
    this.frameCount = 0;
    this.droppedFrames = 0;
    this.consecutiveLowFrames = 0;
    this.currentQuality = this.getOptimalQualitySettings();
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
    this.frameRates = [];
    this.frameCount = 0;
    this.droppedFrames = 0;
  }

  // Get current frame rate
  getCurrentFrameRate(): number {
    if (this.frameRates.length === 0) return 0;
    return this.frameRates[this.frameRates.length - 1];
  }

}

// Hardware acceleration helpers
export class HardwareAccelerationHelper {
  // Apply hardware acceleration to an element
  static applyHardwareAcceleration(element: HTMLElement): void {
    if (!element) return;

    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }

  // Remove hardware acceleration from an element
  static removeHardwareAcceleration(element: HTMLElement): void {
    if (!element) return;

    element.style.transform = '';
    element.style.willChange = 'auto';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
  }

  // Check if device supports hardware acceleration
  static supportsHardwareAcceleration(): boolean {
    const testEl = document.createElement('div');
    testEl.style.transform = 'translateZ(0)';
    return testEl.style.transform !== '';
  }

  // Get optimal animation properties based on device capabilities
  static getOptimalAnimationProperties(): {
    useWillChange: boolean;
    useTransform3D: boolean;
    maxConcurrentAnimations: number;
  } {
    const supportsHA = this.supportsHardwareAcceleration();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      useWillChange: supportsHA && !isMobile,
      useTransform3D: supportsHA,
      maxConcurrentAnimations: isMobile ? 3 : 6,
    };
  }
}

// Performance optimization utilities
export class PerformanceOptimizer {
  // Throttle animation based on performance
  static throttleAnimation(
    callback: () => void,
    priority: keyof typeof ANIMATION_PRIORITIES = 'normal'
  ): () => void {
    const monitor = AnimationPerformanceMonitor.getInstance();
    let lastCall = 0;
    
    return () => {
      const now = performance.now();
      const isDegraded = monitor.isPerformanceDegraded();
      
      // Adjust throttle based on performance and priority
      const baseDelay = ANIMATION_PRIORITIES[priority] * 50;
      const delay = isDegraded ? baseDelay * 2 : baseDelay;
      
      if (now - lastCall >= delay) {
        lastCall = now;
        callback();
      }
    };
  }

  // Debounce animation cleanup
  static debounceCleanup(callback: () => void, delay: number = 1000): () => void {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
  }

  // Optimize animation based on device capabilities
  static optimizeForDevice(animationConfig: {
    duration: number;
    complexity: number; // 1-10 scale
  }): {
    duration: number;
    complexity: number;
    reducedMotion: boolean;
  } {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let durationMultiplier = 1;
    let complexityReduction = 0;
    
    if (isMobile) {
      durationMultiplier = 0.8;
      complexityReduction = 2;
    }
    
    if (prefersReduced) {
      durationMultiplier = 0.5;
      complexityReduction = 5;
    }
    
    return {
      duration: animationConfig.duration * durationMultiplier,
      complexity: Math.max(1, animationConfig.complexity - complexityReduction),
      reducedMotion: prefersReduced,
    };
  }
}

// Export singleton instance
export const performanceMonitor = AnimationPerformanceMonitor.getInstance();