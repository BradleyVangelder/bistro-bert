'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  InteractiveCard, 
  EnhancedLink, 
  FocusGlowInput, 
  FeedbackAnimation, 
  TouchFriendly 
} from '@/components/ui/MicroInteractions'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import BlackButton from '@/components/ui/BlackButton'
import TouchFriendlyButton from '@/components/ui/TouchFriendlyButton'
import { useMicroInteractions, useButtonInteraction, useFormInteraction } from '@/hooks/animations/useMicroInteractions'
import { testAnimationPerformance, testAnimationConsistency, testAnimationAccessibility } from '@/utils/animations/testing'

export default function MicroInteractionsTestPage() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('success')
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [inputSuccess, setInputSuccess] = useState(false)
  
  // Test micro-interaction hooks
  const microInteraction = useMicroInteractions({
    enableHapticFeedback: true,
    enableRippleEffects: true,
    enableGlowEffects: true,
  })
  
  const buttonInteraction = useButtonInteraction({
    enableHapticFeedback: true,
    enableRippleEffects: true,
  })
  
  const formInteraction = useFormInteraction()

  // Test functions
  const testMicroInteractionPerformance = async () => {
    try {
      // Test InteractiveCard performance
      const cardResult = await testAnimationPerformance('interactive-card', async () => {
        // Simulate card interactions
        const testElement = document.querySelector('.test-card')
        if (testElement) {
          testElement.dispatchEvent(new MouseEvent('mouseenter'))
          await new Promise(resolve => setTimeout(resolve, 300))
          testElement.dispatchEvent(new MouseEvent('mouseleave'))
        }
      })

      // Test AnimatedButton performance
      const buttonResult = await testAnimationPerformance('animated-button', async () => {
        const testElement = document.querySelector('.test-button')
        if (testElement) {
          testElement.dispatchEvent(new MouseEvent('mousedown'))
          await new Promise(resolve => setTimeout(resolve, 100))
          testElement.dispatchEvent(new MouseEvent('mouseup'))
        }
      })

      // Test TouchFriendly performance
      const touchResult = await testAnimationPerformance('touch-friendly', async () => {
        const testElement = document.querySelector('.test-touch')
        if (testElement) {
          testElement.dispatchEvent(new TouchEvent('touchstart'))
          await new Promise(resolve => setTimeout(resolve, 100))
          testElement.dispatchEvent(new TouchEvent('touchend'))
        }
      })

      console.log('Micro-interaction performance results:', { cardResult, buttonResult, touchResult })
      
      // Show feedback
      setFeedbackType('success')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    } catch (error) {
      console.error('Micro-interaction performance test failed:', error)
      setFeedbackType('error')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  const testMicroInteractionConsistency = async () => {
    try {
      // Test consistency across different button variants
      const buttonVariants = {
        primary: { scale: 1.02, y: -1 },
        secondary: { scale: 1.02, y: -1 },
        outline: { scale: 1.02, y: -1 },
        ghost: { scale: 1.02, y: -1 }
      }

      const consistencyResult = await testAnimationConsistency(
        'button-variants',
        buttonVariants,
        ['scale', 'y', 'transition']
      )

      console.log('Micro-interaction consistency results:', consistencyResult)
      
      // Show feedback
      setFeedbackType(consistencyResult.passed ? 'success' : 'warning')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    } catch (error) {
      console.error('Micro-interaction consistency test failed:', error)
      setFeedbackType('error')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  const testMicroInteractionAccessibility = async () => {
    try {
      // Test accessibility of micro-interactions
      const accessibilityResult = await testAnimationAccessibility(
        'micro-interactions',
        {
          variants: {
            hover: { scale: 1.02 },
            tap: { scale: 0.98 }
          },
          transition: { duration: 0.2 }
        }
      )

      console.log('Micro-interaction accessibility results:', accessibilityResult)
      
      // Show feedback
      setFeedbackType(accessibilityResult.passed ? 'success' : 'warning')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    } catch (error) {
      console.error('Micro-interaction accessibility test failed:', error)
      setFeedbackType('error')
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setInputError('')
    setInputSuccess(false)
    
    // Simulate validation
    if (value.length > 0 && value.length < 3) {
      setInputError('Input must be at least 3 characters')
    } else if (value.length >= 3) {
      setInputSuccess(true)
    }
  }

  const triggerFeedback = (type: 'success' | 'error' | 'warning' | 'info') => {
    setFeedbackType(type)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)
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
          <h1 className="text-5xl font-light mb-4 text-[#D4AF37]">Micro-Interactions Test Suite</h1>
          <p className="text-xl text-gray-300 mb-8">Comprehensive testing and validation of micro-interaction animations</p>
        </motion.div>

        {/* Current State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Current Interaction State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Active</p>
              <p className="text-lg">{microInteraction.state.isActive ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Hovered</p>
              <p className="text-lg">{microInteraction.state.isHovered ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Pressed</p>
              <p className="text-lg">{microInteraction.state.isPressed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Interactions</p>
              <p className="text-lg">{microInteraction.state.interactionCount}</p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Interactive Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InteractiveCard
              variant="default"
              className="test-card p-6"
              onClick={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Default Card</h3>
              <p className="text-gray-300">Hover and click to test interactions</p>
            </InteractiveCard>
            
            <InteractiveCard
              variant="luxury"
              className="test-card p-6"
              onClick={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Luxury Card</h3>
              <p className="text-gray-300">Premium hover effects with glow</p>
            </InteractiveCard>
            
            <InteractiveCard
              variant="subtle"
              className="test-card p-6"
              onClick={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Subtle Card</h3>
              <p className="text-gray-300">Minimal interaction feedback</p>
            </InteractiveCard>
          </div>
        </motion.div>

        {/* Button Variants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Button Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <AnimatedButton
              variant="primary"
              className="test-button"
              onClick={() => triggerFeedback('success')}
            >
              Primary
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              className="test-button"
              onClick={() => triggerFeedback('info')}
            >
              Secondary
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              className="test-button"
              onClick={() => triggerFeedback('warning')}
            >
              Outline
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              className="test-button"
              onClick={() => triggerFeedback('success')}
            >
              Ghost
            </AnimatedButton>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BlackButton
              className="test-button"
              onClick={() => triggerFeedback('success')}
            >
              Black Button
            </BlackButton>
            
            <TouchFriendlyButton
              className="test-button"
              onClick={() => triggerFeedback('info')}
            >
              Touch Friendly
            </TouchFriendlyButton>
            
            <AnimatedButton
              variant="primary"
              loading
              className="test-button"
            >
              Loading
            </AnimatedButton>
            
            <AnimatedButton
              variant="primary"
              disabled
              className="test-button"
            >
              Disabled
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Touch Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Touch Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TouchFriendly
              feedbackType="ripple"
              className="test-touch bg-white/10 p-6 rounded-lg text-center"
              onTap={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Ripple Effect</h3>
              <p className="text-gray-300">Tap for ripple animation</p>
            </TouchFriendly>
            
            <TouchFriendly
              feedbackType="scale"
              className="test-touch bg-white/10 p-6 rounded-lg text-center"
              onTap={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Scale Effect</h3>
              <p className="text-gray-300">Tap for scale animation</p>
            </TouchFriendly>
            
            <TouchFriendly
              feedbackType="glow"
              className="test-touch bg-white/10 p-6 rounded-lg text-center"
              onTap={() => triggerFeedback('success')}
            >
              <h3 className="text-lg font-medium mb-2">Glow Effect</h3>
              <p className="text-gray-300">Tap for glow animation</p>
            </TouchFriendly>
          </div>
        </motion.div>

        {/* Form Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Form Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FocusGlowInput
              label="Burgundy Glow"
              placeholder="Type to see the glow effect..."
              glowColor="burgundy"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              error={inputError}
              success={inputSuccess}
            />
            
            <FocusGlowInput
              label="Amber Glow"
              placeholder="Focused input with amber glow..."
              glowColor="amber"
            />
            
            <FocusGlowInput
              label="Green Glow"
              placeholder="Success state with green glow..."
              glowColor="green"
              success
            />
            
            <FocusGlowInput
              label="Blue Glow"
              placeholder="Info state with blue glow..."
              glowColor="blue"
            />
          </div>
        </motion.div>

        {/* Enhanced Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Enhanced Links</h2>
          <div className="space-y-4">
            <EnhancedLink
              href="#"
              underlineVariant="standard"
              onClick={() => triggerFeedback('info')}
            >
              Standard underline link
            </EnhancedLink>
            
            <EnhancedLink
              href="#"
              underlineVariant="gradient"
              onClick={() => triggerFeedback('info')}
            >
              Gradient underline link
            </EnhancedLink>
            
            <EnhancedLink
              href="#"
              underlineVariant="dotted"
              onClick={() => triggerFeedback('info')}
            >
              Dotted underline link
            </EnhancedLink>
          </div>
        </motion.div>

        {/* Performance Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
        >
          <h2 className="text-2xl font-light mb-4 text-[#D4AF37]">Performance Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testMicroInteractionPerformance}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Test Performance
            </button>
            
            <button
              onClick={testMicroInteractionConsistency}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Test Consistency
            </button>
            
            <button
              onClick={testMicroInteractionAccessibility}
              className="px-4 py-3 bg-[#D4AF37] text-[#0F3B2F] rounded-lg font-medium hover:bg-[#D4AF37]/80 transition-colors"
            >
              Test Accessibility
            </button>
          </div>
        </motion.div>

        {/* Feedback Animation */}
        <FeedbackAnimation
          type={feedbackType}
          message={`${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}: Micro-interaction test completed`}
          isVisible={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </div>
    </div>
  )
}