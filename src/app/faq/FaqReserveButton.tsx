'use client'

import ActionButton from '@/components/ui/ActionButton'
import { openZenchefWidget } from '@/utils/zenchef'

export function FaqReserveButton() {
  const handleReserveClick = () => {
    const widgetOpened = openZenchefWidget()
    if (!widgetOpened) {
      console.warn('Zenchef widget niet beschikbaar. Gelieve later opnieuw te proberen.')
    }
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
