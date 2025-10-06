'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { usePageTransition } from '@/hooks/animations/usePageTransition'
import { useTransitionManager } from '@/components/ui/TransitionManager'
import { TransitionType } from '@/components/ui/TransitionManager'
import { ANIMATION_DURATIONS } from '@/utils/animations/constants'
import { runAnimationTestSuite, testAnimationPerformance } from '@/utils/animations/testing'

export default function TransitionsTestPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { navigateTo, state, startTransition, getPerformanceMetrics } = usePageTransition()
  const { setRouteTransition, transitionHistory } = useTransitionManager()
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)

  // Test all transition types
  const testTransitions = async () => {
    setIsRunningTests(true)
    
    try {
      // Run comprehensive animation tests
      const results = await runAnimationTestSuite(
        'Page Transitions Test Suite',
        [
          {
            name: 'Luxury Reveal Performance',
            type: 'performance',
            testFunction: async () => {
              return await testAnimationPerformance('luxury-reveal', async () => {
                await startTransition({ type: 'luxury-reveal', duration: 1000 })
              })
            }
          },
          {
            name: 'Gold Shimmer Performance',
            type: 'performance',
            testFunction: async () => {
              return await testAnimationPerformance('gold-shimmer', async () => {
                await startTransition({ type: 'gold-shimmer', duration: 1000 })
              })
            }
          },
          {
            name: 'Elegant Performance',
            type: 'performance',
            testFunction: async () => {
              return await testAnimationPerformance('elegant', async () => {
                await startTransition({ type: 'elegant', duration: 1000 })
              })
            }
          }
        ],
        { testTimeout: 5000, retryFailedTests: 1 }
      )
      setTestResults(results)
      
      console.log('Page transition test results:', results)
    } catch (error) {
      console.error('Animation tests failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  // Test navigation with different transition types
  const testNavigation = async (type: TransitionType, path?: string) => {
    try {
      await navigateTo(path || '/transitions-test', { 
        type, 
        duration: ANIMATION_DURATIONS.page,
        showProgress: true,
        enablePerformanceMonitoring: true
      })
    } catch (error) {
      console.error(`Navigation test failed for ${type}:`, error)
    }
  }

  // Test route configuration
  const testRouteConfiguration = () => {
    // Set different transitions for different routes
    setRouteTransition('/', { type: 'luxury-reveal', duration: ANIMATION_DURATIONS.immersive })
    setRouteTransition('/menu', { type: 'elegant', duration: ANIMATION_DURATIONS.page })
    setRouteTransition('/contact', { type: 'immersive', duration: ANIMATION_DURATIONS.page })
    setRouteTransition('/over-ons', { type: 'slide', duration: ANIMATION_DURATIONS.page })
    setRouteTransition('/transitions-test', { type: 'gold-shimmer', duration: ANIMATION_DURATIONS.page })
    
    console.log('Route transitions configured')
  }

  // Get performance metrics
  const getMetrics = () => {
    const metrics = getPerformanceMetrics()
    console.log('Current performance metrics:', metrics)
    return metrics
  }

  // Test memory management
  const testMemoryManagement = () => {
    if (typeof window !== 'undefined') {
      const before = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      
      // Start and stop multiple transitions rapidly
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(startTransition({ type: 'luxury-reveal', duration: 100 }))
      }
      
      Promise.all(promises).then(() => {
        setTimeout(() => {
          const after = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
          console.log(`Memory usage: ${before} -> ${after} bytes (${((after - before) / before * 100).toFixed(2)}% change)`)
        }, 1000)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3B2F] to-[#1a5a47] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-light mb-4 text-[#D4AF37]">Page Transitions Test Suite</h1>
          <p className="text-xl text-gray-300 mb-8">Comprehensive testing and validation of page transition animations</p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-300 mb-1">Transition State</p>
              <p className="text-lg">{state.isTransitioning ? 'Transitioning...' : 'Idle'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Current Type</p>
              <p className="text-lg">{state.transitionType || 'None'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Progress</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#0F3B2F] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transition Type Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Transition Type Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(['luxury-reveal', 'gold-shimmer', 'immersive', 'elegant', 'fade', 'slide'] as TransitionType[]).map((type) => (
              <button
                key={type}
                onClick={() => testNavigation(type)}
                disabled={state.isTransitioning}
                className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Navigation Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => testNavigation('luxury-reveal', '/')}
              disabled={state.isTransitioning}
              className="px-4 py-3 bg-[#0F3B2F] text-white rounded-lg font-medium hover:bg-[#0F3B2F]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Home
            </button>
            <button
              onClick={() => testNavigation('elegant', '/menu')}
              disabled={state.isTransitioning}
              className="px-4 py-3 bg-[#0F3B2F] text-white rounded-lg font-medium hover:bg-[#0F3B2F]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Menu
            </button>
            <button
              onClick={() => testNavigation('immersive', '/contact')}
              disabled={state.isTransitioning}
              className="px-4 py-3 bg-[#0F3B2F] text-white rounded-lg font-medium hover:bg-[#0F3B2F]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Contact
            </button>
            <button
              onClick={() => testNavigation('slide', '/over-ons')}
              disabled={state.isTransitioning}
              className="px-4 py-3 bg-[#0F3B2F] text-white rounded-lg font-medium hover:bg-[#0F3B2F]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Over Ons
            </button>
          </div>
        </motion.div>

        {/* Performance Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Performance Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testTransitions}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Running Tests...' : 'Run Animation Tests'}
            </button>
            <button
              onClick={testMemoryManagement}
              disabled={state.isTransitioning}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Memory Management
            </button>
            <button
              onClick={getMetrics}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Get Performance Metrics
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6 p-4 bg-black/30 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-[#D4AF37]">Test Results</h3>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Configuration Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Configuration Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={testRouteConfiguration}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Configure Route Transitions
            </button>
            <button
              onClick={() => console.log('Transition History:', transitionHistory)}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Log Transition History
            </button>
          </div>
        </motion.div>

        {/* Transition History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Transition History</h2>
          <div className="space-y-2">
            {transitionHistory.length === 0 ? (
              <p className="text-gray-300">No transitions recorded yet</p>
            ) : (
              transitionHistory.slice(0, 10).map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                  <div>
                    <p className="font-medium">{entry.type}</p>
                    <p className="text-sm text-gray-300">{entry.from} → {entry.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{entry.duration.toFixed(0)}ms</p>
                    <p className="text-xs text-gray-300">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}