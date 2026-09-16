import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { experienceList, educationList, careerStats, ExperienceEntry } from '@/lib/data/experience';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { experiences as dbExperiencesTable } from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: "Pengalaman — As'syahrin Nanda",
  description: "Timeline pengalaman kerja, tanggung jawab, pencapaian, dan teknologi As'syahrin Nanda.",
  openGraph: {
    title: "Pengalaman — As'syahrin Nanda",
    description: "Perjalanan karier dan impact sebagai software engineer.",
  },
};

export default async function Experience() {
  let displayedExperiences: ExperienceEntry[] = experienceList;

  try {
    const list = await db.query.experiences.findMany({
      where: eq(dbExperiencesTable.status, 'active'),
      with: {
        experienceTechnologies: {
          with: {
            technology: true,
          },
        },
      },
      orderBy: [
        asc(dbExperiencesTable.order),
        desc(dbExperiencesTable.startDate),
        desc(dbExperiencesTable.createdAt),
      ],
    });

    if (list && list.length > 0) {
      displayedExperiences = list.map((item) => {
        let respList: string[] = [];
        if (Array.isArray(item.responsibilities)) {
          respList = item.responsibilities;
        } else if (typeof item.responsibilities === 'string') {
          try {
            respList = JSON.parse(item.responsibilities);
          } catch {
            respList = (item.responsibilities as string)
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }

        let achList: string[] = [];
        if (Array.isArray(item.achievements)) {
          achList = item.achievements;
        } else if (typeof item.achievements === 'string') {
          try {
            achList = JSON.parse(item.achievements);
          } catch {
            achList = (item.achievements as string)
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }

        const periodDisplay =
          item.period ||
          (item.startDate
            ? `${item.startDate} — ${item.isCurrent ? 'Sekarang' : item.endDate || 'Selesai'}`
            : '');

        return {
          id: item.id,
          title: item.position,
          company: item.company,
          overline:
            item.overline ||
            `${item.company} · ${item.isCurrent ? 'Posisi Aktif' : 'Pekerjaan'}`,
          period: periodDisplay,
          datetime: item.startDate || '2024-01',
          isCurrent: Boolean(item.isCurrent),
          description: item.description || '',
          responsibilities: respList,
          achievements: achList,
          technologies: item.experienceTechnologies?.map((et) => et.technology.name) || [],
        };
      });
    }
  } catch (err) {
    console.error('Error loading experiences from DB:', err);
  }

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
                <span aria-current="page">Pengalaman</span>
              </nav>
              <h1>
                Pengalaman yang membentuk <em>judgment.</em>
              </h1>
              <p className="page-hero-lead">
                Dari mengirim fitur pertama hingga memimpin keputusan lintas sistem—setiap peran
                mengajarkan cara menyeimbangkan kecepatan, kualitas, dan outcome.
              </p>
            </Reveal>
            <Reveal className="page-hero-side">
              <span className="sample-pill">Riwayat Terverifikasi</span>
              <p>
                Struktur mencakup perusahaan, posisi, periode, deskripsi, tanggung jawab,
                pencapaian, status aktif, dan teknologi terkelola langsung melalui Admin CMS.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="snapshot-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Career snapshot</span>
              <h2 id="snapshot-title">Empat tahun, banyak lapisan.</h2>
            </div>
            <p>
              Angka berikut mendemonstrasikan ringkasan yang dapat dipindai recruiter dalam
              beberapa detik.
            </p>
          </Reveal>
          <div className="career-summary">
            {careerStats.map((stat, i) => (
              <Reveal key={i} className="career-stat panel">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="timeline-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Timeline Perjalanan</span>
              <h2 id="timeline-title">Career timeline.</h2>
            </div>
            <p>
              Peran aktif ditandai, dan setiap pengalaman menghubungkan tanggung jawab dengan hasil
              yang terukur.
            </p>
          </Reveal>
          <div className="career-timeline">
            {displayedExperiences.map((exp) => (
              <Reveal as="article" key={exp.id} className="career-entry">
                <time className="career-date" dateTime={exp.datetime}>
                  {exp.dateDisplay ? (
                    <>
                      {exp.dateDisplay.start}
                      <br />
                      {exp.dateDisplay.end}
                    </>
                  ) : (
                    exp.period
                  )}
                </time>
                <div className="career-card panel">
                  <div className="career-card-top">
                    <div>
                      <span className="overline">{exp.overline}</span>
                      <h2>{exp.title}</h2>
                      <span className="career-company">{exp.company}</span>
                    </div>
                    {exp.isCurrent && <span className="current-badge">Posisi aktif</span>}
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                  <div className="career-columns">
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div>
                        <h3>Tanggung jawab</h3>
                        <ul>
                          {exp.responsibilities.map((res, i) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div>
                        <h3>Pencapaian</h3>
                        <ul>
                          {exp.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="tag-list">
                      {exp.technologies.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="growth-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Education &amp; growth</span>
              <h2 id="growth-title">Fondasi dan pembelajaran.</h2>
            </div>
            <p>
              Software berubah cepat. Saya menggabungkan pendidikan formal S1 Teknik Informatika,
              program bootcamp nasional, dan praktik proyek langsung.
            </p>
          </Reveal>
          <div className="value-grid">
            {educationList.map((edu, i) => (
              <Reveal as="article" key={i} className="value-card panel">
                <span className="value-number">{edu.period}</span>
                <h3>{edu.title}</h3>
                <p>{edu.description}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="hero-actions">
            <Link className="button button-primary" href="/cv">
              Lihat CV lengkap <span>→</span>
            </Link>
            <a className="button button-ghost" href="/assets/syahrin-nanda-cv.pdf" download>
              Unduh CV demo <span>↓</span>
            </a>
          </Reveal>
        </section>
      </main>
    </>
  );
}
