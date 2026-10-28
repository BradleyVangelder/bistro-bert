"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're on the client side before using pathname
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only apply navbar-spacer on pages without a full-screen photo hero
  const hasPhotoHero = isClient && (pathname === '/' || pathname === '/business-lunch');
  const mainClassName = hasPhotoHero ? "" : "navbar-spacer";

  return (
    <main id="main-content" role="main" tabIndex={-1} className={mainClassName}>
      {children}
    </main>
  );
}