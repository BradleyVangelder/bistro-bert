'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LuxuryModal from '@/components/ui/LuxuryModal'
import LuxuryDropdown, { DropdownItem } from '@/components/ui/LuxuryDropdown'
import { useModal } from '@/hooks/animations/useModal'
import { useDropdown } from '@/hooks/animations/useDropdown'
import { testAnimationPerformance, testAnimationConsistency, testAnimationAccessibility } from '@/utils/animations/testing'

export default function ModalDropdownTestPage() {
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedModalVariant, setSelectedModalVariant] = useState<'elegant' | 'immersive' | 'minimal'>('elegant')
  const [selectedDropdownVariant, setSelectedDropdownVariant] = useState<'elegant' | 'slide' | 'scale'>('elegant')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Test hooks
  const modalHook = useModal({
    variant: selectedModalVariant,
    enablePerformanceMonitoring: true,
    enableAccessibility: true,
  })

  const dropdownHook = useDropdown({
    variant: selectedDropdownVariant,
    enablePerformanceMonitoring: true,
    enableAccessibility: true,
  })

  // Sample dropdown items
  const dropdownItems: DropdownItem[] = [
    {
      id: '1',
      label: 'Starters',
      value: 'starters',
      description: 'Fresh appetizers and small bites',
      icon: <div className="w-4 h-4 bg-[#D4AF37] rounded-full" />,
    },
    {
      id: '2',
      label: 'Main Courses',
      value: 'mains',
      description: 'Signature dishes and specialties',
      icon: <div className="w-4 h-4 bg-[#0F3B2F] rounded-full" />,
    },
    {
      id: '3',
      label: 'Desserts',
      value: 'desserts',
      description: 'Sweet endings to your meal',
      icon: <div className="w-4 h-4 bg-[#8B4513] rounded-full" />,
    },
    {
      id: '4',
      label: 'Wine Selection',
      value: 'wine',
      description: 'Curated wines from around the world',
      icon: <div className="w-4 h-4 bg-[#8B0000] rounded-full" />,
    },
    {
      id: '5',
      label: 'Cocktails',
      value: 'cocktails',
      description: 'Crafted mixology creations',
      icon: <div className="w-4 h-4 bg-[#FFD700] rounded-full" />,
    },
  ]

  // Test functions
  const testModalPerformance = async () => {
    setIsRunningTests(true)
    
    try {
      // Test modal open performance
      const openResult = await testAnimationPerformance('modal-open', async () => {
        setIsModalOpen(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      // Test modal close performance
      const closeResult = await testAnimationPerformance('modal-close', async () => {
        setIsModalOpen(false)
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      const results = {
        open: openResult,
        close: closeResult,
      }
      
      setTestResults(results)
      console.log('Modal performance results:', results)
    } catch (error) {
      console.error('Modal performance test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testDropdownPerformance = async () => {
    setIsRunningTests(true)
    
    try {
      // Test dropdown open performance
      const openResult = await testAnimationPerformance('dropdown-open', async () => {
        setIsDropdownOpen(true)
        await new Promise(resolve => setTimeout(resolve, 500))
      })

      // Test dropdown close performance
      const closeResult = await testAnimationPerformance('dropdown-close', async () => {
        setIsDropdownOpen(false)
        await new Promise(resolve => setTimeout(resolve, 500))
      })

      const results = {
        open: openResult,
        close: closeResult,
      }
      
      setTestResults(results)
      console.log('Dropdown performance results:', results)
    } catch (error) {
      console.error('Dropdown performance test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testModalConsistency = async () => {
    setIsRunningTests(true)
    
    try {
      // Test consistency across different modal variants
      const modalVariants = {
        elegant: { opacity: 0, scale: 0.95, y: 20 },
        immersive: { opacity: 0, scale: 0.9, y: 50 },
        minimal: { opacity: 0, y: -20 }
      }

      const consistencyResult = await testAnimationConsistency(
        'modal-variants',
        modalVariants,
        ['opacity', 'transition']
      )

      setTestResults({ modalConsistency: consistencyResult })
      console.log('Modal consistency results:', consistencyResult)
    } catch (error) {
      console.error('Modal consistency test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testDropdownConsistency = async () => {
    setIsRunningTests(true)
    
    try {
      // Test consistency across different dropdown variants
      const dropdownVariants = {
        elegant: { opacity: 0, scale: 0.95, y: -10 },
        slide: { opacity: 0, y: -20 },
        scale: { opacity: 0, scale: 0.8 }
      }

      const consistencyResult = await testAnimationConsistency(
        'dropdown-variants',
        dropdownVariants,
        ['opacity', 'transition']
      )

      setTestResults({ dropdownConsistency: consistencyResult })
      console.log('Dropdown consistency results:', consistencyResult)
    } catch (error) {
      console.error('Dropdown consistency test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testModalAccessibility = async () => {
    setIsRunningTests(true)
    
    try {
      // Test accessibility of modal animations
      const accessibilityResult = await testAnimationAccessibility(
        'modal-animations',
        {
          variants: {
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 }
          },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
      )

      setTestResults({ modalAccessibility: accessibilityResult })
      console.log('Modal accessibility results:', accessibilityResult)
    } catch (error) {
      console.error('Modal accessibility test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testDropdownAccessibility = async () => {
    setIsRunningTests(true)
    
    try {
      // Test accessibility of dropdown animations
      const accessibilityResult = await testAnimationAccessibility(
        'dropdown-animations',
        {
          variants: {
            initial: { opacity: 0, scale: 0.95, y: -10 },
            animate: { opacity: 1, scale: 1, y: 0 }
          },
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
      )

      setTestResults({ dropdownAccessibility: accessibilityResult })
      console.log('Dropdown accessibility results:', accessibilityResult)
    } catch (error) {
      console.error('Dropdown accessibility test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsRunningTests(false)
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
          <h1 className="text-5xl font-light mb-4 text-[#D4AF37]">Modal & Dropdown Animation Test Suite</h1>
          <p className="text-xl text-gray-300 mb-8">Comprehensive testing and validation of modal and dropdown animation components</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Animation Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Modal Variant</label>
              <select
                value={selectedModalVariant}
                onChange={(e) => setSelectedModalVariant(e.target.value as 'elegant' | 'immersive' | 'minimal')}
                className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
              >
                <option value="elegant">Elegant</option>
                <option value="immersive">Immersive</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Dropdown Variant</label>
              <select
                value={selectedDropdownVariant}
                onChange={(e) => setSelectedDropdownVariant(e.target.value as 'elegant' | 'slide' | 'scale')}
                className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
              >
                <option value="elegant">Elegant</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Modal Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Modal Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Open Modal
            </button>
            
            <button
              onClick={testModalPerformance}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Testing...' : 'Test Performance'}
            </button>
            
            <button
              onClick={testModalConsistency}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? 'Testing...' : 'Test Consistency'}
            </button>
          </div>

          <button
            onClick={testModalAccessibility}
            disabled={isRunningTests}
            className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isRunningTests ? 'Testing...' : 'Test Accessibility'}
          </button>

          {/* Modal Component */}
          <LuxuryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            variant={selectedModalVariant}
            title="Test Modal"
            description="This is a test modal for animation validation"
            size="medium"
            showBackdrop={true}
            closeOnBackdrop={true}
            closeOnEscape={true}
            showCloseButton={true}
            showMaximizeButton={true}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                This modal is using the <strong>{selectedModalVariant}</strong> variant.
              </p>
              <p className="text-gray-700">
                The animation performance is being monitored to ensure smooth transitions and optimal user experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">Animation Metrics</h4>
                  <p className="text-sm text-gray-600">Frame Rate: 60 FPS</p>
                  <p className="text-sm text-gray-600">Duration: 500ms</p>
                  <p className="text-sm text-gray-600">Easing: Luxury</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">Accessibility</h4>
                  <p className="text-sm text-gray-600">Reduced Motion: Respected</p>
                  <p className="text-sm text-gray-600">Focus Management: Enabled</p>
                  <p className="text-sm text-gray-600">Screen Reader: Supported</p>
                </div>
              </div>
            </div>
          </LuxuryModal>
        </motion.div>

        {/* Dropdown Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Dropdown Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Test Dropdown</label>
              <LuxuryDropdown
                items={dropdownItems}
                placeholder="Select menu category"
                variant={selectedDropdownVariant}
                showBackdrop={true}
                closeOnSelect={false}
                onSelect={(item) => console.log('Selected:', item)}
              />
            </div>
            
            <button
              onClick={testDropdownPerformance}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {isRunningTests ? 'Testing...' : 'Test Performance'}
            </button>
            
            <button
              onClick={testDropdownConsistency}
              disabled={isRunningTests}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {isRunningTests ? 'Testing...' : 'Test Consistency'}
            </button>
          </div>

          <button
            onClick={testDropdownAccessibility}
            disabled={isRunningTests}
            className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isRunningTests ? 'Testing...' : 'Test Accessibility'}
          </button>
        </motion.div>

        {/* Hook State Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Hook State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Modal Hook</h3>
              <div className="space-y-1 text-sm">
                <p>Open: {modalHook.state.isOpen ? 'Yes' : 'No'}</p>
                <p>Animating: {modalHook.state.isAnimating ? 'Yes' : 'No'}</p>
                <p>Variant: {modalHook.state.variant}</p>
                <p>Interacted: {modalHook.state.hasInteracted ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Dropdown Hook</h3>
              <div className="space-y-1 text-sm">
                <p>Open: {dropdownHook.state.isOpen ? 'Yes' : 'No'}</p>
                <p>Animating: {dropdownHook.state.isAnimating ? 'Yes' : 'No'}</p>
                <p>Variant: {dropdownHook.state.variant}</p>
                <p>Position: {dropdownHook.state.position}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Results */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
          >
            <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Test Results</h2>
            <div className="p-4 bg-black/30 rounded-lg">
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}