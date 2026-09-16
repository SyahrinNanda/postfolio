import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { projectData, projectList, ProjectData } from '@/lib/data/projects';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(slug: string): Promise<ProjectData | null> {
  try {
    const dbProject = await db.query.projects.findFirst({
      where: and(eq(projects.slug, slug), eq(projects.status, 'published')),
      with: {
        images: true,
        features: true,
        projectTechnologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    if (dbProject) {
      const staticProj = projectData[slug];
      return {
        title: dbProject.title,
        type: dbProject.projectType || staticProj?.type || 'Fullstack',
        summary: dbProject.shortDescription || staticProj?.summary || '',
        role: dbProject.role || staticProj?.role || 'Software Engineer',
        duration: dbProject.duration || staticProj?.duration || '',
        status: dbProject.status === 'published' ? 'Production' : (dbProject.status || 'Active'),
        year: dbProject.year || staticProj?.year || '2026',
        mark: dbProject.symbol || staticProj?.mark || dbProject.title.slice(0, 2).toUpperCase(),
        overview: dbProject.fullDescription || staticProj?.overview || '',
        problem: dbProject.problem || staticProj?.problem || '',
        requirements: dbProject.requirements || staticProj?.requirements || [],
        solution: dbProject.solution || staticProj?.solution || '',
        architecture: dbProject.architecture || staticProj?.architecture || [],
        technologies:
          dbProject.projectTechnologies?.map((pt) => pt.technology.name) ||
          staticProj?.technologies ||
          [],
        tables: dbProject.tables || staticProj?.tables || [],
        features: dbProject.features?.map((f) => f.title) || staticProj?.features || [],
        challenges: dbProject.challenges || staticProj?.challenges || [],
        decisions: dbProject.decisions || staticProj?.decisions || [],
        implementation: dbProject.implementation || staticProj?.implementation || '',
        testing: dbProject.testing || staticProj?.testing || '',
        results: dbProject.result || staticProj?.results || [],
        lessons: dbProject.lessons || staticProj?.lessons || '',
        repo: dbProject.githubUrl || staticProj?.repo || '',
        demo: dbProject.liveDemoUrl || staticProj?.demo || '',
      };
    }
  } catch (err) {
    console.error('Error fetching project from DB:', err);
  }

  return projectData[slug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(projectData).map((id) => ({ id }));
}

export default async function ProjectDetail({ params }: Props) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <BodyStyler classes={['public-page']} attributes={{ 'data-project-detail': 'true' }} />
      <main className="public-main" id="main">
      <section className="page-hero case-hero">
        <div className="public-shell">
          <Reveal as="nav" className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Beranda</Link><i>/</i>
            <Link href="/projects">Project</Link><i>/</i>
            <span aria-current="page">{project.title}</span>
          </Reveal>
          <div className="page-hero-grid">
            <Reveal>
              <span className="overline">{project.type}</span>
              <h1>{project.title}</h1>
              <p className="page-hero-lead">{project.summary}</p>
            </Reveal>
            <Reveal as="aside" className="page-hero-side">
              <span className="sample-pill">Technical case study</span>
              <p>Studi kasus nyata tentang problem, constraint, arsitektur, dan keputusan teknis.</p>
            </Reveal>
          </div>
          <Reveal className="case-meta" aria-label="Metadata project">
            <div><span>Role</span><strong>{project.role}</strong></div>
            <div><span>Durasi</span><strong>{project.duration}</strong></div>
            <div><span>Status</span><strong>{project.status}</strong></div>
            <div><span>Tahun</span><strong>{project.year}</strong></div>
          </Reveal>
        </div>
      </section>

      <div className="public-shell public-section">
        <Reveal className="case-cover" role="img" aria-label={`Visual cover project ${project.title}`}>
          <span className="case-cover-mark">{project.mark}</span>
        </Reveal>
      </div>

      <section className="public-section public-shell" aria-label="Isi technical case study">
        <div className="case-nav-layout">
          <nav className="case-toc panel" aria-label="Daftar isi case study">
            <span>Di halaman ini</span>
            <a href="#overview">Overview</a>
            <a href="#problem">Problem &amp; requirements</a>
            <a href="#solution">Solution</a>
            <a href="#architecture">Architecture</a>
            <a href="#technology">Technology stack</a>
            <a href="#database">Database design</a>
            <a href="#features">Features</a>
            <a href="#challenges">Challenges</a>
            <a href="#decisions">Technical decisions</a>
            <a href="#implementation">Implementation</a>
            <a href="#testing">Testing</a>
            <a href="#screenshots">Screenshots</a>
            <a href="#results">Results</a>
            <a href="#lessons">Lessons learned</a>
          </nav>

          <article className="case-content">
            <Reveal as="section" className="case-block" id="overview">
              <span className="overline">01 / Overview</span>
              <h2>Konteks project.</h2>
              <p>{project.overview}</p>
            </Reveal>

            <Reveal as="section" className="case-block" id="problem">
              <span className="overline">02 / Business &amp; technical problem</span>
              <h2>Masalah yang layak diselesaikan.</h2>
              <p>{project.problem}</p>
              <h3>Requirements &amp; constraints</h3>
              <div className="requirement-grid">
                {project.requirements.map(([title, desc], idx) => (
                  <article key={idx} className="requirement-card">
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="solution">
              <span className="overline">03 / Solution</span>
              <h2>Pendekatan engineering.</h2>
              <p>{project.solution}</p>
            </Reveal>

            <Reveal as="section" className="case-block" id="architecture">
              <span className="overline">04 / System architecture</span>
              <h2>Aliran data yang dapat diamati.</h2>
              <p>Diagram konseptual ini menekankan batas layanan dan arah data.</p>
              <div className="architecture-board">
                <div className="architecture-flow">
                  {project.architecture.map((node, idx, arr) => (
                    <span key={idx} style={{ display: 'contents' }}>
                      <span className={`arch-node${idx === Math.floor(arr.length / 2) ? ' accent' : ''}`}>
                        {node}
                      </span>
                      {idx < arr.length - 1 && <span className="arch-arrow">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="technology">
              <span className="overline">05 / Technology stack</span>
              <h2>Tool dipilih berdasarkan constraint.</h2>
              <p>Stack bukan daftar popularitas. Setiap alat dipilih untuk mengurangi risiko tertentu, sesuai kematangan tim dan kebutuhan operasional.</p>
              <div className="tag-list">
                {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="database">
              <span className="overline">06 / Database design</span>
              <h2>Data utama dan relasinya.</h2>
              <p>Model berikut adalah subset yang disederhanakan. Foreign key, unique constraint, index, retention, dan auditability ditentukan bersama pola aksesnya.</p>
              <div className="schema-board">
                {project.tables.map(([tableName, cols]) => (
                  <section key={tableName} className="schema-table">
                    <h4>{tableName}</h4>
                    <ul>
                      {cols.map(col => <li key={col}>{col}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="features">
              <span className="overline">07 / Main features</span>
              <h2>Capability yang dikirim.</h2>
              <ul>
                {project.features.map((feat, i) => <li key={i}>{feat}</li>)}
              </ul>
            </Reveal>

            <Reveal as="section" className="case-block" id="challenges">
              <span className="overline">08 / Engineering challenges</span>
              <h2>Bagian yang paling menuntut.</h2>
              <ul>
                {project.challenges.map((chal, i) => <li key={i}>{chal}</li>)}
              </ul>
            </Reveal>

            <Reveal as="section" className="case-block" id="decisions">
              <span className="overline">09 / Technical decisions</span>
              <h2>Trade-off yang disengaja.</h2>
              <div className="decision-grid">
                {project.decisions.map(([title, desc], i) => (
                  <article key={i} className="decision-card">
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="implementation">
              <span className="overline">10 / Implementation</span>
              <h2>Delivery dalam vertical slices.</h2>
              <p>{project.implementation}</p>
              <pre className="code-snippet" aria-label="Contoh pseudo-code"><code>
<span className="accent">async function</span> handle(payload) {'{'}
  console.log('Processing:', payload);
  <span className="accent">return</span> true;
{'}'}
              </code></pre>
            </Reveal>

            <Reveal as="section" className="case-block" id="testing">
              <span className="overline">11 / Testing &amp; quality</span>
              <h2>Confidence di setiap lapisan.</h2>
              <p>{project.testing}</p>
            </Reveal>

            <Reveal as="section" className="case-block" id="screenshots">
              <span className="overline">12 / Product screenshots</span>
              <h2>Interface dalam konteks.</h2>
              <p>Mock screenshot berikut menunjukkan slot gallery responsive. Visual merupakan ilustrasi CSS—bukan tangkapan produk aktual.</p>
              <div className="screenshot-grid">
                <div className="case-screenshot" role="img" aria-label="Mock screenshot overview"><span>Overview · demo</span></div>
                <div className="case-screenshot" role="img" aria-label="Mock screenshot workflow"><span>Workflow · demo</span></div>
                <div className="case-screenshot" role="img" aria-label="Mock screenshot mobile"><span>Mobile · demo</span></div>
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="results">
              <span className="overline">13 / Result &amp; impact</span>
              <h2>Outcome yang dapat dibaca.</h2>
              <div className="result-grid">
                {project.results.map(([val, label], i) => (
                  <article key={i} className="result-card">
                    <strong>{val}</strong>
                    <p>{label}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" className="case-block" id="lessons">
              <span className="overline">14 / Lessons learned</span>
              <h2>Apa yang akan dibawa ke project berikutnya.</h2>
              <p>{project.lessons}</p>
              <div className="case-actions">
                {project.demo ? (
                  <a className="button button-primary" href={project.demo} target="_blank" rel="noreferrer">Kunjungi Demo <span>↗</span></a>
                ) : (
                  <span className="button button-primary is-disabled" aria-disabled="true">Demo privat / offline</span>
                )}
                {project.repo ? (
                  <a className="button button-ghost" href={project.repo} target="_blank" rel="noreferrer">Repository <span>↗</span></a>
                ) : (
                  <span className="button button-ghost is-disabled" aria-disabled="true">Repository private</span>
                )}
                <Link className="button button-ghost" href="/projects">Semua project</Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>
    </main>
    </>
  );
}

