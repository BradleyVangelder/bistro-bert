'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LuxuryModal from './LuxuryModal'
import LuxuryDropdown from './LuxuryDropdown'
import LuxuryButton from './LuxuryButton'
import LuxuryTooltip from './LuxuryTooltip'
import AnimatedValidationMessage from './AnimatedValidationMessage'
import AnimatedButton from './AnimatedButton'
import LuxuryCard from './LuxuryCard'
import StaggeredAnimations from './StaggeredAnimations'
import { PageTransition } from './PageTransition'
import {
  ModalVariant
} from '@/hooks/animations/useModal'
import {
  DropdownVariant
} from '@/hooks/animations/useDropdown'
import { performanceMonitor } from '@/utils/animations/performance'
import { ANIMATION_PRESETS } from '@/utils/animations/presets'
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants'
import { AnimationTestingUtils } from '@/utils/animations/testing'

// Define DropdownItem interface locally
interface DropdownItem {
  id: string
  label: string
  value: string
  description?: string
  disabled?: boolean
  icon?: React.ReactNode
  divider?: boolean
}

// Device simulation presets
interface DevicePreset {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
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
    capabilities: {
      hardwareAcceleration: true,
      maxConcurrentAnimations: 3,
      preferredFrameRate: 30,
    },
  },
];

export default function AnimationDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalVariant, setModalVariant] = useState<ModalVariant>('elegant')
  const [dropdownVariant, setDropdownVariant] = useState<DropdownVariant>('elegant')
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('')
  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [validationType, setValidationType] = useState<'error' | 'warning' | 'success' | 'info'>('error')
  
  // New state for enhanced demo features
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0])
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  const [currentMetrics, setCurrentMetrics] = useState<{
    quality: string;
    frameRate: number;
    performanceScore: number;
    deviceCapabilities: {
      gpuTier: string;
    };
  } | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [activeTab, setActiveTab] = useState<'components' | 'performance' | 'testing' | 'accessibility'>('components')
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState<{
    testName: string;
    passed: boolean;
    duration: number;
    metrics: {
      frameRate: number;
      droppedFrames: number;
    };
    issues: string[];
  }[]>([])
  
  const testContainerRef = useRef<HTMLDivElement>(null)

  // Sample dropdown items
  const dropdownItems: DropdownItem[] = [
    {
      id: '1',
      label: 'Elegant Experience',
      value: 'elegant',
      description: 'Sophisticated dining with refined animations'
    },
    {
      id: '2',
      label: 'Immersive Journey',
      value: 'immersive',
      description: 'Full sensory experience with rich transitions'
    },
    {
      id: '3',
      label: 'Minimalist Approach',
      value: 'minimal',
      description: 'Clean and focused interaction design'
    },
    {
      id: 'divider1',
      label: '',
      value: '',
      divider: true
    },
    {
      id: '4',
      label: 'Luxury Tasting Menu',
      value: 'tasting',
      description: 'Chef\'s curated selection with premium ingredients'
    },
    {
      id: '5',
      label: 'Wine Pairing Experience',
      value: 'wine',
      description: 'Expertly matched wines with each course'
    }
  ]

  // Performance monitoring
  useEffect(() => {
    if (showPerformanceMetrics) {
      const interval = setInterval(() => {
        const metrics = performanceMonitor.getCurrentQuality()
        const frameRate = performanceMonitor.getCurrentFrameRate()
        const insights = performanceMonitor.getInsights()
        
        setCurrentMetrics({
          quality: metrics.quality,
          frameRate,
          performanceScore: insights.performanceScore,
          deviceCapabilities: insights.deviceCapabilities,
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [showPerformanceMetrics])

  // Apply accessibility preferences
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration-multiplier', '0.1')
    } else {
      document.documentElement.style.setProperty('--animation-duration-multiplier', animationSpeed.toString())
    }
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [animationSpeed, reducedMotion, highContrast])

  // Run performance test
  const runPerformanceTest = useCallback(async () => {
    setIsTestRunning(true)
    setTestResults([])
    
    try {
      const tests = [
        {
          name: 'Button Animation',
          testFunction: () => AnimationTestingUtils.runPerformanceBenchmark(
            'Button Hover',
            async () => {
              const button = document.querySelector('[data-test-button]') as HTMLButtonElement
              if (button) {
                button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
                await new Promise(resolve => setTimeout(resolve, 300))
                button.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
                await new Promise(resolve => setTimeout(resolve, 300))
              }
            }
          ),
        },
        {
          name: 'Modal Animation',
          testFunction: () => AnimationTestingUtils.runPerformanceBenchmark(
            'Modal Open/Close',
            async () => {
              setIsModalOpen(true)
              await new Promise(resolve => setTimeout(resolve, 600))
              setIsModalOpen(false)
              await new Promise(resolve => setTimeout(resolve, 600))
            }
          ),
        },
        {
          name: 'Dropdown Animation',
          testFunction: () => AnimationTestingUtils.runPerformanceBenchmark(
            'Dropdown Open/Close',
            async () => {
              const dropdown = document.querySelector('[data-test-dropdown]') as HTMLElement
              if (dropdown) {
                dropdown.click()
                await new Promise(resolve => setTimeout(resolve, 400))
                document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                await new Promise(resolve => setTimeout(resolve, 400))
              }
            }
          ),
        },
      ]
      
      const results = await Promise.all(tests.map(test => test.testFunction()))
      setTestResults(results)
    } catch (error) {
      console.error('Performance test error:', error)
    } finally {
      setIsTestRunning(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-light text-gray-900 mb-4">
            Luxury Animation Components
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience sophisticated modal and dropdown transitions designed for the Bistro Bert application
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
            Interactive Controls
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['components', 'performance', 'testing', 'accessibility'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0F3B2F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Device Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Simulation
              </label>
              <select
                value={selectedDevice.name}
                onChange={(e) => {
                  const device = DEVICE_PRESETS.find(d => d.name === e.target.value)
                  if (device) setSelectedDevice(device)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3B2F]"
              >
                {DEVICE_PRESETS.map(device => (
                  <option key={device.name} value={device.name}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full"
                disabled={reducedMotion}
              />
              <div className="text-xs text-gray-500 mt-1">
                {animationSpeed.toFixed(1)}x
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessibility Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Reduced Motion</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">High Contrast</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Monitoring
              </label>
              <button
                onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
                className={`w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                  showPerformanceMetrics
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showPerformanceMetrics ? 'Hide' : 'Show'} Metrics
              </button>
            </div>
          </div>

          {/* Performance Metrics Display */}
          {showPerformanceMetrics && currentMetrics && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Frame Rate</div>
                  <div className="font-medium">{currentMetrics.frameRate.toFixed(1)} fps</div>
                </div>
                <div>
                  <div className="text-gray-500">Quality</div>
                  <div className="font-medium capitalize">{currentMetrics.quality}</div>
                </div>
                <div>
                  <div className="text-gray-500">Performance Score</div>
                  <div className="font-medium">{currentMetrics.performanceScore}/100</div>
                </div>
                <div>
                  <div className="text-gray-500">GPU Tier</div>
                  <div className="font-medium capitalize">{currentMetrics.deviceCapabilities.gpuTier}</div>
                </div>
              </div>
            </div>
          )}

          {/* Testing Panel */}
          {activeTab === 'testing' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Performance Testing</h3>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={runPerformanceTest}
                  disabled={isTestRunning}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isTestRunning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0F3B2F] text-white hover:bg-[#1a5a47]'
                  }`}
                >
                  {isTestRunning ? 'Running Tests...' : 'Run Performance Tests'}
                </button>
                <button
                  onClick={() => setTestResults([])}
                  disabled={testResults.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    testResults.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Clear Results
                </button>
              </div>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Test Results</h4>
                  {testResults.map((result, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.testName}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Duration: {result.duration.toFixed(2)}ms | 
                        FPS: {result.metrics.frameRate.toFixed(1)} |
                        Dropped: {result.metrics.droppedFrames}
                      </div>
                      {result.issues.length > 0 && (
                        <div className="text-sm text-red-600 mt-1">
                          Issues: {result.issues.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Device Simulation Frame */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-hidden"
          style={{ 
            maxWidth: `${selectedDevice.width}px`,
            margin: '0 auto',
            transform: `scale(${Math.min(1, 1200 / selectedDevice.width)})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="text-center mb-4 text-sm text-gray-500">
            Simulated: {selectedDevice.name} ({selectedDevice.width}×{selectedDevice.height})
          </div>
          
          <div 
            ref={testContainerRef}
            style={{ 
              width: '100%', 
              height: `${selectedDevice.height * 0.6}px`,
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            {activeTab === 'components' && (
              <div className="p-6">
                {/* Modal Demo Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                    Modal Animations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {(['elegant', 'immersive', 'minimal'] as ModalVariant[]).map((variant) => (
                      <div key={variant} className="text-center">
                        <LuxuryButton
                          onClick={() => {
                            setModalVariant(variant)
                            setIsModalOpen(true)
                          }}
                          variant="gold"
                          className="w-full mb-2"
                          data-test-button
                        >
                          {variant.charAt(0).toUpperCase() + variant.slice(1)} Modal
                        </LuxuryButton>
                        <p className="text-sm text-gray-600">
                          {variant === 'elegant' && 'Smooth, refined entrance'}
                          {variant === 'immersive' && 'Rich, engaging experience'}
                          {variant === 'minimal' && 'Clean, simple transition'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dropdown Demo Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                    Dropdown Animations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Variant Selection
                      </h3>
                      <div className="space-y-2">
                        {(['elegant', 'slide', 'scale'] as DropdownVariant[]).map((variant) => (
                          <label key={variant} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="dropdown-variant"
                              value={variant}
                              checked={dropdownVariant === variant}
                              onChange={(e) => setDropdownVariant(e.target.value as DropdownVariant)}
                              className="text-[#0F3B2F] focus:ring-[#0F3B2F]"
                            />
                            <span className="text-gray-700">
                              {variant.charAt(0).toUpperCase() + variant.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Dropdown Example
                      </h3>
                      <LuxuryDropdown
                        items={dropdownItems}
                        variant={dropdownVariant}
                        placeholder="Select an experience"
                        selectedValue={selectedDropdownValue}
                        onSelect={(item) => setSelectedDropdownValue(item.value as string)}
                        className="w-full"
                        data-test-dropdown
                      />
                      {selectedDropdownValue && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: <span className="font-medium">{selectedDropdownValue}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Button Animations */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                    Enhanced Button Animations
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AnimatedButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      data-test-button
                    >
                      Primary
                    </AnimatedButton>
                    <AnimatedButton
                      variant="secondary"
                      size="md"
                      className="w-full"
                      data-test-button
                    >
                      Secondary
                    </AnimatedButton>
                    <AnimatedButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      data-test-button
                    >
                      Luxury
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="md"
                      className="w-full"
                      data-test-button
                    >
                      Minimal
                    </AnimatedButton>
                  </div>
                </div>

                {/* Card Animations */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                    Card Hover Animations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LuxuryCard
                      title="Elegant Card"
                      description="Smooth hover animation with subtle effects"
                    >
                      <div className="p-4">
                        <p className="text-sm text-gray-600">
                          Experience smooth hover animations with subtle effects
                        </p>
                      </div>
                    </LuxuryCard>
                    <LuxuryCard
                      title="Immersive Card"
                      description="Rich hover animation with enhanced effects"
                    >
                      <div className="p-4">
                        <p className="text-sm text-gray-600">
                          Enjoy rich hover animations with enhanced visual effects
                        </p>
                      </div>
                    </LuxuryCard>
                    <LuxuryCard
                      title="Minimal Card"
                      description="Clean hover animation with simple effects"
                    >
                      <div className="p-4">
                        <p className="text-sm text-gray-600">
                          Appreciate clean hover animations with simple effects
                        </p>
                      </div>
                    </LuxuryCard>
                  </div>
                </div>

                {/* Staggered Animations */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                    Staggered List Animations
                  </h2>
                  <div className="space-y-2">
                    {[
                      'First item with staggered animation',
                      'Second item appears after delay',
                      'Third item completes the sequence',
                      'Fourth item with final animation',
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="p-6">
                <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                  Performance Analysis
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    Monitor real-time performance metrics and analyze animation efficiency.
                    Use the controls above to adjust animation speed and test different device capabilities.
                  </p>
                  {currentMetrics && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Current Frame Rate:</span>
                        <span className="font-medium">{currentMetrics.frameRate.toFixed(1)} fps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Animation Quality:</span>
                        <span className="font-medium capitalize">{currentMetrics.quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance Score:</span>
                        <span className="font-medium">{currentMetrics.performanceScore}/100</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="p-6">
                <h2 className="text-xl font-serif font-light text-gray-900 mb-4">
                  Accessibility Testing
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-4">
                    Test animations with different accessibility preferences enabled.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Reduced Motion</h3>
                      <p className="text-sm text-gray-600">
                        {reducedMotion 
                          ? "Reduced motion is enabled. Animations should be minimal or disabled."
                          : "Reduced motion is disabled. Full animations are active."}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">High Contrast</h3>
                      <p className="text-sm text-gray-600">
                        {highContrast 
                          ? "High contrast mode is enabled. Enhanced visual indicators should be active."
                          : "High contrast mode is disabled. Standard styling is active."}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Animation Speed</h3>
                      <p className="text-sm text-gray-600">
                        Current speed multiplier: {animationSpeed.toFixed(1)}x
                        {reducedMotion && " (overridden by reduced motion)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Original Modal Demo Section (outside device frame) */}
        {activeTab === 'components' && (
          <>
            {/* Tooltip Demo Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                Tooltip Animations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-3">Elegant Tooltip</h3>
                  <LuxuryTooltip
                    content="This is an elegant tooltip with smooth animations and luxury styling."
                    variant="elegant"
                    position="top"
                  >
                    <LuxuryButton variant="gold" className="w-full">
                      Hover for Elegant
                    </LuxuryButton>
                  </LuxuryTooltip>
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-3">Minimal Tooltip</h3>
                  <LuxuryTooltip
                    content="This is a minimal tooltip with clean, simple animations."
                    variant="minimal"
                    position="bottom"
                  >
                    <LuxuryButton variant="platinum" className="w-full">
                      Hover for Minimal
                    </LuxuryButton>
                  </LuxuryTooltip>
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-3">Luxury Tooltip</h3>
                  <LuxuryTooltip
                    content="This is a luxury tooltip with premium golden styling and enhanced animations."
                    variant="luxury"
                    position="right"
                  >
                    <LuxuryButton variant="rose-gold" className="w-full">
                      Hover for Luxury
                    </LuxuryButton>
                  </LuxuryTooltip>
                </div>
              </div>
            </div>

            {/* Validation Message Demo Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                Validation Message Animations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Message Type</h3>
                  <div className="space-y-2">
                    {(['error', 'warning', 'success', 'info'] as const).map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="validation-type"
                          value={type}
                          checked={validationType === type}
                          onChange={(e) => setValidationType(e.target.value as typeof validationType)}
                          className="text-[#0F3B2F] focus:ring-[#0F3B2F]"
                        />
                        <span className="text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Show Message</h3>
                  <LuxuryButton
                    onClick={() => setShowValidationMessage(!showValidationMessage)}
                    variant="gold"
                    className="w-full mb-4"
                  >
                    {showValidationMessage ? 'Hide' : 'Show'} {validationType} Message
                  </LuxuryButton>
                  
                  <AnimatedValidationMessage
                    message={
                      validationType === 'error' ? 'This is an error message with elegant animations.'
                      : validationType === 'warning' ? 'This is a warning message with subtle animations.'
                      : validationType === 'success' ? 'This is a success message with delightful animations.'
                      : 'This is an info message with smooth animations.'
                    }
                    type={validationType}
                    isVisible={showValidationMessage}
                    dismissible={true}
                    onDismiss={() => setShowValidationMessage(false)}
                  />
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
                Animation Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">✨</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Sophisticated Timing</h3>
                  <p className="text-sm text-gray-600">
                    Luxury-themed easing curves and carefully crafted durations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">🎯</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Accessibility First</h3>
                  <p className="text-sm text-gray-600">
                    Respects reduced motion preferences and includes proper ARIA support
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">⚡</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Performance Optimized</h3>
                  <p className="text-sm text-gray-600">
                    Hardware acceleration and frame rate monitoring included
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">🎨</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Multiple Variants</h3>
                  <p className="text-sm text-gray-600">
                    Elegant, immersive, and minimal animation styles available
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">📱</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Responsive Design</h3>
                  <p className="text-sm text-gray-600">
                    Adapts to different screen sizes and viewport constraints
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#0F3B2F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">🔧</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Easy Integration</h3>
                  <p className="text-sm text-gray-600">
                    Simple hooks and components for seamless implementation
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Demo Modal */}
        <LuxuryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          variant={modalVariant}
          title={`${modalVariant.charAt(0).toUpperCase() + modalVariant.slice(1)} Modal Demo`}
          description="Experience the sophisticated animation transitions"
          size="medium"
          showBackdrop={true}
          backdropVariant="blur"
          showCloseButton={true}
        >
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              This is an example of the <span className="font-medium text-[#0F3B2F]">{modalVariant}</span> modal variant.
              Each variant offers a unique animation experience while maintaining the luxury aesthetic.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Animation Characteristics:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {modalVariant === 'elegant' && (
                  <>
                    <li>• Smooth scale and fade transitions</li>
                    <li>• Subtle blur effects</li>
                    <li>• Refined timing curves</li>
                  </>
                )}
                {modalVariant === 'immersive' && (
                  <>
                    <li>• Dramatic entrance animations</li>
                    <li>• Enhanced visual effects</li>
                    <li>• Extended duration for impact</li>
                  </>
                )}
                {modalVariant === 'minimal' && (
                  <>
                    <li>• Clean, simple transitions</li>
                    <li>• Fast and responsive</li>
                    <li>• Focus on content</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="flex justify-end pt-4">
              <LuxuryButton
                onClick={() => setIsModalOpen(false)}
                variant="gold"
              >
                Close Modal
              </LuxuryButton>
            </div>
          </div>
        </LuxuryModal>
      </div>
    </div>
  )
}