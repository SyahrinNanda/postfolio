'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BodyStyler from '@/components/BodyStyler';
import { getAssetPath } from '@/lib/assets';
import { DEFAULT_CV, DEFAULT_PROFILE, CvData, ProfileData, ExperienceData, ProjectData } from '@/components/admin/AdminContext';

export default function CVPage() {
  const [cvData, setCvData] = useState<CvData>(DEFAULT_CV);
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    // 1. Fetch live CV data
    fetch('/api/cv')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res?.data) {
          setCvData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});

    // 2. Fetch live Profile data
    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res?.data) {
          setProfileData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});

    // 3. Fetch live Experiences
    fetch('/api/experiences')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped: ExperienceData[] = res.data.map((item: any) => ({
            id: item.id,
            company: item.company,
            position: item.position,
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            current: Boolean(item.isCurrent),
            description: item.description || '',
            responsibilities: Array.isArray(item.responsibilities)
              ? item.responsibilities.join('\n')
              : item.responsibilities || '',
            achievements: Array.isArray(item.achievements)
              ? item.achievements.join('\n')
              : item.achievements || '',
            technologies: Array.isArray(item.technologies)
              ? item.technologies.map((t: any) => (typeof t === 'string' ? t : t.name))
              : [],
            status: item.status || 'active',
            overline: item.overline || '',
            period: item.period || '',
          }));
          setExperiences(mapped);
        }
      })
      .catch(() => {});

    // 4. Fetch live Projects
    fetch('/api/projects?status=published')
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const mapped: ProjectData[] = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            shortDescription: item.shortDescription || '',
            fullDescription: item.fullDescription || '',
            category: item.category || 'Fullstack',
            role: item.role || 'Software Engineer',
            duration: item.duration || '',
            status: item.status || 'published',
            thumbnail: item.thumbnail || '',
            technologies: Array.isArray(item.technologies)
              ? item.technologies.map((t: any) => (typeof t === 'string' ? t : t.name))
              : [],
            featured: Boolean(item.featured),
            updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID') : 'Baru saja',
          }));
          setProjects(mapped.filter((p) => p.featured).slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <BodyStyler classes={['public-page', 'cv-page']} />
      <main className="public-main">
        <div className="cv-toolbar">
          <div className="public-shell cv-toolbar-inner">
            <div>
              <span className="sample-pill">{cvData.badgeText || 'CV versi resmi · 2026'}</span>
              <p>{cvData.noteText || 'Konten identitas, pengalaman, dan metrik di CV ini diperbarui secara berkala.'}</p>
            </div>
            <div className="hero-actions" style={{ margin: 0 }}>
              <button
                className="button button-ghost button-small"
                type="button"
                onClick={() => window.print()}
              >
                Cetak / simpan PDF <span aria-hidden="true">⌘P</span>
              </button>
              <a
                className="button button-primary button-small"
                href={getAssetPath(cvData.fileUrl || '/assets/syahrin-nanda-cv.pdf')}
                download={cvData.name || 'syahrin-nanda-cv.pdf'}
              >
                Unduh PDF CV <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>

        <article className="cv-paper" id="cv-document" aria-labelledby="cv-name">
          <header className="cv-header">
            <div>
              <h1 id="cv-name">{profileData.fullName || "As'syahrin Nanda"}</h1>
              <div className="cv-role">{cvData.summaryHeadline || profileData.title || 'Software Engineer'}</div>
              <p className="cv-summary">
                {cvData.summaryText ||
                  profileData.shortBio ||
                  'Product-minded software engineer dengan pengalaman membangun aplikasi web end-to-end, layanan event-driven, dan AI application.'}
              </p>
            </div>
            <address className="cv-contact">
              {profileData.email && <a href={`mailto:${profileData.email}`}>{profileData.email}</a>}
              {profileData.location && <span>{profileData.location}</span>}
              {profileData.website && (
                <Link href="/">{profileData.website.replace(/^https?:\/\//, '')}</Link>
              )}
              {profileData.github && (
                <a href={profileData.github} target="_blank" rel="noreferrer">
                  {profileData.github.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noreferrer">
                  {profileData.linkedin.replace(/^https?:\/\//, '')}
                </a>
              )}
            </address>
          </header>

          <div className="cv-content">
            <div>
              {/* SECTION: PENGALAMAN KERJA */}
              <section className="cv-section" aria-labelledby="cv-experience">
                <h2 id="cv-experience">Pengalaman</h2>
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <article key={exp.id} className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>{exp.position}</h3>
                          <span className="org">
                            {exp.company}
                            {exp.overline ? ` · ${exp.overline}` : ''}
                          </span>
                        </div>
                        <time>
                          {exp.period ||
                            (exp.startDate
                              ? `${exp.startDate.slice(0, 4)} — ${exp.current ? 'Sekarang' : (exp.endDate?.slice(0, 4) || 'Selesai')}`
                              : '')}
                        </time>
                      </div>
                      {exp.description && <p style={{ fontSize: '13px', margin: '4px 0 8px 0' }}>{exp.description}</p>}
                      {exp.responsibilities ? (
                        <ul>
                          {exp.responsibilities
                            .split('\n')
                            .filter(Boolean)
                            .map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                        </ul>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <>
                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Freelance Software Engineer</h3>
                          <span className="org">Freelance Job · Custom Software</span>
                        </div>
                        <time dateTime="2024">2024—Sekarang</time>
                      </div>
                      <ul>
                        <li>Merancang &amp; memproduksi aplikasi web &amp; mobile custom (termasuk Chick Farm AI Mobile &amp; ERP PT Rachita).</li>
                        <li>Mengintegrasikan AI Computer Vision untuk diagnosa penyakit unggas dan marketplace ternak.</li>
                        <li>Mengotomatiskan alur kerja operasional dan integrasi REST API.</li>
                      </ul>
                    </article>

                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Asisten Laboratorium Teknik Informatika</h3>
                          <span className="org">Universitas Muslim Indonesia</span>
                        </div>
                        <time dateTime="2023-01">Jan 2023—Des 2024</time>
                      </div>
                      <ul>
                        <li>Membimbing praktikum mahasiswa Teknik Informatika UMI dalam laboratorium komputer.</li>
                        <li>Mendampingi pemahaman materi pemrograman (C++, Java, Python) &amp; jaringan komputer.</li>
                        <li>Mengelola kelancaran operasional dan perangkat laboratorium.</li>
                      </ul>
                    </article>

                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Cloud Computing Student</h3>
                          <span className="org">Bangkit Academy by Google, GoTo, Traveloka</span>
                        </div>
                        <time dateTime="2023-08">14 Agu—31 Des 2023</time>
                      </div>
                      <ul>
                        <li>Membangun backend REST API &amp; microservices terdeploy di Google Cloud Platform (GCP).</li>
                        <li>Menyelesaikan Cloud Computing Learning Path bersertifikat resmi MSIB.</li>
                      </ul>
                    </article>

                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Front-end Engineering Student</h3>
                          <span className="org">Ruangguru Bootcamp</span>
                        </div>
                        <time dateTime="2023-02">16 Feb—30 Jun 2023</time>
                      </div>
                      <ul>
                        <li>Bootcamp intensif React, modern JavaScript (ES6+), responsive design, &amp; web accessibility.</li>
                        <li>Mengembangkan 5+ proyek web interaktif berbasis React dengan kriteria performa tinggi.</li>
                      </ul>
                    </article>
                  </>
                )}
              </section>

              {/* SECTION: SELECTED PROJECT */}
              <section className="cv-section" aria-labelledby="cv-projects">
                <h2 id="cv-projects">Selected project</h2>
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <article key={proj.id} className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>{proj.title}</h3>
                          <span className="org">{proj.role || 'Software Engineer'} · {proj.category}</span>
                        </div>
                        <time>{proj.duration || '2026'}</time>
                      </div>
                      <p>{proj.shortDescription || proj.fullDescription}</p>
                    </article>
                  ))
                ) : (
                  <>
                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Chick Farm App Mobile</h3>
                          <span className="org">Lead Mobile &amp; AI · Mobile App</span>
                        </div>
                        <time>2026</time>
                      </div>
                      <p>Aplikasi mobile peternakan ayam dengan fitur AI pendeteksi penyakit lewat foto kotoran &amp; toko pakan/alat ternak.</p>
                    </article>

                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Rachita Apps</h3>
                          <span className="org">Lead Fullstack · Enterprise</span>
                        </div>
                        <time>2026</time>
                      </div>
                      <p>Sistem aplikasi web management PT Rachita setiap department dengan alur kerja &amp; RBAC terpadu.</p>
                    </article>

                    <article className="cv-entry">
                      <div className="cv-entry-head">
                        <div>
                          <h3>Automation Sistem N8N</h3>
                          <span className="org">Automation Engineer · Workflow</span>
                        </div>
                        <time>2025</time>
                      </div>
                      <p>Otomatisasi aggregator berita harian jam 8 pagi dikirim otomatis ke Telegram, Email, dan Spreadsheet.</p>
                    </article>
                  </>
                )}
              </section>

              {/* SECTION: PENDIDIKAN (CRUD LENGKAP DARI ADMIN) */}
              <section className="cv-section" aria-labelledby="cv-education">
                <h2 id="cv-education">Pendidikan</h2>
                {(cvData.educations || []).map((edu) => (
                  <article key={edu.id} className="cv-entry">
                    <div className="cv-entry-head">
                      <div>
                        <h3>{edu.degree}</h3>
                        <span className="org">{edu.institution}</span>
                      </div>
                      <time>{edu.period}</time>
                    </div>
                    {edu.description && <p>{edu.description}</p>}
                  </article>
                ))}
              </section>
            </div>

            {/* SIDEBAR ASIDE: SKILLS, BAHASA, SERTIFIKASI, PREFERENSI */}
            <aside aria-label="Ringkasan skill dan informasi tambahan">
              <section className="cv-section">
                <h2>Core skills</h2>
                <div className="cv-side-list">
                  <span>System Design</span>
                  <span>TypeScript</span>
                  <span>React</span>
                  <span>React Native</span>
                  <span>Next.js</span>
                  <span>Node.js</span>
                  <span>Python</span>
                  <span>API Design</span>
                  <span>Testing</span>
                </div>
              </section>

              <section className="cv-section">
                <h2>Data &amp; infrastructure</h2>
                <div className="cv-side-list">
                  <span>PostgreSQL</span>
                  <span>MySQL</span>
                  <span>Redis</span>
                  <span>Docker</span>
                  <span>Google Cloud Platform</span>
                  <span>N8N</span>
                  <span>CI/CD</span>
                </div>
              </section>

              <section className="cv-section">
                <h2>AI &amp; Mobile</h2>
                <div className="cv-side-list">
                  <span>TensorFlow</span>
                  <span>Computer Vision</span>
                  <span>React Native</span>
                  <span>REST API</span>
                  <span>GCP Cloud Run</span>
                </div>
              </section>

              {/* BAHASA (CRUD LENGKAP DARI ADMIN) */}
              <section className="cv-section">
                <h2>Bahasa</h2>
                {(cvData.languages || []).map((lang) => (
                  <div key={lang.id} className="cv-fact">
                    <strong>{lang.language}</strong>
                    <span>{lang.proficiency}</span>
                  </div>
                ))}
              </section>

              {/* SERTIFIKASI & BOOTCAMP (CRUD LENGKAP DARI ADMIN) */}
              <section className="cv-section">
                <h2>Sertifikasi &amp; Bootcamp</h2>
                {(cvData.certifications || []).map((cert) => (
                  <div key={cert.id} className="cv-fact">
                    <strong>{cert.title}</strong>
                    <span>
                      {cert.subtitle} {cert.year ? `(${cert.year})` : ''}
                    </span>
                  </div>
                ))}
              </section>

              {/* PREFERENSI (EDITABLE DARI ADMIN) */}
              <section className="cv-section">
                <h2>Preferensi</h2>
                {(cvData.preferences || []).map((pref) => (
                  <div key={pref.key} className="cv-fact">
                    <strong>{pref.label}</strong>
                    <span>{pref.value}</span>
                  </div>
                ))}
              </section>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
