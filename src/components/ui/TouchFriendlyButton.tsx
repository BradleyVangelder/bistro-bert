import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TouchFriendlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export default function TouchFriendlyButton({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}: TouchFriendlyButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    secondary: 'bg-white text-black border border-black hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[44px]', // Minimum touch target size
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[52px]',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}