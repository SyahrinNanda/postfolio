import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { profiles as dbProfilesTable } from '@/db/schema';
import { DEFAULT_PROFILE, ProfileData } from '@/lib/data/profile';
import { getAssetPath } from '@/lib/assets';

async function getProfileData(): Promise<ProfileData> {
  try {
    const p = await db.select().from(dbProfilesTable).get();
    if (p) {
      return {
        fullName: p.fullName || DEFAULT_PROFILE.fullName,
        title: p.professionalTitle || DEFAULT_PROFILE.title,
        shortBio: p.shortBio || DEFAULT_PROFILE.shortBio,
        detailedBio: p.detailedBio || DEFAULT_PROFILE.detailedBio,
        careerFocus: p.careerFocus || DEFAULT_PROFILE.careerFocus,
        location: p.location || DEFAULT_PROFILE.location,
        email: p.email || DEFAULT_PROFILE.email,
        phone: p.phone || DEFAULT_PROFILE.phone || '',
        photo: p.profilePhoto || DEFAULT_PROFILE.photo,
        github: p.socialLinks?.github || DEFAULT_PROFILE.github,
        linkedin: p.socialLinks?.linkedin || DEFAULT_PROFILE.linkedin,
        website: p.socialLinks?.website || DEFAULT_PROFILE.website,
        availability: p.availability || DEFAULT_PROFILE.availability,
        aboutHeadline: p.aboutHeadline || DEFAULT_PROFILE.aboutHeadline,
        aboutLead: p.aboutLead || DEFAULT_PROFILE.aboutLead,
        principles:
          Array.isArray(p.principles) && p.principles.length > 0
            ? p.principles
            : DEFAULT_PROFILE.principles,
        processes:
          Array.isArray(p.processes) && p.processes.length > 0
            ? p.processes
            : DEFAULT_PROFILE.processes,
        highlights:
          Array.isArray(p.highlights) && p.highlights.length > 0
            ? p.highlights
            : DEFAULT_PROFILE.highlights,
      };
    }
  } catch (err) {
    console.error('Error fetching profile for about page:', err);
  }

  return DEFAULT_PROFILE;
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData();
  return {
    title: `Tentang — ${profile.fullName}`,
    description: profile.shortBio,
  };
}

export default async function About() {
  const profile = await getProfileData();

  // Split detailed bio by double newline into clean paragraphs
  const paragraphs = (profile.detailedBio || '')
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  return (
    <>
      <BodyStyler classes={['public-page']} />
      <main id="main" className="public-main">
        {/* HERO SECTION */}
        <section className="page-hero">
          <div className="public-shell page-hero-grid">
            <Reveal>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <i>/</i>
                <span aria-current="page">Tentang</span>
              </nav>
              <h1>{profile.aboutHeadline || 'Engineer yang peduli pada alasannya.'}</h1>
              <p className="page-hero-lead">
                {profile.aboutLead || profile.shortBio}
              </p>
            </Reveal>
            <Reveal className="page-hero-side">
              <span className="sample-pill">Profil {profile.fullName}</span>
              <p>
                Halaman ini menampilkan profil profesional, kapabilitas engineering, dan cara berpikir {profile.fullName}.
              </p>
            </Reveal>
          </div>
        </section>

        {/* PROFILE DETAIL SECTION */}
        <section className="public-section public-shell" aria-labelledby="profile-title">
          <div className="profile-layout">
            <Reveal as="figure" className="portrait-card panel">
              {profile.photo ? (
                <img
                  src={getAssetPath(profile.photo)}
                  width="560"
                  height="420"
                  alt={`Foto profil ${profile.fullName}`}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '320px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--line)',
                    fontSize: '3rem',
                    fontWeight: 800,
                  }}
                >
                  {(profile.fullName || DEFAULT_PROFILE.fullName).slice(0, 2).toUpperCase()}
                </div>
              )}
              <figcaption className="portrait-caption">
                <span>{profile.fullName || DEFAULT_PROFILE.fullName}</span>
                <span>{profile.title.toUpperCase()}</span>
              </figcaption>
            </Reveal>

            <Reveal className="profile-copy">
              <span className="overline">Profil lengkap</span>
              <h2 id="profile-title" className="large-copy">
                {profile.shortBio}
              </h2>

              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>
                  Software engineer dengan dedikasi pada kualitas kode, arsitektur yang terukur, dan pengalaman pengguna yang optimal.
                </p>
              )}

              {profile.careerFocus && (
                <p>
                  Fokus karier saya adalah <strong>{profile.careerFocus}</strong>.
                </p>
              )}

              <div className="profile-facts" aria-label="Informasi profil">
                <div className="profile-fact">
                  <span>Nama lengkap</span>
                  <strong>{profile.fullName}</strong>
                </div>
                <div className="profile-fact">
                  <span>Professional title</span>
                  <strong>{profile.title}</strong>
                </div>
                {profile.location && (
                  <div className="profile-fact">
                    <span>Lokasi</span>
                    <strong>{profile.location}</strong>
                  </div>
                )}
                {profile.email && (
                  <div className="profile-fact">
                    <span>Email</span>
                    <strong>
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </strong>
                  </div>
                )}
                {profile.careerFocus && (
                  <div className="profile-fact">
                    <span>Career focus</span>
                    <strong>{profile.careerFocus}</strong>
                  </div>
                )}
                {profile.availability && (
                  <div className="profile-fact">
                    <span>Ketersediaan</span>
                    <strong>{profile.availability}</strong>
                  </div>
                )}
              </div>

              <div className="about-links profile-links" aria-label="Tautan sosial">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub <span>↗</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <span>↗</span>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer">
                    Website <span>↗</span>
                  </a>
                )}
              </div>

              <div className="hero-actions" aria-label="Aksi utama profil">
                <Link className="button button-primary" href="/projects">
                  Lihat project <span aria-hidden="true">→</span>
                </Link>
                <Link className="button button-ghost" href="/contact">
                  Hubungi saya <span aria-hidden="true">↗</span>
                </Link>
                <a className="button button-ghost" href={getAssetPath("/assets/syahrin-nanda-cv.pdf")} download>
                  Unduh CV <span aria-hidden="true">↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRINSIP KERJA (VALUES) - Dynamic List */}
        {profile.principles && profile.principles.length > 0 && (
          <section className="public-section public-shell" aria-labelledby="values-title">
            <Reveal className="section-intro">
              <div>
                <span className="overline">Prinsip kerja</span>
                <h2 id="values-title">Bagaimana saya mengambil keputusan.</h2>
              </div>
              <p>
                Kualitas engineering terlihat dari trade-off yang dibuat, cara risiko dikelola, dan seberapa cepat tim bisa belajar.
              </p>
            </Reveal>
            <div className="value-grid">
              {profile.principles.map((pr, idx) => (
                <Reveal as="article" key={idx} className="value-card panel">
                  <span className="value-number">{pr.number}</span>
                  <h3>{pr.title}</h3>
                  <p>{pr.description}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* CARA BEKERJA (PROCESS STEPS) - Dynamic List */}
        {profile.processes && profile.processes.length > 0 && (
          <section className="public-section" aria-labelledby="process-title">
            <div className="public-shell">
              <Reveal className="section-intro">
                <div>
                  <span className="overline">Cara bekerja</span>
                  <h2 id="process-title">Dari ambiguity menuju impact.</h2>
                </div>
                <p>
                  Proses ini fleksibel, tetapi checkpoint-nya menjaga produk dan engineering tetap bergerak ke arah yang sama.
                </p>
              </Reveal>
              <Reveal className="process-list">
                {profile.processes.map((proc, idx) => (
                  <article key={idx} className="process-step">
                    <h3>{proc.title}</h3>
                    <p>{proc.description}</p>
                  </article>
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* DI LUAR EDITOR (HIGHLIGHTS/METRICS) - Dynamic List */}
        {profile.highlights && profile.highlights.length > 0 && (
          <section className="public-section public-shell" aria-labelledby="outside-title">
            <Reveal className="section-intro">
              <div>
                <span className="overline">Di luar editor</span>
                <h2 id="outside-title">Tetap penasaran.</h2>
              </div>
              <p>
                Saya menulis catatan teknis, membaca source code open-source, bereksperimen dengan teknologi baru, dan menjelajah kota.
              </p>
            </Reveal>
            <Reveal className="metric-row">
              {profile.highlights.map((hl, idx) => (
                <div key={idx} className="metric">
                  <strong>{hl.value}</strong>
                  <span>{hl.label}</span>
                </div>
              ))}
            </Reveal>
          </section>
        )}
      </main>
    </>
  );
}
