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

  // Only apply navbar-spacer when NOT on the home page
  const isHomePage = isClient && pathname === '/';
  const mainClassName = isHomePage ? "" : "navbar-spacer";

  return (
    <main id="main-content" role="main" tabIndex={-1} className={mainClassName}>
      {children}
    </main>
  );
}