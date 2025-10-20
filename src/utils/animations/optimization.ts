/**
 * Animation optimization utilities
 * Provides hardware acceleration helpers, animation pooling, and memory management
 */

import { AnimationQualitySettings } from './performance';

// Animation pool interface
interface PooledAnimation {
  id: string;
  element: HTMLElement;
  animation: Animation;
  startTime: number;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  isInUse: boolean;
}

// Animation optimization options
interface OptimizationOptions {
  enableHardwareAcceleration?: boolean;
  enablePooling?: boolean;
  maxPoolSize?: number;
  enableMemoryManagement?: boolean;
  memoryThreshold?: number; // MB
}

// Optimized animation config
interface OptimizedAnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterations: number | 'infinite';
  useHardwareAcceleration: boolean;
  willChange?: string;
}

// Animation frame manager
class AnimationFrameManager {
  private static instance: AnimationFrameManager;
  private activeFrames: Set<number> = new Set();
  private frameCallbacks: Map<number, () => void> = new Map();
  
  static getInstance(): AnimationFrameManager {
    if (!AnimationFrameManager.instance) {
      AnimationFrameManager.instance = new AnimationFrameManager();
    }
    return AnimationFrameManager.instance;
  }
  
  requestFrame(callback: () => void): number {
    const frameId = requestAnimationFrame((timestamp) => {
      callback();
      this.activeFrames.delete(frameId);
      this.frameCallbacks.delete(frameId);
    });
    
    this.activeFrames.add(frameId);
    this.frameCallbacks.set(frameId, callback);
    return frameId;
  }
  
  cancelFrame(frameId: number): void {
    cancelAnimationFrame(frameId);
    this.activeFrames.delete(frameId);
    this.frameCallbacks.delete(frameId);
  }
  
  cancelAllFrames(): void {
    this.activeFrames.forEach(frameId => {
      cancelAnimationFrame(frameId);
    });
    this.activeFrames.clear();
    this.frameCallbacks.clear();
  }
  
  getActiveFrameCount(): number {
    return this.activeFrames.size;
  }
}

// Animation pool manager
class AnimationPoolManager {
  private static instance: AnimationPoolManager;
  private pool: Map<string, PooledAnimation[]> = new Map();
  private maxPoolSize: number = 50;
  
  static getInstance(): AnimationPoolManager {
    if (!AnimationPoolManager.instance) {
      AnimationPoolManager.instance = new AnimationPoolManager();
    }
    return AnimationPoolManager.instance;
  }
  
  setMaxPoolSize(size: number): void {
    this.maxPoolSize = size;
    this.trimPool();
  }
  
  getAnimation(type: string, element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions): PooledAnimation | null {
    const poolKey = this.getPoolKey(type, keyframes, options);
    const animations = this.pool.get(poolKey) || [];
    
    // Find an unused animation
    const availableAnimation = animations.find(anim => !anim.isInUse);
    
    if (availableAnimation) {
      availableAnimation.isInUse = true;
      availableAnimation.startTime = performance.now();
      return availableAnimation;
    }
    
    // Create new animation if pool is not full
    if (animations.length < this.maxPoolSize) {
      const animation = element.animate(keyframes, options);
      const pooledAnimation: PooledAnimation = {
        id: `${poolKey}-${Date.now()}`,
        element,
        animation,
        startTime: performance.now(),
        duration: options.duration as number || 300,
        priority: 'medium',
        isInUse: true,
      };
      
      animations.push(pooledAnimation);
      this.pool.set(poolKey, animations);
      
      return pooledAnimation;
    }
    
    return null;
  }
  
  releaseAnimation(animation: PooledAnimation): void {
    animation.isInUse = false;
    animation.animation.cancel();
  }
  
  clearPool(): void {
    this.pool.forEach(animations => {
      animations.forEach(anim => {
        anim.animation.cancel();
      });
    });
    this.pool.clear();
  }
  
  private getPoolKey(type: string, keyframes: Keyframe[], options: KeyframeAnimationOptions): string {
    const keyframeString = JSON.stringify(keyframes);
    const optionsString = JSON.stringify(options);
    return `${type}-${keyframeString}-${optionsString}`;
  }
  
  private trimPool(): void {
    this.pool.forEach((animations, poolKey) => {
      if (animations.length > this.maxPoolSize) {
        // Remove oldest unused animations
        const unusedAnimations = animations.filter(anim => !anim.isInUse);
        const toRemove = unusedAnimations.slice(0, animations.length - this.maxPoolSize);
        
        toRemove.forEach(anim => {
          anim.animation.cancel();
          const index = animations.indexOf(anim);
          if (index > -1) {
            animations.splice(index, 1);
          }
        });
        
        this.pool.set(poolKey, animations);
      }
    });
  }
  
  getPoolStats(): { totalAnimations: number; activeAnimations: number; poolTypes: number } {
    let totalAnimations = 0;
    let activeAnimations = 0;
    
    this.pool.forEach(animations => {
      totalAnimations += animations.length;
      activeAnimations += animations.filter(anim => anim.isInUse).length;
    });
    
    return {
      totalAnimations,
      activeAnimations,
      poolTypes: this.pool.size,
    };
  }
}

// Memory manager for animations
class AnimationMemoryManager {
  private static instance: AnimationMemoryManager;
  private memoryThreshold: number = 100; // MB
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  static getInstance(): AnimationMemoryManager {
    if (!AnimationMemoryManager.instance) {
      AnimationMemoryManager.instance = new AnimationMemoryManager();
    }
    return AnimationMemoryManager.instance;
  }
  
  setMemoryThreshold(threshold: number): void {
    this.memoryThreshold = threshold;
  }
  
  startMonitoring(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, 5000); // Check every 5 seconds
  }
  
  stopMonitoring(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  private checkMemoryUsage(): void {
    const memoryUsage = this.getMemoryUsage();
    
    if (memoryUsage > this.memoryThreshold) {
      this.performCleanup();
    }
  }
  
  private getMemoryUsage(): number {
    if ('memory' in performance) {
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
  
  private performCleanup(): void {
    // Clear animation pool
    AnimationPoolManager.getInstance().clearPool();
    
    // Cancel all animation frames
    AnimationFrameManager.getInstance().cancelAllFrames();
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as { gc?: () => void }).gc?.();
    }
  }
}

// Hardware acceleration utilities
export class HardwareAccelerationOptimizer {
  // Apply optimal hardware acceleration properties
  static applyOptimalAcceleration(
    element: HTMLElement,
    properties: string[] = ['transform', 'opacity']
  ): void {
    if (!element) return;
    
    // Apply will-change property
    element.style.willChange = properties.join(', ');
    
    // Force hardware acceleration with transform3d
    if (!element.style.transform || element.style.transform === 'none') {
      element.style.transform = 'translateZ(0)';
    }
    
    // Optimize for compositing
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    
    // Ensure proper layer creation
    element.style.transformStyle = 'preserve-3d';
  }
  
  // Remove hardware acceleration properties
  static removeAcceleration(element: HTMLElement): void {
    if (!element) return;
    
    element.style.willChange = 'auto';
    
    // Only remove transform if it's just our hardware acceleration
    if (element.style.transform === 'translateZ(0)') {
      element.style.transform = '';
    }
    
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
    element.style.transformStyle = '';
  }
  
  // Check if element is hardware accelerated
  static isAccelerated(element: HTMLElement): boolean {
    if (!element) return false;
    
    const computedStyle = window.getComputedStyle(element);
    const willChange = computedStyle.willChange;
    const transform = computedStyle.transform;
    
    return (
      willChange.includes('transform') ||
      willChange.includes('opacity') ||
      Boolean(transform && transform !== 'none')
    );
  }
  
  // Get optimal animation properties based on device
  static getOptimalProperties(quality: AnimationQualitySettings): {
    willChange: string[];
    useTransform3d: boolean;
    enableFilterOptimization: boolean;
  } {
    return {
      willChange: quality.useHardwareAcceleration ? ['transform', 'opacity'] : [],
      useTransform3d: quality.useHardwareAcceleration,
      enableFilterOptimization: quality.quality !== 'low',
    };
  }
}

// Animation optimization utilities
export class AnimationOptimizer {
  private static frameManager = AnimationFrameManager.getInstance();
  private static poolManager = AnimationPoolManager.getInstance();
  private static memoryManager = AnimationMemoryManager.getInstance();
  
  // Initialize optimization system
  static initialize(options: OptimizationOptions = {}): void {
    if (options.enablePooling !== false) {
      this.poolManager.setMaxPoolSize(options.maxPoolSize || 50);
    }
    
    if (options.enableMemoryManagement !== false) {
      this.memoryManager.setMemoryThreshold(options.memoryThreshold || 100);
      this.memoryManager.startMonitoring();
    }
  }
  
  // Create optimized animation
  static createOptimizedAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
    quality: AnimationQualitySettings,
    type: string = 'default'
  ): Animation | null {
    // Optimize keyframes based on quality
    const optimizedKeyframes = this.optimizeKeyframes(keyframes, quality);
    
    // Optimize options based on quality
    const optimizedOptions = this.optimizeOptions(options, quality);
    
    // Try to get from pool
    if (quality.quality !== 'high') {
      const pooledAnimation = this.poolManager.getAnimation(type, element, optimizedKeyframes, optimizedOptions);
      if (pooledAnimation) {
        return pooledAnimation.animation;
      }
    }
    
    // Create new animation
    return element.animate(optimizedKeyframes, optimizedOptions);
  }
  
  // Optimize keyframes based on quality settings
  static optimizeKeyframes(keyframes: Keyframe[], quality: AnimationQualitySettings): Keyframe[] {
    if (quality.quality === 'high') return keyframes;
    
    return keyframes.map(keyframe => {
      const optimizedKeyframe: Keyframe = { ...keyframe };
      
      // Remove complex properties for low quality
      if (quality.quality === 'low') {
        delete optimizedKeyframe.filter;
        delete (optimizedKeyframe as Keyframe & { backdropFilter?: string }).backdropFilter;
        
        // Simplify easing
        if (optimizedKeyframe.easing && optimizedKeyframe.easing !== 'linear') {
          optimizedKeyframe.easing = 'ease-out';
        }
      }
      
      return optimizedKeyframe;
    });
  }
  
  // Optimize animation options based on quality
  static optimizeOptions(options: KeyframeAnimationOptions, quality: AnimationQualitySettings): KeyframeAnimationOptions {
    const optimizedOptions: KeyframeAnimationOptions = { ...options };
    
    // Adjust duration
    const durationMultiplier = quality.quality === 'low' ? 0.7 : 
                              quality.quality === 'medium' ? 0.85 : 1;
    optimizedOptions.duration = (options.duration as number || 300) * durationMultiplier;
    
    // Simplify easing
    if (quality.quality === 'low' && optimizedOptions.easing) {
      optimizedOptions.easing = 'ease-out';
    }
    
    return optimizedOptions;
  }
  
  // Apply hardware acceleration to element
  static applyHardwareAcceleration(element: HTMLElement, quality: AnimationQualitySettings): void {
    if (quality.useHardwareAcceleration) {
      const properties = HardwareAccelerationOptimizer.getOptimalProperties(quality);
      HardwareAccelerationOptimizer.applyOptimalAcceleration(element, properties.willChange);
    }
  }
  
  // Remove hardware acceleration from element
  static removeHardwareAcceleration(element: HTMLElement): void {
    HardwareAccelerationOptimizer.removeAcceleration(element);
  }
  
  // Request optimized animation frame
  static requestAnimationFrame(callback: () => void): number {
    return this.frameManager.requestFrame(callback);
  }
  
  // Cancel animation frame
  static cancelAnimationFrame(frameId: number): void {
    this.frameManager.cancelFrame(frameId);
  }
  
  // Get optimization statistics
  static getOptimizationStats(): {
    activeFrames: number;
    poolStats: { totalAnimations: number; activeAnimations: number; poolTypes: number };
    memoryUsage: number;
  } {
    const memoryUsage = this.memoryManager['getMemoryUsage']();
    
    return {
      activeFrames: this.frameManager.getActiveFrameCount(),
      poolStats: this.poolManager.getPoolStats(),
      memoryUsage,
    };
  }
  
  // Cleanup resources
  static cleanup(): void {
    this.frameManager.cancelAllFrames();
    this.poolManager.clearPool();
    this.memoryManager.stopMonitoring();
  }
}

// Export singleton instances
export const frameManager = AnimationFrameManager.getInstance();
export const poolManager = AnimationPoolManager.getInstance();
export const memoryManager = AnimationMemoryManager.getInstance();

// Export convenience functions
export const createOptimizedAnimation = AnimationOptimizer.createOptimizedAnimation.bind(AnimationOptimizer);
export const applyHardwareAcceleration = HardwareAccelerationOptimizer.applyOptimalAcceleration.bind(HardwareAccelerationOptimizer);
export const removeHardwareAcceleration = HardwareAccelerationOptimizer.removeAcceleration.bind(HardwareAccelerationOptimizer);
export const requestOptimizedFrame = AnimationOptimizer.requestAnimationFrame.bind(AnimationOptimizer);
export const cancelOptimizedFrame = AnimationOptimizer.cancelAnimationFrame.bind(AnimationOptimizer);