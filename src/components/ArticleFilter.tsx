'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { articleList, type ArticleListItem } from '@/lib/data/articles';

const filterCategories = [
  { id: 'all', label: 'Semua' },
  { id: 'web', label: 'Web Development' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'devops', label: 'DevOps' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'programming', label: 'Programming' },
];

interface ArticleFilterProps {
  initialArticles?: ArticleListItem[];
}

export default function ArticleFilter({ initialArticles }: ArticleFilterProps) {
  const articlesToUse = initialArticles && initialArticles.length > 0 ? initialArticles : articleList;
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articlesToUse.filter((a) => {
      const catLower = (a.category || '').toLowerCase();
      const categoryMatch =
        activeFilter === 'all' ||
        catLower.includes(activeFilter.toLowerCase()) ||
        (a.categoryLabel && a.categoryLabel.toLowerCase().includes(activeFilter.toLowerCase()));
      const haystack = [a.title, a.summary, a.category, a.categoryLabel, a.searchKeywords].join(' ').toLowerCase();
      const searchMatch = !q || haystack.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [articlesToUse, search, activeFilter]);

  return (
    <>
      <section className="explorer-bar" data-article-explorer aria-label="Pencarian dan filter artikel">
        <div className="public-shell explorer-inner">
          <label className="search-field">
            <span className="skip-link">Cari artikel</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-4-4"></path>
            </svg>
            <input
              type="search"
              data-search
              placeholder="Cari judul, topik, atau tag…"
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

      <section className="public-section public-shell" aria-labelledby="article-list-title">
        <Reveal className="section-intro">
          <div>
            <span className="overline">Syahrin Notes · Edisi 2026</span>
            <h2 id="article-list-title">Artikel terbaru.</h2>
          </div>
          <p className="result-summary" data-result-count aria-live="polite">
            {visible.length} artikel ditemukan
          </p>
        </Reveal>

        <div className="articles-grid-public">
          {visible.map((a) => (
            <Reveal
              as="article"
              key={a.id}
              className="article-card-public"
              data-article-card
              data-category={a.category}
              data-search={a.searchKeywords}
            >
              <div className={`article-cover ${a.coverColor}`}>
                <span className="article-cover-mark">{a.coverMark}</span>
              </div>
              <div className="article-card-copy">
                <span className="article-meta mono">
                  {a.categoryLabel} · {a.hasFullPage ? 'PUBLISHED' : 'PUBLISHED SUMMARY'}
                </span>
                {a.hasFullPage ? (
                  <h2>
                    <Link href={`/articles/${a.id}`}>{a.title}</Link>
                  </h2>
                ) : (
                  <h3>{a.title}</h3>
                )}
                <p>{a.summary}</p>
                <div className="article-card-footer">
                  <time dateTime={a.datetime}>{a.date}</time>
                  <span>{a.duration}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="empty-state" data-empty-state>
            <strong>Tidak menemukan artikel</strong>
            Ubah kata kunci atau kembali ke kategori &ldquo;Semua&rdquo;.
          </div>
        )}

        <Reveal as="p" className="note">
          <strong>Status content:</strong> tiga artikel pertama memiliki halaman baca lengkap. Empat kartu lain sengaja ditandai &ldquo;Published summary&rdquo; sebagai sample listing, bukan diarahkan ke artikel yang tidak sesuai.
        </Reveal>
      </section>
    </>
  );
}
