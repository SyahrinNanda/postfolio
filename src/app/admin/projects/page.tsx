'use client';

import { useState } from 'react';
import { useAdmin, ProjectData } from '@/components/admin/AdminContext';
import AdminModalPortal from '@/components/admin/AdminModalPortal';

export default function AdminProjectsPage() {
  const {
    projects,
    technologies,
    setDetailItem,
    setDeleteConfirm,
    addProject,
    updateProject,
  } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customTechInput, setCustomTechInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Fullstack',
    role: 'Software Engineer',
    duration: '3 bulan',
    year: '2026',
    status: 'published' as 'published' | 'draft' | 'archived',
    featured: false,
    shortDescription: '',
    fullDescription: '',
    problem: '',
    solution: '',
    technologies: [] as string[],
    githubUrl: '',
    liveDemoUrl: '',
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Fullstack',
      role: 'Software Engineer',
      duration: '3 bulan',
      year: '2026',
      status: 'published',
      featured: false,
      shortDescription: '',
      fullDescription: '',
      problem: '',
      solution: '',
      technologies: ['React', 'TypeScript'],
      githubUrl: '',
      liveDemoUrl: '',
    });
    setCustomTechInput('');
    setIsFormOpen(true);
  };

  const openEditModal = (proj: ProjectData) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      category: proj.category || 'Fullstack',
      role: proj.role || 'Software Engineer',
      duration: proj.duration || '',
      year: proj.year || '2026',
      status: proj.status || 'published',
      featured: Boolean(proj.featured),
      shortDescription: proj.shortDescription || '',
      fullDescription: proj.fullDescription || '',
      problem: proj.problem || '',
      solution: proj.solution || '',
      technologies: proj.technologies || [],
      githubUrl: proj.githubUrl || '',
      liveDemoUrl: proj.liveDemoUrl || '',
    });
    setCustomTechInput('');
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      // Auto generate slug if creating new and slug hasn't been manually set
      const autoSlug = !editingId
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: autoSlug };
    });
  };

  const toggleTechnology = (techName: string) => {
    setFormData((prev) => {
      const exists = prev.technologies.includes(techName);
      if (exists) {
        return {
          ...prev,
          technologies: prev.technologies.filter((t) => t !== techName),
        };
      } else {
        return {
          ...prev,
          technologies: [...prev.technologies, techName],
        };
      }
    });
  };

  const handleAddCustomTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTechInput.trim()) {
      e.preventDefault();
      const tech = customTechInput.trim();
      if (!formData.technologies.includes(tech)) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, tech],
        }));
      }
      setCustomTechInput('');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const payload = {
      ...formData,
      slug: cleanSlug,
    };

    if (editingId) {
      const success = await updateProject(editingId, payload);
      if (success) setIsFormOpen(false);
    } else {
      const success = await addProject(payload);
      if (success) setIsFormOpen(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = filterQuery.toLowerCase();
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStat = statusFilter === 'all' || p.status === statusFilter;
    return matchQuery && matchCat && matchStat;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Project</h1>
          <p>Tampilkan proses berpikir, arsitektur, dan dampak engineering.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Tambah project
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
            <label className="sr-only" htmlFor="projects-search">
              Cari project atau teknologi…
            </label>
            <input
              id="projects-search"
              type="search"
              placeholder="Cari project atau teknologi…"
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
            <option value="Fullstack">Fullstack</option>
            <option value="Backend">Backend</option>
            <option value="Automation">Automation</option>
            <option value="Mobile">Mobile</option>
            <option value="Web">Web</option>
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

      {filteredProjects.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>Tidak ada hasil</h3>
            <p>Coba ubah kata kunci atau filter yang dipilih.</p>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="cards-grid">
          {filteredProjects.map((item) => (
            <article key={item.id} className="entity-card">
              <div className="entity-cover">
                <span>{item.title.slice(0, 2).toUpperCase()}</span>
                <span className={`badge badge-${item.status}`}>{item.status}</span>
              </div>
              <div className="entity-card-body">
                <h3>
                  {item.title} {item.featured && '★'}
                </h3>
                <p>{item.shortDescription}</p>
                <div className="tag-list">
                  {item.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="tag more">+{item.technologies.length - 3}</span>
                  )}
                </div>
                <footer className="entity-card-footer">
                  <small>
                    {item.category} · {item.updated}
                  </small>
                  <div className="row-actions">
                    <button
                      className="row-action"
                      type="button"
                      title="Edit project"
                      onClick={() => openEditModal(item)}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button
                      className="row-action"
                      type="button"
                      title="Lihat detail"
                      onClick={() =>
                        setDetailItem({
                          title: item.title,
                          subtitle: `${item.category} · ${item.role}`,
                          body: `${item.shortDescription}\n\n${item.fullDescription}`,
                          type: 'Project',
                        })
                      }
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      className="row-action danger"
                      type="button"
                      title="Hapus"
                      onClick={() =>
                        setDeleteConfirm({
                          id: item.id,
                          module: 'projects',
                          name: item.title,
                        })
                      }
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </footer>
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
                  <th>Project</th>
                  <th>Kategori</th>
                  <th>Teknologi</th>
                  <th>Status</th>
                  <th>Diperbarui</th>
                  <th>
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="row-main">
                        <span className="row-thumbnail">{item.title.slice(0, 2).toUpperCase()}</span>
                        <span>
                          <span className="row-title">
                            {item.title} {item.featured && <span title="Featured" style={{ color: '#e86f4a' }}>★</span>}
                          </span>
                          <span className="row-subtitle">/{item.slug}</span>
                        </span>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <div className="tag-list">
                        {item.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="tag more">+{item.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                    <td>{item.updated}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action"
                          type="button"
                          title="Edit project"
                          onClick={() => openEditModal(item)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          className="row-action"
                          type="button"
                          title="Detail ringkasan"
                          onClick={() =>
                            setDetailItem({
                              title: item.title,
                              subtitle: `${item.category} · ${item.role}`,
                              body: `${item.shortDescription}\n\n${item.fullDescription}`,
                              type: 'Project',
                            })
                          }
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          className="row-action danger"
                          type="button"
                          title="Hapus"
                          onClick={() =>
                            setDeleteConfirm({
                              id: item.id,
                              module: 'projects',
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
            <span>Menampilkan {filteredProjects.length} data</span>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT PROJECT */}
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
                  <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {editingId ? 'Edit Project' : 'Tambah Project Baru'}
                  </p>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                    {editingId ? `Ubah: ${formData.title}` : 'Buat Project Baru'}
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
                  gap: '20px',
                }}
              >
                {/* 1. INFORMASI UTAMA */}
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="required">Judul Project</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Contoh: Rachita Apps"
                    />
                  </div>

                  <div className="form-group">
                    <label className="required">Slug URL (/projects/[slug])</label>
                    <input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="rachita-apps"
                    />
                  </div>

                  <div className="form-group">
                    <label>Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Fullstack">Fullstack</option>
                      <option value="Backend">Backend</option>
                      <option value="Automation">Automation</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Web">Web</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Lead Software Engineer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Durasi pengerjaan</label>
                    <input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="10 bulan"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tahun</label>
                    <input
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2026"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status Publikasi</label>
                    <select
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

                  <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="form-featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="form-featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                      Tampilkan di Beranda (Selected Work / Featured ★)
                    </label>
                  </div>
                </div>

                {/* 2. DESKRIPSI */}
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="required">Deskripsi Singkat (Ringkasan Kartu)</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Sistem aplikasi web untuk management PT Rachita..."
                    />
                  </div>

                  <div className="form-group full">
                    <label>Deskripsi Lengkap / Overview</label>
                    <textarea
                      rows={4}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Rachita Apps adalah platform ERP/HRM internal PT Rachita yang..."
                    />
                  </div>
                </div>

                {/* 3. CASE STUDY FIELDS */}
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Problem Statement (Masalah yang dihadapi)</label>
                    <textarea
                      rows={3}
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      placeholder="Setiap department menggunakan spreadsheet terpisah tanpa sinkronisasi..."
                    />
                  </div>

                  <div className="form-group full">
                    <label>Solution &amp; Architecture (Solusi Teknis)</label>
                    <textarea
                      rows={3}
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder="Merancang arsitektur monolit modular dengan PostgreSQL dan Node.js..."
                    />
                  </div>
                </div>

                {/* 4. TEKNOLOGI STACK */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Stack Teknologi Digunakan
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '12px',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      padding: '8px',
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    {technologies.map((tech) => {
                      const selected = formData.technologies.includes(tech.name);
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => toggleTechnology(tech.name)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            border: `1px solid ${selected ? 'var(--primary)' : 'var(--line)'}`,
                            background: selected ? 'var(--primary)' : 'var(--surface)',
                            color: selected ? '#ffffff' : 'var(--ink)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {selected ? '✓ ' : '+ '}
                          {tech.name}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      onKeyDown={handleAddCustomTech}
                      placeholder="Ketik nama teknologi lain lalu tekan Enter..."
                      style={{ flex: 1, fontSize: '0.85rem' }}
                    />
                  </div>
                  {formData.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {formData.technologies.map((t) => (
                        <span
                          key={t}
                          className="tag"
                          style={{
                            background: 'var(--primary-soft)',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => toggleTechnology(t)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'inherit',
                              cursor: 'pointer',
                              padding: 0,
                              fontWeight: 800,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. TAUTAN */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>GitHub Repository URL</label>
                    <input
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input
                      value={formData.liveDemoUrl}
                      onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer"
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  background: 'var(--surface-2)',
                }}
              >
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setIsFormOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="button button-primary">
                  {editingId ? 'Simpan Perubahan' : 'Tambah Project'}
                </button>
              </div>
            </form>
          </div>
        </AdminModalPortal>
      )}
    </>
  );
}
