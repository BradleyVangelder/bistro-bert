# Bistro Bert Animation System Usage Guide

This guide provides comprehensive examples and best practices for using the animation system components in Bistro Bert.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Page Transitions](#page-transitions)
3. [Micro-interactions](#micro-interactions)
4. [Staggered Animations](#staggered-animations)
5. [Modal Animations](#modal-animations)
6. [Dropdown Animations](#dropdown-animations)
7. [Performance Optimization](#performance-optimization)
8. [Accessibility Best Practices](#accessibility-best-practices)
9. [Testing Animations](#testing-animations)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Importing Animation Components

```typescript
// Core animation utilities
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants'
import { animationPresets } from '@/utils/animations/presets'

// Animation hooks
import { usePageTransition } from '@/hooks/animations/usePageTransition'
import { useMicroInteractions } from '@/hooks/animations/useMicroInteractions'
import { useStaggeredAnimation } from '@/hooks/animations/useStaggeredAnimation'
import { useModal } from '@/hooks/animations/useModal'
import { useDropdown } from '@/hooks/animations/useDropdown'

// Animation components
import { PageTransition, LuxuryPageTransition } from '@/components/ui/PageTransition'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { MicroInteractions } from '@/components/ui/MicroInteractions'
import { StaggeredContainer, StaggeredCard } from '@/components/ui/StaggeredAnimations'
import { LuxuryModal } from '@/components/ui/LuxuryModal'
import { LuxuryDropdown } from '@/components/ui/LuxuryDropdown'
```

### Basic Animation Setup

```typescript
import { motion } from 'framer-motion'
import { ANIMATION_DURATIONS, EASING } from '@/utils/animations/constants'

function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: EASING.luxury
      }}
    >
      Content with animation
    </motion.div>
  )
}
```

## Page Transitions

### Basic Page Transition

```typescript
import { usePageTransition } from '@/hooks/animations/usePageTransition'
import { PageTransition } from '@/components/ui/PageTransition'

function App() {
  const { transitionProps } = usePageTransition()

  return (
    <PageTransition {...transitionProps}>
      <YourPageContent />
    </PageTransition>
  )
}
```

### Luxury Page Transition with Route-Specific Variants

```typescript
import { usePageTransition } from '@/hooks/animations/usePageTransition'
import { LuxuryPageTransition } from '@/components/ui/LuxuryPageTransition'

function App() {
  const { transitionProps, currentTransition } = usePageTransition({
    defaultTransition: 'luxury-reveal',
    routeTransitions: {
      '/menu': 'gold-shimmer',
      '/contact': 'immersive',
      '/about': 'elegant-fade'
    }
  })

  return (
    <>
      <LuxuryPageTransition {...transitionProps}>
        <YourPageContent />
      </LuxuryPageTransition>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/50 text-white p-2 rounded">
          Current transition: {currentTransition}
        </div>
      )}
    </>
  )
}
```

### Custom Page Transition

```typescript
import { usePageTransition } from '@/hooks/animations/usePageTransition'

function CustomPageTransition() {
  const { transitionProps } = usePageTransition({
    defaultTransition: 'custom',
    customTransitions: {
      custom: {
        initial: { opacity: 0, scale: 0.95, rotateX: 10 },
        animate: { opacity: 1, scale: 1, rotateX: 0 },
        exit: { opacity: 0, scale: 1.05, rotateX: -10 }
      }
    }
  })

  return (
    <motion.div {...transitionProps}>
      <YourPageContent />
    </motion.div>
  )
}
```

## Micro-interactions

### Animated Button

```typescript
import { AnimatedButton } from '@/components/ui/AnimatedButton'

function ExampleButtons() {
  return (
    <div className="space-x-4">
      {/* Basic animated button */}
      <AnimatedButton variant="primary">
        Primary Button
      </AnimatedButton>
      
      {/* With custom animation */}
      <AnimatedButton 
        variant="secondary"
        animationConfig={{
          whileHover: { scale: 1.05, y: -2 },
          whileTap: { scale: 0.95 }
        }}
      >
        Custom Animation
      </AnimatedButton>
      
      {/* With loading state */}
      <AnimatedButton 
        variant="luxury"
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </AnimatedButton>
    </div>
  )
}
```

### Interactive Card with Micro-interactions

```typescript
import { MicroInteractions } from '@/components/ui/MicroInteractions'

function InteractiveCard({ title, description, onClick }) {
  return (
    <MicroInteractions
      interactionType="card"
      config={{
        hover: { scale: 1.02, y: -4 },
        tap: { scale: 0.98 }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </MicroInteractions>
  )
}
```

### Form Input with Focus Animation

```typescript
import { MicroInteractions } from '@/components/ui/MicroInteractions'

function AnimatedInput({ label, value, onChange }) {
  return (
    <div className="relative">
      <MicroInteractions
        interactionType="input"
        config={{
          focus: { scale: 1.01 },
          blur: { scale: 1 }
        }}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
          placeholder={label}
        />
      </MicroInteractions>
    </div>
  )
}
```

## Staggered Animations

### Basic Staggered Container

```typescript
import { StaggeredContainer } from '@/components/ui/StaggeredAnimations'

function MenuList({ items }) {
  return (
    <StaggeredContainer
      direction="up"
      staggerDelay={100}
      initialDelay={200}
    >
      {items.map((item, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </StaggeredContainer>
  )
}
```

### Scroll-Triggered Staggered Animation

```typescript
import { ScrollTriggeredStagger } from '@/components/ui/StaggeredAnimations'

function ScrollAnimatedSection() {
  return (
    <ScrollTriggeredStagger
      direction="left"
      staggerDelay={150}
      threshold={0.2}
    >
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </ScrollTriggeredStagger>
  )
}
```

### Staggered List with Custom Animation

```typescript
import { StaggeredList } from '@/components/ui/StaggeredAnimations'

function AnimatedList({ items }) {
  return (
    <StaggeredList
      items={items}
      direction="fade"
      staggerDelay={80}
      duration={400}
      triggerOnScroll
      scrollOffset={100}
    >
      {(item, index) => (
        <div key={index} className="p-3 border-b border-gray-200">
          <span className="font-medium">{item.title}</span>
          <span className="ml-2 text-gray-500">{item.subtitle}</span>
        </div>
      )}
    </StaggeredList>
  )
}
```

### Using Staggered Animation Hook

```typescript
import { useStaggeredAnimation } from '@/hooks/animations/useStaggeredAnimation'

function CustomStaggeredComponent() {
  const { containerProps, itemProps, trigger } = useStaggeredAnimation({
    direction: 'up',
    staggerDelay: 120,
    triggerOnScroll: true
  })

  return (
    <motion.div {...containerProps}>
      {items.map((item, index) => (
        <motion.div key={index} {...itemProps(index)}>
          {item.content}
        </motion.div>
      ))}
      
      <button onClick={trigger}>Trigger Animation</button>
    </motion.div>
  )
}
```

## Modal Animations

### Basic Modal

```typescript
import { LuxuryModal } from '@/components/ui/LuxuryModal'

function ExampleModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      
      <LuxuryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        description="This is a luxury modal with smooth animations"
        variant="elegant"
        size="medium"
      >
        <div className="space-y-4">
          <p>Modal content goes here</p>
          <button onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>
      </LuxuryModal>
    </>
  )
}
```

### Modal with Custom Animation

```typescript
import { LuxuryModal } from '@/components/ui/LuxuryModal'

function CustomAnimatedModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Custom Animation Modal"
      variant="immersive"
      size="large"
      duration={800}
      showBackdrop
      backdropVariant="blur"
      closeOnBackdrop
      closeOnEscape
      showMaximizeButton
      enablePerformanceMonitoring
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Custom Modal Content</h2>
        <p>This modal uses the immersive variant with custom duration.</p>
      </div>
    </LuxuryModal>
  )
}
```

### Using Modal Hook

```typescript
import { useModal } from '@/hooks/animations/useModal'

function CustomModalComponent() {
  const modal = useModal({
    variant: 'minimal',
    enablePerformanceMonitoring: true,
    closeOnEscape: true,
    onAnimationComplete: () => console.log('Animation completed')
  })

  return (
    <>
      <button onClick={() => modal.open()}>
        Open Custom Modal
      </button>
      
      {modal.state.isOpen && (
        <motion.div
          ref={modal.modalRef}
          {...modal.getModalProps()}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <motion.div
            ref={modal.contentRef}
            {...modal.getContentProps()}
            className="bg-white rounded-lg p-6 max-w-md"
          >
            <h2>Custom Modal</h2>
            <p>This modal is controlled by the useModal hook</p>
            <button onClick={modal.close}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
```

## Dropdown Animations

### Basic Dropdown

```typescript
import { LuxuryDropdown, DropdownItem } from '@/components/ui/LuxuryDropdown'

function ExampleDropdown() {
  const items: DropdownItem[] = [
    {
      id: '1',
      label: 'Appetizers',
      value: 'appetizers',
      description: 'Start your meal with our selection'
    },
    {
      id: '2',
      label: 'Main Courses',
      value: 'mains',
      description: 'Our signature dishes'
    },
    {
      id: '3',
      label: 'Desserts',
      value: 'desserts',
      description: 'Sweet endings to your meal'
    }
  ]

  return (
    <LuxuryDropdown
      items={items}
      placeholder="Select menu category"
      variant="elegant"
      onSelect={(item) => console.log('Selected:', item)}
    />
  )
}
```

### Dropdown with Custom Styling

```typescript
import { LuxuryDropdown } from '@/components/ui/LuxuryDropdown'

function StyledDropdown() {
  return (
    <LuxuryDropdown
      items={menuItems}
      placeholder="Choose your preference"
      variant="slide"
      showBackdrop
      backdropVariant="blur"
      showChevron
      closeOnSelect={false}
      className="w-full max-w-xs"
      triggerClassName="bg-burgundy text-white"
      dropdownClassName="mt-2"
      itemClassName="hover:bg-gold/10"
    />
  )
}
```

### Using Dropdown Hook

```typescript
import { useDropdown } from '@/hooks/animations/useDropdown'

function CustomDropdown() {
  const dropdown = useDropdown({
    variant: 'scale',
    position: 'bottom-right',
    enablePerformanceMonitoring: true,
    closeOnOutsideClick: true
  })

  return (
    <>
      <button
        ref={dropdown.triggerRef}
        onClick={() => dropdown.toggle()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Custom Dropdown
      </button>
      
      {dropdown.state.isOpen && (
        <motion.div
          ref={dropdown.dropdownRef}
          {...dropdown.getDropdownProps()}
          style={{
            position: 'fixed',
            ...dropdown.getPosition()
          }}
          className="bg-white rounded-lg shadow-lg p-2"
        >
          <motion.div {...dropdown.getItemsProps()}>
            {items.map(item => (
              <div key={item.id} className="p-2 hover:bg-gray-100">
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
```

## Performance Optimization

### Performance Monitoring

```typescript
import { performanceMonitor } from '@/utils/animations/performance'

function MonitoredAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    // Start monitoring
    performanceMonitor.startMonitoring('custom-animation', 'important')
    setIsAnimating(true)
    
    // Stop monitoring after animation
    setTimeout(() => {
      const metrics = performanceMonitor.stopMonitoring('custom-animation')
      
      if (metrics.frameRate < 30) {
        console.warn('Low frame rate detected:', metrics)
      }
      
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <motion.div
      animate={isAnimating ? { scale: 1.1, rotate: 5 } : {}}
      transition={{ duration: 1 }}
      className="w-20 h-20 bg-blue-500 rounded"
    />
  )
}
```

### Device-Specific Optimizations

```typescript
import { PerformanceOptimizer } from '@/utils/animations/performance'

function OptimizedAnimation() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // Optimize for current device
    const optimized = PerformanceOptimizer.optimizeForDevice({
      duration: 600,
      complexity: 5
    })
    
    setConfig(optimized)
  }, [])

  if (!config) return null

  return (
    <motion.div
      animate={config.reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: config.duration / 1000 }}
      className="optimized-component"
    >
      Content optimized for device performance
    </motion.div>
  )
}
```

### Hardware Acceleration

```typescript
import { HardwareAccelerationHelper } from '@/utils/animations/performance'

function AcceleratedAnimation() {
  const elementRef = useRef(null)

  useEffect(() => {
    // Apply hardware acceleration
    if (elementRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(elementRef.current)
    }

    // Cleanup
    return () => {
      if (elementRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(elementRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      ref={elementRef}
      animate={{ rotate: 360 }}
      transition={{ duration: 2 }}
      className="w-16 h-16 bg-green-500 rounded"
    />
  )
}
```

## Accessibility Best Practices

### Reduced Motion Support

```typescript
import { createSafeAnimationProps } from '@/utils/animations/accessibility'

function AccessibleAnimation() {
  const animationProps = createSafeAnimationProps(
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    { respectReducedMotion: true }
  )

  return (
    <motion.div {...animationProps}>
      Content that respects reduced motion preferences
    </motion.div>
  )
}
```

### Focus Management

```typescript
function AccessibleModal() {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef(null)

  // Handle focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Find first focusable element
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
  }, [isOpen])

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      modalRef={modalRef}
      ariaLabel="Example modal"
      ariaDescribedBy="modal-description"
    >
      <div id="modal-description">
        Modal content with proper accessibility
      </div>
    </LuxuryModal>
  )
}
```

### High Contrast Support

```typescript
import { AccessibilityAnimationAdapter } from '@/utils/animations/accessibility'

function HighContrastAnimation() {
  const baseAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }

  const adaptedAnimation = AccessibilityAnimationAdapter.adaptAnimation(
    baseAnimation,
    { highContrast: true }
  )

  return (
    <motion.div {...adaptedAnimation}>
      Content adapted for high contrast mode
    </motion.div>
  )
}
```

## Testing Animations

### Performance Testing

```typescript
import { testAnimationPerformance } from '@/utils/animations/testing'

async function testAnimation() {
  const results = await testAnimationPerformance('test-animation', async () => {
    // Perform animation
    await performComplexAnimation()
  })

  console.log('Performance results:', results)
  
  if (results.averageFrameRate < 55) {
    console.warn('Animation performance below optimal')
  }
}
```

### Consistency Testing

```typescript
import { testAnimationConsistency } from '@/utils/animations/testing'

async function testConsistency() {
  const variants = {
    variant1: { opacity: 0, y: 20 },
    variant2: { opacity: 0, y: 20 },
    variant3: { opacity: 0, y: 20 }
  }

  const results = await testAnimationConsistency(
    'animation-group',
    variants,
    ['opacity', 'y']
  )

  if (!results.isConsistent) {
    console.error('Animation inconsistencies found:', results.issues)
  }
}
```

### Accessibility Testing

```typescript
import { testAnimationAccessibility } from '@/utils/animations/testing'

async function testAccessibility() {
  const results = await testAnimationAccessibility(
    'test-animation',
    {
      variants: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      },
      transition: { duration: 0.5 }
    }
  )

  console.log('Accessibility results:', results)
}
```

## Troubleshooting

### Common Issues and Solutions

#### Animation Not Working
1. Check if Framer Motion is properly installed
2. Verify component is wrapped in `AnimatePresence` if using exit animations
3. Ensure correct prop names and values
4. Check browser console for errors

#### Low Performance
1. Reduce animation complexity
2. Use transform and opacity properties
3. Apply hardware acceleration
4. Implement lazy loading for off-screen animations

#### Accessibility Issues
1. Test with reduced motion preferences
2. Ensure proper focus management
3. Add appropriate ARIA labels
4. Test with screen readers

#### Mobile Issues
1. Reduce animation complexity on smaller screens
2. Use touch-friendly interaction areas
3. Test on actual devices
4. Implement proper touch event handling

### Debug Tools

```typescript
// Enable debug mode for animations
const DEBUG_ANIMATIONS = process.env.NODE_ENV === 'development'

function DebugAnimation() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2 }}
      onAnimationStart={() => DEBUG_ANIMATIONS && console.log('Animation started')}
      onAnimationComplete={() => DEBUG_ANIMATIONS && console.log('Animation completed')}
      className="debug-animation"
    />
  )
}
```

### Performance Profiling

```typescript
import { performanceMonitor } from '@/utils/animations/performance'

// Enable performance monitoring in development
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    // Log performance metrics every 5 seconds
    const interval = setInterval(() => {
      const metrics = performanceMonitor.getInsights()
      console.log('Animation performance:', metrics)
    }, 5000)

    return () => clearInterval(interval)
  }
}, [])
```

This comprehensive guide provides examples and best practices for using all animation components in the Bistro Bert application. For more specific use cases, refer to the individual component documentation and test pages.