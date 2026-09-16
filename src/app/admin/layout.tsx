import type { Metadata, Viewport } from 'next';
import './admin.css';
import AdminLayoutClient from './AdminLayoutClient';

export const viewport: Viewport = {
  themeColor: '#102f36',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Admin CMS — Syahrin.dev',
  description: 'Panel admin untuk mengelola konten portfolio Syahrin.dev.',
  icons: {
    icon: [
      { url: '/favicon-admin.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-admin.svg',
    apple: '/favicon-admin.svg',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
