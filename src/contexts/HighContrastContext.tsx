'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface HighContrastContextType {
  isHighContrast: boolean
  toggleHighContrast: () => void
}

const HighContrastContext = createContext<HighContrastContextType | undefined>(undefined)

export function useHighContrast() {
  const context = useContext(HighContrastContext)
  if (!context) {
    throw new Error('useHighContrast must be used within a HighContrastProvider')
  }
  return context
}

interface HighContrastProviderProps {
  children: ReactNode
}

export function HighContrastProvider({ children }: HighContrastProviderProps) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load state from localStorage on mount (only on client)
  useEffect(() => {
    if (!isClient) return
    
    try {
      const savedState = localStorage.getItem('high-contrast')
      if (savedState !== null) {
        setIsHighContrast(JSON.parse(savedState))
      }
    } catch (error) {
      console.warn('Failed to read high-contrast setting from localStorage:', error)
    }
  }, [isClient])

  // Save state to localStorage whenever it changes (only on client)
  useEffect(() => {
    if (!isClient) return
    
    try {
      localStorage.setItem('high-contrast', JSON.stringify(isHighContrast))
    } catch (error) {
      console.warn('Failed to save high-contrast setting to localStorage:', error)
    }
  }, [isHighContrast, isClient])

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev)
  }

  return (
    <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  )
}