/**
 * Animation testing utilities for Bistro Bert
 * Provides performance benchmarking, consistency validation, and visual regression testing
 */

import { AnimationPerformanceMonitor, PerformanceMetrics } from './performance';
import { ANIMATION_DURATIONS, ANIMATION_CATEGORIES, EASING } from './constants';
import { AccessibilityAnimationAdapter, SafeAnimationProps } from './accessibility';

// Test result interface
export interface AnimationTestResult {
  testName: string;
  passed: boolean;
  duration: number;
  metrics: PerformanceMetrics;
  issues: string[];
  recommendations: string[];
  timestamp: number;
}

// Animation consistency test result
export interface ConsistencyTestResult {
  testName: string;
  passed: boolean;
  inconsistencies: {
    property: string;
    expected: unknown;
    actual: unknown;
    severity: 'low' | 'medium' | 'high';
  }[];
  timestamp: number;
}

// Visual regression test result
export interface VisualRegressionTestResult {
  testName: string;
  passed: boolean;
  baselineHash?: string;
  currentHash?: string;
  difference?: number; // 0-1 scale
  timestamp: number;
}

// Animation benchmark configuration
export interface BenchmarkConfig {
  iterations: number;
  warmupIterations: number;
  testDuration: number; // ms
  targetFPS: number;
  complexity: 'low' | 'medium' | 'high';
  deviceTier: 'low' | 'medium' | 'high';
}

// Animation test suite configuration
export interface TestSuiteConfig {
  enablePerformanceTests: boolean;
  enableConsistencyTests: boolean;
  enableVisualRegressionTests: boolean;
  enableAccessibilityTests: boolean;
  benchmarkConfig: BenchmarkConfig;
  testTimeout: number; // ms
  retryFailedTests: number;
}

// Animation testing utilities class
export class AnimationTestingUtils {
  private static performanceMonitor = AnimationPerformanceMonitor.getInstance();
  private static testResults: Map<string, AnimationTestResult[]> = new Map();
  private static baselineImages: Map<string, string> = new Map();

  // Run performance benchmark for an animation
  static async runPerformanceBenchmark(
    animationName: string,
    animationFunction: () => Promise<void> | void,
    config: Partial<BenchmarkConfig> = {}
  ): Promise<AnimationTestResult> {
    const finalConfig: BenchmarkConfig = {
      iterations: 10,
      warmupIterations: 3,
      testDuration: 5000,
      targetFPS: 60,
      complexity: 'medium',
      deviceTier: 'medium',
      ...config,
    };

    const startTime = performance.now();
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Warmup iterations
      for (let i = 0; i < finalConfig.warmupIterations; i++) {
        await animationFunction();
        await this.wait(100); // Brief pause between iterations
      }

      // Start performance monitoring
      this.performanceMonitor.startMonitoring(animationName);

      // Run test iterations
      const iterationPromises: Promise<void>[] = [];
      for (let i = 0; i < finalConfig.iterations; i++) {
        iterationPromises.push(this.runIteration(animationFunction, i * 100));
      }

      await Promise.all(iterationPromises);

      // Stop monitoring and get metrics
      const metrics = this.performanceMonitor.stopMonitoring(animationName);
      const duration = performance.now() - startTime;

      if (!metrics) {
        throw new Error('Failed to collect performance metrics');
      }

      // Analyze results
      if (metrics.frameRate < finalConfig.targetFPS * 0.8) {
        issues.push(`Frame rate below target: ${metrics.frameRate.toFixed(1)}fps < ${finalConfig.targetFPS}fps`);
        recommendations.push('Consider reducing animation complexity or duration');
      }

      if (metrics.droppedFrames > metrics.totalFrames * 0.1) {
        issues.push(`High dropped frame rate: ${(metrics.droppedFrames / metrics.totalFrames * 100).toFixed(1)}%`);
        recommendations.push('Optimize animation for better performance');
      }

      if (metrics.animationDuration > finalConfig.testDuration * 1.2) {
        issues.push(`Animation duration exceeded expected: ${metrics.animationDuration}ms`);
        recommendations.push('Check for animation blocking or infinite loops');
      }

      const passed = issues.length === 0;

      const result: AnimationTestResult = {
        testName: animationName,
        passed,
        duration,
        metrics,
        issues,
        recommendations,
        timestamp: Date.now(),
      };

      this.storeTestResult(animationName, result);
      return result;

    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        testName: animationName,
        passed: false,
        duration,
        metrics: {
          frameRate: 0,
          frameTime: 0,
          droppedFrames: 0,
          totalFrames: 0,
          animationDuration: duration,
        },
        issues: [`Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        recommendations: ['Check animation implementation and test configuration'],
        timestamp: Date.now(),
      };
    }
  }

  // Test animation consistency across different states
  static async testAnimationConsistency(
    animationName: string,
    variants: Record<string, unknown>,
    expectedProperties: string[]
  ): Promise<ConsistencyTestResult> {
    const inconsistencies: {
      property: string;
      expected: unknown;
      actual: unknown;
      severity: 'low' | 'medium' | 'high';
    }[] = [];

    try {
      // Test each variant
      for (const [variantName, variant] of Object.entries(variants)) {
        if (typeof variant === 'object' && variant !== null) {
          const variantObj = variant as Record<string, unknown>;
          
          // Check expected properties
          for (const property of expectedProperties) {
            if (variantObj[property] === undefined) {
              inconsistencies.push({
                property: `${variantName}.${property}`,
                expected: 'defined',
                actual: 'undefined',
                severity: 'medium',
              });
            }
          }

          // Check transition consistency
          if (variantObj.transition) {
            const transition = variantObj.transition as Record<string, unknown>;
            if (typeof transition.duration !== 'number' || transition.duration <= 0) {
              inconsistencies.push({
                property: `${variantName}.transition.duration`,
                expected: 'positive number',
                actual: transition.duration,
                severity: 'high',
              });
            }

            if (transition.ease && typeof transition.ease !== 'string' && !Array.isArray(transition.ease)) {
              inconsistencies.push({
                property: `${variantName}.transition.ease`,
                expected: 'string or array',
                actual: typeof transition.ease,
                severity: 'medium',
              });
            }
          }
        }
      }

      // Check for consistent easing functions
      const easingFunctions = Object.values(variants)
        .filter(variant => {
          if (typeof variant === 'object' && variant !== null) {
            const variantObj = variant as Record<string, unknown>;
            return variantObj.transition && typeof variantObj.transition === 'object' &&
                   (variantObj.transition as Record<string, unknown>).ease;
          }
          return false;
        })
        .map(variant => {
          const variantObj = variant as Record<string, unknown>;
          const transition = variantObj.transition as Record<string, unknown>;
          return transition.ease;
        });

      if (easingFunctions.length > 1) {
        const firstEasing = easingFunctions[0];
        const hasInconsistentEasing = easingFunctions.some(easing => 
          JSON.stringify(easing) !== JSON.stringify(firstEasing)
        );

        if (hasInconsistentEasing) {
          inconsistencies.push({
            property: 'easing consistency',
            expected: 'consistent easing across variants',
            actual: 'inconsistent easing detected',
            severity: 'low',
          });
        }
      }

      const passed = inconsistencies.length === 0;

      return {
        testName: animationName,
        passed,
        inconsistencies,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        testName: animationName,
        passed: false,
        inconsistencies: [{
          property: 'test execution',
          expected: 'successful completion',
          actual: error instanceof Error ? error.message : 'Unknown error',
          severity: 'high',
        }],
        timestamp: Date.now(),
      };
    }
  }

  // Test visual regression for animations
  static async testVisualRegression(
    animationName: string,
    element: HTMLElement,
    animationFunction: () => Promise<void> | void,
    captureFrames: number = 5
  ): Promise<VisualRegressionTestResult> {
    try {
      // Capture baseline if not exists
      const baselineHash = this.baselineImages.get(animationName);
      
      // Setup canvas for image capture
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const rect = element.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Capture frames during animation
      const frames: string[] = [];
      const frameInterval = 1000 / 60; // 60fps
      let frameCount = 0;

      const captureFrame = () => {
        if (frameCount >= captureFrames) return;
        
        // Draw element to canvas
        ctx.drawImage(element as HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, 0, 0, rect.width, rect.height);
        const frameData = canvas.toDataURL();
        frames.push(frameData);
        frameCount++;
      };

      // Start animation and capture frames
      const animationPromise = animationFunction();
      const captureInterval = setInterval(captureFrame, frameInterval);

      await animationPromise;
      clearInterval(captureInterval);

      // Generate hash from frames
      const currentHash = await this.generateImageHash(frames);

      // Compare with baseline
      let difference: number | undefined;
      let passed = false;

      if (baselineHash) {
        difference = this.compareImageHashes(baselineHash, currentHash);
        passed = difference < 0.05; // 5% threshold
      } else {
        // Store as baseline if none exists
        this.baselineImages.set(animationName, currentHash);
        passed = true;
      }

      return {
        testName: animationName,
        passed,
        baselineHash,
        currentHash,
        difference,
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        testName: animationName,
        passed: false,
        issues: [`Visual regression test failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        timestamp: Date.now(),
      } as VisualRegressionTestResult;
    }
  }

  // Test animation accessibility
  static testAnimationAccessibility(
    animationName: string,
    animationProps: SafeAnimationProps
  ): Promise<AnimationTestResult> {
    return new Promise((resolve) => {
      try {
        const startTime = performance.now();
        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check accessibility with the adapter
        const accessibilityCheck = AccessibilityAnimationAdapter.isAnimationSafe(animationProps);

        if (!accessibilityCheck.isSafe) {
          issues.push(...accessibilityCheck.issues);
          recommendations.push(...accessibilityCheck.recommendations);
        }

        // Check for reduced motion considerations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion && animationProps.transition && animationProps.transition.duration && animationProps.transition.duration > 0.1) {
          issues.push('Animation duration may be too long for reduced motion preference');
          recommendations.push('Consider reducing duration to under 0.1s for reduced motion users');
        }

        // Check for complex animations that might cause issues
        if (animationProps.variants) {
          const hasComplexProperties = Object.values(animationProps.variants).some(variant => {
            if (typeof variant === 'object' && variant !== null) {
              const complexProps = ['filter', 'backdropFilter', 'clipPath', 'mask'];
              return complexProps.some(prop => (variant as Record<string, unknown>)[prop] !== undefined);
            }
            return false;
          });

          if (hasComplexProperties) {
            issues.push('Complex animation properties detected that may cause accessibility issues');
            recommendations.push('Consider simplifying animations for better accessibility');
          }
        }

        const duration = performance.now() - startTime;
        const passed = issues.length === 0;

        resolve({
          testName: `${animationName} - Accessibility`,
          passed,
          duration,
          metrics: {
            frameRate: 60, // Accessibility tests don't measure performance
            frameTime: 16.67,
            droppedFrames: 0,
            totalFrames: 1,
            animationDuration: duration,
          },
          issues,
          recommendations,
          timestamp: Date.now(),
        });

      } catch (error) {
        resolve({
          testName: `${animationName} - Accessibility`,
          passed: false,
          duration: 0,
          metrics: {
            frameRate: 0,
            frameTime: 0,
            droppedFrames: 0,
            totalFrames: 0,
            animationDuration: 0,
          },
          issues: [`Accessibility test failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          recommendations: ['Check animation implementation'],
          timestamp: Date.now(),
        });
      }
    });
  }

  // Run comprehensive test suite
  static async runTestSuite(
    testSuiteName: string,
    tests: Array<{
      name: string;
      type: 'performance' | 'consistency' | 'visual' | 'accessibility';
      testFunction: () => Promise<unknown>;
    }>,
    config: Partial<TestSuiteConfig> = {}
  ): Promise<{
    suiteName: string;
    results: AnimationTestResult[];
    summary: {
      total: number;
      passed: number;
      failed: number;
      duration: number;
    };
  }> {
    const finalConfig: TestSuiteConfig = {
      enablePerformanceTests: true,
      enableConsistencyTests: true,
      enableVisualRegressionTests: true,
      enableAccessibilityTests: true,
      benchmarkConfig: {
        iterations: 5,
        warmupIterations: 2,
        testDuration: 3000,
        targetFPS: 60,
        complexity: 'medium',
        deviceTier: 'medium',
      },
      testTimeout: 10000,
      retryFailedTests: 1,
      ...config,
    };

    const startTime = performance.now();
    const results: AnimationTestResult[] = [];

    for (const test of tests) {
      // Skip disabled test types
      if (test.type === 'performance' && !finalConfig.enablePerformanceTests) continue;
      if (test.type === 'consistency' && !finalConfig.enableConsistencyTests) continue;
      if (test.type === 'visual' && !finalConfig.enableVisualRegressionTests) continue;
      if (test.type === 'accessibility' && !finalConfig.enableAccessibilityTests) continue;

      let attempts = 0;
      let lastError: Error | null = null;

      while (attempts <= finalConfig.retryFailedTests) {
        try {
          const result = await Promise.race([
            test.testFunction(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Test timeout')), finalConfig.testTimeout)
            )
          ]);

          // Type guard to ensure result is AnimationTestResult
          if (this.isAnimationTestResult(result)) {
            results.push(result);
          } else {
            // Convert unknown result to AnimationTestResult
            results.push({
              testName: test.name,
              passed: false,
              duration: 0,
              metrics: {
                frameRate: 0,
                frameTime: 0,
                droppedFrames: 0,
                totalFrames: 0,
                animationDuration: 0,
              },
              issues: ['Test returned unexpected result type'],
              recommendations: ['Check test implementation'],
              timestamp: Date.now(),
            });
          }
          break; // Test passed, exit retry loop

        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          attempts++;

          if (attempts > finalConfig.retryFailedTests) {
            // Test failed after all retries
            results.push({
              testName: test.name,
              passed: false,
              duration: 0,
              metrics: {
                frameRate: 0,
                frameTime: 0,
                droppedFrames: 0,
                totalFrames: 0,
                animationDuration: 0,
              },
              issues: [`Test failed: ${lastError.message}`],
              recommendations: ['Check test implementation and configuration'],
              timestamp: Date.now(),
            });
          }
        }
      }
    }

    const duration = performance.now() - startTime;
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;

    return {
      suiteName: testSuiteName,
      results,
      summary: {
        total: results.length,
        passed,
        failed,
        duration,
      },
    };
  }

  // Get test results for a specific test
  static getTestResults(testName: string): AnimationTestResult[] {
    return this.testResults.get(testName) || [];
  }

  // Get all test results
  static getAllTestResults(): Map<string, AnimationTestResult[]> {
    return new Map(this.testResults);
  }

  // Clear test results
  static clearTestResults(): void {
    this.testResults.clear();
  }

  // Clear baseline images
  static clearBaselineImages(): void {
    this.baselineImages.clear();
  }

  // Export test results as JSON
  static exportTestResults(): string {
    const results: Record<string, AnimationTestResult[]> = {};
    this.testResults.forEach((testResults, testName) => {
      results[testName] = testResults;
    });
    return JSON.stringify(results, null, 2);
  }

  // Private helper methods
  private static async runIteration(
    animationFunction: () => Promise<void> | void,
    delay: number
  ): Promise<void> {
    if (delay > 0) {
      await this.wait(delay);
    }
    await animationFunction();
  }

  private static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async generateImageHash(frames: string[]): Promise<string> {
    // Simple hash generation from frame data
    const combinedFrames = frames.join('');
    let hash = 0;
    
    for (let i = 0; i < combinedFrames.length; i++) {
      const char = combinedFrames.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  private static compareImageHashes(hash1: string, hash2: string): number {
    // Simple comparison - in a real implementation, you'd use proper image diffing
    if (hash1 === hash2) return 0;
    
    // Convert to numbers for comparison
    const num1 = parseInt(hash1, 16);
    const num2 = parseInt(hash2, 16);
    
    const max = Math.max(num1, num2);
    const diff = Math.abs(num1 - num2);
    
    return max > 0 ? diff / max : 0;
  }

  private static storeTestResult(testName: string, result: AnimationTestResult): void {
    if (!this.testResults.has(testName)) {
      this.testResults.set(testName, []);
    }
    this.testResults.get(testName)!.push(result);
  }

  // Type guard for AnimationTestResult
  private static isAnimationTestResult(obj: unknown): obj is AnimationTestResult {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'testName' in obj &&
      'passed' in obj &&
      'duration' in obj &&
      'metrics' in obj &&
      'timestamp' in obj
    );
  }
}

// Convenience functions for common test scenarios
export const testAnimationPerformance = AnimationTestingUtils.runPerformanceBenchmark.bind(AnimationTestingUtils);
export const testAnimationConsistency = AnimationTestingUtils.testAnimationConsistency.bind(AnimationTestingUtils);
export const testVisualRegression = AnimationTestingUtils.testVisualRegression.bind(AnimationTestingUtils);
export const testAnimationAccessibility = AnimationTestingUtils.testAnimationAccessibility.bind(AnimationTestingUtils);
export const runAnimationTestSuite = AnimationTestingUtils.runTestSuite.bind(AnimationTestingUtils);

// Default test configurations
export const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
  iterations: 10,
  warmupIterations: 3,
  testDuration: 5000,
  targetFPS: 60,
  complexity: 'medium',
  deviceTier: 'medium',
};

export const DEFAULT_TEST_SUITE_CONFIG: TestSuiteConfig = {
  enablePerformanceTests: true,
  enableConsistencyTests: true,
  enableVisualRegressionTests: true,
  enableAccessibilityTests: true,
  benchmarkConfig: DEFAULT_BENCHMARK_CONFIG,
  testTimeout: 10000,
  retryFailedTests: 1,
};

// Test presets for different animation types
export const ANIMATION_TEST_PRESETS = {
  microInteraction: {
    benchmarkConfig: {
      ...DEFAULT_BENCHMARK_CONFIG,
      iterations: 20,
      testDuration: 2000,
      complexity: 'low',
    },
  },
  pageTransition: {
    benchmarkConfig: {
      ...DEFAULT_BENCHMARK_CONFIG,
      iterations: 5,
      testDuration: 3000,
      complexity: 'medium',
    },
  },
  complexAnimation: {
    benchmarkConfig: {
      ...DEFAULT_BENCHMARK_CONFIG,
      iterations: 3,
      testDuration: 8000,
      complexity: 'high',
    },
  },
} as const;