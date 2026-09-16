'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAssetPath } from '@/lib/assets';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Special footer for /contact matching contact.html exactly
  if (pathname === '/contact') {
    return (
      <footer className="public-footer">
        <div className="public-shell">
          <div className="footer-top">
            <div>
              <Link className="brand" href="/" onClick={scrollToTop}>
                <span className="brand-mark">AN</span>
                <span>syahrin.dev</span>
              </Link>
              <p className="footer-summary">
                Percakapan yang baik dimulai dari konteks dan problem, lalu bergerak menuju langkah
                yang dapat diuji.
              </p>
            </div>
            <div>
              <span className="footer-heading">Jelajahi</span>
              <nav className="footer-links" aria-label="Navigasi footer">
                <Link href="/about">Tentang</Link>
                <Link href="/projects">Project</Link>
                <Link href="/skills">Skills</Link>
                <Link href="/articles">Artikel</Link>
              </nav>
            </div>
            <div>
              <span className="footer-heading">Langsung</span>
              <div className="footer-links">
                <a href="mailto:syahrinnanda@gmail.com">syahrinnanda@gmail.com</a>
                <a href="https://github.com/syahrinnanda" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/syahrinnanda"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© <span data-current-year>{currentYear}</span> As&apos;syahrin Nanda.</p>
            <p>Makassar, Indonesia.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Special footer for /experience matching experience.html
  if (pathname === '/experience') {
    return (
      <footer className="public-footer">
        <div className="public-shell">
          <div className="footer-top">
            <div>
              <Link className="brand" href="/" onClick={scrollToTop}>
                <span className="brand-mark">AN</span>
                <span>syahrin.dev</span>
              </Link>
              <p className="footer-summary">
                Pengalaman membentuk judgment: apa yang harus dibangun, risiko mana yang penting,
                dan kapan keputusan perlu diubah.
              </p>
            </div>
            <div>
              <span className="footer-heading">Jelajahi</span>
              <nav className="footer-links" aria-label="Navigasi footer">
                <Link href="/about">Tentang</Link>
                <Link href="/projects">Project</Link>
                <Link href="/skills">Skills</Link>
                <Link href="/articles">Artikel</Link>
              </nav>
            </div>
            <div>
              <span className="footer-heading">Aksi</span>
              <div className="footer-links">
                <a href={getAssetPath("/assets/syahrin-nanda-cv.pdf")} download>
                  Unduh CV demo
                </a>
                <Link href="/contact">Hubungi saya</Link>
                <a
                  href="https://www.linkedin.com/in/syahrin-nanda"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © <span data-current-year>{currentYear}</span> As&apos;syahrin Nanda. Timeline dan metrik
              adalah data demonstrasi.
            </p>
            <p>Berbasis di Makassar, Indonesia, bekerja lintas zona waktu.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Special footer for /articles matching articles.html
  if (pathname.startsWith('/articles')) {
    return (
      <footer className="public-footer">
        <div className="public-shell">
          <div className="footer-top">
            <div>
              <Link className="brand" href="/" onClick={scrollToTop}>
                <span className="brand-mark">AN</span>
                <span>syahrin.notes</span>
              </Link>
              <p className="footer-summary">
                Catatan untuk membuat keputusan teknis dapat dilihat, diuji, dan dibagikan.
              </p>
            </div>
            <div>
              <span className="footer-heading">Topik</span>
              <nav className="footer-links" aria-label="Topik artikel">
                <Link href="/articles">Architecture</Link>
                <Link href="/articles">Backend</Link>
                <Link href="/articles">AI engineering</Link>
                <Link href="/articles">Frontend</Link>
              </nav>
            </div>
            <div>
              <span className="footer-heading">Portfolio</span>
              <div className="footer-links">
                <Link href="/about">Tentang</Link>
                <Link href="/projects">Project</Link>
                <Link href="/contact">Kontak</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © <span data-current-year>{currentYear}</span> As&apos;syahrin Nanda. Artikel adalah konten
              demonstrasi.
            </p>
            <p>Draft tidak ditampilkan di halaman publik.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Default / other pages footer
  return (
    <footer className="public-footer">
      <div className="public-shell">
        <div className="footer-top">
          <div>
            <Link className="brand" href="#top" onClick={scrollToTop}>
              <span className="brand-mark">AN</span>
              <span>syahrin.dev</span>
            </Link>
            <p className="footer-summary">
              Software engineer yang berfokus pada product engineering, sistem yang andal, dan
              pengalaman pengguna yang luar biasa.
            </p>
          </div>
          <div>
            <span className="footer-heading">Jelajahi</span>
            <nav className="footer-links" aria-label="Navigasi footer">
              <Link href="/about">Tentang</Link>
              <Link href="/projects">Project</Link>
              <Link href="/skills">Skills</Link>
              <Link href="/experience">Pengalaman</Link>
              <Link href="/articles">Artikel</Link>
            </nav>
          </div>
          <div>
            <span className="footer-heading">Aksi &amp; Tautan</span>
            <div className="footer-links">
              <Link href="/cv">Lihat CV</Link>
              <a href={getAssetPath("/assets/syahrin-nanda-cv.pdf")} download>
                Unduh CV demo
              </a>
              <Link href="/contact">Hubungi saya</Link>
              <Link href="/admin/login">Admin CMS</Link>
              <a href="https://github.com/syahrinnanda" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/syahrin-nanda" target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span data-current-year id="year">{currentYear}</span> As&apos;syahrin Nanda. Built with care
            and performance in mind.
          </p>
          <p>
            Berada di Makassar, Indonesia ·{' '}
            <a href="#top" onClick={scrollToTop}>
              Ke atas ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
