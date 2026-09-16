'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const brandHref = pathname === '/' ? '#top' : '/';

  return (
    <header className="site-header" id="top">
      <Link className="brand" href={brandHref} aria-label="Beranda As'syahrin Nanda" onClick={closeMenu}>
        <span className="brand-mark">AN</span>
        <span>{pathname.startsWith('/articles') ? 'syahrin.notes' : 'syahrin.dev'}</span>
      </Link>
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
      </button>
      <nav
        ref={navRef}
        className={`main-nav${open ? ' open' : ''}`}
        id="main-nav"
        aria-label="Navigasi utama"
      >
        <Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined} onClick={closeMenu}>Tentang</Link>
        <Link href="/projects" aria-current={pathname.startsWith('/projects') ? 'page' : undefined} onClick={closeMenu}>Project</Link>
        <Link href="/skills" aria-current={pathname === '/skills' ? 'page' : undefined} onClick={closeMenu}>Skills</Link>
        <Link href="/experience" aria-current={pathname === '/experience' ? 'page' : undefined} onClick={closeMenu}>Pengalaman</Link>
        <Link href="/articles" aria-current={pathname.startsWith('/articles') ? 'page' : undefined} onClick={closeMenu}>Artikel</Link>
      </nav>
      <Link
        className="header-cta"
        href="/contact"
        aria-current={pathname === '/contact' ? 'page' : undefined}
        onClick={closeMenu}
      >
        Mari bicara <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
