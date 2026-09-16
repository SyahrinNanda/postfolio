'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface ProjectCardData {
  id: string;
  category: string;
  search: string;
  color: string;
  symbol: string;
  topMeta: string;
  yearMeta: string;
  title: string;
  isH2?: boolean;
  featured?: boolean;
  description: string;
  impact?: { val: string; label: string }[];
  tags: string[];
}

export interface ProjectFilterProps {
  initialProjects?: ProjectCardData[];
}

const projects: ProjectCardData[] = [
  {
    id: 'rachita-apps',
    category: 'fullstack web internal',
    search: 'Rachita Apps sistem aplikasi web management pt rachita setiap department fullstack internal React Next.js Node.js PostgreSQL RBAC',
    color: 'purple',
    symbol: 'RA',
    topMeta: '01 · Enterprise',
    yearMeta: 'Featured · 2026',
    title: 'Rachita Apps',
    isH2: true,
    featured: true,
    description: 'Sistem aplikasi web untuk management PT Rachita setiap department dengan alur kerja & RBAC terpadu.',
    impact: [
      { val: '65%', label: 'efisiensi workflow' },
      { val: '8 Dept', label: 'terintegrasi' },
    ],
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'rachita-finance',
    category: 'fullstack web',
    search: 'Rachita Apps Finance sistem aplikasi web keuangan management pt rachita khusus department keuangan fintech TypeScript Next.js PostgreSQL',
    color: 'lime',
    symbol: 'RF',
    topMeta: '02 · Fintech',
    yearMeta: '2026',
    title: 'Rachita Apps Finance',
    description: 'Sistem aplikasi web keuangan untuk management PT Rachita khusus department keuangan.',
    impact: [
      { val: '50%', label: 'closing lebih cepat' },
      { val: '100%', label: 'akurasi ledger' },
    ],
    tags: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'n8n-automation',
    category: 'automation backend',
    search: 'Automation Sistem N8N automatisasi berita jam 8 pagi telegram email spreadsheet cron webhook',
    color: 'orange',
    symbol: 'N8',
    topMeta: '03 · Automation',
    yearMeta: '2025',
    title: 'Automation Sistem N8N',
    description: 'Membuat automatisasi berita di setiap jam 8 pagi akan dikirimkan ke Telegram, Email, dan Spreadsheet.',
    tags: ['N8N', 'Telegram API', 'Google Sheets', 'NodeMailer'],
  },
  {
    id: 'kpr-simulasi',
    category: 'web other',
    search: 'Simulasi Hitungan KPR Rachita kalkulator angsuran cicilan rumah subsidi kpr react chart pdf',
    color: 'blue',
    symbol: 'KP',
    topMeta: '04 · Tools',
    yearMeta: '2025',
    title: 'Simulasi Hitungan KPR Rachita',
    description: 'Kalkulator untuk menghitung simulasi perhitungan angsuran cicilan rumah subsidi KPR.',
    tags: ['JavaScript', 'React', 'Chart.js', 'jsPDF'],
  },
  {
    id: 'rachita-3d',
    category: 'web other',
    search: 'Web 3D Tour Rachita web 3d tour lokasi room tour perumahan pt rachita three.js webgl 360',
    color: 'slate',
    symbol: '3D',
    topMeta: '05 · 3D Graphics',
    yearMeta: '2026',
    title: 'Web 3D Tour Rachita',
    description: 'Web 3D tour untuk melihat lokasi dan room tour perumahan PT Rachita.',
    tags: ['Three.js', 'WebGL', 'Pannellum', 'JavaScript'],
  },
  {
    id: 'mbg-gizi',
    category: 'web other',
    search: 'MBG Gizi Harian web informasi menu makan beserta gizi harian dari mbg kesehatan nutrisi',
    color: 'purple',
    symbol: 'MB',
    topMeta: '06 · Health',
    yearMeta: '2026',
    title: 'MBG Gizi Harian',
    description: 'Web informasi menu makan beserta gizi harian dari MBG.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    id: 'chick-farm',
    category: 'mobile ai',
    search: 'Chick Farm App Mobile aplikasi mobile peternakan ayam deteksi penyakit AI foto kotoran marketplace pakan alat React Native Python TensorFlow Node.js',
    color: 'orange',
    symbol: 'CF',
    topMeta: '07 · Mobile App & AI',
    yearMeta: '2026',
    title: 'Chick Farm App Mobile',
    description: 'Aplikasi mobile peternakan ayam dengan AI pendeteksi penyakit lewat foto kotoran & toko pakan/alat ternak.',
    impact: [
      { val: '92%', label: 'akurasi AI' },
      { val: '< 3s', label: 'diagnosa foto' },
    ],
    tags: ['React Native', 'Python', 'TensorFlow', 'Node.js'],
  },
];

const filterCategories = [
  { id: 'all', label: 'Semua' },
  { id: 'web', label: 'Web' },
  { id: 'backend', label: 'Backend' },
  { id: 'fullstack', label: 'Fullstack' },
  { id: 'ai', label: 'AI' },
  { id: 'automation', label: 'Automation' },
  { id: 'internal', label: 'Internal System' },
  { id: 'other', label: 'Other' },
];

export default function ProjectFilter({ initialProjects }: ProjectFilterProps = {}) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const projectList = initialProjects && initialProjects.length > 0 ? initialProjects : projects;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projectList.filter((p) => {
      const categoryMatch = activeFilter === 'all' || p.category.split(' ').includes(activeFilter);
      const haystack = (p.search + ' ' + p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
      const searchMatch = !q || haystack.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [search, activeFilter, projectList]);

  return (
    <>
      <section className="explorer-bar" data-project-explorer aria-label="Pencarian dan filter project">
        <div className="public-shell explorer-inner">
          <label className="search-field">
            <span className="skip-link">Cari project</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-4-4"></path>
            </svg>
            <input
              type="search"
              data-search
              placeholder="Cari project atau teknologi…"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="public-filters" aria-label="Filter kategori">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                className={`public-filter${activeFilter === cat.id ? ' active' : ''}`}
                type="button"
                data-filter={cat.id}
                aria-pressed={activeFilter === cat.id}
                onClick={() => setActiveFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-shell" aria-labelledby="project-list-title">
        <div className="section-intro reveal visible">
          <div>
            <span className="overline">Selected work · 2024—2026</span>
            <h2 id="project-list-title">Technical case studies.</h2>
          </div>
          <p data-result-count aria-live="polite">
            {visible.length} project ditemukan
          </p>
        </div>

        <div className="projects-grid">
          {visible.map((p) => (
            <article
              key={p.id}
              className={`project-card-public panel reveal visible${p.featured ? ' featured' : ''}`}
              data-project-card
              data-project-id={p.id}
              data-category={p.category}
              data-search={p.search}
            >
              <div className={`project-art ${p.color}`}>
                <span className="project-art-grid" aria-hidden="true"></span>
                <span className="project-symbol" aria-hidden="true">
                  {p.symbol}
                </span>
              </div>
              <div className="project-card-body">
                <div className="project-card-top">
                  <span>{p.topMeta}</span>
                  <span>{p.yearMeta}</span>
                </div>
                {p.isH2 ? <h2>{p.title}</h2> : <h3>{p.title}</h3>}
                <p>{p.description}</p>
                {p.impact && (
                  <div className="impact">
                    {p.impact.map((item, idx) => (
                      <span key={idx}>
                        <b>{item.val}</b>
                        {item.label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="tag-list">
                  {p.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="link-arrow" href={`/projects/${p.id}`}>
                  Baca case study
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={`empty-state${visible.length === 0 ? '' : ' hidden'}`} data-empty-state>
          <strong>Tidak ada project yang cocok</strong>
          Coba kata kunci lain atau pilih kategori “Semua”.
        </div>
      </section>
    </>
  );
}
