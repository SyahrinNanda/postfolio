import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import HomeProjects, { HomeProjectItem } from '@/components/HomeProjects';
import { db } from '@/db';
import { getAssetPath } from '@/lib/assets';
import {
  projects as dbProjectsTable,
  experiences as dbExperiencesTable,
  articles as dbArticlesTable,
  settings as dbSettingsTable,
  profiles as dbProfilesTable,
} from '@/db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';

export default async function Home() {
  let siteSettings: Record<string, any> = {};
  try {
    const rawSettings = await db.select().from(dbSettingsTable).all();
    for (const s of rawSettings) {
      if (s.key) {
        let val: any = s.value;
        if (
          typeof val === 'string' &&
          ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']')))
        ) {
          try {
            val = JSON.parse(val);
          } catch {}
        }
        siteSettings[s.key] = val;
      }
    }
  } catch (err) {
    console.error('Error loading settings from DB:', err);
  }

  let dbProfile: any = null;
  try {
    dbProfile = await db.select().from(dbProfilesTable).get();
  } catch (err) {
    console.error('Error loading profile from DB:', err);
  }
  let featuredProjects: HomeProjectItem[] | undefined = undefined;
  let homeExperiences: Array<{
    period: string;
    position: string;
    company: string;
    description: string;
    technologies: string[];
  }> | undefined = undefined;
  let homeArticles: Array<{
    slug: string;
    title: string;
    summary: string;
    category: string;
    categoryLabel: string;
    duration: string;
    date: string;
    datetime: string;
    mark: string;
    hasFullPage: boolean;
  }> | undefined = undefined;

  try {
    const artList = await db.query.articles.findMany({
      where: eq(dbArticlesTable.status, 'published'),
      orderBy: [desc(dbArticlesTable.publishedDate), desc(dbArticlesTable.createdAt)],
      limit: 3,
    });

    if (artList && artList.length > 0) {
      homeArticles = artList.map((a) => {
        let formattedDate = a.publishedDate || '';
        if (a.publishedDate && a.publishedDate.includes('-')) {
          try {
            const d = new Date(a.publishedDate);
            formattedDate = d.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
          } catch {
            // fallback
          }
        }

        return {
          slug: a.slug,
          title: a.title,
          summary: a.summary || '',
          category: a.category || 'Software Architecture',
          categoryLabel: (a.categoryLabel || a.category || 'Software Architecture').toUpperCase(),
          duration: (a.readDuration || '5 min baca').toUpperCase(),
          date: formattedDate || a.publishedDate || '2026',
          datetime: a.publishedDate || '2026-01-01',
          mark: a.coverMark || a.title.slice(0, 2).toUpperCase(),
          hasFullPage: Boolean(a.hasFullPage),
        };
      });
    }
  } catch (err) {
    console.error('Error loading home articles from DB:', err);
  }

  try {
    const expList = await db.query.experiences.findMany({
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
      limit: 4,
    });

    if (expList && expList.length > 0) {
      homeExperiences = expList.map((e) => ({
        period:
          e.period ||
          (e.startDate
            ? `${e.startDate.slice(0, 4)} — ${e.isCurrent ? 'NOW' : (e.endDate?.slice(0, 4) || 'SELESAI')}`
            : '2024 — NOW'),
        position: e.position,
        company: `${e.company}${e.overline ? ` · ${e.overline.split('·')[0].trim()}` : ''}`,
        description: e.description || '',
        technologies: e.experienceTechnologies?.map((et) => et.technology.name) || [],
      }));
    }
  } catch (err) {
    console.error('Error loading home experiences from DB:', err);
  }

  try {
    const list = await db.query.projects.findMany({
      where: and(eq(dbProjectsTable.status, 'published'), eq(dbProjectsTable.featured, true)),
      with: {
        projectTechnologies: {
          with: {
            technology: true,
          },
        },
      },
      orderBy: [asc(dbProjectsTable.order), desc(dbProjectsTable.createdAt)],
      limit: 6,
    });

    if (list && list.length > 0) {
      const total = list.length;
      featuredProjects = list.map((p, idx) => ({
        id: p.slug,
        title: p.title,
        type: p.label || (p.category ? p.category.toUpperCase() : 'PROJECT'),
        num: `${p.num || String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
        shortDescription: p.shortDescription || '',
        category: p.category || 'fullstack',
        impact:
          p.result && Array.isArray(p.result)
            ? (p.result.slice(0, 2) as [string, string][]).map(([val, label]) => ({
                val,
                label,
              }))
            : undefined,
        technologies: p.projectTechnologies?.map((pt) => pt.technology.name) || [],
      }));
    }
  } catch (err) {
    console.error('Error loading featured projects from DB:', err);
  }

  const heroEyebrow =
    siteSettings.heroEyebrow ||
    (dbProfile?.fullName
      ? `${dbProfile.fullName} · ${dbProfile.professionalTitle || 'Software Engineer'}`
      : "As'syahrin Nanda · Software Engineer");
  const heroTitle = siteSettings.heroTitle || 'Membangun produk digital yang berarti.';
  const heroLead =
    siteSettings.heroLead ||
    dbProfile?.shortBio ||
    'Saya syahrin, software engineer yang mengubah masalah kompleks menjadi sistem yang sederhana, andal, dan menyenangkan untuk digunakan.';
  const heroPrimaryStack: string[] =
    Array.isArray(siteSettings.heroPrimaryStack) && siteSettings.heroPrimaryStack.length > 0
      ? siteSettings.heroPrimaryStack
      : ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'];
  const heroMetrics: Array<{ value: string; label: string }> =
    Array.isArray(siteSettings.heroMetrics) && siteSettings.heroMetrics.length > 0
      ? siteSettings.heroMetrics
      : [
          { value: '4+', label: 'Tahun\npengalaman' },
          { value: '18', label: 'Produk\ndiluncurkan' },
          { value: '99.9%', label: 'Best system\nuptime' },
        ];
  const tickerText =
    siteSettings.tickerText ||
    'PRODUCT ENGINEERING ✦ SYSTEM DESIGN ✦ FRONTEND ✦ BACKEND ✦ CLOUD ✦ PRODUCT ENGINEERING ✦ SYSTEM DESIGN ✦ FRONTEND ✦ BACKEND ✦ CLOUD ✦';
  const cvDownloadUrl = getAssetPath(
    dbProfile?.cvFileUrl || siteSettings.cvFileUrl || '/assets/syahrin-nanda-cv.pdf'
  );

  const capabilities: Array<{
    id: string;
    index: string;
    icon: string;
    title: string;
    description: string;
    tags: string[];
  }> =
    Array.isArray(siteSettings.capabilities) && siteSettings.capabilities.length > 0
      ? siteSettings.capabilities
      : [
          {
            id: 'cap-1',
            index: '01',
            icon: '◫',
            title: 'Frontend Engineering',
            description: 'Interface responsif, accessible, dan terasa cepat di setiap perangkat.',
            tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
          },
          {
            id: 'cap-2',
            index: '02',
            icon: '⌘',
            title: 'Backend & API',
            description: 'Layanan terukur dengan struktur data yang solid dan observability sejak awal.',
            tags: ['Node.js', 'Laravel', 'PostgreSQL', 'Redis'],
          },
          {
            id: 'cap-3',
            index: '03',
            icon: '△',
            title: 'System & Cloud',
            description: 'Deployment repeatable, infrastruktur tangguh, dan performa yang terukur.',
            tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
          },
        ];

  return (
    <>
      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot"></span> {heroEyebrow}
            </div>
            <h1 id="hero-title">{heroTitle}</h1>
            <p className="hero-lead">{heroLead}</p>
            <div className="hero-stack">
              <span className="mono">PRIMARY STACK</span>
              {heroPrimaryStack.map((st, i) => (
                <b key={i}>{st}</b>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="/projects">
                Lihat karya <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-ghost" href="/contact">
                Hubungi saya <span aria-hidden="true">↗</span>
              </Link>
              <a className="button button-ghost" href={cvDownloadUrl} download>
                Unduh CV <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-meta" aria-label="Ringkasan profesional dari data demonstrasi">
              {heroMetrics.map((met, i) => (
                <div key={i}>
                  <strong>{met.value}</strong>
                  <span style={{ whiteSpace: 'pre-line' }}>{met.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="hero-visual" aria-label="Ilustrasi ruang kerja software engineer">
            <div className="visual-label mono">currently_building.tsx</div>
            <div className="code-card glass-card">
              <div className="window-bar">
                <i></i><i></i><i></i><span>impact.ts</span>
              </div>
              <pre aria-hidden="true">
                <code
                  dangerouslySetInnerHTML={{
                    __html: `<span class="c-purple">interface</span> <span class="c-green">GoodProduct</span> {
  problem: <span class="c-yellow">"understood"</span>;
  solution: <span class="c-yellow">"simple"</span>;
  impact: <span class="c-yellow">"measurable"</span>;
}

<span class="c-purple">const</span> craft = <span class="c-purple">async</span> () => {
  <span class="c-purple">return</span> <span class="c-blue">buildWithCare</span>();
};`,
                  }}
                />
              </pre>
              <div className="code-status">
                <span>✓ All systems operational</span>
                <span>UTF-8</span>
              </div>
            </div>
            <div className="orbit orbit-one"><span>REACT</span></div>
            <div className="orbit orbit-two"><span>NODE</span></div>
            <div className="orbit orbit-three"><span>POSTGRES</span></div>
            <svg className="visual-grid" viewBox="0 0 520 520" role="presentation">
              <defs>
                <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M26 0H0V26" fill="none" stroke="currentColor" strokeWidth=".5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </Reveal>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>{tickerText}</span>
          </div>
        </div>

        <section className="about section-shell section-pad" id="about" aria-labelledby="about-title">
          <Reveal className="section-kicker mono">01 / Tentang</Reveal>
          <div className="about-grid">
            <Reveal className="about-heading">
              <h2 id="about-title">{dbProfile?.aboutHeadline || 'Lebih dari sekadar menulis kode.'}</h2>
              <figure className="profile-figure">
                <img
                  src={getAssetPath(dbProfile?.profilePhoto || '/assets/foto-profile.jpeg')}
                  width="560"
                  height="420"
                  alt={`Foto profil ${dbProfile?.fullName || "As'syahrin Nanda"}`}
                />
                <figcaption className="mono">{dbProfile?.location ? `${dbProfile.location.toUpperCase()} · GMT+8` : 'MAKASSAR, INDONESIA · GMT+8'}</figcaption>
              </figure>
              <div className="profile-stamp" aria-hidden="true">
                <span>{dbProfile?.fullName ? dbProfile.fullName.slice(0, 2).toUpperCase() : 'AN'}</span>
                <svg viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                    fill="none"
                  />
                  <text>
                    <textPath href="#circlePath">BUILD • LEARN • ITERATE • </textPath>
                  </text>
                </svg>
              </div>
            </Reveal>
            <Reveal className="about-copy">
              <p className="large-copy">
                {dbProfile?.aboutLead || 'Saya percaya software terbaik lahir dari pemahaman yang dalam—tentang pengguna, bisnis, dan sistem di baliknya.'}
              </p>
              <p>
                {dbProfile?.shortBio || 'Berada di Makassar, Indonesia. Fokus karier saya adalah product engineering dan distributed systems—dari merancang arsitektur dan API hingga meramu interface yang cepat dan intuitif.'}
              </p>
              <p>
                {dbProfile?.detailedBio || 'Di luar editor, saya suka membedah open-source, menulis catatan teknis, dan mencari kopi terbaik di kota.'}
              </p>
              <div className="about-links">
                <Link href="/about">
                  Baca profil lengkap <span>→</span>
                </Link>
                {dbProfile?.email && (
                  <a href={`mailto:${dbProfile.email}`}>
                    Email <span>↗</span>
                  </a>
                )}
                {siteSettings.showGithub !== false && (
                  <a href={dbProfile?.socialLinks?.github || (siteSettings.githubUsername ? `https://github.com/${siteSettings.githubUsername}` : 'https://github.com/syahrinnanda')} target="_blank" rel="noreferrer">
                    GitHub <span>↗</span>
                  </a>
                )}
                {dbProfile?.socialLinks?.linkedin && (
                  <a href={dbProfile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <span>↗</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="skills section-shell section-pad" aria-labelledby="skills-title">
          <Reveal className="section-kicker mono">02 / Kapabilitas</Reveal>
          <Reveal className="section-heading writing-heading">
            <div>
              <h2 id="skills-title">Dari ide hingga production.</h2>
              <p>Tool hanyalah alat. Fokus saya memilih teknologi yang tepat untuk hasil yang tepat.</p>
            </div>
            <Link className="text-link" href="/skills">
              Lihat semua skills &amp; stack <span>↗</span>
            </Link>
          </Reveal>
          <div className="capability-grid">
            {capabilities.map((cap, idx) => (
              <Reveal as="article" key={cap.id || idx} className="capability-card">
                <span className="card-index mono">{cap.index || String(idx + 1).padStart(2, '0')}</span>
                <div className="cap-icon">{cap.icon || '◫'}</div>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
                {cap.tags && cap.tags.length > 0 && (
                  <div className="tag-list">
                    {cap.tags.map((tg, i) => (
                      <span key={i}>{tg}</span>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </section>

        <HomeProjects initialProjects={featuredProjects} />

        <section className="experience section-shell section-pad" id="experience" aria-labelledby="experience-title">
          <Reveal className="section-kicker mono">04 / Perjalanan</Reveal>
          <div className="experience-grid">
            <Reveal className="section-heading sticky-heading">
              <h2 id="experience-title">
                Belajar. Bertumbuh.<br />Membangun.
              </h2>
              <p>Perjalanan yang dibentuk oleh rasa ingin tahu dan keputusan engineering.</p>
              <Link className="text-link" href="/experience" style={{ marginTop: '16px', display: 'inline-block' }}>
                Lihat pengalaman lengkap <span>↗</span>
              </Link>
            </Reveal>
            <div className="timeline">
              {homeExperiences && homeExperiences.length > 0 ? (
                homeExperiences.map((item, idx) => (
                  <Reveal as="article" key={idx} className="timeline-item">
                    <div className="timeline-date mono">{item.period}</div>
                    <div>
                      <h3>{item.position}</h3>
                      <p className="company">{item.company}</p>
                      {item.description && <p>{item.description}</p>}
                      {item.technologies.length > 0 && (
                        <div className="tag-list">
                          {item.technologies.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))
              ) : (
                <>
                  <Reveal as="article" className="timeline-item">
                    <div className="timeline-date mono">2025 — NOW</div>
                    <div>
                      <h3>Senior Software Engineer</h3>
                      <p className="company">Lumina Labs · Remote</p>
                      <p>Memimpin delivery platform primitives yang dipakai squad untuk workflow finansial.</p>
                      <div className="tag-list">
                        <span>TypeScript</span>
                        <span>Node.js</span>
                        <span>AWS</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal as="article" className="timeline-item">
                    <div className="timeline-date mono">2024 — 2025</div>
                    <div>
                      <h3>Software Engineer</h3>
                      <p className="company">Kargo Nusantara · Hybrid</p>
                      <p>Membangun layanan routing real-time dan operations console untuk logistics platform.</p>
                      <div className="tag-list">
                        <span>Go</span>
                        <span>Kafka</span>
                        <span>Kubernetes</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal as="article" className="timeline-item">
                    <div className="timeline-date mono">2023</div>
                    <div>
                      <h3>Junior Web Developer</h3>
                      <p className="company">Studio Awan · On-site</p>
                      <p>Mengirim interface responsif, accessible, serta endpoint Laravel untuk produk klien.</p>
                      <div className="tag-list">
                        <span>JavaScript</span>
                        <span>Laravel</span>
                        <span>MySQL</span>
                      </div>
                    </div>
                  </Reveal>
                </>
              )}
            </div>
          </div>
        </section>

        {siteSettings.showArticles !== 'false' && siteSettings.showArticles !== false && (
          <section className="writing section-pad" id="writing" aria-labelledby="writing-title">
            <div className="section-shell">
              <Reveal className="section-kicker mono">05 / Catatan</Reveal>
              <Reveal className="section-heading writing-heading">
                <div>
                  <h2 id="writing-title">
                    Yang saya pelajari,<br />saya bagikan.
                  </h2>
                </div>
                <Link className="text-link" href="/articles">
                  Lihat semua artikel <span>↗</span>
                </Link>
              </Reveal>
              <div className="article-grid">
                {homeArticles && homeArticles.length > 0 ? (
                  homeArticles.map((art, idx) => (
                    <Reveal as="article" key={art.slug} className="article-card">
                      <div
                        className={`article-art ${
                          idx === 0 ? 'art-one' : idx === 1 ? 'art-two' : 'art-three'
                        }`}
                      >
                        <span>{art.mark}</span>
                      </div>
                      <div className="article-meta mono">
                        {art.categoryLabel} · {art.duration}
                      </div>
                      <h3>
                        <Link href={art.hasFullPage ? `/articles/${art.slug}` : '/articles'}>
                          {art.title}
                        </Link>
                      </h3>
                      <p>{art.summary}</p>
                      <time dateTime={art.datetime}>{art.date}</time>
                    </Reveal>
                  ))
                ) : (
                  <>
                    <Reveal as="article" className="article-card">
                      <div className="article-art art-one">
                        <span>⌁</span>
                      </div>
                      <div className="article-meta mono">SOFTWARE ARCHITECTURE · 9 MIN</div>
                      <h3>
                        <Link href="/articles/scale">
                          Merancang sistem yang tetap tenang saat traffic naik 10×
                        </Link>
                      </h3>
                      <p>Bottleneck, backpressure, observability, dan keputusan sebelum menambah server.</p>
                      <time dateTime="2026-08-12">12 Agu 2026</time>
                    </Reveal>

                    <Reveal as="article" className="article-card">
                      <div className="article-art art-two">
                        <span>DS</span>
                      </div>
                      <div className="article-meta mono">WEB DEVELOPMENT · 7 MIN</div>
                      <h3>
                        <Link href="/articles/design-system">
                          Design system bukan sekadar kumpulan komponen
                        </Link>
                      </h3>
                      <p>Token, API komponen, dokumentasi, dan governance sebagai satu sistem.</p>
                      <time dateTime="2026-07-29">29 Jul 2026</time>
                    </Reveal>

                    <Reveal as="article" className="article-card">
                      <div className="article-art art-three">
                        <span>RAG</span>
                      </div>
                      <div className="article-meta mono">AI / MACHINE LEARNING · 11 MIN</div>
                      <h3>
                        <Link href="/articles/rag">
                          RAG yang dapat dipercaya: dari retrieval sampai evaluasi
                        </Link>
                      </h3>
                      <p>Metadata, permission, evaluasi, dan UX penolakan untuk jawaban yang grounded.</p>
                      <time dateTime="2026-07-15">15 Jul 2026</time>
                    </Reveal>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="contact section-shell section-pad" id="contact" aria-labelledby="contact-title">
          <Reveal className="contact-card">
            <div className="contact-copy">
              <div className="section-kicker mono">06 / Kontak</div>
              <h2 id="contact-title">Punya masalah menarik untuk dipecahkan?</h2>
              <p>
                Ceritakan apa yang sedang Anda bangun. Saya senang bertukar ide, membahas peluang, atau sekadar menyapa.
              </p>
              <a href="mailto:syahrinnanda@gmail.com">
                syahrinnanda@gmail.com <span>↗</span>
              </a>
            </div>
            <ContactForm variant="home" />
          </Reveal>
        </section>
      </main>

      <div className="toast" id="toast" role="status" aria-live="polite"></div>
    </>
  );
}
