'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface TouchInteractionProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onLongPress?: () => void
  disabled?: boolean
  className?: string
  touchAction?: 'none' | 'auto' | 'pan-x' | 'pan-y' | 'manipulation'
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isLongPress: boolean
  hasMoved: boolean
}

export function TouchInteraction({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  disabled = false,
  className = '',
  touchAction
}: TouchInteractionProps) {
  const [touchState, setTouchState] = useState<TouchState | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  const calculateSwipeDirection = useCallback((endX: number, endY: number, startX: number, startY: number) => {
    const deltaX = endX - startX
    const deltaY = endY - startY
    const minSwipeDistance = 30 // Reduced for better mobile experience

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return null
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    console.log('[TouchInteraction] 👆 Touch start at:', touch.clientX, touch.clientY);
    console.log('[TouchInteraction] Touch action:', touchAction);
    
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isLongPress: false,
      hasMoved: false
    })

    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      setTouchState(prev => prev ? { ...prev, isLongPress: true } : null)
      onLongPress?.()
    }, 500)
  }, [disabled, onLongPress, touchAction])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchState) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchState.startX)
    const deltaY = Math.abs(touch.clientY - touchState.startY)
    
    // Log significant movements
    if (deltaX > 10 || deltaY > 10) {
      console.log('[TouchInteraction] 📱 Touch move - deltaX:', deltaX, 'deltaY:', deltaY);
      
      // If we've moved enough, clear the long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
        setTouchState(prev => prev ? { ...prev, hasMoved: true } : null)
      }
    }
    
    // Only prevent default for horizontal swipes when touchAction is 'pan-y'
    // This allows vertical scrolling to work naturally
    if (touchAction === 'pan-y' && deltaX > deltaY && deltaX > 15) {
      e.preventDefault()
    } else if (touchAction === 'none') {
      e.preventDefault()
    }
    
    // Add haptic feedback for mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator && (deltaX > 30 || deltaY > 30)) {
      navigator.vibrate(10)
    }
  }, [disabled, touchState, touchAction])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchState) return

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    const touch = e.changedTouches[0]
    const direction = calculateSwipeDirection(
      touch.clientX,
      touch.clientY,
      touchState.startX,
      touchState.startY
    )

    const touchDuration = Date.now() - touchState.startTime
    const isQuickTap = touchDuration < 300 && !touchState.hasMoved

    // Add haptic feedback for gestures
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (direction) {
        navigator.vibrate(20)
      } else if (isQuickTap) {
        navigator.vibrate(5)
      }
    }

    if (direction) {
      switch (direction) {
        case 'left':
          onSwipeLeft?.()
          break
        case 'right':
          onSwipeRight?.()
          break
        case 'up':
          onSwipeUp?.()
          break
        case 'down':
          onSwipeDown?.()
          break
      }
    } else if (isQuickTap && !touchState.isLongPress) {
      onTap?.()
    }

    setTouchState(null)
  }, [disabled, touchState, calculateSwipeDirection, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap])

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevent click if we just had a touch interaction
    if (touchState) {
      e.preventDefault()
    }
  }, [touchState])

  return (
    <div
      ref={elementRef}
      className={`${className} touch-optimized`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        touchAction: disabled ? 'none' : (touchAction || 'auto'),
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'rgba(128, 0, 32, 0.1)',
      }}
    >
      {children}
    </div>
  )
}

export function useSwipeGestures(
  element: HTMLElement | null,
  {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50
  }: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    threshold?: number
  } = {}
) {
  useEffect(() => {
    if (!element) return

    let touchState: TouchState | null = null
    let longPressTimer: NodeJS.Timeout | null = null

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchState = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isLongPress: false,
        hasMoved: false
      }

      longPressTimer = setTimeout(() => {
        touchState = touchState ? { ...touchState, isLongPress: true } : null
      }, 500)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState) return

      const touch = e.touches[0]
      const deltaX = Math.abs(touch.clientX - touchState.startX)
      const deltaY = Math.abs(touch.clientY - touchState.startY)

      if ((deltaX > 10 || deltaY > 10) && longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
        touchState = { ...touchState, hasMoved: true }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchState) return

      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchState.startX
      const deltaY = touch.clientY - touchState.startY

      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      } else if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }

      touchState = null
    }

    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchmove', handleTouchMove)
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [element, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])
}