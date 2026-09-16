'use client';

import { useState, useEffect } from 'react';
import {
  useAdmin,
  SettingsData,
  CapabilityItem,
  HeroMetricItem,
} from '@/components/admin/AdminContext';

export default function AdminSettingsPage() {
  const { settings, saveSettings, setDeleteConfirm, showToast } = useAdmin();
  const [formData, setFormData] = useState<SettingsData>(settings);
  const [activeTab, setActiveTab] = useState<'home' | 'capabilities' | 'identity' | 'preferences'>('home');

  // Sync state when settings load from backend
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Modal State for Capabilities CRUD
  const [isCapModalOpen, setIsCapModalOpen] = useState(false);
  const [editingCapId, setEditingCapId] = useState<string | null>(null);
  const [capFormData, setCapFormData] = useState<CapabilityItem>({
    id: '',
    index: '01',
    icon: '◫',
    title: '',
    description: '',
    tags: [],
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Primary stack tag input state
  const [newStackTag, setNewStackTag] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSettings(formData);
  };

  // --- Capabilities CRUD ---
  const openCreateCapModal = () => {
    const nextNum = (formData.capabilities?.length || 0) + 1;
    setEditingCapId(null);
    setCapFormData({
      id: `cap-${Date.now()}`,
      index: String(nextNum).padStart(2, '0'),
      icon: '◫',
      title: '',
      description: '',
      tags: [],
    });
    setNewTagInput('');
    setIsCapModalOpen(true);
  };

  const openEditCapModal = (item: CapabilityItem) => {
    setEditingCapId(item.id);
    setCapFormData({
      ...item,
      tags: [...(item.tags || [])],
    });
    setNewTagInput('');
    setIsCapModalOpen(true);
  };

  const handleSaveCap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capFormData.title.trim()) {
      showToast('Judul kapabilitas wajib diisi');
      return;
    }

    let updatedCaps: CapabilityItem[];
    if (editingCapId) {
      updatedCaps = (formData.capabilities || []).map((c) =>
        c.id === editingCapId
          ? {
              ...capFormData,
              title: capFormData.title.trim(),
              description: capFormData.description.trim(),
            }
          : c
      );
    } else {
      updatedCaps = [
        ...(formData.capabilities || []),
        {
          ...capFormData,
          title: capFormData.title.trim(),
          description: capFormData.description.trim(),
        },
      ];
    }

    const updatedSettings = { ...formData, capabilities: updatedCaps };
    setFormData(updatedSettings);
    saveSettings(updatedSettings);
    setIsCapModalOpen(false);
  };

  const handleDeleteCap = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kartu kapabilitas "${title}"?`)) {
      const updatedCaps = (formData.capabilities || []).filter((c) => c.id !== id);
      const updatedSettings = { ...formData, capabilities: updatedCaps };
      setFormData(updatedSettings);
      saveSettings(updatedSettings);
      showToast(`Kapabilitas "${title}" berhasil dihapus`);
    }
  };

  const handleAddCapTag = () => {
    if (!newTagInput.trim()) return;
    if (!capFormData.tags.includes(newTagInput.trim())) {
      setCapFormData({ ...capFormData, tags: [...capFormData.tags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveCapTag = (tag: string) => {
    setCapFormData({ ...capFormData, tags: capFormData.tags.filter((t) => t !== tag) });
  };

  // --- Primary Stack Tags ---
  const handleAddStackTag = () => {
    if (!newStackTag.trim()) return;
    if (!formData.heroPrimaryStack?.includes(newStackTag.trim())) {
      const updated = [...(formData.heroPrimaryStack || []), newStackTag.trim()];
      setFormData({ ...formData, heroPrimaryStack: updated });
    }
    setNewStackTag('');
  };

  const handleRemoveStackTag = (tag: string) => {
    const updated = (formData.heroPrimaryStack || []).filter((t) => t !== tag);
    setFormData({ ...formData, heroPrimaryStack: updated });
  };

  // --- Hero Metrics ---
  const handleMetricChange = (index: number, field: keyof HeroMetricItem, val: string) => {
    const updated = [...(formData.heroMetrics || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: val };
      setFormData({ ...formData, heroMetrics: updated });
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Pengaturan</h1>
          <p>Kelola konten halaman utama (Hero, Kapabilitas, Ticker), identitas SEO situs, dan visibilitas.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-primary" type="button" onClick={() => handleSubmit()}>
            Simpan Pengaturan
          </button>
        </div>
      </div>

      {/* MODERN TABS BAR */}
      <nav
        aria-label="Navigasi Pengaturan"
        style={{
          display: 'inline-flex',
          gap: '4px',
          padding: '4px',
          background: 'var(--surface-2)',
          borderRadius: '11px',
          border: '1px solid var(--line)',
          marginBottom: '20px',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: activeTab === 'home' ? 700 : 500,
            color: activeTab === 'home' ? 'var(--primary)' : 'var(--muted)',
            background: activeTab === 'home' ? 'var(--surface)' : 'transparent',
            borderRadius: '8px',
            border: 'none',
            boxShadow: activeTab === 'home' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Main Halaman (Hero &amp; Ticker)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('capabilities')}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: activeTab === 'capabilities' ? 700 : 500,
            color: activeTab === 'capabilities' ? 'var(--primary)' : 'var(--muted)',
            background: activeTab === 'capabilities' ? 'var(--surface)' : 'transparent',
            borderRadius: '8px',
            border: 'none',
            boxShadow: activeTab === 'capabilities' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Kapabilitas (CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: activeTab === 'identity' ? 700 : 500,
            color: activeTab === 'identity' ? 'var(--primary)' : 'var(--muted)',
            background: activeTab === 'identity' ? 'var(--surface)' : 'transparent',
            borderRadius: '8px',
            border: 'none',
            boxShadow: activeTab === 'identity' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Identitas Situs &amp; SEO
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: activeTab === 'preferences' ? 700 : 500,
            color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--muted)',
            background: activeTab === 'preferences' ? 'var(--surface)' : 'transparent',
            borderRadius: '8px',
            border: 'none',
            boxShadow: activeTab === 'preferences' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Preferensi &amp; Visibilitas
        </button>
      </nav>

      <form onSubmit={handleSubmit}>
        {/* TAB 1: MAIN HALAMAN (HERO, METRIK & TICKER) */}
        {activeTab === 'home' && (
          <div className="settings-layout">
            {/* Kolom Kiri: Konten Utama Hero */}
            <div>
              <section className="form-card">
                <header className="form-card-header">
                  <h2>Teks &amp; Headline Hero</h2>
                  <p>Sesuaikan teks pembuka dan headline utama pada homepage portofolio.</p>
                </header>
                <div className="form-card-body">
                  <div className="form-grid">
                    <div className="form-group full">
                      <label htmlFor="hero-eyebrow">Teks Eyebrow / Label Atas</label>
                      <input
                        id="hero-eyebrow"
                        value={formData.heroEyebrow || ''}
                        placeholder="Contoh: As'syahrin Nanda · Software Engineer"
                        onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                      />
                      <small>Tampil di atas judul utama dengan indikator status dot.</small>
                    </div>

                    <div className="form-group full">
                      <label className="required" htmlFor="hero-title">
                        Headline Utama (H1)
                      </label>
                      <input
                        id="hero-title"
                        value={formData.heroTitle || ''}
                        placeholder="Membangun produk digital yang berarti."
                        required
                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="required" htmlFor="hero-lead">
                        Paragraf Pembuka (Hero Lead)
                      </label>
                      <textarea
                        id="hero-lead"
                        rows={3}
                        value={formData.heroLead || ''}
                        placeholder="Saya syahrin, software engineer yang mengubah masalah kompleks..."
                        required
                        onChange={(e) => setFormData({ ...formData, heroLead: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="form-card">
                <header className="form-card-header">
                  <h2>Primary Tech Stack (Badge Hero)</h2>
                  <p>Daftar teknologi utama yang disorot tepat di bawah paragraf lead hero.</p>
                </header>
                <div className="form-card-body">
                  <div className="form-group full">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Ketik teknologi (e.g. Next.js, Docker, AI)..."
                        value={newStackTag}
                        onChange={(e) => setNewStackTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddStackTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleAddStackTag}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        + Tambah
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(formData.heroPrimaryStack || []).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            padding: '6px 12px',
                            background: 'var(--surface-2)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            border: '1px solid var(--line-strong)',
                            fontWeight: 600,
                            color: 'var(--ink)',
                          }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveStackTag(tag)}
                            aria-label={`Hapus ${tag}`}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--danger, #ef4444)',
                              fontWeight: 700,
                              fontSize: '13px',
                              padding: 0,
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="form-card">
                <header className="form-card-header">
                  <h2>Ticker Bar (Teks Berjalan / Marquee)</h2>
                  <p>Teks yang mengalir horizontal tepat di bawah section Hero.</p>
                </header>
                <div className="form-card-body">
                  <div className="form-group full">
                    <label htmlFor="ticker-text">Isi Teks Ticker</label>
                    <input
                      id="ticker-text"
                      value={formData.tickerText || ''}
                      placeholder="PRODUCT ENGINEERING ✦ SYSTEM DESIGN ✦ FRONTEND ✦ BACKEND ✦ CLOUD ✦"
                      onChange={(e) => setFormData({ ...formData, tickerText: e.target.value })}
                    />
                    <small>Gunakan simbol pemisah seperti ✦ atau • untuk memberi jeda elegan antar kata.</small>
                  </div>
                </div>
              </section>
            </div>

            {/* Kolom Kanan: Metrik Statistik Hero */}
            <aside>
              <section className="form-card">
                <header className="form-card-header">
                  <h3>Metrik Prestasi Hero</h3>
                  <p>3 angka statistik pencapaian di sisi samping hero.</p>
                </header>
                <div className="form-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(formData.heroMetrics || []).map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px',
                        background: 'var(--surface-2)',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                          METRIK #{idx + 1}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                          {metric.value || '0'}
                        </span>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '10px' }}>Nilai Angka (Besar)</label>
                        <input
                          type="text"
                          value={metric.value}
                          placeholder="e.g. 4+, 18, 99.9%"
                          onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '10px' }}>Keterangan / Label</label>
                        <textarea
                          rows={2}
                          value={metric.label}
                          placeholder="e.g. Tahun pengalaman"
                          style={{ minHeight: '55px' }}
                          onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <footer className="form-card-footer">
                  <button className="button button-primary button-sm" type="submit" style={{ width: '100%' }}>
                    Simpan Perubahan
                  </button>
                </footer>
              </section>
            </aside>
          </div>
        )}

        {/* TAB 2: KAPABILITAS / LAYANAN (CRUD LENGKAP) */}
        {activeTab === 'capabilities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: 0 }}>Kartu Kapabilitas (Section 02 Home)</h2>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0 0' }}>
                  Kartu-kartu ini tampil di halaman utama portofolio pada bagian <strong>02 / Kapabilitas</strong>.
                </p>
              </div>
              <button
                type="button"
                className="button button-primary"
                onClick={openCreateCapModal}
              >
                + Tambah Kapabilitas Baru
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
              {(formData.capabilities || []).map((cap, idx) => (
                <div
                  key={cap.id || idx}
                  style={{
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: 'var(--muted)',
                          fontWeight: 700,
                        }}
                      >
                        {cap.index || String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          fontSize: '1.25rem',
                          background: 'var(--surface-2)',
                          width: '38px',
                          height: '38px',
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: '10px',
                          border: '1px solid var(--line)',
                          color: 'var(--primary)',
                        }}
                      >
                        {cap.icon || '◫'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--ink)' }}>
                      {cap.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      {cap.description}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(cap.tags || []).map((tg, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '11px',
                            background: 'var(--surface-2)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--line)',
                            color: 'var(--muted)',
                          }}
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
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
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => openEditCapModal(cap)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger, #ef4444)' }}
                      onClick={() => handleDeleteCap(cap.id, cap.title)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IDENTITAS SITUS & SEO */}
        {activeTab === 'identity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section className="form-card">
              <header className="form-card-header">
                <h2>Identitas Situs &amp; Metadata SEO</h2>
                <p>Konfigurasi dasar judul situs, deskripsi, dan integrasi eksternal.</p>
              </header>
              <div className="form-card-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required" htmlFor="setting-name">
                      Nama Situs
                    </label>
                    <input
                      id="setting-name"
                      value={formData.siteName}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="setting-url">URL Situs</label>
                    <input
                      id="setting-url"
                      type="url"
                      value={formData.siteUrl}
                      placeholder="https://domainanda.dev"
                      onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group full">
                    <label className="required" htmlFor="setting-title">
                      Meta Title (Browser Tab)
                    </label>
                    <input
                      id="setting-title"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      maxLength={60}
                      required
                    />
                    <small>Disarankan maksimal 60 karakter untuk SEO optimal.</small>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="setting-description">Meta Description</label>
                    <textarea
                      id="setting-description"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      maxLength={160}
                    />
                    <small>Disarankan maksimal 160 karakter untuk cuplikan Google Search.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="setting-github">GitHub Username</label>
                    <input
                      id="setting-github"
                      placeholder="syahrinnanda"
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="setting-analytics">Google Analytics ID</label>
                    <input
                      id="setting-analytics"
                      placeholder="G-XXXXXXXXXX"
                      value={formData.analyticsId}
                      onChange={(e) => setFormData({ ...formData, analyticsId: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <footer className="form-card-footer">
                <button className="button button-primary" type="submit">
                  Simpan Identitas
                </button>
              </footer>
            </section>
          </div>
        )}

        {/* TAB 4: PREFERENSI & VISIBILITAS */}
        {activeTab === 'preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section className="form-card">
              <header className="form-card-header">
                <h2>Visibilitas Konten &amp; Preferensi</h2>
                <p>Atur section yang aktif di halaman publik dan mode sistem.</p>
              </header>
              <div className="form-card-body">
                <div className="switch-row">
                  <span className="switch-copy">
                    <strong>Tampilkan Bagian Artikel (05 / Catatan)</strong>
                    <small>Aktifkan atau sembunyikan section artikel di halaman utama</small>
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.showArticles}
                      onChange={(e) => setFormData({ ...formData, showArticles: e.target.checked })}
                    />
                    <span></span>
                  </label>
                </div>

                <div className="switch-row">
                  <span className="switch-copy">
                    <strong>Tampilkan Tautan GitHub</strong>
                    <small>Tampilkan tautan GitHub pada header, hero, dan footer</small>
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.showGithub}
                      onChange={(e) => setFormData({ ...formData, showGithub: e.target.checked })}
                    />
                    <span></span>
                  </label>
                </div>

                <div className="switch-row">
                  <span className="switch-copy">
                    <strong>Notifikasi Email</strong>
                    <small>Kirim notifikasi email saat pesan contact form masuk</small>
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                    />
                    <span></span>
                  </label>
                </div>

                <div className="switch-row">
                  <span className="switch-copy">
                    <strong>Maintenance Mode</strong>
                    <small>Sembunyikan situs sementara untuk pemeliharaan</small>
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceMode}
                      onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                    />
                    <span></span>
                  </label>
                </div>
              </div>
              <footer className="form-card-footer">
                <button className="button button-primary" type="submit">
                  Simpan Preferensi
                </button>
              </footer>
            </section>
          </div>
        )}
      </form>

      {/* MODAL FORM (CREATE / EDIT KAPABILITAS) */}
      {isCapModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingCapId ? 'Edit Kapabilitas' : 'Tambah Kapabilitas Baru'}
                </p>
                <h2>{editingCapId ? 'Ubah Kartu Kapabilitas' : 'Buat Layanan / Kapabilitas Baru'}</h2>
              </div>
              <button
                className="icon-button modal-close"
                type="button"
                onClick={() => setIsCapModalOpen(false)}
                aria-label="Tutup dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCap} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required" htmlFor="cap-index">
                      Nomor / Urutan
                    </label>
                    <input
                      id="cap-index"
                      value={capFormData.index}
                      placeholder="01, 02, etc."
                      required
                      onChange={(e) => setCapFormData({ ...capFormData, index: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="required" htmlFor="cap-icon">
                      Simbol / Icon
                    </label>
                    <input
                      id="cap-icon"
                      value={capFormData.icon}
                      placeholder="◫, ⌘, △, ✦, ⚙"
                      required
                      onChange={(e) => setCapFormData({ ...capFormData, icon: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="required" htmlFor="cap-title">
                      Judul Kapabilitas
                    </label>
                    <input
                      id="cap-title"
                      value={capFormData.title}
                      placeholder="Contoh: AI Application & Agentic Design"
                      required
                      onChange={(e) => setCapFormData({ ...capFormData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="required" htmlFor="cap-desc">
                      Deskripsi Layanan / Kapabilitas
                    </label>
                    <textarea
                      id="cap-desc"
                      rows={3}
                      value={capFormData.description}
                      placeholder="Penjelasan ringkas tentang keahlian atau hasil yang di-deliver..."
                      required
                      onChange={(e) => setCapFormData({ ...capFormData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label>Teknologi / Tags Terkait</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Contoh: LangChain, Next.js..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCapTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleAddCapTag}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        + Tambah
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {capFormData.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '12px',
                            padding: '4px 9px',
                            background: 'var(--surface-2)',
                            borderRadius: '6px',
                            border: '1px solid var(--line)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveCapTag(tag)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--danger, #ef4444)',
                              fontWeight: 700,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setIsCapModalOpen(false)}
                >
                  Batal
                </button>
                <button className="button button-primary" type="submit">
                  {editingCapId ? 'Simpan Perubahan' : 'Tambah Kapabilitas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
