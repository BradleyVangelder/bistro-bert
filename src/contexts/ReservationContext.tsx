'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import ReservationModal from '@/components/reservation/ReservationModal'

interface ReservationContextType {
    open: () => void
    close: () => void
    isOpen: boolean
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    return (
        <ReservationContext.Provider value={{ open, close, isOpen }}>
            {children}
            <ReservationModal isOpen={isOpen} onClose={close} />
        </ReservationContext.Provider>
    )
}

export function useReservation() {
    const context = useContext(ReservationContext)
    if (context === undefined) {
        throw new Error('useReservation must be used within a ReservationProvider')
    }
    return context
}
