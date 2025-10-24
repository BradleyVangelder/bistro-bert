import { Metadata } from 'next'
import AnimationDemo from '@/components/ui/AnimationDemo'

export const metadata: Metadata = {
  title: 'Luxury Animations | Bistro Bert',
  description: 'Experience sophisticated modal and dropdown animations designed for the Bistro Bert application',
}

export default function AnimationsPage() {
  return (
    <div className="min-h-screen">
      <AnimationDemo />
    </div>
  )
}