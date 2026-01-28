'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuxuryModal } from '@/components/ui/LuxuryModal'
import { useReservation } from '@/contexts/ReservationContext'
import ActionButton from '@/components/ui/ActionButton'

// Set to end of February 15th (23:59:59) in local time
const VALENTINE_END_DATE = new Date(2026, 1, 15, 23, 59, 59)
const MODAL_DELAY = 2500 // 2.5 seconds
const STORAGE_KEY = 'valentine-modal-shown'

export default function ValentineModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { open: openReservation } = useReservation()

  useEffect(() => {
    setIsClient(true)

    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Check if promotion has ended
    const now = new Date()
    if (now > VALENTINE_END_DATE) {
      return
    }

    // Check if user has already seen the modal this session
    const hasSeenModal = sessionStorage.getItem(STORAGE_KEY)
    if (hasSeenModal) {
      return
    }

    // Show modal after delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, MODAL_DELAY)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  const handleViewMenu = () => {
    handleClose()
    router.push('/menu?tab=valentine')
  }

  const handleReserve = () => {
    handleClose()
    openReservation()
  }

  // Don't render on server
  if (!isClient) {
    return null
  }

  // Don't render if promotion has ended
  const now = new Date()
  if (now > VALENTINE_END_DATE) {
    return null
  }

  return (
    <LuxuryModal
      isOpen={isOpen}
      onClose={handleClose}
      size="medium"
      title="Valentijnsmenu"
      showBackdrop={true}
      backdropVariant="fade"
      backdropOpacity={0.75}
      backdropColor="rgba(0, 0, 0, 0.75)"
      closeOnBackdrop={true}
      closeOnEscape={true}
      showCloseButton={true}
      modalClassName="border border-gray-200/80 shadow-2xl"
      ariaLabel="Valentijnsmenu promotie"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="space-y-3 max-w-sm">
          <p className="typography-body text-gray-700">
            Vier Valentijn met een exclusief menu, enkel op reservatie.
          </p>
          <p className="typography-caption text-gray-500">
            13–15 februari
          </p>
        </div>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <ActionButton
            onClick={handleViewMenu}
            variant="menu"
            ariaLabel="Bekijk het Valentijnsmenu"
          >
            Bekijk het Menu
          </ActionButton>
          <ActionButton
            onClick={handleReserve}
            variant="reserve"
            ariaLabel="Reserveer voor Valentijn"
            dataZcAction="open"
          >
            Reserveer Nu
          </ActionButton>
        </div>
      </div>
    </LuxuryModal>
  )
}
