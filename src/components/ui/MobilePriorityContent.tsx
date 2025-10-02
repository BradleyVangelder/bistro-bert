import { ReactNode } from 'react';

interface MobilePriorityContentProps {
  primary: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
}

export default function MobilePriorityContent({ 
  primary, 
  secondary, 
  tertiary 
}: MobilePriorityContentProps) {
  return (
    <div className="space-y-4">
      {/* Primary content - always visible */}
      <div className="order-1">
        {primary}
      </div>
      
      {/* Secondary content - visible on medium screens and up */}
      {secondary && (
        <div className="hidden md:block order-2">
          {secondary}
        </div>
      )}
      
      {/* Tertiary content - visible on large screens only */}
      {tertiary && (
        <div className="hidden lg:block order-3">
          {tertiary}
        </div>
      )}
    </div>
  );
}