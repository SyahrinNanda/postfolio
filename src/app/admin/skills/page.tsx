'use client';

import { useState } from 'react';
import { useAdmin, SkillData } from '@/components/admin/AdminContext';

export default function AdminSkillsPage() {
  const { skills, setDeleteConfirm, addSkill, updateSkill } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 85,
    years: 3,
    status: 'active' as 'active' | 'inactive',
  });

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'AI',
    'DevOps',
    'Engineering',
    'Mobile',
    'Other',
  ];

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Frontend',
      level: 80,
      years: 2,
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (skill: SkillData) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category || 'Frontend',
      level: skill.level ?? 80,
      years: skill.years ?? 1,
      status: skill.status || 'active',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim() || 'Engineering',
      level: Number(formData.level),
      years: Number(formData.years),
      status: formData.status,
    };

    if (editingId) {
      const success = await updateSkill(editingId, payload);
      if (success) setIsFormOpen(false);
    } else {
      const success = await addSkill(payload);
      if (success) setIsFormOpen(false);
    }
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 85) return 'ADVANCED';
    if (level >= 75) return 'PROFICIENT';
    if (level >= 60) return 'WORKING';
    return 'FAMILIAR';
  };

  // Collect distinct categories from existing skills
  const availableCategories = Array.from(
    new Set([...categories, ...skills.map((s) => s.category).filter(Boolean)])
  );

  const filtered = skills.filter((s) => {
    const q = filterQuery.toLowerCase();
    const matchQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchQuery && matchCat && matchStatus;
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Skills &amp; Kompetensi</h1>
          <p>Kelola keahlian teknis, kategori, dan tingkat penguasaan.</p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Tambah skill
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
              placeholder="Cari skill atau kategori…"
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
            {availableCategories.map((cat) => (
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
            <option value="active">Active (Tampil)</option>
            <option value="inactive">Inactive (Sembunyi)</option>
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
        <div
          className="grid-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="row-thumbnail" style={{ fontSize: '0.85rem' }}>
                    {item.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{item.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                  </div>
                </div>
                <span className={`badge badge-${item.status}`}>{item.status}</span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {getMasteryLabel(item.level)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {item.level}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '4px',
                    background: 'var(--line)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.level}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: 'var(--primary)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--ink-light)', marginTop: 'auto' }}>
                ⏳ <strong>{item.years}</strong> tahun pengalaman
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '12px',
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
                      module: 'skills',
                      name: item.name,
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
                  <th>Skill</th>
                  <th>Kategori</th>
                  <th>Penguasaan</th>
                  <th>Pengalaman</th>
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
                        <span className="row-thumbnail">{item.name.slice(0, 2).toUpperCase()}</span>
                        <span>
                          <span className="row-title">{item.name}</span>
                          <span className="row-subtitle">{item.category}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="tag" style={{ fontSize: '0.78rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <span
                          style={{
                            display: 'block',
                            width: '90px',
                            height: '6px',
                            borderRadius: '4px',
                            background: 'var(--line)',
                            overflow: 'hidden',
                          }}
                        >
                          <i
                            style={{
                              display: 'block',
                              width: `${item.level}%`,
                              height: '100%',
                              borderRadius: '4px',
                              background: 'var(--primary)',
                            }}
                          ></i>
                        </span>
                        <b style={{ minWidth: '34px', fontSize: '0.85rem' }}>{item.level}%</b>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                          ({getMasteryLabel(item.level)})
                        </span>
                      </div>
                    </td>
                    <td>{item.years} tahun</td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action"
                          type="button"
                          title="Edit Skill"
                          onClick={() => openEditModal(item)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="row-action danger"
                          type="button"
                          title="Hapus Skill"
                          onClick={() =>
                            setDeleteConfirm({
                              id: item.id,
                              module: 'skills',
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
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Menampilkan {filtered.length} skill</span>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT SKILL */}
      {isFormOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="modal"
            style={{
              width: 'min(560px, calc(100vw - 32px))',
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}
            >
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {editingId ? 'Edit Skill' : 'Tambah Skill Baru'}
                </p>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  {editingId ? `Ubah: ${formData.name}` : 'Keahlian Teknis Baru'}
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

            <form
              onSubmit={handleFormSubmit}
              style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, height: '100%', overflow: 'hidden' }}
            >
              <div
                className="modal-body"
                style={{
                  padding: '24px',
                  overflowY: 'auto',
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                <div className="form-group">
                  <label className="required">Nama Skill</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: React & Next.js, System Design, PostgreSQL"
                  />
                </div>

                <div className="form-group">
                  <label className="required">Kategori</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={categories.includes(formData.category) ? formData.category : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      style={{ flex: 1 }}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="custom">Kategori Kustom...</option>
                    </select>
                    <input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Atau ketik kategori..."
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="required" style={{ margin: 0 }}>
                      Tingkat Penguasaan (Proficiency): <strong>{formData.level}%</strong> ({getMasteryLabel(formData.level)})
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={1}
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                      style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                      style={{ width: '70px', textAlign: 'center' }}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="required">Pengalaman (Tahun)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      required
                      value={formData.years}
                      onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                      placeholder="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="required">Status Tampilan</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                      }
                    >
                      <option value="active">Active (Tampil di Portofolio)</option>
                      <option value="inactive">Inactive (Disembunyikan)</option>
                    </select>
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
                  {editingId ? 'Simpan Perubahan' : 'Tambah Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
