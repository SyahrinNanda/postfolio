import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kontak — As'syahrin Nanda",
  description:
    "Hubungi As'syahrin Nanda untuk berdiskusi tentang product engineering, backend systems, AI application, atau peluang kerja.",
  openGraph: {
    title: "Kontak — As'syahrin Nanda",
    description: "Ceritakan konteks, problem, dan outcome yang ingin dicapai.",
  },
};

export default function Contact() {
  return (
    <>
      <BodyStyler classes={['public-page']} />
      <main id="main" className="public-main" tabIndex={-1}>
        <section className="page-hero">
          <div className="public-shell page-hero-grid">
            <Reveal>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <i>/</i>
                <span aria-current="page">Kontak</span>
              </nav>
              <h1>
                Mari mulai dari <em>masalahnya.</em>
              </h1>
              <p className="page-hero-lead">
                Ceritakan konteks, constraint, dan outcome yang ingin dicapai. Saya akan membalas
                dengan pertanyaan atau langkah berikutnya yang konkret.
              </p>
            </Reveal>
            <Reveal className="page-hero-side">
              <span className="status-pill live">Terbuka untuk diskusi baru</span>
              <p>Waktu respons: 1–2 hari kerja. Zona waktu UTC+8 · Makassar, Indonesia.</p>
            </Reveal>
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="contact-form-title">
          <div className="contact-layout">
            <Reveal as="aside" className="contact-aside">
              <span className="overline">Kontak langsung</span>
              <h2>Lebih suka email?</h2>
              <p>
                Kirim konteks singkat: apa yang sedang dibangun, siapa penggunanya, dan bagian mana
                yang paling tidak pasti.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <span>Email</span>
                  <a href="mailto:syahrinnanda@gmail.com">syahrinnanda@gmail.com ↗</a>
                </div>
                <div className="contact-method">
                  <span>LinkedIn</span>
                  <a
                    href="https://www.linkedin.com/in/syahrin-nanda"
                    target="_blank"
                    rel="noreferrer"
                  >
                    /in/syahrin-nanda ↗
                  </a>
                </div>
                <div className="contact-method">
                  <span>GitHub</span>
                  <a href="https://github.com/syahrinnanda" target="_blank" rel="noreferrer">
                    @syahrinnanda ↗
                  </a>
                </div>
                <div className="contact-method">
                  <span>Lokasi</span>
                  <strong>Makassar, Indonesia</strong>
                </div>
              </div>

              <div className="availability-card panel">
                <span className="status-dot"></span>
                <div>
                  <strong>Kapasitas diskusi tersedia</strong>
                  <p>
                    Product engineering · backend systems · AI application · technical advisory.
                  </p>
                </div>
              </div>
            </Reveal>

            <ContactForm variant="page" />
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="faq-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Sebelum mengirim</span>
              <h2 id="faq-title">Pertanyaan umum.</h2>
            </div>
            <p>Beberapa detail yang membantu percakapan pertama lebih fokus.</p>
          </Reveal>
          <div className="faq-grid">
            <Reveal as="article" className="faq-card panel">
              <h3>Jenis project apa yang menarik?</h3>
              <p>
                Workflow operasional, platform internal, backend systems, dan AI application dengan
                problem nyata serta ruang mengukur outcome.
              </p>
            </Reveal>
            <Reveal as="article" className="faq-card panel">
              <h3>Apakah tersedia untuk full-time?</h3>
              <p>
                Status terbuka untuk peluang yang selaras. Gunakan form untuk berbagi role, tim,
                lokasi, dan prosesnya.
              </p>
            </Reveal>
            <Reveal as="article" className="faq-card panel">
              <h3>Bagaimana dengan timeline?</h3>
              <p>
                Sertakan target dan alasan di baliknya. Scope, akses, dependency, serta tingkat
                ketidakpastian menentukan estimasi yang realistis.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
