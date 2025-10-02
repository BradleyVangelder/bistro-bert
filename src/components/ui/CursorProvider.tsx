'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface CursorContextType {
  mousePosition: { x: number; y: number }
  cursorVariant: string
  setCursorVariant: (variant: string) => void
  hoveredElement: string | null
  setHoveredElement: (element: string | null) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export function CursorProvider({ children }: { children: ReactNode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <CursorContext.Provider value={{
      mousePosition,
      cursorVariant,
      setCursorVariant,
      hoveredElement,
      setHoveredElement
    }}>
      {/* Global Custom Cursor */}
      <div
        className={`fixed w-8 h-8 rounded-full pointer-events-none z-50 transition-all duration-200 ease-out mix-blend-difference ${
          cursorVariant === 'hover' ? 'scale-150 bg-white/20' : 'scale-100 bg-white/10'
        }`}
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      />

      {/* Secondary cursor effect */}
      <div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-40 transition-all duration-300 ease-out bg-[#0F3B2F]/20"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: cursorVariant === 'hover' ? 'scale(2)' : 'scale(1)',
        }}
      />

      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}