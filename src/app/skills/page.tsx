import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { skills as dbSkillsTable, technologies as dbTechnologiesTable } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: "Skills & Technology — As'syahrin Nanda",
  description: "Kapabilitas engineering dari interface hingga production.",
};

const DEFAULT_SKILL_GROUPS = [
  {
    category: 'Frontend',
    icon: 'FE',
    items: [
      { name: 'HTML · Semantic UI', level: 94, badge: 'ADVANCED' },
      { name: 'CSS · Responsive systems', level: 91, badge: 'ADVANCED' },
      { name: 'JavaScript · TypeScript', level: 89, badge: 'ADVANCED' },
      { name: 'React · Next.js', level: 87, badge: 'ADVANCED' },
    ],
  },
  {
    category: 'Backend & API',
    icon: 'BE',
    items: [
      { name: 'Node.js · API design', level: 90, badge: 'ADVANCED' },
      { name: 'PHP · Laravel', level: 80, badge: 'PROFICIENT' },
      { name: 'Python · FastAPI', level: 82, badge: 'PROFICIENT' },
      { name: 'Go · Concurrent services', level: 70, badge: 'WORKING' },
    ],
  },
  {
    category: 'Data & Database',
    icon: 'DB',
    items: [
      { name: 'PostgreSQL · SQL', level: 88, badge: 'ADVANCED' },
      { name: 'MySQL', level: 80, badge: 'PROFICIENT' },
      { name: 'Redis · Caching', level: 79, badge: 'PROFICIENT' },
      { name: 'MongoDB', level: 65, badge: 'WORKING' },
    ],
  },
  {
    category: 'AI Engineering',
    icon: 'AI',
    items: [
      { name: 'LLM application design', level: 81, badge: 'PROFICIENT' },
      { name: 'RAG · Embeddings', level: 80, badge: 'PROFICIENT' },
      { name: 'Evaluation · Guardrails', level: 78, badge: 'PROFICIENT' },
      { name: 'Machine Learning · Deep Learning', level: 68, badge: 'WORKING' },
    ],
  },
  {
    category: 'DevOps & Cloud',
    icon: 'OP',
    items: [
      { name: 'Git · CI/CD', level: 90, badge: 'ADVANCED' },
      { name: 'Docker · Linux', level: 86, badge: 'ADVANCED' },
      { name: 'AWS', level: 78, badge: 'PROFICIENT' },
      { name: 'Kubernetes', level: 68, badge: 'WORKING' },
    ],
  },
  {
    category: 'Engineering Practice',
    icon: 'XP',
    items: [
      { name: 'System design', level: 87, badge: 'ADVANCED' },
      { name: 'Testing strategy', level: 85, badge: 'ADVANCED' },
      { name: 'Observability', level: 79, badge: 'PROFICIENT' },
      { name: 'Technical leadership', level: 82, badge: 'PROFICIENT' },
    ],
  },
];

const DEFAULT_TECH_LIST = [
  'HTML5',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PHP',
  'Laravel',
  'Python',
  'FastAPI',
  'Go',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Kafka',
  'Docker',
  'Kubernetes',
  'Linux',
  'AWS',
  'GitHub Actions',
  'Playwright',
  'OpenTelemetry',
  'Machine Learning',
  'Deep Learning',
  'LLM',
  'RAG',
  'AI Agent',
  'pgvector',
];

function getCategoryIcon(catName: string) {
  const lower = catName.toLowerCase();
  if (lower.includes('front')) return 'FE';
  if (lower.includes('back')) return 'BE';
  if (lower.includes('data') || lower.includes('db')) return 'DB';
  if (lower.includes('ai') || lower.includes('ml')) return 'AI';
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('ops')) return 'OP';
  if (lower.includes('eng') || lower.includes('prac') || lower.includes('arch')) return 'XP';
  if (lower.includes('mob')) return 'MO';
  return catName.slice(0, 2).toUpperCase();
}

function getMasteryBadge(level: number) {
  if (level >= 85) return 'ADVANCED';
  if (level >= 75) return 'PROFICIENT';
  if (level >= 60) return 'WORKING';
  return 'FAMILIAR';
}

export default async function Skills() {
  let skillGroups = DEFAULT_SKILL_GROUPS;
  let techCloud = DEFAULT_TECH_LIST;

  try {
    const dbSkills = await db.query.skills.findMany({
      where: eq(dbSkillsTable.status, 'active'),
      orderBy: [asc(dbSkillsTable.order), asc(dbSkillsTable.name)],
    });

    if (dbSkills && dbSkills.length > 0) {
      const groupedMap = new Map<string, Array<{ name: string; level: number; badge: string }>>();

      for (const s of dbSkills) {
        const cat = s.category || 'Engineering';
        if (!groupedMap.has(cat)) {
          groupedMap.set(cat, []);
        }
        const level = s.proficiency ?? 80;
        groupedMap.get(cat)!.push({
          name: s.name,
          level,
          badge: getMasteryBadge(level),
        });
      }

      skillGroups = Array.from(groupedMap.entries()).map(([category, items]) => ({
        category,
        icon: getCategoryIcon(category),
        items,
      }));
    }
  } catch (err) {
    console.error('Error loading skills from DB:', err);
  }

  try {
    const dbTechs = await db.query.technologies.findMany({
      where: eq(dbTechnologiesTable.status, 'active'),
      orderBy: [asc(dbTechnologiesTable.order), asc(dbTechnologiesTable.name)],
    });

    if (dbTechs && dbTechs.length > 0) {
      techCloud = dbTechs.map((t) => t.name);
    }
  } catch (err) {
    console.error('Error loading technologies from DB:', err);
  }

  return (
    <>
      <BodyStyler classes={['public-page']} />
      <main id="main" className="public-main">
        <section className="page-hero">
          <div className="public-shell page-hero-grid">
            <Reveal>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <i>/</i>
                <span aria-current="page">Skills</span>
              </nav>
              <h1>
                Tool berubah. Fondasi <em>bertahan.</em>
              </h1>
              <p className="page-hero-lead">
                Saya bekerja end-to-end dan memilih teknologi berdasarkan problem, constraint,
                operability, serta kemampuan tim untuk memeliharanya.
              </p>
            </Reveal>
            <Reveal className="page-hero-side">
              <span className="sample-pill">Terkelola via Admin CMS</span>
              <p>
                Bar menunjukkan tingkat penguasaan relatif. Seluruh skill dan teknologi stack
                disinkronkan secara langsung dari database SQLite.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="capability-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Capability map</span>
              <h2 id="capability-title">Dari browser hingga observability.</h2>
            </div>
            <p>
              Setiap kelompok mencakup delivery, quality, dan operation—bukan sekadar sintaks
              framework.
            </p>
          </Reveal>

          <div className="skill-overview">
            {skillGroups.map((group) => (
              <Reveal as="article" key={group.category} className="skill-group panel">
                <div className="skill-group-head">
                  <h2>{group.category}</h2>
                  <span className="skill-group-icon">{group.icon}</span>
                </div>
                <div className="skill-list">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <div className="skill-item-top">
                        <span>{item.name}</span>
                        <span>{item.badge}</span>
                      </div>
                      <div className="skill-track">
                        <i style={{ '--level': `${item.level}%` } as React.CSSProperties}></i>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="stack-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Technology index</span>
              <h2 id="stack-title">Stack yang pernah digunakan.</h2>
            </div>
            <p>Daftar dikonfigurasi dan disinkronkan langsung dengan master teknologi di CMS.</p>
          </Reveal>
          <Reveal className="stack-cloud" aria-label="Technology stack">
            {techCloud.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </Reveal>
        </section>

        <section className="public-section public-shell" aria-labelledby="proof-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Skill × evidence</span>
              <h2 id="proof-title">Bukti dalam konteks project.</h2>
            </div>
            <p>
              Level lebih berarti ketika terhubung dengan jenis masalah dan tanggung jawab yang
              pernah ditangani.
            </p>
          </Reveal>
          <Reveal style={{ overflowX: 'auto' }}>
            <table className="competency-table">
              <thead>
                <tr>
                  <th>Kapabilitas</th>
                  <th>Digunakan pada</th>
                  <th>Bukti</th>
                  <th>Fokus berikutnya</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fullstack product delivery</td>
                  <td>Rachita Apps</td>
                  <td>Sistem ERP, RBAC, Approval</td>
                  <td>Skalabilitas platform internal</td>
                </tr>
                <tr>
                  <td>Event-driven backend</td>
                  <td>N8N Automation</td>
                  <td>Integrasi Telegram, Cron otomatis</td>
                  <td>Formal resiliency log data</td>
                </tr>
                <tr>
                  <td>AI application engineering</td>
                  <td>Chick Farm Mobile</td>
                  <td>Computer vision, klasifikasi penyakit</td>
                  <td>Agent reliability</td>
                </tr>
                <tr>
                  <td>Accessible UI systems</td>
                  <td>MBG Gizi Harian</td>
                  <td>Lighthouse 98%, web publik</td>
                  <td>Inclusive research</td>
                </tr>
              </tbody>
            </table>
          </Reveal>
          <Reveal as="p" className="note">
            <strong>Keterkaitan Proyek:</strong> Data skill dan teknologi di atas terhubung langsung
            dengan rekam jejak pada halaman studi kasus dan pengalaman kerja.
          </Reveal>
        </section>

        <section className="public-section public-shell">
          <Reveal className="contact-card">
            <div className="contact-copy">
              <span className="overline">Punya problem yang cocok?</span>
              <h2>Mari pilih teknologi setelah memahami kebutuhan.</h2>
              <p>
                Saya terbuka untuk diskusi product engineering, backend systems, dan AI
                application yang memerlukan fondasi tepercaya.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Link className="button button-light" href="/contact">
                Ceritakan project Anda <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
