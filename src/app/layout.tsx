import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssistantPanel from '@/components/AssistantPanel';
import ScrollReveal from '@/components/ScrollReveal';
import AmbientLights from '@/components/AmbientLights';

import './globals-styles.css';
import './globals-public.css';
import './responsive-fixes.css';

export const viewport: Viewport = {
  themeColor: '#0b0d12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "As'syahrin Nanda — Software Engineer",
  description: "Portfolio As'syahrin Nanda, software engineer yang membangun produk digital andal dan terukur.",
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "As'syahrin Nanda — Software Engineer",
    description: 'Engineering thoughtful products, from idea to impact.',
    type: 'website',
    url: 'https://syahrin.dev/',
    images: [{ url: 'https://syahrin.dev/assets/social-preview.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "As'syahrin Nanda — Software Engineer",
    description: 'Engineering thoughtful products, from idea to impact.',
    images: ['https://syahrin.dev/assets/social-preview.svg'],
  },
  alternates: {
    canonical: 'https://syahrin.dev/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: "As'syahrin Nanda",
  jobTitle: 'Software Engineer',
  url: 'https://syahrin.dev/',
  email: 'mailto:syahrinnanda@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Makassar',
    addressCountry: 'ID',
  },
  knowsAbout: [
    'Software Engineering',
    'System Design',
    'React',
    'Node.js',
    'PostgreSQL',
    'Cloud Infrastructure',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        <AmbientLights />
        <Header />
        {children}
        <Footer />
        <AssistantPanel />
        <ScrollReveal />
      </body>
    </html>
  );
}
