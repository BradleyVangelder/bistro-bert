'use client'

import ActionButton from '@/components/ui/ActionButton'
import { useReservation } from '@/contexts/ReservationContext'

export function FaqReserveButton() {
  const { open } = useReservation()

  const handleReserveClick = () => {
    open()
  }

  return (
    <ActionButton
      onClick={handleReserveClick}
      variant="reserve"
      ariaLabel="Reserveer een tafel bij Bistro Bert"
      dataZcAction="open"
    >
      Reserveer een tafel
    </ActionButton>
  )
}
