'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import { ProjectDialog } from './ProjectDialog';

export interface HomeProjectItem {
  id: string;
  title: string;
  type: string;
  num: string;
  shortDescription: string;
  category: string;
  impact?: { val: string; label: string }[];
  technologies: string[];
}

interface HomeProjectsProps {
  initialProjects?: HomeProjectItem[];
}

const DEFAULT_HOME_PROJECTS: HomeProjectItem[] = [
  {
    id: 'rachita-apps',
    title: 'Rachita Apps',
    type: 'ENTERPRISE · FULLSTACK',
    num: '01 / 03',
    shortDescription: 'Sistem aplikasi web terpadu untuk efisiensi operasional dan alur kerja lintas department PT Rachita.',
    category: 'fullstack',
    impact: [
      { val: '65%', label: 'efisiensi workflow' },
      { val: '8', label: 'department terintegrasi' },
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'rachita-finance',
    title: 'Rachita Apps Finance',
    type: 'FINTECH · BACKEND & LEDGER',
    num: '02 / 03',
    shortDescription: 'Modul khusus keuangan terenkripsi untuk pencatatan transaksi masuk/keluar, payroll, dan pelaporan otomatis.',
    category: 'fullstack',
    impact: [
      { val: '50%', label: 'closing lebih cepat' },
      { val: '100%', label: 'akurasi ledger' },
    ],
    technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'n8n-automation',
    title: 'Automation Sistem N8N',
    type: 'AUTOMATION · WORKFLOW',
    num: '03 / 03',
    shortDescription: 'Otomatisasi aggregator berita setiap jam 8 pagi yang dikirimkan otomatis ke Telegram, Email, dan Google Spreadsheet.',
    category: 'backend',
    impact: [
      { val: '1.5 jam', label: 'hemat waktu / hari' },
      { val: '100%', label: 'otomatisasi pagi' },
    ],
    technologies: ['N8N', 'Telegram API', 'Google Sheets', 'NodeMailer'],
  },
];

export default function HomeProjects({ initialProjects }: HomeProjectsProps = {}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  const projectsToRender =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : DEFAULT_HOME_PROJECTS;

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      setOpenProjectId(id);
    }
  };

  const visualStyles = ['visual-nusa', 'visual-pulse', 'visual-sora'];

  return (
    <>
      <section className="work section-pad" id="work" aria-labelledby="work-title">
        <div className="section-shell">
          <Reveal className="section-kicker mono">03 / Selected work</Reveal>
          <Reveal className="work-header">
            <div>
              <h2 id="work-title">
                Problem nyata.<br />Solusi terukur.
              </h2>
              <p>Beberapa produk yang saya bangun dari discovery sampai delivery.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link className="text-link" href="/projects">
                Lihat semua project <span>↗</span>
              </Link>
              <div className="filters" role="group" aria-label="Filter project">
                <button
                  className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
                  type="button"
                  data-filter="all"
                  aria-pressed={activeFilter === 'all'}
                  onClick={() => handleFilterClick('all')}
                >
                  Semua
                </button>
                <button
                  className={`filter ${activeFilter === 'fullstack' ? 'active' : ''}`}
                  type="button"
                  data-filter="fullstack"
                  aria-pressed={activeFilter === 'fullstack'}
                  onClick={() => handleFilterClick('fullstack')}
                >
                  Fullstack
                </button>
                <button
                  className={`filter ${activeFilter === 'backend' ? 'active' : ''}`}
                  type="button"
                  data-filter="backend"
                  aria-pressed={activeFilter === 'backend'}
                  onClick={() => handleFilterClick('backend')}
                >
                  Backend
                </button>
                <button
                  className={`filter ${activeFilter === 'ai' ? 'active' : ''}`}
                  type="button"
                  data-filter="ai"
                  aria-pressed={activeFilter === 'ai'}
                  onClick={() => handleFilterClick('ai')}
                >
                  AI
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="project-list section-shell">
          {projectsToRender.map((proj, idx) => {
            const isReverse = idx % 2 === 1;
            const isHidden =
              activeFilter !== 'all' && !proj.category.toLowerCase().includes(activeFilter);
            const visualClass = visualStyles[idx % visualStyles.length];

            return (
              <Reveal
                as="article"
                key={proj.id}
                className={`project ${isReverse ? 'project-reverse' : ''} ${isHidden ? 'hidden' : ''}`}
                data-category={proj.category}
                tabIndex={0}
                data-project={proj.id}
                onKeyDown={(e) => handleKeyDown(e, proj.id)}
              >
                <div className={`project-visual ${visualClass}`}>
                  <div className="project-number mono">
                    {proj.num || `${String(idx + 1).padStart(2, '0')} / ${String(projectsToRender.length).padStart(2, '0')}`}
                  </div>
                  <div className="mock-browser">
                    <div className="mock-top">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="mock-dashboard" style={{ display: 'grid', placeItems: 'center', height: '100%', padding: '24px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '8px' }}>
                          {proj.title.slice(0, 2).toUpperCase()}
                        </div>
                        <b style={{ display: 'block', fontSize: '1rem', color: '#ffffff' }}>{proj.title}</b>
                        <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{proj.type}</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="project-copy">
                  <div className="project-type mono">{proj.type.toUpperCase()}</div>
                  <h3>{proj.title}</h3>
                  <p>{proj.shortDescription}</p>

                  {proj.impact && proj.impact.length > 0 && (
                    <div className="impact">
                      {proj.impact.map((imp, i) => (
                        <span key={i}>
                          <b>{imp.val}</b> {imp.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="tag-list">
                    {proj.technologies.slice(0, 5).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <button
                      className="text-link open-project"
                      type="button"
                      onClick={() => setOpenProjectId(proj.id)}
                    >
                      Ringkasan <span>↗</span>
                    </button>
                    <Link className="text-link" href={`/projects/${proj.id}`}>
                      Case study lengkap <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ProjectDialog projectId={openProjectId} onClose={() => setOpenProjectId(null)} />
    </>
  );
}
