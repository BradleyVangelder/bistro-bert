import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface BlackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  href?: string
  variant?: 'solid' | 'outline'
  className?: string
}

export default function BlackButton({ 
  children, 
  href, 
  variant = 'solid',
  className = '',
  ...props 
}: BlackButtonProps) {
  const baseClasses = 'inline-block px-6 py-3 typography-button w-full sm:w-auto text-center min-w-0 transition-colors'
  
  const variantClasses = {
    solid: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-black text-black hover:bg-black hover:text-white'
  }
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}