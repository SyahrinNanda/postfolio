import Link from 'next/link';
import ProjectFilter, { ProjectCardData } from '@/components/ProjectFilter';
import GithubWidget from '@/components/GithubWidget';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { projects as dbProjectsTable } from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: "Project — As'syahrin Nanda",
  description: "Project dan technical case study As'syahrin Nanda: fullstack, backend, AI, automation, dan internal systems.",
};

export default async function Projects() {
  let projectItems: ProjectCardData[] | undefined = undefined;

  try {
    const list = await db.query.projects.findMany({
      where: eq(dbProjectsTable.status, 'published'),
      with: {
        projectTechnologies: {
          with: {
            technology: true,
          },
        },
      },
      orderBy: [asc(dbProjectsTable.order), desc(dbProjectsTable.createdAt)],
    });

    if (list && list.length > 0) {
      projectItems = list.map((p, idx) => ({
        id: p.slug,
        category: p.category || 'fullstack web',
        search: `${p.title} ${p.shortDescription || ''} ${
          p.projectTechnologies?.map((pt) => pt.technology.name).join(' ') || ''
        }`,
        color: p.color || 'purple',
        symbol: p.symbol || p.title.slice(0, 2).toUpperCase(),
        topMeta: `${p.num || String(idx + 1).padStart(2, '0')} · ${p.label || 'Project'}`,
        yearMeta: p.featured ? `Featured · ${p.year || '2026'}` : p.year || '2026',
        title: p.title,
        isH2: idx === 0,
        featured: Boolean(p.featured),
        description: p.shortDescription || '',
        impact:
          p.result && Array.isArray(p.result)
            ? (p.result.slice(0, 2) as [string, string][]).map(([val, label]) => ({
                val,
                label,
              }))
            : undefined,
        tags: p.projectTechnologies?.map((pt) => pt.technology.name) || [],
      }));
    }
  } catch (err) {
    console.error('Error loading projects from DB:', err);
  }

  return (
    <>
      <BodyStyler classes={['public-page']} />
      <main id="main" className="public-main" tabIndex={-1}>
        <section className="page-hero">
          <div className="public-shell page-hero-grid">
            <div className="reveal visible">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <i>/</i>
                <span aria-current="page">Project</span>
              </nav>
              <h1>
                Karya yang menjelaskan <em>cara berpikir.</em>
              </h1>
              <p className="page-hero-lead">
                Bukan hanya hasil akhir. Setiap case study membahas problem, constraint, arsitektur, keputusan teknis,
                testing, dan hasil yang terukur.
              </p>
            </div>
            <div className="page-hero-side reveal visible">
              <span className="sample-pill">Tersambung ke Database SQLite</span>
              <p>
                Daftar project dan case study diambil dinamis dari database SQLite dan dikelola melalui Admin CMS.
              </p>
            </div>
          </div>
        </section>

        <ProjectFilter initialProjects={projectItems} />

        <GithubWidget />
      </main>
    </>
  );
}
