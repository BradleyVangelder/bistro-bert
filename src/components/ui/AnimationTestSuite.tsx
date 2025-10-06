/**
 * Comprehensive animation test suite for Bistro Bert
 * Provides visual tests, performance tests, and accessibility tests for all animation components
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  AnimationTestingUtils, 
  AnimationTestResult, 
  TestSuiteConfig, 
  DEFAULT_TEST_SUITE_CONFIG,
  ANIMATION_TEST_PRESETS,
  BenchmarkConfig
} from '@/utils/animations/testing';
import { performanceMonitor } from '@/utils/animations/performance';
import { ANIMATION_PRESETS } from '@/utils/animations/presets';
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants';

// Test types
type TestType = 'performance' | 'consistency' | 'visual' | 'accessibility' | 'all';

// Device simulation presets
interface DevicePreset {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  userAgent: string;
  capabilities: {
    hardwareAcceleration: boolean;
    maxConcurrentAnimations: number;
    preferredFrameRate: number;
  };
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    name: 'High-end Desktop',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    capabilities: {
      hardwareAcceleration: true,
      maxConcurrentAnimations: 8,
      preferredFrameRate: 60,
    },
  },
  {
    name: 'Standard Laptop',
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    capabilities: {
      hardwareAcceleration: true,
      maxConcurrentAnimations: 6,
      preferredFrameRate: 60,
    },
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    capabilities: {
      hardwareAcceleration: true,
      maxConcurrentAnimations: 4,
      preferredFrameRate: 60,
    },
  },
  {
    name: 'Mobile',
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    capabilities: {
      hardwareAcceleration: true,
      maxConcurrentAnimations: 3,
      preferredFrameRate: 30,
    },
  },
];

// Test suite component
export const AnimationTestSuite: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [testResults, setTestResults] = useState<AnimationTestResult[]>([]);
  const [selectedTests, setSelectedTests] = useState<TestType>('all');
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [testConfig, setTestConfig] = useState<TestSuiteConfig>(DEFAULT_TEST_SUITE_CONFIG);
  const [showDetails, setShowDetails] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    performanceScore: number;
    deviceCapabilities: {
      gpuTier: string;
    };
    recommendations: string[];
  } | null>(null);
  
  const testContainerRef = useRef<HTMLDivElement>(null);
  const testElementRef = useRef<HTMLDivElement>(null);

  // Animation test cases
  const animationTestCases = [
    {
      name: 'Button Hover Animation',
      type: 'microInteraction' as const,
      component: 'AnimatedButton',
      testFunction: () => testButtonAnimation(),
    },
    {
      name: 'Card Hover Animation',
      type: 'microInteraction' as const,
      component: 'LuxuryCard',
      testFunction: () => testCardAnimation(),
    },
    {
      name: 'Page Transition',
      type: 'pageTransition' as const,
      component: 'PageTransition',
      testFunction: () => testPageTransition(),
    },
    {
      name: 'Staggered List Animation',
      type: 'staggered' as const,
      component: 'StaggeredAnimations',
      testFunction: () => testStaggeredAnimation(),
    },
    {
      name: 'Modal Animation',
      type: 'modal' as const,
      component: 'LuxuryModal',
      testFunction: () => testModalAnimation(),
    },
    {
      name: 'Dropdown Animation',
      type: 'dropdown' as const,
      component: 'LuxuryDropdown',
      testFunction: () => testDropdownAnimation(),
    },
  ];

  // Test functions for different animation types
  const testButtonAnimation = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <button style="padding: 12px 24px; background: #000; color: white; border: none; border-radius: 4px;">
        Test Button
      </button>
    `;
    
    const button = element.querySelector('button') as HTMLButtonElement;
    
    // Test hover animation
    const hoverAnimation = async () => {
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 300));
      button.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 300));
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Button Hover',
      hoverAnimation,
      ANIMATION_TEST_PRESETS.microInteraction.benchmarkConfig
    );
  };

  const testCardAnimation = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; width: 200px; height: 150px;">
        <h3>Test Card</h3>
        <p>Card content for animation testing</p>
      </div>
    `;
    
    const card = element.firstElementChild as HTMLElement;
    
    // Test card hover animation
    const cardAnimation = async () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      await new Promise(resolve => setTimeout(resolve, 400));
      card.style.transform = '';
      card.style.boxShadow = '';
      await new Promise(resolve => setTimeout(resolve, 400));
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Card Hover',
      cardAnimation,
      ANIMATION_TEST_PRESETS.microInteraction.benchmarkConfig
    );
  };

  const testPageTransition = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <div style="width: 100%; height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center;">
        <h2>Page Content</h2>
      </div>
    `;
    
    const content = element.firstElementChild as HTMLElement;
    
    // Test page transition animation
    const pageTransition = async () => {
      content.style.opacity = '0';
      content.style.transform = 'translateX(50px)';
      await new Promise(resolve => setTimeout(resolve, 100));
      
      content.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      content.style.opacity = '1';
      content.style.transform = 'translateX(0)';
      
      await new Promise(resolve => setTimeout(resolve, 700));
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Page Transition',
      pageTransition,
      ANIMATION_TEST_PRESETS.pageTransition.benchmarkConfig
    );
  };

  const testStaggeredAnimation = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <div style="display: flex; gap: 10px;">
        ${Array.from({ length: 5 }, (_, i) => `
          <div style="width: 40px; height: 40px; background: #333; border-radius: 4px; opacity: 0; transform: translateY(20px);"></div>
        `).join('')}
      </div>
    `;
    
    const items = element.querySelectorAll('div > div') as NodeListOf<HTMLElement>;
    
    // Test staggered animation
    const staggeredAnimation = async () => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.style.transition = 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        await new Promise(resolve => setTimeout(resolve, 100)); // Stagger delay
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
      });
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Staggered Animation',
      staggeredAnimation,
      ANIMATION_TEST_PRESETS.pageTransition.benchmarkConfig
    );
  };

  const testModalAnimation = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <div style="position: relative; width: 100%; height: 200px;">
        <div id="backdrop" style="position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s ease;"></div>
        <div id="modal" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); opacity: 0; background: white; padding: 20px; border-radius: 8px; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);">
          <h3>Modal Content</h3>
          <p>This is a test modal</p>
        </div>
      </div>
    `;
    
    const backdrop = element.querySelector('#backdrop') as HTMLElement;
    const modal = element.querySelector('#modal') as HTMLElement;
    
    // Test modal animation
    const modalAnimation = async () => {
      // Show modal
      backdrop.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Hide modal
      backdrop.style.opacity = '0';
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
      
      await new Promise(resolve => setTimeout(resolve, 400));
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Modal Animation',
      modalAnimation,
      ANIMATION_TEST_PRESETS.pageTransition.benchmarkConfig
    );
  };

  const testDropdownAnimation = async (): Promise<AnimationTestResult> => {
    if (!testElementRef.current) {
      throw new Error('Test element not available');
    }

    const element = testElementRef.current;
    element.innerHTML = `
      <div style="position: relative;">
        <button id="trigger" style="padding: 8px 16px; background: #333; color: white; border: none; border-radius: 4px;">
          Dropdown
        </button>
        <div id="dropdown" style="position: absolute; top: 100%; left: 0; margin-top: 4px; background: white; border: 1px solid #ccc; border-radius: 4px; padding: 8px; opacity: 0; transform: translateY(-10px); transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
        </div>
      </div>
    `;
    
    const trigger = element.querySelector('#trigger') as HTMLElement;
    const dropdown = element.querySelector('#dropdown') as HTMLElement;
    
    // Test dropdown animation
    const dropdownAnimation = async () => {
      // Show dropdown
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'translateY(0)';
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Hide dropdown
      dropdown.style.opacity = '0';
      dropdown.style.transform = 'translateY(-10px)';
      
      await new Promise(resolve => setTimeout(resolve, 300));
    };

    return AnimationTestingUtils.runPerformanceBenchmark(
      'Dropdown Animation',
      dropdownAnimation,
      ANIMATION_TEST_PRESETS.microInteraction.benchmarkConfig
    );
  };

  // Run selected tests
  const runTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest('Initializing tests...');
    
    try {
      // Get filtered test cases based on selection
      let filteredTests = animationTestCases;
      
      if (selectedTests !== 'all') {
        filteredTests = animationTestCases.filter(test => {
          switch (selectedTests) {
            case 'performance':
              return true; // All tests can run performance tests
            case 'consistency':
              return test.type === 'microInteraction';
            case 'visual':
              return test.type === 'pageTransition' || test.type === 'modal';
            case 'accessibility':
              return true; // All tests should be accessible
            default:
              return true;
          }
        });
      }

      // Run tests for each selected type
      const testsToRun = [];
      
      for (const testCase of filteredTests) {
        setCurrentTest(`Running ${testCase.name}...`);
        
        if (selectedTests === 'all' || selectedTests === 'performance') {
          testsToRun.push({
            name: `${testCase.name} - Performance`,
            type: 'performance' as const,
            testFunction: () => testCase.testFunction(),
          });
        }
        
        if (selectedTests === 'all' || selectedTests === 'accessibility') {
          testsToRun.push({
            name: `${testCase.name} - Accessibility`,
            type: 'accessibility' as const,
            testFunction: () => AnimationTestingUtils.testAnimationAccessibility(
              testCase.name,
              ANIMATION_PRESETS.microInteraction.buttonHover
            ),
          });
        }
      }

      // Run the test suite
      const results = await AnimationTestingUtils.runTestSuite(
        `Animation Test Suite - ${selectedDevice.name}`,
        testsToRun,
        testConfig
      );

      setTestResults(results.results);
      
      // Get performance insights
      const insights = performanceMonitor.getInsights();
      setPerformanceMetrics(insights);
      
    } catch (error) {
      console.error('Test suite error:', error);
      setTestResults([{
        testName: 'Test Suite Error',
        passed: false,
        duration: 0,
        metrics: {
          frameRate: 0,
          frameTime: 0,
          droppedFrames: 0,
          totalFrames: 0,
          animationDuration: 0,
        },
        issues: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Check test configuration and try again'],
        timestamp: Date.now(),
      }]);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  }, [selectedTests, selectedDevice, testConfig]);

  // Export test results
  const exportResults = () => {
    const resultsJson = AnimationTestingUtils.exportTestResults();
    const blob = new Blob([resultsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animation-test-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear results
  const clearResults = () => {
    setTestResults([]);
    setPerformanceMetrics(null);
    AnimationTestingUtils.clearTestResults();
  };

  // Update test config when device changes
  useEffect(() => {
    setTestConfig(prev => ({
      ...prev,
      benchmarkConfig: {
        ...prev.benchmarkConfig,
        targetFPS: selectedDevice.capabilities.preferredFrameRate,
      },
    }));
  }, [selectedDevice]);

  return (
    <div className="animation-test-suite" style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
          Animation Test Suite
        </h1>
        
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Comprehensive testing for animations across different device capabilities and user preferences.
        </p>

        {/* Test Configuration */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem' 
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Test Configuration</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {/* Test Type Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Test Type
              </label>
              <select 
                value={selectedTests} 
                onChange={(e) => setSelectedTests(e.target.value as TestType)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
                disabled={isRunning}
              >
                <option value="all">All Tests</option>
                <option value="performance">Performance Tests</option>
                <option value="consistency">Consistency Tests</option>
                <option value="visual">Visual Regression Tests</option>
                <option value="accessibility">Accessibility Tests</option>
              </select>
            </div>

            {/* Device Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Device Simulation
              </label>
              <select 
                value={selectedDevice.name} 
                onChange={(e) => {
                  const device = DEVICE_PRESETS.find(d => d.name === e.target.value);
                  if (device) setSelectedDevice(device);
                }}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
                disabled={isRunning}
              >
                {DEVICE_PRESETS.map(device => (
                  <option key={device.name} value={device.name}>
                    {device.name} ({device.capabilities.preferredFrameRate}fps)
                  </option>
                ))}
              </select>
            </div>

            {/* Test Iterations */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Test Iterations
              </label>
              <input 
                type="number" 
                min="1" 
                max="20" 
                value={testConfig.benchmarkConfig.iterations}
                onChange={(e) => setTestConfig(prev => ({
                  ...prev,
                  benchmarkConfig: {
                    ...prev.benchmarkConfig,
                    iterations: parseInt(e.target.value) || 5
                  }
                }))}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
                disabled={isRunning}
              />
            </div>

            {/* Test Timeout */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Test Timeout (ms)
              </label>
              <input 
                type="number" 
                min="1000" 
                max="30000" 
                step="1000"
                value={testConfig.testTimeout}
                onChange={(e) => setTestConfig(prev => ({
                  ...prev,
                  testTimeout: parseInt(e.target.value) || 10000
                }))}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={runTests}
              disabled={isRunning}
              style={{
                padding: '0.75rem 1.5rem',
                background: isRunning ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              {isRunning ? `Running: ${currentTest}` : 'Run Tests'}
            </button>
            
            <button 
              onClick={clearResults}
              disabled={isRunning}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Clear Results
            </button>
            
            <button 
              onClick={exportResults}
              disabled={testResults.length === 0}
              style={{
                padding: '0.75rem 1.5rem',
                background: testResults.length === 0 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: testResults.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Export Results
            </button>
            
            <button 
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>

        {/* Test Container */}
        <div 
          ref={testContainerRef}
          style={{ 
            background: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '2rem',
            marginBottom: '2rem',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            ref={testElementRef}
            style={{ 
              width: '100%', 
              maxWidth: '600px',
              transform: `scale(${selectedDevice.width / 1920})`,
              transformOrigin: 'top center',
            }}
          >
            {isRunning ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #f3f3f3', 
                  borderTop: '4px solid #007bff', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p>{currentTest}</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666' }}>
                <p>Test elements will appear here during testing</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Simulated device: {selectedDevice.name} ({selectedDevice.width}x{selectedDevice.height})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div style={{ 
            background: '#fff', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem' 
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Test Results</h2>
            
            {/* Results Summary */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem', 
              marginBottom: '1.5rem' 
            }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                  {testResults.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Tests</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#d4edda', borderRadius: '4px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  {testResults.filter(r => r.passed).length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Passed</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8d7da', borderRadius: '4px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                  {testResults.filter(r => !r.passed).length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Failed</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#856404' }}>
                  {Math.round(testResults.reduce((acc, r) => acc + r.metrics.frameRate, 0) / testResults.length)}fps
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Avg FPS</div>
              </div>
            </div>

            {/* Performance Metrics */}
            {performanceMetrics && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px', 
                marginBottom: '1.5rem' 
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Performance Insights</h3>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  <div>Performance Score: {performanceMetrics.performanceScore}/100</div>
                  <div>Device Tier: {performanceMetrics.deviceCapabilities.gpuTier}</div>
                  {performanceMetrics.recommendations.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Recommendations:</strong>
                      <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                        {performanceMetrics.recommendations.slice(0, 3).map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Results */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '1rem', 
                    border: '1px solid #eee', 
                    borderRadius: '4px', 
                    marginBottom: '0.5rem',
                    background: result.passed ? '#f8fff9' : '#fff8f8'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '0.5rem' 
                  }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      {result.testName}
                    </h4>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      background: result.passed ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  {showDetails && (
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      <div>Duration: {result.duration.toFixed(2)}ms</div>
                      <div>Frame Rate: {result.metrics.frameRate.toFixed(1)}fps</div>
                      <div>Dropped Frames: {result.metrics.droppedFrames}/{result.metrics.totalFrames}</div>
                      
                      {result.issues.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong>Issues:</strong>
                          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                            {result.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.recommendations.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong>Recommendations:</strong>
                          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                            {result.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimationTestSuite;