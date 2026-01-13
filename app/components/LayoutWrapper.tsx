'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AIChat from './AIChat';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarOn = ['/', '/login'];
  const shouldShowNavbar = !hideNavbarOn.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
      {shouldShowNavbar && <AIChat />}
    </>
  );
}
