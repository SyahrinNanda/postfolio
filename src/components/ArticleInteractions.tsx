'use client';

import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress(value);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="reading-progress" data-reading-progress style={{ width: `${progress}%` }} aria-hidden="true" />;
}

export function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_err) {
      window.prompt('Salin tautan berikut:', window.location.href);
    }
  };

  return (
    <aside className="share-rail" aria-label="Bagikan artikel">
      <span>Bagikan</span>
      <button
        className="button-icon"
        type="button"
        data-copy-link
        aria-label={copied ? 'Tautan tersalin' : 'Salin tautan'}
        onClick={handleCopy}
      >
        {copied ? '✓' : '↗'}
      </button>
      <a
        className="button-icon"
        href="https://www.linkedin.com/sharing/share-offsite/"
        target="_blank"
        rel="noreferrer"
        aria-label="Bagikan ke LinkedIn"
      >
        in
      </a>
      <a
        className="button-icon"
        href={`mailto:?subject=${encodeURIComponent(title)}`}
        aria-label="Bagikan melalui email"
      >
        @
      </a>
    </aside>
  );
}

