import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ArticleFilter from '@/components/ArticleFilter';
import BodyStyler from '@/components/BodyStyler';
import type { Metadata } from 'next';
import { db } from '@/db';
import { articles as dbArticlesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { ArticleListItem } from '@/lib/data/articles';

export const metadata: Metadata = {
  title: "Artikel Teknis — As'syahrin Nanda",
  description: "Artikel teknis As'syahrin Nanda tentang web development, backend, database, AI, DevOps, dan software architecture.",
  openGraph: {
    title: "Syahrin Notes — Artikel Teknis",
    description: "Catatan praktis tentang membangun software yang dapat dipahami dan dioperasikan.",
  },
};

export default async function Articles() {
  let mappedArticles: ArticleListItem[] | undefined = undefined;

  try {
    const dbArticles = await db.query.articles.findMany({
      where: eq(dbArticlesTable.status, 'published'),
      orderBy: [desc(dbArticlesTable.publishedDate), desc(dbArticlesTable.createdAt)],
    });

    if (dbArticles && dbArticles.length > 0) {
      const validColors: ('dark' | 'violet' | 'lime' | 'coral' | 'blue')[] = [
        'dark',
        'violet',
        'lime',
        'coral',
        'blue',
      ];

      mappedArticles = dbArticles.map((a) => {
        let formattedDate = a.publishedDate || '';
        if (a.publishedDate && a.publishedDate.includes('-')) {
          try {
            const d = new Date(a.publishedDate);
            formattedDate = d.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          } catch {
            // fallback
          }
        }

        const coverColor = validColors.includes(a.coverColor as any)
          ? (a.coverColor as 'dark' | 'violet' | 'lime' | 'coral' | 'blue')
          : 'dark';

        return {
          id: a.slug,
          title: a.title,
          summary: a.summary || '',
          category: a.category || 'Architecture',
          categoryLabel: a.categoryLabel || a.category || 'Software Architecture',
          searchKeywords: a.searchKeywords || [a.title, a.summary, a.category].join(' '),
          date: formattedDate || a.publishedDate || '2026',
          datetime: a.publishedDate || '2026-01-01',
          duration: a.readDuration || '5 menit baca',
          coverColor,
          coverMark: a.coverMark || 'ART',
          hasFullPage: Boolean(a.hasFullPage),
        };
      });
    }
  } catch (err) {
    console.error('Error fetching articles from SQLite:', err);
  }

  return (
    <>
      <BodyStyler classes={['public-page', 'article-page']} />
      <main id="main" className="public-main" tabIndex={-1}>
        <section className="page-hero">
          <div className="public-shell page-hero-grid">
            <Reveal>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Beranda</Link>
                <i>/</i>
                <span aria-current="page">Artikel</span>
              </nav>
              <h1>
                Catatan untuk berpikir lebih <em>jernih.</em>
              </h1>
              <p className="page-hero-lead">
                Tulisan tentang trade-off, failure mode, pola yang berhasil, dan pelajaran dari membangun produk digital.
              </p>
            </Reveal>
            <Reveal className="page-hero-side">
              <span className="sample-pill">Artikel adalah konten demonstrasi</span>
              <p>
                Hanya artikel berstatus published yang ditampilkan. Draft dan unpublish dikelola dari CMS dan tidak muncul di halaman publik.
              </p>
            </Reveal>
          </div>
        </section>

        <ArticleFilter initialArticles={mappedArticles} />
      </main>
    </>
  );
}
