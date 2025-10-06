'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  StaggeredContainer, 
  StaggeredCard, 
  StaggeredList, 
  ScrollTriggeredStagger, 
  LuxuryStaggeredReveal 
} from '@/components/ui/StaggeredAnimations'
import { useStaggeredAnimation, useSimpleStagger, useScrollStagger, useOptimizedStagger } from '@/hooks/animations/useStaggeredAnimation'
import { testAnimationPerformance, testAnimationConsistency, testAnimationAccessibility } from '@/utils/animations/testing'

export default function StaggeredAnimationsTestPage() {
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedDirection, setSelectedDirection] = useState<'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'>('up')
  const [staggerDelay, setStaggerDelay] = useState(100)
  const [triggerOnScroll, setTriggerOnScroll] = useState(false)

  // Test hooks
  const basicStagger = useStaggeredAnimation({
    direction: selectedDirection,
    staggerDelay,
    triggerOnScroll,
    enablePerformanceMonitoring: true,
  })

  const simpleStagger = useSimpleStagger(6, {
    direction: selectedDirection,
    staggerDelay,
  })

  const scrollStagger = useScrollStagger({
    direction: selectedDirection,
    staggerDelay,
    threshold: 0.2,
  })

  const optimizedStagger = useOptimizedStagger({
    direction: selectedDirection,
    staggerDelay,
  })

  // Test functions
  const testStaggeredPerformance = async () => {
    setIsRunningTests(true)
    
    try {
      // Test StaggeredContainer performance
      const containerResult = await testAnimationPerformance('staggered-container', async () => {
        // Simulate container animation
        basicStagger.trigger()
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      // Test StaggeredList performance
      const listResult = await testAnimationPerformance('staggered-list', async () => {
        // Simulate list animation
        const items = Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-4 bg-white/10 rounded">Item {i + 1}</div>
        ))
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      // Test ScrollTriggeredStagger performance
      const scrollResult = await testAnimationPerformance('scroll-triggered-stagger', async () => {
        // Simulate scroll-triggered animation
        scrollStagger.trigger()
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      const results = {
        container: containerResult,
        list: listResult,
        scroll: scrollResult,
      }
      
      setTestResults(results)
      console.log('Staggered animation performance results:', results)
    } catch (error) {
      console.error('Staggered animation performance test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testStaggeredConsistency = async () => {
    setIsRunningTests(true)
    
    try {
      // Test consistency across different directions
      const directionVariants = {
        up: { opacity: 0, y: 30 },
        down: { opacity: 0, y: -30 },
        left: { opacity: 0, x: 30 },
        right: { opacity: 0, x: -30 },
        scale: { opacity: 0, scale: 0.9 },
        fade: { opacity: 0 }
      }

      const consistencyResult = await testAnimationConsistency(
        'stagger-directions',
        directionVariants,
        ['opacity', 'transition']
      )

      setTestResults({ consistency: consistencyResult })
      console.log('Staggered animation consistency results:', consistencyResult)
    } catch (error) {
      console.error('Staggered animation consistency test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testStaggeredAccessibility = async () => {
    setIsRunningTests(true)
    
    try {
      // Test accessibility of staggered animations
      const accessibilityResult = await testAnimationAccessibility(
        'staggered-animations',
        {
          variants: {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 }
          },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      )

      setTestResults({ accessibility: accessibilityResult })
      console.log('Staggered animation accessibility results:', accessibilityResult)
    } catch (error) {
      console.error('Staggered animation accessibility test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  // Sample data for demonstrations
  const sampleItems = [
    { title: 'Elegant Dining', description: 'Experience fine dining at its finest' },
    { title: 'Premium Cuisine', description: 'Authentic flavors with modern presentation' },
    { title: 'Luxury Ambiance', description: 'Sophisticated atmosphere for memorable moments' },
    { title: 'Exceptional Service', description: 'Attentive staff dedicated to your experience' },
    { title: 'Curated Menu', description: 'Seasonal ingredients from local producers' },
    { title: 'Wine Selection', description: 'Expertly chosen pairings for every dish' },
  ]

  const longList = Array.from({ length: 20 }, (_, i) => ({
    title: `Menu Item ${i + 1}`,
    description: `Delicious description for menu item number ${i + 1}`,
    price: `€${(Math.random() * 50 + 10).toFixed(2)}`
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3B2F] to-[#1a5a47] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-light mb-4 text-[#D4AF37]">Staggered Animations Test Suite</h1>
          <p className="text-xl text-gray-300 mb-8">Comprehensive testing and validation of staggered animation components</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Animation Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Direction</label>
              <select
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value as 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade')}
                className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
              >
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="scale">Scale</option>
                <option value="fade">Fade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Stagger Delay (ms)</label>
              <input
                type="range"
                min="50"
                max="300"
                step="50"
                value={staggerDelay}
                onChange={(e) => setStaggerDelay(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-1">{staggerDelay}ms</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Trigger on Scroll</label>
              <button
                onClick={() => setTriggerOnScroll(!triggerOnScroll)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  triggerOnScroll 
                    ? 'bg-[#D4AF37] text-[#0F3B2F]' 
                    : 'bg-white/20 text-white'
                }`}
              >
                {triggerOnScroll ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Staggered Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Staggered Container</h2>
          <div className="mb-4">
            <button
              onClick={basicStagger.trigger}
              className="px-4 py-2 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors mr-2"
            >
              Trigger Animation
            </button>
            <button
              onClick={basicStagger.reset}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              Reset
            </button>
          </div>
          
          <StaggeredContainer
            direction={selectedDirection}
            staggerDelay={staggerDelay}
            triggerOnScroll={triggerOnScroll}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {sampleItems.slice(0, 6).map((item, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </StaggeredContainer>
        </motion.div>

        {/* Staggered List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Staggered List</h2>
          <StaggeredList
            items={sampleItems.map((item, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
            direction={selectedDirection}
            staggerDelay={staggerDelay}
            triggerOnScroll={triggerOnScroll}
            className="space-y-4"
          />
        </motion.div>

        {/* Scroll Triggered Stagger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Scroll Triggered Stagger</h2>
          <p className="text-gray-300 mb-4">Scroll down to see the animation trigger</p>
          
          <div className="h-96 mb-8 flex items-center justify-center">
            <p className="text-gray-400">Scroll down to trigger animation ↓</p>
          </div>
          
          <ScrollTriggeredStagger
            direction={selectedDirection}
            staggerDelay={staggerDelay}
            threshold={0.2}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {sampleItems.slice(0, 4).map((item, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </ScrollTriggeredStagger>
        </motion.div>

        {/* Luxury Staggered Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Luxury Staggered Reveal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleItems.slice(0, 4).map((item, index) => (
              <LuxuryStaggeredReveal
                key={index}
                delay={index * 200}
                className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-white/10 rounded-lg"
              >
                <h3 className="text-xl font-medium mb-3 text-[#D4AF37]">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </LuxuryStaggeredReveal>
            ))}
          </div>
        </motion.div>

        {/* Performance Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Performance Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testStaggeredPerformance}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Running Tests...' : 'Test Performance'}
            </button>
            
            <button
              onClick={testStaggeredConsistency}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Running Tests...' : 'Test Consistency'}
            </button>
            
            <button
              onClick={testStaggeredAccessibility}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Running Tests...' : 'Test Accessibility'}
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

        {/* Hook State Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Hook State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Stagger</h3>
              <div className="space-y-1 text-sm">
                <p>Visible: {basicStagger.state.isVisible ? 'Yes' : 'No'}</p>
                <p>Animated: {basicStagger.state.hasAnimated ? 'Yes' : 'No'}</p>
                <p>Animating: {basicStagger.state.isAnimating ? 'Yes' : 'No'}</p>
                <p>Progress: {(basicStagger.getProgress() * 100).toFixed(0)}%</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Scroll Stagger</h3>
              <div className="space-y-1 text-sm">
                <p>Visible: {scrollStagger.state.isVisible ? 'Yes' : 'No'}</p>
                <p>Animated: {scrollStagger.state.hasAnimated ? 'Yes' : 'No'}</p>
                <p>Animating: {scrollStagger.state.isAnimating ? 'Yes' : 'No'}</p>
                <p>Progress: {(scrollStagger.getProgress() * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}