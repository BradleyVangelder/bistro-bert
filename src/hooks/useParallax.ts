import { useState, useEffect } from 'react'

export const useParallax = (speed: number = 0.5) => {
  const [y, setY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      setY(rate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [speed])

  return { y }
}