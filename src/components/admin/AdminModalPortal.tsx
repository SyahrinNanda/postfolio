'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AdminModalPortalProps {
  children: React.ReactNode;
}

export default function AdminModalPortal({ children }: AdminModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent background body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('modal-open');
    };
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

