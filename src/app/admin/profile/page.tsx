'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useAdmin,
  ProfileData,
  PrincipleItem,
  ProcessItem,
  HighlightItem,
} from '@/components/admin/AdminContext';

export default function AdminProfilePage() {
  const { profile, saveProfile } = useAdmin();
  const [formData, setFormData] = useState<ProfileData>(profile);

  // Sync state when profile updates from backend API
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
  };

  // --- Principles management (Add, Edit, Delete) ---
  const addPrinciple = () => {
    const nextNum = (formData.principles?.length || 0) + 1;
    const pad = String(nextNum).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      principles: [
        ...(prev.principles || []),
        { number: `${pad} / VALUE`, title: '', description: '' },
      ],
    }));
  };

  const updatePrinciple = (idx: number, field: keyof PrincipleItem, val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.principles || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, principles: updated };
    });
  };

  const removePrinciple = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      principles: (prev.principles || []).filter((_, i) => i !== idx),
    }));
  };

  // --- Processes management (Add, Edit, Delete) ---
  const addProcess = () => {
    setFormData((prev) => ({
      ...prev,
      processes: [...(prev.processes || []), { title: '', description: '' }],
    }));
  };

  const updateProcess = (idx: number, field: keyof ProcessItem, val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.processes || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, processes: updated };
    });
  };

  const removeProcess = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      processes: (prev.processes || []).filter((_, i) => i !== idx),
    }));
  };

  // --- Highlights management (Add, Edit, Delete) ---
  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), { value: '', label: '' }],
    }));
  };

  const updateHighlight = (idx: number, field: keyof HighlightItem, val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, highlights: updated };
    });
  };

  const removeHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Profil &amp; Halaman Tentang</h1>
          <p>Kelola identitas, bio, prinsip kerja, alur kerja, dan informasi kontak publik.</p>
        </div>
        <div className="heading-actions">
          <Link className="button button-secondary" href="/about" target="_blank">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M14 4h6v6M20 4l-9 9M18 13v7H4V6h7" />
            </svg>
            Buka halaman Tentang ↗
          </Link>
        </div>
      </div>

      <div className="profile-layout">
        <form id="profile-form" onSubmit={handleSubmit}>
          {/* SECTION 1: Identitas Profesional */}
          <section className="form-card">
            <header className="form-card-header">
              <h2>Identitas profesional</h2>
              <p>Informasi utama yang tampil pada hero, kartu profil, dan metadata.</p>
            </header>
            <div className="form-card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="required" htmlFor="profile-name">
                    Nama lengkap
                  </label>
                  <input
                    id="profile-name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="required" htmlFor="profile-title">
                    Professional title
                  </label>
                  <input
                    id="profile-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full">
                  <label className="required" htmlFor="profile-short-bio">
                    Bio singkat / Subheading
                  </label>
                  <textarea
                    id="profile-short-bio"
                    maxLength={300}
                    value={formData.shortBio}
                    onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                    required
                  />
                  <small>Digunakan pada kartu hero dan heading profil lengkap.</small>
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-detailed-bio">Bio lengkap / Cerita Tentang</label>
                  <textarea
                    className="tall"
                    id="profile-detailed-bio"
                    rows={5}
                    value={formData.detailedBio}
                    onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
                  />
                  <small>Dapat terdiri dari beberapa kalimat penjelasan fokus dan filosofi kerja.</small>
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-focus">Fokus karier</label>
                  <input
                    id="profile-focus"
                    value={formData.careerFocus}
                    onChange={(e) => setFormData({ ...formData, careerFocus: e.target.value })}
                  />
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-photo">URL / Lokasi foto profil</label>
                  <input
                    id="profile-photo"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="/assets/foto-profile.jpeg atau https://…"
                  />
                  <small>Gunakan path aset internal (cth: /assets/foto-profile.jpeg) atau URL gambar.</small>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Pengantar Halaman Tentang */}
          <section className="form-card">
            <header className="form-card-header">
              <h2>Pengantar Halaman Tentang</h2>
              <p>Teks headline dan lead hero di bagian atas halaman /about.</p>
            </header>
            <div className="form-card-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="profile-about-headline">Hero headline</label>
                  <input
                    id="profile-about-headline"
                    value={formData.aboutHeadline || ''}
                    onChange={(e) => setFormData({ ...formData, aboutHeadline: e.target.value })}
                    placeholder="Engineer yang peduli pada alasannya."
                  />
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-about-lead">Hero lead text</label>
                  <textarea
                    id="profile-about-lead"
                    rows={3}
                    value={formData.aboutLead || ''}
                    onChange={(e) => setFormData({ ...formData, aboutLead: e.target.value })}
                    placeholder="Saya menggabungkan product thinking, desain sistem, dan eksekusi teknis..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Kontak & Lokasi */}
          <section className="form-card">
            <header className="form-card-header">
              <h2>Kontak, lokasi &amp; ketersediaan</h2>
              <p>Informasi yang memudahkan recruiter dan klien menghubungi Anda.</p>
            </header>
            <div className="form-card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="required" htmlFor="profile-email">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone">Nomor telepon</label>
                  <input
                    id="profile-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-location">Lokasi</label>
                  <input
                    id="profile-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-availability">Ketersediaan kerja</label>
                  <input
                    id="profile-availability"
                    value={formData.availability || ''}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="Remote / hybrid · diskusi terbuka"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Social Links */}
          <section className="form-card">
            <header className="form-card-header">
              <h2>Social links</h2>
              <p>Tautan sosial yang dapat dibuka pengunjung di halaman Tentang.</p>
            </header>
            <div className="form-card-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="profile-github">GitHub</label>
                  <div className="input-prefix">
                    <span>github.com/</span>
                    <input
                      id="profile-github"
                      value={(formData.github || '').replace(/^https?:\/\/github\.com\//, '')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          github: e.target.value.startsWith('http')
                            ? e.target.value
                            : `https://github.com/${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-linkedin">LinkedIn</label>
                  <div className="input-prefix">
                    <span>linkedin.com/in/</span>
                    <input
                      id="profile-linkedin"
                      value={(formData.linkedin || '').replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linkedin: e.target.value.startsWith('http')
                            ? e.target.value
                            : `https://www.linkedin.com/in/${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="profile-website">Website pribadi</label>
                  <input
                    id="profile-website"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Prinsip Kerja (Values) - Dynamic List */}
          <section className="form-card">
            <header className="form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Prinsip kerja (Values)</h2>
                <p>Kartu prinsip pengambilan keputusan yang tampil di halaman Tentang.</p>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={addPrinciple}
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              >
                + Tambah Prinsip
              </button>
            </header>
            <div className="form-card-body">
              {(!formData.principles || formData.principles.length === 0) && (
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Belum ada prinsip kerja. Klik &quot;+ Tambah Prinsip&quot; untuk menambahkan.
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {formData.principles?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                        Prinsip #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePrinciple(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        ✕ Hapus
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label>Nomor / Tag (misal: 01 / WHY)</label>
                        <input
                          value={item.number}
                          onChange={(e) => updatePrinciple(idx, 'number', e.target.value)}
                          placeholder="01 / WHY"
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Judul prinsip</label>
                        <input
                          value={item.title}
                          onChange={(e) => updatePrinciple(idx, 'title', e.target.value)}
                          placeholder="Pahami masalah dahulu"
                        />
                      </div>
                      <div className="form-group full">
                        <label>Deskripsi prinsip</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => updatePrinciple(idx, 'description', e.target.value)}
                          placeholder="Saya mencari konteks pengguna, constraint bisnis, dan ukuran keberhasilan..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: Cara Bekerja (Process Steps) - Dynamic List */}
          <section className="form-card">
            <header className="form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Cara bekerja (Process)</h2>
                <p>Tahapan eksekusi dan alur proses kerja di halaman Tentang.</p>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={addProcess}
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              >
                + Tambah Tahapan
              </button>
            </header>
            <div className="form-card-body">
              {(!formData.processes || formData.processes.length === 0) && (
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Belum ada tahapan kerja. Klik &quot;+ Tambah Tahapan&quot; untuk menambahkan.
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {formData.processes?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                        Tahapan #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProcess(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Hapus
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group full">
                        <label>Nama tahapan</label>
                        <input
                          value={item.title}
                          onChange={(e) => updateProcess(idx, 'title', e.target.value)}
                          placeholder="Discover / Design / Build / Learn"
                        />
                      </div>
                      <div className="form-group full">
                        <label>Deskripsi tahapan</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateProcess(idx, 'description', e.target.value)}
                          placeholder="Menyelaraskan masalah, pengguna, constraint..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: Di Luar Editor (Highlights/Metrics) - Dynamic List */}
          <section className="form-card">
            <header className="form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Di luar editor (Metrics &amp; Highlights)</h2>
                <p>Metrik ringkas di bagian bawah halaman Tentang.</p>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={addHighlight}
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              >
                + Tambah Metrik
              </button>
            </header>
            <div className="form-card-body">
              {(!formData.highlights || formData.highlights.length === 0) && (
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Belum ada highlight metrik. Klik &quot;+ Tambah Metrik&quot; untuk menambahkan.
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {formData.highlights?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                        Metrik #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Hapus
                      </button>
                    </div>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label>Angka / Simbol (misal: 24, 06, ∞)</label>
                      <input
                        value={item.value}
                        onChange={(e) => updateHighlight(idx, 'value', e.target.value)}
                        placeholder="24"
                      />
                    </div>
                    <div className="form-group">
                      <label>Label keterangan</label>
                      <input
                        value={item.label}
                        onChange={(e) => updateHighlight(idx, 'label', e.target.value)}
                        placeholder="Catatan teknis / tahun"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="form-card-footer" style={{ marginTop: '20px' }}>
              <button className="button button-primary" type="submit">
                Simpan perubahan profil &amp; halaman Tentang
              </button>
            </footer>
          </section>
        </form>

        {/* SIDEBAR PREVIEW */}
        <aside className="profile-preview" aria-label="Pratinjau profil">
          <div className="preview-cover"></div>
          <div className="preview-content">
            <div className="preview-avatar">
              {formData.photo ? (
                <img src={formData.photo} alt={`Foto ${formData.fullName}`} />
              ) : (
                formData.fullName.slice(0, 2).toUpperCase()
              )}
            </div>
            <h3>{formData.fullName}</h3>
            <p className="preview-role">{formData.title}</p>
            <p className="preview-bio">{formData.shortBio}</p>
            <div className="preview-meta" style={{ marginTop: '12px' }}>
              <span>⌖ {formData.location}</span>
              <span>✉ {formData.email}</span>
              {formData.availability && <span>⏱ {formData.availability}</span>}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Prinsip Kerja:</span>
                <strong>{formData.principles?.length || 0} item</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--muted)' }}>Tahapan Proses:</span>
                <strong>{formData.processes?.length || 0} item</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Highlights Metrik:</span>
                <strong>{formData.highlights?.length || 0} item</strong>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link
                href="/about"
                target="_blank"
                className="button button-secondary"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                Buka /about di tab baru ↗
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
