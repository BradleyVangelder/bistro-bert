'use client'

import { useEffect, useState } from 'react'
import ActionButton from '@/components/ui/ActionButton'
import { useReservation } from '@/contexts/ReservationContext'

export default function MobileReserveerBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { open } = useReservation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      // Show after scrolling past hero section
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  if (!isMobile || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="container-dh px-4 py-3">
        <ActionButton
          onClick={open}
          variant="reserve"
          className="w-full"
          ariaLabel="Reserveer een tafel bij Bistro Bert"
        >
          Reserveer een tafel
        </ActionButton>
      </div>
    </div>
  )
}