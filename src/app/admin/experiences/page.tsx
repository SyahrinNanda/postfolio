'use client';

import { useState } from 'react';
import { useAdmin, ExperienceData } from '@/components/admin/AdminContext';
import AdminModalPortal from '@/components/admin/AdminModalPortal';

export default function AdminExperiencesPage() {
  const {
    experiences,
    technologies,
    setDetailItem,
    setDeleteConfirm,
    addExperience,
    updateExperience,
  } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customTechInput, setCustomTechInput] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    overline: '',
    startDate: '',
    endDate: '',
    period: '',
    current: false,
    status: 'active' as 'active' | 'inactive',
    description: '',
    responsibilities: '',
    achievements: '',
    technologies: [] as string[],
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      company: '',
      position: '',
      overline: '',
      startDate: new Date().toISOString().slice(0, 7),
      endDate: '',
      period: '',
      current: true,
      status: 'active',
      description: '',
      responsibilities: '',
      achievements: '',
      technologies: ['TypeScript', 'React', 'Node.js'],
    });
    setCustomTechInput('');
    setIsFormOpen(true);
  };

  const openEditModal = (exp: ExperienceData) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      overline: exp.overline || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      period: exp.period || '',
      current: Boolean(exp.current),
      status: exp.status || 'active',
      description: exp.description || '',
      responsibilities: exp.responsibilities || '',
      achievements: exp.achievements || '',
      technologies: exp.technologies || [],
    });
    setCustomTechInput('');
    setIsFormOpen(true);
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

    const derivedPeriod =
      formData.period.trim() ||
      (formData.startDate
        ? `${formData.startDate} — ${formData.current ? 'Sekarang' : formData.endDate || 'Selesai'}`
        : '');

    const payload = {
      ...formData,
      period: derivedPeriod,
    };

    if (editingId) {
      const success = await updateExperience(editingId, payload);
      if (success) setIsFormOpen(false);
    } else {
      const success = await addExperience(payload);
      if (success) setIsFormOpen(false);
    }
  };

  const filtered = experiences.filter((e) => {
    const q = filterQuery.toLowerCase();
    const matchQuery =
      !q ||
      e.company.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.technologies.some((t) => t.toLowerCase().includes(q));
    const matchTimeline =
      timelineFilter === 'all' || (timelineFilter === 'current' ? e.current : !e.current);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchQuery && matchTimeline && matchStatus;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Pengalaman</h1>
          <p>Susun perjalanan karier, tanggung jawab, dan pencapaian.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Tambah pengalaman
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
              placeholder="Cari posisi, perusahaan, atau teknologi…"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value)}
          >
            <option value="all">Semua Timeline</option>
            <option value="current">Current / Posisi Aktif</option>
            <option value="past">Past / Sebelumnya</option>
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
          <div className="view-toggle" role="group" aria-label="Pilihan tampilan">
            <button
              type="button"
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              type="button"
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
              title="Tampilan Kartu"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                <rect x="3" y="3" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  {item.overline && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                      {item.overline}
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.position}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', margin: '2px 0 0' }}>
                    {item.company}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.current && (
                    <span className="badge badge-current" style={{ fontSize: '0.7rem' }}>
                      Current
                    </span>
                  )}
                  <span className={`badge badge-${item.status}`} style={{ fontSize: '0.7rem' }}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                🗓️ {item.period || `${item.startDate} — ${item.current ? 'Sekarang' : item.endDate || 'Selesai'}`}
              </div>

              {item.description && (
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-light)', lineHeight: 1.5, margin: 0 }}>
                  {item.description}
                </p>
              )}

              {item.technologies && item.technologies.length > 0 && (
                <div className="tag-list" style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  {item.technologies.map((t) => (
                    <span key={t} className="tag" style={{ fontSize: '0.75rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '12px',
                  marginTop: '8px',
                }}
              >
                <button
                  className="button button-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  type="button"
                  onClick={() => openEditModal(item)}
                >
                  ✎ Edit
                </button>
                <button
                  className="button button-ghost danger"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)' }}
                  type="button"
                  onClick={() =>
                    setDeleteConfirm({
                      id: item.id,
                      module: 'experiences',
                      name: `${item.position} di ${item.company}`,
                    })
                  }
                >
                  ✕ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Posisi &amp; Perusahaan</th>
                  <th>Periode / Sub-label</th>
                  <th>Deskripsi &amp; Pencapaian</th>
                  <th>Teknologi</th>
                  <th>Status</th>
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
                        <span className="row-thumbnail">{item.company.slice(0, 2).toUpperCase()}</span>
                        <span>
                          <span className="row-title">{item.position}</span>
                          <span className="row-subtitle">{item.company}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 500 }}>
                          {item.period || `${item.startDate} — ${item.current ? 'Sekarang' : item.endDate || 'Selesai'}`}
                        </span>
                        {item.overline && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                            {item.overline}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--ink-light)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description || item.responsibilities || '-'}
                      </p>
                    </td>
                    <td>
                      <div className="tag-list">
                        {item.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="tag">+{item.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.current ? 'current' : item.status}`}>
                        {item.current ? 'Current' : item.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action"
                          type="button"
                          title="Edit Pengalaman"
                          onClick={() => openEditModal(item)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="row-action"
                          type="button"
                          title="Detail Pengalaman"
                          onClick={() =>
                            setDetailItem({
                              title: item.position,
                              subtitle: `${item.company} (${item.period || item.startDate})`,
                              body: `${item.description}\n\nTanggung Jawab:\n${item.responsibilities || '-'}\n\nPencapaian:\n${item.achievements || '-'}\n\nTeknologi: ${item.technologies.join(', ') || '-'}`,
                              type: 'Pengalaman',
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
                              module: 'experiences',
                              name: `${item.position} di ${item.company}`,
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
            <span>Menampilkan {filtered.length} data pengalaman</span>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT PENGALAMAN */}
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
                    {editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
                  </p>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                    {editingId ? `Ubah: ${formData.position}` : 'Perjalanan Karier Baru'}
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
                  <div className="form-group">
                    <label className="required">Posisi / Jabatan</label>
                    <input
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Contoh: Senior Software Engineer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="required">Perusahaan / Organisasi</label>
                    <input
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Contoh: Lumina Labs / PT Rachita"
                    />
                  </div>

                  <div className="form-group">
                    <label>Overline / Sub-label</label>
                    <input
                      value={formData.overline}
                      onChange={(e) => setFormData({ ...formData, overline: e.target.value })}
                      placeholder="Contoh: Full-time · Remote atau Makassar, Indonesia"
                    />
                  </div>

                  <div className="form-group">
                    <label>Periode Tampilan Custom (Opsional)</label>
                    <input
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Contoh: 2024 — Sekarang atau Jan 2023 — Des 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label className="required">Tanggal Mulai</label>
                    <input
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      placeholder="YYYY-MM atau YYYY-MM-DD (e.g. 2024-01)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Selesai</label>
                    <input
                      disabled={formData.current}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      placeholder={formData.current ? 'Saat ini bekerja di sini' : 'YYYY-MM atau YYYY-MM-DD'}
                      style={{ opacity: formData.current ? 0.6 : 1 }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                      }
                    >
                      <option value="active">Active (Tampil di Portfolio)</option>
                      <option value="inactive">Inactive (Disembunyikan)</option>
                    </select>
                  </div>

                  <div
                    className="form-group"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      paddingTop: '24px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="form-current-exp"
                      checked={formData.current}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : formData.endDate,
                        })
                      }
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label
                      htmlFor="form-current-exp"
                      style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}
                    >
                      Posisi Aktif saat ini (Current Role ✦)
                    </label>
                  </div>
                </div>

                {/* 2. DESKRIPSI & RINGKASAN */}
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Deskripsi Ringkasan Peran</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jelaskan peran utama, fokus engineering, dan dampak terhadap produk/tim..."
                    />
                  </div>
                </div>

                {/* 3. TANGGUNG JAWAB & PENCAPAIAN */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tanggung Jawab (1 baris per butir)</label>
                    <textarea
                      rows={4}
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      placeholder="Arsitektur aplikasi mobile & web end-to-end.&#10;Integrasi AI Computer Vision & E-commerce.&#10;Pengembangan backend REST API."
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '4px' }}>
                      Setiap baris baru akan ditampilkan sebagai poin bullet pada halaman portofolio.
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Pencapaian Utama (1 baris per butir)</label>
                    <textarea
                      rows={4}
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="Merilis aplikasi peternakan pintar Chick Farm AI.&#10;Mengonsolidasikan 8 departemen dalam 1 ERP.&#10;Otomatisasi 100% distribusi berita harian."
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '4px' }}>
                      Pencapaian konkret dan hasil terukur selama menjabat posisi ini.
                    </span>
                  </div>
                </div>

                {/* 4. TEKNOLOGI STACK */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Stack Teknologi yang Digunakan
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
                      placeholder="Ketik teknologi lain (misal: Docker, Kafka, Go) lalu tekan Enter..."
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
                            gap: '6px',
                          }}
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => toggleTechnology(t)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: 'inherit',
                              padding: 0,
                              fontWeight: 'bold',
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                  background: 'var(--surface)',
                  flexShrink: 0,
                }}
              >
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                >
                  Batal
                </button>
                <button className="button button-primary" type="submit">
                  {editingId ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
                </button>
              </div>
            </form>
          </div>
        </AdminModalPortal>
      )}
    </>
  );
}
