'use client';

import { useState } from 'react';
import { useAdmin, TechnologyData } from '@/components/admin/AdminContext';

const TECH_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'AI',
  'Mobile',
  'Automation',
  'Tools',
];

const PRESET_COLORS = [
  '#3178c6', // TypeScript Blue
  '#149eca', // React Cyan
  '#111111', // Next.js Dark
  '#43853d', // Node.js Green
  '#ff2d20', // Laravel Red
  '#336791', // PostgreSQL Blue
  '#2496ed', // Docker Blue
  '#3776ab', // Python Blue/Yellow
  '#f05032', // Git Orange
  '#764abc', // Redux Purple
  '#06b6d4', // Tailwind Cyan
  '#f59e0b', // Amber / JS
];

export default function AdminTechnologiesPage() {
  const {
    technologies,
    projects,
    setDeleteConfirm,
    addTechnology,
    updateTechnology,
    showToast,
  } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: 'TS',
    color: '#3178c6',
    website: '',
    status: 'active' as 'active' | 'inactive',
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Frontend',
      icon: 'TS',
      color: '#3178c6',
      website: '',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: TechnologyData) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category || 'Frontend',
      icon: item.icon || item.name.slice(0, 2).toUpperCase(),
      color: item.color || '#3178c6',
      website: item.website || '',
      status: item.status || 'active',
    });
    setIsFormOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      // If creating new and icon is either empty or matches previous auto monogram
      const autoIcon = !editingId
        ? val
            .trim()
            .slice(0, 2)
            .toUpperCase() || 'TC'
        : prev.icon;
      return { ...prev, name: val, icon: autoIcon };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama teknologi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const ok = await updateTechnology(editingId, {
          ...formData,
          name: formData.name.trim(),
          website: formData.website.trim() || undefined,
        });
        if (ok) setIsFormOpen(false);
      } else {
        const ok = await addTechnology({
          ...formData,
          name: formData.name.trim(),
          website: formData.website.trim() || undefined,
        });
        if (ok) setIsFormOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = technologies.filter((t) => {
    const q = filterQuery.toLowerCase();
    const matchQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.website && t.website.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchStat = statusFilter === 'all' || t.status === statusFilter;
    return matchQuery && matchCat && matchStat;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Teknologi</h1>
          <p>Atur technology stack yang dapat dikaitkan ke project dan tampil di portofolio.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Tambah teknologi
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
              placeholder="Cari nama atau kategori teknologi…"
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
            {TECH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            <h3>Tidak ada teknologi ditemukan</h3>
            <p>Coba sesuaikan kata kunci pencarian atau filter yang dipilih.</p>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="cards-grid">
          {filtered.map((item) => {
            const usageCount = projects.filter((p) =>
              p.technologies.some((t) => t.toLowerCase() === item.name.toLowerCase())
            ).length;
            return (
              <article key={item.id} className="entity-card">
                <div
                  className="entity-cover"
                  style={{
                    background: item.color ? `${item.color}22` : 'var(--surface-2)',
                    borderBottom: `3px solid ${item.color || 'var(--primary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                  }}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: item.color || 'var(--primary)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                    }}
                  >
                    {item.icon || item.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                </div>
                <div className="entity-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        {item.category}
                      </span>
                      <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem' }}>{item.name}</h3>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: item.color,
                        border: '2px solid var(--surface)',
                        boxShadow: '0 0 0 1px var(--line)',
                      }}
                      title={item.color}
                    />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        {item.website.replace(/^https?:\/\//, '')} ↗
                      </a>
                    ) : (
                      'Website resmi belum disetel'
                    )}
                  </p>

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
                    <span>{usageCount} project terkait</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="row-action"
                        type="button"
                        title="Edit teknologi"
                        onClick={() => openEditModal(item)}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        className="row-action danger"
                        type="button"
                        title="Hapus teknologi"
                        onClick={() =>
                          setDeleteConfirm({
                            id: item.id,
                            module: 'technologies',
                            name: item.name,
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
            );
          })}
        </div>
      ) : (
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teknologi</th>
                  <th>Kategori</th>
                  <th>Warna Aksen</th>
                  <th>Digunakan</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const usageCount = projects.filter((p) =>
                    p.technologies.some((t) => t.toLowerCase() === item.name.toLowerCase())
                  ).length;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="row-main">
                          <span
                            className="row-thumbnail"
                            style={{
                              color: item.color || '#3b82f6',
                              background: item.color ? `${item.color}18` : 'rgba(59, 130, 246, 0.1)',
                              fontWeight: 700,
                            }}
                          >
                            {item.icon || item.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span>
                            <span className="row-title">{item.name}</span>
                            <span className="row-subtitle">
                              {item.website ? (
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                  {item.website}
                                </a>
                              ) : (
                                '-'
                              )}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              background: item.color,
                              display: 'inline-block',
                              border: '1px solid var(--line)',
                            }}
                          />
                          <code className="mono" style={{ fontSize: '0.75rem' }}>
                            {item.color}
                          </code>
                        </div>
                      </td>
                      <td>{usageCount} project</td>
                      <td>
                        <span className={`badge badge-${item.status}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="row-action"
                            type="button"
                            title="Edit teknologi"
                            onClick={() => openEditModal(item)}
                          >
                            <svg aria-hidden="true" viewBox="0 0 24 24">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>
                          <button
                            className="row-action danger"
                            type="button"
                            title="Hapus teknologi"
                            onClick={() =>
                              setDeleteConfirm({
                                id: item.id,
                                module: 'technologies',
                                name: item.name,
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
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Menampilkan {filtered.length} teknologi</span>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT TEKNOLOGI */}
      {isFormOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingId ? 'Edit Teknologi' : 'Tambah Teknologi Baru'}
                </p>
                <h2>
                  {editingId ? `Ubah: ${formData.name}` : 'Buat Stack Teknologi Baru'}
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

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, height: '100%', overflow: 'hidden' }}>
              <div
                className="modal-body"
                style={{
                  padding: '24px',
                  overflowY: 'auto',
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* 1. INFORMASI UTAMA */}
                <div>
                  <div className="form-section-title">1. INFORMASI TEKNOLOGI</div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group full">
                      <label className="required" htmlFor="tech-name">
                        Nama Teknologi
                      </label>
                      <input
                        id="tech-name"
                        type="text"
                        required
                        placeholder="Contoh: React, TypeScript, PostgreSQL"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tech-category">Kategori Stack</label>
                      <select
                        id="tech-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {TECH_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tech-status">Status</label>
                      <select
                        id="tech-status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as 'active' | 'inactive',
                          })
                        }
                      >
                        <option value="active">Active (Dapat dipilih di Project)</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tech-icon">Icon / Singkatan (Monogram)</label>
                      <input
                        id="tech-icon"
                        type="text"
                        maxLength={8}
                        placeholder="Contoh: TS, Re, Py, Pg"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      />
                      <small>Maksimal 8 karakter atau simbol/emoji.</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tech-color">Warna Brand (Hex)</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={formData.color.startsWith('#') ? formData.color : '#3b82f6'}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          style={{
                            width: '40px',
                            height: '40px',
                            padding: '2px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: '1px solid var(--line-strong)',
                            flexShrink: 0,
                          }}
                        />
                        <input
                          id="tech-color"
                          type="text"
                          placeholder="#3178c6"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {PRESET_COLORS.map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: col })}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: col,
                              border: formData.color.toLowerCase() === col.toLowerCase() ? '2px solid #ffffff' : 'none',
                              boxShadow: '0 0 0 1px var(--line)',
                              cursor: 'pointer',
                            }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="form-group full">
                      <label htmlFor="tech-website">URL Website Resmi (Opsional)</label>
                      <input
                        id="tech-website"
                        type="url"
                        placeholder="https://react.dev"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    background: 'var(--surface-2)',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: formData.color || 'var(--primary)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {formData.icon || (formData.name.slice(0, 2).toUpperCase() || 'TC')}
                  </span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: 'var(--ink)' }}>
                      {formData.name || 'Nama Teknologi'}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Kategori: {formData.category} · Warna:{' '}
                      <span style={{ color: formData.color, fontWeight: 700 }}>{formData.color}</span>
                    </span>
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
                    : 'Tambah Teknologi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
