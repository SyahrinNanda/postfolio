'use client';

import { useState } from 'react';
import { useAdmin, ArticleData } from '@/components/admin/AdminContext';
import AdminModalPortal from '@/components/admin/AdminModalPortal';

const CATEGORIES = [
  'Software Architecture',
  'Web Development',
  'Backend',
  'AI / Machine Learning',
  'DevOps',
  'Database',
];

const COVER_COLORS = [
  { label: 'Dark (Dark Slate)', value: 'dark' },
  { label: 'Violet (Ungu)', value: 'violet' },
  { label: 'Lime (Hijau)', value: 'lime' },
  { label: 'Coral (Merah / Oranye)', value: 'coral' },
  { label: 'Blue (Biru)', value: 'blue' },
];

export default function AdminArticlesPage() {
  const {
    articles,
    setDetailItem,
    setDeleteConfirm,
    addArticle,
    updateArticle,
    showToast,
  } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Software Architecture',
    categoryLabel: 'Software Architecture',
    coverColor: 'dark',
    coverMark: 'NOTE',
    summary: '',
    lead: '',
    content: '',
    tags: [] as string[],
    readDuration: '5 min baca',
    publishedDate: new Date().toISOString().split('T')[0],
    author: "As'syahrin Nanda",
    status: 'published' as 'published' | 'draft' | 'archived',
    hasFullPage: true,
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Software Architecture',
      categoryLabel: 'Software Architecture',
      coverColor: 'dark',
      coverMark: 'NOTE',
      summary: '',
      lead: '',
      content: '',
      tags: ['Architecture', 'System Design'],
      readDuration: '5 min baca',
      publishedDate: new Date().toISOString().split('T')[0],
      author: "As'syahrin Nanda",
      status: 'published',
      hasFullPage: true,
    });
    setTagInput('');
    setIsFormOpen(true);
  };

  const openEditModal = (item: ArticleData) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category || 'Software Architecture',
      categoryLabel: item.categoryLabel || item.category || 'Software Architecture',
      coverColor: item.coverColor || 'dark',
      coverMark: item.coverMark || 'NOTE',
      summary: item.summary || '',
      lead: item.lead || '',
      content: item.content || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      readDuration: item.readDuration || '5 min baca',
      publishedDate: item.publishedDate || '',
      author: item.author || "As'syahrin Nanda",
      status: item.status || 'published',
      hasFullPage: item.hasFullPage ?? true,
    });
    setTagInput('');
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const autoSlug = !editingId
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: autoSlug };
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const raw = tagInput.trim().replace(/,/g, '');
      if (raw && !formData.tags.includes(raw)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, raw],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tToRemove),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Judul artikel wajib diisi');
      return;
    }

    const cleanSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    setIsSubmitting(true);
    try {
      if (editingId) {
        const ok = await updateArticle(editingId, {
          ...formData,
          slug: cleanSlug,
        });
        if (ok) setIsFormOpen(false);
      } else {
        const ok = await addArticle({
          ...formData,
          slug: cleanSlug,
        });
        if (ok) setIsFormOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = articles.filter((a) => {
    const q = filterQuery.toLowerCase();
    const tagMatch = Array.isArray(a.tags) && a.tags.some((t) => t.toLowerCase().includes(q));
    const matchQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.category && a.category.toLowerCase().includes(q)) ||
      tagMatch;

    const matchStat = statusFilter === 'all' || a.status === statusFilter;
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    return matchQuery && matchStat && matchCat;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Artikel</h1>
          <p>Tulis, edit, dan publikasikan insight teknis ke database SQLite.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Tulis artikel
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-group">
          <div className="module-search">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Cari judul, slug, topik, atau tag…"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="toolbar-group">
          <div className="view-toggle" aria-label="Mode tampilan">
            <button
              className={viewMode === 'table' ? 'active' : ''}
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Tampilan tabel"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 6h14M5 12h14M5 18h14" />
              </svg>
            </button>
            <button
              className={viewMode === 'cards' ? 'active' : ''}
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Tampilan kartu"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" />
                <rect x="14" y="4" width="6" height="6" />
                <rect x="4" y="14" width="6" height="6" />
                <rect x="14" y="14" width="6" height="6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>Tidak ada artikel ditemukan</h3>
            <p>Coba sesuaikan kata kunci pencarian atau filter status dan kategori.</p>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="cards-grid">
          {filtered.map((item) => (
            <article key={item.id} className="entity-card">
              <div
                className="entity-cover"
                style={{
                  background:
                    item.coverColor === 'lime'
                      ? '#10b981'
                      : item.coverColor === 'violet'
                      ? '#8b5cf6'
                      : item.coverColor === 'coral'
                      ? '#f43f5e'
                      : item.coverColor === 'blue'
                      ? '#3b82f6'
                      : '#1e293b',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                }}
              >
                <span>{item.coverMark || 'ART'}</span>
                <span className={`badge badge-${item.status}`}>{item.status}</span>
              </div>
              <div className="entity-card-body">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    {item.categoryLabel || item.category}
                  </span>
                  {item.hasFullPage ? (
                    <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
                      Full Page
                    </span>
                  ) : (
                    <span className="badge" style={{ fontSize: '0.68rem', opacity: 0.7 }}>
                      Summary
                    </span>
                  )}
                </div>
                <h3>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {item.summary}
                </p>
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: '12px' }}>
                    {item.tags.slice(0, 3).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--line)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>{item.publishedDate || item.updated}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="row-action"
                      type="button"
                      title="Edit artikel"
                      onClick={() => openEditModal(item)}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      className="row-action danger"
                      type="button"
                      title="Hapus artikel"
                      onClick={() =>
                        setDeleteConfirm({
                          id: item.id,
                          module: 'articles',
                          name: item.title,
                        })
                      }
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Kategori</th>
                  <th>Tag</th>
                  <th>Status</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                  <th>
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="row-main">
                        <span
                          className="row-thumbnail"
                          style={{
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {item.coverMark || item.title.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="row-title">{item.title}</span>
                          <span className="row-subtitle">/{item.slug}</span>
                        </span>
                      </div>
                    </td>
                    <td>{item.categoryLabel || item.category}</td>
                    <td>
                      <div className="tag-list">
                        {Array.isArray(item.tags) &&
                          item.tags.map((t) => (
                            <span key={t} className="tag">
                              {t}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                    <td>
                      {item.hasFullPage ? (
                        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
                          Full
                        </span>
                      ) : (
                        <span className="badge" style={{ opacity: 0.7 }}>
                          Summary
                        </span>
                      )}
                    </td>
                    <td>{item.status === 'published' ? item.publishedDate : item.updated}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action"
                          type="button"
                          title="Detail ringkasan"
                          onClick={() =>
                            setDetailItem({
                              title: item.title,
                              subtitle: `${item.category} · ${item.readDuration || '5 min baca'}`,
                              body: `${item.summary}\n\n${item.lead ? `[LEAD]\n${item.lead}\n\n` : ''}${item.content || ''}`,
                              type: 'Artikel',
                            })
                          }
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="row-action"
                          type="button"
                          title="Edit artikel"
                          onClick={() => openEditModal(item)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="row-action danger"
                          type="button"
                          title="Hapus artikel"
                          onClick={() =>
                            setDeleteConfirm({
                              id: item.id,
                              module: 'articles',
                              name: item.title,
                            })
                          }
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Menampilkan {filtered.length} artikel</span>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT ARTIKEL */}
      {isFormOpen && (
        <AdminModalPortal>
          <div
            className="modal-overlay"
            onClick={() => setIsFormOpen(false)}
          >
            <form
              className="modal"
              onSubmit={handleFormSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                  </p>
                  <h2>
                    {editingId ? `Ubah: ${formData.title}` : 'Buat Artikel Teknis Baru'}
                  </h2>
                </div>
                <button
                  className="icon-button modal-close"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  aria-label="Tutup dialog"
                >
                  ×
                </button>
              </div>

              <div
                className="modal-body"
                style={{
                  padding: '24px',
                  overflowY: 'auto',
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* 1. INFORMASI UTAMA */}
                <div>
                  <div className="form-section-title">1. INFORMASI UTAMA &amp; STATUS</div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group full">
                      <label className="required" htmlFor="art-title">
                        Judul Artikel
                      </label>
                      <input
                        id="art-title"
                        type="text"
                        required
                        placeholder="Contoh: Merancang sistem yang tetap tenang saat traffic naik 10×"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="required" htmlFor="art-slug">
                        Slug URL (/articles/[slug])
                      </label>
                      <input
                        id="art-slug"
                        type="text"
                        required
                        placeholder="merancang-sistem-tenang"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-category">Kategori</label>
                      <select
                        id="art-category"
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            category: val,
                            categoryLabel: val,
                          });
                        }}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-status">Status Publikasi</label>
                      <select
                        id="art-status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as 'published' | 'draft' | 'archived',
                          })
                        }
                      >
                        <option value="published">Published (Tampil di Frontend)</option>
                        <option value="draft">Draft (Hanya di Admin)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-duration">Estimasi Durasi Baca</label>
                      <input
                        id="art-duration"
                        type="text"
                        placeholder="Contoh: 9 menit baca"
                        value={formData.readDuration}
                        onChange={(e) => setFormData({ ...formData, readDuration: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-date">Tanggal Publikasi</label>
                      <input
                        id="art-date"
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-author">Penulis (Author)</label>
                      <input
                        id="art-author"
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. VISUAL & KARTU */}
                <div>
                  <div className="form-section-title">2. TAMPILAN KARTU &amp; AKSES HALAMAN</div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label htmlFor="art-cover-mark">Cover Mark (Singkatan / Tipografi)</label>
                      <input
                        id="art-cover-mark"
                        type="text"
                        placeholder="Contoh: 10×, DS, RAG, SQL"
                        value={formData.coverMark}
                        onChange={(e) => setFormData({ ...formData, coverMark: e.target.value })}
                      />
                      <small>Tampil sebagai huruf/angka besar pada kartu cover artikel.</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="art-cover-color">Tema Warna Kartu</label>
                      <select
                        id="art-cover-color"
                        value={formData.coverColor}
                        onChange={(e) => setFormData({ ...formData, coverColor: e.target.value })}
                      >
                        {COVER_COLORS.map((col) => (
                          <option key={col.value} value={col.value}>
                            {col.label}
                          </option>
                        ))}
                      </select>
                      <small>Menentukan warna aksen latar cover artikel.</small>
                    </div>

                    <div className="form-group full">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '14px 16px',
                          background: 'var(--surface-2)',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                        }}
                      >
                        <input
                          type="checkbox"
                          id="art-fullpage"
                          checked={formData.hasFullPage}
                          onChange={(e) => setFormData({ ...formData, hasFullPage: e.target.checked })}
                          style={{
                            width: '18px',
                            height: '18px',
                            marginTop: '2px',
                            accentColor: 'var(--primary)',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <label
                            htmlFor="art-fullpage"
                            style={{
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'block',
                              color: 'var(--ink)',
                              margin: 0,
                            }}
                          >
                            Tersedia Halaman Baca Penuh (/articles/[slug])
                          </label>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>
                            Jika dicentang, judul artikel di halaman publik dapat diklik untuk membaca artikel secara
                            mendalam. Jika tidak dicentang, hanya muncul sebagai kartu summary.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. KONTEN & PEMBAHASAN */}
                <div>
                  <div className="form-section-title">3. KONTEN &amp; PEMBAHASAN</div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group full">
                      <label className="required" htmlFor="art-summary">
                        Ringkasan Singkat (Summary)
                      </label>
                      <textarea
                        id="art-summary"
                        required
                        rows={2}
                        placeholder="Tuliskan 1-2 kalimat ringkasan artikel yang tampil di daftar artikel..."
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      />
                    </div>

                    <div className="form-group full">
                      <label htmlFor="art-lead">Paragraf Pembuka / Lead</label>
                      <textarea
                        id="art-lead"
                        rows={3}
                        placeholder="Kalimat pembuka utama artikel (muncul dengan font lebih besar di halaman detail)..."
                        value={formData.lead}
                        onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                      />
                    </div>

                    <div className="form-group full">
                      <label htmlFor="art-content">Isi Artikel Lengkap (Teks / Markdown)</label>
                      <textarea
                        id="art-content"
                        className="tall mono"
                        rows={8}
                        placeholder="Tulis isi pembahasan artikel secara detail di sini..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. TAG & KATA KUNCI */}
                <div>
                  <div className="form-section-title">4. TAG &amp; KATA KUNCI</div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group full">
                      <label htmlFor="art-tags">Tags (Tekan Enter atau Koma untuk menambahkan)</label>
                      {formData.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          {formData.tags.map((t) => (
                            <span
                              key={t}
                              className="tag"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                fontSize: '11px',
                              }}
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'inherit',
                                  padding: 0,
                                  fontSize: '13px',
                                  lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <input
                        id="art-tags"
                        type="text"
                        placeholder="Ketik tag lalu tekan Enter (contoh: Architecture, Backend, Database)..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : editingId
                    ? 'Simpan Perubahan'
                    : 'Publikasikan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </AdminModalPortal>
      )}
    </>
  );
}
