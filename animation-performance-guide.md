# Bistro Bert Animation Performance Optimization Guide

This guide provides comprehensive strategies and best practices for optimizing animation performance in the Bistro Bert application.

## Table of Contents

1. [Performance Fundamentals](#performance-fundamentals)
2. [Animation Best Practices](#animation-best-practices)
3. [Device-Specific Optimizations](#device-specific-optimizations)
4. [Performance Monitoring](#performance-monitoring)
5. [Common Performance Issues](#common-performance-issues)
6. [Optimization Techniques](#optimization-techniques)
7. [Testing Performance](#testing-performance)
8. [Performance Metrics](#performance-metrics)

## Performance Fundamentals

### Understanding the Rendering Pipeline

1. **Layout**: Calculate element positions and dimensions
2. **Paint**: Fill pixels with colors, images, etc.
3. **Composite**: Combine layers to create the final image

### The 60fps Target

- **16ms per frame**: The budget for each animation frame
- **120fps for high-refresh displays**: Target for smooth animations
- **Consistent frame timing**: More important than average frame rate

### GPU Acceleration

```typescript
// Good: GPU-accelerated properties
const goodAnimation = {
  transform: 'translateX(100px)',
  opacity: 0.5,
  filter: 'blur(5px)'
}

// Bad: Layout-triggering properties
const badAnimation = {
  left: '100px',
  width: '200px',
  margin: '20px'
}
```

## Animation Best Practices

### Use Transform and Opacity

```typescript
// ✅ Optimized animation
<motion.div
  animate={{ 
    x: 100,           // Transform property
    opacity: 0.5,     // Opacity property
    scale: 1.2        // Transform property
  }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// ❌ Non-optimized animation
<motion.div
  animate={{ 
    left: 100,        // Layout property
    width: 200,       // Layout property
    margin: 20        // Layout property
  }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Apply Hardware Acceleration Strategically

```typescript
import { HardwareAccelerationHelper } from '@/utils/animations/performance'

function OptimizedComponent() {
  const elementRef = useRef(null)

  useEffect(() => {
    // Apply hardware acceleration for complex animations
    if (elementRef.current) {
      HardwareAccelerationHelper.applyHardwareAcceleration(elementRef.current)
    }

    return () => {
      // Clean up hardware acceleration
      if (elementRef.current) {
        HardwareAccelerationHelper.removeHardwareAcceleration(elementRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      ref={elementRef}
      animate={{ rotate: 360, scale: 1.1 }}
      transition={{ duration: 1 }}
      className="complex-animation"
    >
      Content
    </motion.div>
  )
}
```

### Use Will-Change Property Wisely

```typescript
// ✅ Strategic use of will-change
<motion.div
  style={{ willChange: 'transform, opacity' }}
  animate={{ x: 100, opacity: 0.5 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// ❌ Overuse of will-change
<motion.div
  style={{ willChange: 'transform, opacity, width, height, color' }}
  animate={{ x: 100 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Device-Specific Optimizations

### Detect Device Capabilities

```typescript
import { PerformanceOptimizer } from '@/utils/animations/performance'

function AdaptiveAnimation() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // Get device-optimized configuration
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
      className="device-optimized"
    >
      Content optimized for {config.deviceTier}
    </motion.div>
  )
}
```

### Reduce Animation Complexity on Mobile

```typescript
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

function ResponsiveAnimation() {
  const { isMobile, isTablet } = useDeviceDetection()

  const animationConfig = {
    duration: isMobile ? 300 : 600,
    ease: isMobile ? "easeOut" : [0.22, 1, 0.36, 1],
    stagger: isMobile ? 50 : 100
  }

  return (
    <StaggeredContainer
      staggerDelay={animationConfig.stagger}
      duration={animationConfig.duration}
      ease={animationConfig.ease}
    >
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </StaggeredContainer>
  )
}
```

### Implement Device-Specific Easing

```typescript
function getEasingForDevice(deviceTier: string) {
  switch (deviceTier) {
    case 'low':
      return 'easeOut' // Simple easing for low-end devices
    case 'medium':
      return [0.25, 0.46, 0.45, 0.94] // Moderate easing
    case 'high':
      return [0.22, 1, 0.36, 1] // Luxury easing for high-end devices
    default:
      return 'easeOut'
  }
}
```

## Performance Monitoring

### Real-time Performance Monitoring

```typescript
import { performanceMonitor } from '@/utils/animations/performance'

function MonitoredAnimation() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Start monitoring
    performanceMonitor.startMonitoring('monitored-animation', 'important')

    // Update metrics every second
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getInsights()
      setMetrics(currentMetrics)
    }, 1000)

    return () => {
      clearInterval(interval)
      performanceMonitor.stopMonitoring('monitored-animation')
    }
  }, [])

  return (
    <div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2 }}
        className="monitored-animation"
      >
        Content
      </motion.div>
      
      {metrics && (
        <div className="performance-metrics">
          <p>Frame Rate: {metrics.frameRate} FPS</p>
          <p>Dropped Frames: {metrics.droppedFrames}</p>
          <p>Performance Score: {metrics.performanceScore}</p>
        </div>
      )}
    </div>
  )
}
```

### Performance Thresholds

```typescript
const PERFORMANCE_THRESHOLDS = {
  excellent: { minFrameRate: 58, maxDroppedFrames: 2 },
  good: { minFrameRate: 45, maxDroppedFrames: 5 },
  acceptable: { minFrameRate: 30, maxDroppedFrames: 10 },
  poor: { minFrameRate: 0, maxDroppedFrames: Infinity }
}

function getPerformanceGrade(frameRate: number, droppedFrames: number) {
  if (frameRate >= PERFORMANCE_THRESHOLDS.excellent.minFrameRate && 
      droppedFrames <= PERFORMANCE_THRESHOLDS.excellent.maxDroppedFrames) {
    return 'excellent'
  } else if (frameRate >= PERFORMANCE_THRESHOLDS.good.minFrameRate && 
             droppedFrames <= PERFORMANCE_THRESHOLDS.good.maxDroppedFrames) {
    return 'good'
  } else if (frameRate >= PERFORMANCE_THRESHOLDS.acceptable.minFrameRate && 
             droppedFrames <= PERFORMANCE_THRESHOLDS.acceptable.maxDroppedFrames) {
    return 'acceptable'
  } else {
    return 'poor'
  }
}
```

## Common Performance Issues

### Layout Thrashing

```typescript
// ❌ Layout thrashing - causes multiple layout recalculations
function BadAnimation() {
  const [state, setState] = useState(0)
  
  useEffect(() => {
    // Reading layout properties (triggers layout)
    const width = elementRef.current.offsetWidth
    
    // Writing layout properties (triggers layout)
    elementRef.current.style.left = `${width}px`
    
    // Reading again (triggers another layout)
    const height = elementRef.current.offsetHeight
    
    // Writing again (triggers another layout)
    elementRef.current.style.top = `${height}px`
  }, [state])
  
  return <div ref={elementRef} />
}

// ✅ Batched operations - single layout recalculation
function GoodAnimation() {
  const [state, setState] = useState(0)
  
  useEffect(() => {
    // Read all layout properties first
    const element = elementRef.current
    const width = element.offsetWidth
    const height = element.offsetHeight
    
    // Write all layout properties at once
    element.style.transform = `translate(${width}px, ${height}px)`
  }, [state])
  
  return <div ref={elementRef} />
}
```

### Excessive DOM Manipulation

```typescript
// ❌ Too many animated elements
function BadPerformance() {
  return (
    <div>
      {Array.from({ length: 1000 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          Item {i}
        </motion.div>
      ))}
    </div>
  )
}

// ✅ Optimized with reduced complexity
function GoodPerformance() {
  return (
    <StaggeredContainer
      staggerDelay={10}
      duration={200}
      direction="fade"
    >
      {Array.from({ length: 1000 }).map((_, i) => (
        <div key={i}>Item {i}</div>
      ))}
    </StaggeredContainer>
  )
}
```

### Memory Leaks

```typescript
// ❌ Memory leak - not cleaning up
function LeakyComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Animation logic
    }, 16)
    
    // Missing cleanup
  }, [])
  
  return <div />
}

// ✅ Proper cleanup
function CleanComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Animation logic
    }, 16)
    
    return () => clearInterval(interval)
  }, [])
  
  return <div />
}
```

## Optimization Techniques

### Lazy Loading Animations

```typescript
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

function LazyAnimatedComponent() {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  // Trigger animation when element comes into view
  useIntersectionObserver(elementRef, {
    threshold: 0.1,
    onIntersect: () => setIsVisible(true)
  })

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      Content
    </motion.div>
  )
}
```

### Animation Batching

```typescript
import { useAnimationBatch } from '@/hooks/useAnimationBatch'

function BatchedAnimations() {
  const { batchAnimations } = useAnimationBatch()

  const handleMultipleAnimations = () => {
    batchAnimations([
      { target: element1Ref.current, animation: { x: 100 } },
      { target: element2Ref.current, animation: { y: 100 } },
      { target: element3Ref.current, animation: { scale: 1.2 } }
    ])
  }

  return (
    <div>
      <motion.div ref={element1Ref} />
      <motion.div ref={element2Ref} />
      <motion.div ref={element3Ref} />
      <button onClick={handleMultipleAnimations}>
        Animate All
      </button>
    </div>
  )
}
```

### Reduce Animation Quality Under Load

```typescript
import { usePerformanceAdaptive } from '@/hooks/usePerformanceAdaptive'

function AdaptiveQualityAnimation() {
  const { quality, shouldReduceQuality } = usePerformanceAdaptive()

  const animationConfig = {
    duration: shouldReduceQuality ? 200 : 600,
    ease: shouldReduceQuality ? 'easeOut' : [0.22, 1, 0.36, 1],
    stagger: shouldReduceQuality ? 20 : 100
  }

  return (
    <StaggeredContainer
      staggerDelay={animationConfig.stagger}
      duration={animationConfig.duration}
      ease={animationConfig.ease}
    >
      {items.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </StaggeredContainer>
  )
}
```

## Testing Performance

### Performance Testing Framework

```typescript
import { testAnimationPerformance } from '@/utils/animations/testing'

async function runPerformanceTests() {
  const testCases = [
    {
      name: 'simple-transition',
      animation: async () => {
        await animateElement({ opacity: 0.5 })
      }
    },
    {
      name: 'complex-transform',
      animation: async () => {
        await animateElement({ x: 100, y: 100, scale: 1.2, rotate: 45 })
      }
    },
    {
      name: 'staggered-animation',
      animation: async () => {
        await animateStaggeredElements()
      }
    }
  ]

  for (const testCase of testCases) {
    const results = await testAnimationPerformance(testCase.name, testCase.animation)
    
    console.log(`${testCase.name} results:`, {
      frameRate: results.averageFrameRate,
      droppedFrames: results.droppedFrames,
      performanceGrade: getPerformanceGrade(results.averageFrameRate, results.droppedFrames)
    })
  }
}
```

### Automated Performance Regression Testing

```typescript
function setupPerformanceRegressionTests() {
  const baselineMetrics = {
    simpleTransition: { minFrameRate: 58, maxDroppedFrames: 2 },
    complexTransform: { minFrameRate: 55, maxDroppedFrames: 3 },
    staggeredAnimation: { minFrameRate: 50, maxDroppedFrames: 5 }
  }

  return async function runRegressionTests() {
    const results = await runPerformanceTests()
    const regressions = []

    for (const [testName, baseline] of Object.entries(baselineMetrics)) {
      const result = results[testName]
      
      if (result.averageFrameRate < baseline.minFrameRate || 
          result.droppedFrames > baseline.maxDroppedFrames) {
        regressions.push({
          test: testName,
          expected: baseline,
          actual: {
            frameRate: result.averageFrameRate,
            droppedFrames: result.droppedFrames
          }
        })
      }
    }

    if (regressions.length > 0) {
      console.error('Performance regressions detected:', regressions)
      throw new Error('Performance regression detected')
    }
  }
}
```

## Performance Metrics

### Key Performance Indicators

```typescript
interface AnimationMetrics {
  // Frame rate metrics
  frameRate: number
  averageFrameRate: number
  minFrameRate: number
  maxFrameRate: number
  
  // Frame consistency
  droppedFrames: number
  frameDrops: number[]
  frameTimeVariance: number
  
  // Memory metrics
  memoryUsage: number
  memoryLeakDetected: boolean
  
  // Timing metrics
  animationDuration: number
  actualDuration: number
  startTime: number
  endTime: number
  
  // Performance score
  performanceScore: number
  performanceGrade: 'excellent' | 'good' | 'acceptable' | 'poor'
}
```

### Performance Score Calculation

```typescript
function calculatePerformanceScore(metrics: Partial<AnimationMetrics>): number {
  const weights = {
    frameRate: 0.4,
    frameConsistency: 0.3,
    memoryEfficiency: 0.2,
    timingAccuracy: 0.1
  }

  const frameRateScore = Math.min(metrics.frameRate / 60, 1)
  const consistencyScore = 1 - (metrics.droppedFrames / 100)
  const memoryScore = metrics.memoryLeakDetected ? 0 : 1
  const timingScore = metrics.actualDuration ? metrics.animationDuration / metrics.actualDuration : 1

  return (
    frameRateScore * weights.frameRate +
    consistencyScore * weights.frameConsistency +
    memoryScore * weights.memoryEfficiency +
    timingScore * weights.timingAccuracy
  ) * 100
}
```

### Performance Dashboard

```typescript
function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<AnimationMetrics[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const currentMetrics = performanceMonitor.getInsights()
        setMetrics(prev => [...prev.slice(-100), currentMetrics])
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  return (
    <div className="performance-dashboard">
      <button onClick={() => setIsMonitoring(!isMonitoring)}>
        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>
      
      {metrics.length > 0 && (
        <div className="metrics-display">
          <div className="metric">
            <h3>Frame Rate</h3>
            <div className="chart">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{ height: `${(m.frameRate / 60) * 100}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="metric">
            <h3>Performance Score</h3>
            <div className="score">
              {metrics[metrics.length - 1]?.performanceScore.toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

By following these performance optimization guidelines, you can ensure that animations in the Bistro Bert application run smoothly across all devices while maintaining the luxury aesthetic and user experience.