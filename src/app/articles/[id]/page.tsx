import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { articleData, articleList, type ArticleData as StaticArticleData, type ArticleSection } from '@/lib/data/articles';
import BodyStyler from '@/components/BodyStyler';
import { ReadingProgress, ShareRail } from '@/components/ArticleInteractions';
import type { Metadata } from 'next';
import { db } from '@/db';
import { articles as dbArticlesTable } from '@/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';

export const dynamicParams = false;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    const dbItem = await db.query.articles.findFirst({
      where: eq(dbArticlesTable.slug, slug),
    });
    if (dbItem) {
      return {
        title: `${dbItem.title} — Syahrin Notes`,
        description: dbItem.summary || '',
        openGraph: {
          title: `${dbItem.title} — Syahrin Notes`,
          description: dbItem.summary || '',
        },
      };
    }
  } catch {
    // fallback
  }

  const staticArticle = articleData[slug];
  if (!staticArticle) return { title: 'Article Not Found' };

  return {
    title: `${staticArticle.title} — Syahrin Notes`,
    description: staticArticle.summary,
    openGraph: {
      title: `${staticArticle.title} — Syahrin Notes`,
      description: staticArticle.summary,
    },
  };
}

export async function generateStaticParams() {
  try {
    const dbArticles = await db.query.articles.findMany({
      where: eq(dbArticlesTable.hasFullPage, true),
      columns: { slug: true },
    });
    if (dbArticles && dbArticles.length > 0) {
      return dbArticles.map((a) => ({ id: a.slug }));
    }
  } catch {
    // fallback
  }
  return articleList.filter((a) => a.hasFullPage).map((a) => ({ id: a.id }));
}

export default async function ArticleDetail({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  let title = '';
  let category = '';
  let categoryLabel = '';
  let summary = '';
  let lead = '';
  let date = '';
  let datetime = '';
  let read = '';
  let mark = '';
  let author = "As'syahrin Nanda";
  let tags: string[] = [];
  let sections: ArticleSection[] = [];

  // 1. Try fetching from SQLite
  try {
    const dbItem = await db.query.articles.findFirst({
      where: eq(dbArticlesTable.slug, slug),
    });

    if (dbItem) {
      title = dbItem.title;
      category = dbItem.category || 'Software Architecture';
      categoryLabel = dbItem.categoryLabel || dbItem.category || 'Software Architecture';
      summary = dbItem.summary || '';
      lead = dbItem.lead || dbItem.summary || '';
      author = dbItem.author || "As'syahrin Nanda";
      read = dbItem.readDuration || '5 menit baca';
      mark = dbItem.coverMark || dbItem.title.slice(0, 2).toUpperCase();

      datetime = dbItem.publishedDate || '2026-01-01';
      date = dbItem.publishedDate || '';
      if (date && date.includes('-')) {
        try {
          const d = new Date(date);
          date = d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        } catch {
          // fallback
        }
      }

      // Parse tags
      if (Array.isArray(dbItem.tags)) {
        tags = dbItem.tags;
      } else if (typeof dbItem.tags === 'string') {
        try {
          tags = JSON.parse(dbItem.tags);
        } catch {
          tags = [];
        }
      }

      // Parse sections
      let parsedSections: any = dbItem.sections;
      if (typeof parsedSections === 'string') {
        try {
          parsedSections = JSON.parse(parsedSections);
        } catch {
          parsedSections = [];
        }
      }

      if (Array.isArray(parsedSections) && parsedSections.length > 0) {
        sections = parsedSections;
      } else if (dbItem.content) {
        sections = [
          {
            id: 'isi-artikel',
            title: 'Pembahasan',
            paragraphs: dbItem.content.split('\n\n').filter(Boolean),
          },
        ];
      }
    }
  } catch (err) {
    console.error('Error querying article from DB:', err);
  }

  // 2. Fallback to static data if not found in database
  if (!title) {
    const staticArticle = articleData[slug];
    const listData = articleList.find((a) => a.id === slug);

    if (!staticArticle || !listData) {
      notFound();
    }

    title = staticArticle.title;
    category = staticArticle.category;
    categoryLabel = listData.categoryLabel || staticArticle.category;
    summary = staticArticle.summary;
    lead = staticArticle.lead;
    date = staticArticle.date;
    datetime = staticArticle.datetime;
    read = staticArticle.read;
    mark = staticArticle.mark;
    tags = staticArticle.tags;
    sections = staticArticle.sections;
  }

  // Recommendations: Other articles with full page
  let otherArticles: Array<{
    id: string;
    title: string;
    summary: string;
    categoryLabel: string;
    duration: string;
  }> = [];

  try {
    const dbOthers = await db.query.articles.findMany({
      where: and(
        eq(dbArticlesTable.status, 'published'),
        eq(dbArticlesTable.hasFullPage, true),
        ne(dbArticlesTable.slug, slug)
      ),
      orderBy: [desc(dbArticlesTable.publishedDate)],
      limit: 2,
    });

    if (dbOthers && dbOthers.length > 0) {
      otherArticles = dbOthers.map((o) => ({
        id: o.slug,
        title: o.title,
        summary: o.summary || '',
        categoryLabel: o.categoryLabel || o.category || 'Architecture',
        duration: o.readDuration || '5 menit',
      }));
    }
  } catch {
    // fallback
  }

  if (otherArticles.length === 0) {
    otherArticles = articleList
      .filter((a) => a.hasFullPage && a.id !== slug)
      .slice(0, 2)
      .map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        categoryLabel: a.categoryLabel,
        duration: a.duration,
      }));
  }

  return (
    <>
      <BodyStyler
        classes={['public-page', 'article-page']}
        attributes={{ 'data-article-detail': 'true' }}
      />
      <ReadingProgress />
      <a className="skip-link" href="#article-body">
        Lewati ke artikel
      </a>

      <main className="public-main" id="main" tabIndex={-1}>
        <header className="article-detail-hero">
          <div className="public-shell">
            <Reveal as="nav" className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Beranda</Link>
              <i>/</i>
              <Link href="/articles">Artikel</Link>
              <i>/</i>
              <span aria-current="page" data-article-field="category">
                {category}
              </span>
            </Reveal>
            <Reveal as="span" className="overline" data-article-field="category">
              {categoryLabel || category}
            </Reveal>
            <Reveal as="h1" data-article-field="title">
              {title}
            </Reveal>
            <Reveal as="p" className="article-deck" data-article-field="summary">
              {summary}
            </Reveal>
            <Reveal className="article-byline">
              <span className="author-avatar" aria-hidden="true">
                AN
              </span>
              <span>
                {author} ·{' '}
                <time dateTime={datetime} data-article-field="date">
                  {date}
                </time>{' '}
                · <span data-article-field="read">{read}</span>
              </span>
              <span className="sample-pill">Artikel teknis</span>
            </Reveal>
            <Reveal
              className="article-visual"
              role="img"
              aria-label={`Cover artikel berupa tipografi abstrak`}
            >
              <span className="article-visual-mark" data-article-field="mark">
                {mark}
              </span>
            </Reveal>
          </div>
        </header>

        <section className="public-section public-shell" aria-label="Konten artikel">
          <div className="article-layout">
            {sections.length > 0 && (
              <nav className="article-toc" data-article-toc aria-label="Daftar isi artikel">
                <strong>Di halaman ini</strong>
                {sections.map((sec) => (
                  <a key={sec.id} href={`#${sec.id}`}>
                    {sec.title}
                  </a>
                ))}
              </nav>
            )}

            <article className="article-body" id="article-body" data-article-body>
              {lead && <p className="lead">{lead}</p>}

              {sections.map((sec) => (
                <div key={sec.id}>
                  <h2 id={sec.id}>{sec.title}</h2>
                  {sec.paragraphs &&
                    sec.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  {sec.callout && <aside className="callout">{sec.callout}</aside>}
                  {sec.bullets && (
                    <ul>
                      {sec.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {sec.code && (
                    <pre>
                      <code>{sec.code}</code>
                    </pre>
                  )}
                  {sec.quote && <blockquote>{sec.quote}</blockquote>}
                </div>
              ))}

              {tags && tags.length > 0 && (
                <div className="article-tags">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </article>

            <ShareRail title={title} />
          </div>
        </section>

        <section className="public-section public-shell" aria-labelledby="more-title">
          <Reveal className="section-intro">
            <div>
              <span className="overline">Baca berikutnya</span>
              <h2 id="more-title">Lanjutkan catatan.</h2>
            </div>
            <Link className="link-arrow" href="/articles">
              Semua artikel
            </Link>
          </Reveal>
          <div className="value-grid">
            {otherArticles.map((other) => (
              <Reveal as="article" key={other.id} className="value-card panel">
                <span className="value-number">
                  {other.categoryLabel} · {other.duration}
                </span>
                <h3>
                  <Link href={`/articles/${other.id}`}>{other.title}</Link>
                </h3>
                <p>{other.summary}</p>
              </Reveal>
            ))}
            <Reveal as="article" className="value-card panel">
              <span className="value-number">TRANSPARANSI</span>
              <h3>Catatan Teknis</h3>
              <p>
                Artikel dirancang sebagai insight engineering seputar system design, observability,
                dan arsitektur modern.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
