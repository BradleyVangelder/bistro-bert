'use client'

import { useState, useEffect } from 'react'

interface FocusVisibleProps {
  children: React.ReactNode
  className?: string
  focusClassName?: string
  visibleClassName?: string
}

export function FocusVisible({
  children,
  className = '',
  focusClassName = 'ring-2 ring-offset-2 ring-burgundy ring-offset-white',
  visibleClassName = ''
}: FocusVisibleProps) {
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      setIsKeyboardUser(true)
    }
  }

  const handleMouseDown = () => {
    setIsKeyboardUser(false)
  }

  const handleFocusIn = () => {
    if (isKeyboardUser) {
      setIsFocusVisible(true)
    }
  }

  const handleFocusOut = () => {
    setIsFocusVisible(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isKeyboardUser])

  return (
    <div
      className={`
        ${className}
        ${isFocusVisible ? focusClassName : ''}
        ${visibleClassName}
      `}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      {children}
    </div>
  )
}

export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true)
      }
    }

    const handleMouseDown = () => {
      setIsFocusVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return { isFocusVisible, setIsFocusVisible }
}