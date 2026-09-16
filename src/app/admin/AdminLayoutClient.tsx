'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/components/admin/AdminContext';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Dynamically update favicon in browser tab when navigating to admin
    const updateFavicon = (href: string) => {
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (iconLink) {
        iconLink.href = href;
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    updateFavicon('/favicon-admin.svg');

    return () => {
      // Revert to portfolio yellow favicon on leaving admin
      updateFavicon('/favicon.svg');
    };
  }, []);

  // Login page has its own full-page layout without admin sidebar/topbar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

