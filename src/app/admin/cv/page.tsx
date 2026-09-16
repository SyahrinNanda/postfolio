'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useAdmin,
  CvData,
  EducationItem,
  CertificationItem,
  LanguageItem,
  PreferenceItem,
} from '@/components/admin/AdminContext';

function formatBytes(bytes: number): string {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

export default function AdminCvPage() {
  const { cv, saveCv, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'document' | 'summary' | 'education' | 'skills' | 'preferences'>('document');

  // Document Upload State
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Summary Form State
  const [summaryForm, setSummaryForm] = useState({
    summaryHeadline: cv.summaryHeadline || '',
    summaryText: cv.summaryText || '',
    badgeText: cv.badgeText || '',
    noteText: cv.noteText || '',
  });

  // Modal State for Education
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduFormData, setEduFormData] = useState<EducationItem>({
    id: '',
    degree: '',
    institution: '',
    period: '',
    description: '',
    status: 'active',
  });

  // Modal State for Certification
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certFormData, setCertFormData] = useState<CertificationItem>({
    id: '',
    title: '',
    subtitle: '',
    year: '',
  });

  // Modal State for Language
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [langFormData, setLangFormData] = useState<LanguageItem>({
    id: '',
    language: '',
    proficiency: 'Native',
  });

  // --- Real File Upload to Server ---
  const handleFileUpload = async (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showToast('File tidak didukung: Pilih dokumen dengan format PDF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File terlalu besar: Maksimal 10 MB.');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/cv/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengunggah file CV');
      }

      const json = await res.json();
      const newVersion = (cv.version || 1) + 1;

      const historyItem = cv.name
        ? {
            id: `h-${Date.now()}`,
            name: cv.name,
            fileUrl: cv.fileUrl,
            size: cv.size,
            updated: cv.updated || 'Baru saja',
            version: cv.version,
          }
        : null;

      const updated: CvData = {
        ...cv,
        name: json.fileName || file.name,
        fileUrl: json.fileUrl,
        size: json.fileSize || file.size,
        updated: 'Baru saja',
        version: newVersion,
        status: 'published',
        history: [historyItem, ...(cv.history || [])].filter(Boolean).slice(0, 10) as any[],
      };

      await saveCv(updated);
      showToast(`CV versi ${newVersion} berhasil diunggah dan dipublikasikan!`);
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal mengunggah file'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // --- Summary Update ---
  const handleSaveSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CvData = {
      ...cv,
      summaryHeadline: summaryForm.summaryHeadline.trim(),
      summaryText: summaryForm.summaryText.trim(),
      badgeText: summaryForm.badgeText.trim(),
      noteText: summaryForm.noteText.trim(),
    };
    await saveCv(updated);
    showToast('Ringkasan CV berhasil disimpan');
  };

  // --- Education CRUD ---
  const openCreateEduModal = () => {
    setEditingEduId(null);
    setEduFormData({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      period: '',
      description: '',
      status: 'active',
    });
    setIsEduModalOpen(true);
  };

  const openEditEduModal = (item: EducationItem) => {
    setEditingEduId(item.id);
    setEduFormData({ ...item });
    setIsEduModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduFormData.degree.trim() || !eduFormData.institution.trim()) {
      showToast('Gelar dan Institusi wajib diisi');
      return;
    }

    let updatedList: EducationItem[];
    if (editingEduId) {
      updatedList = (cv.educations || []).map((item) =>
        item.id === editingEduId ? { ...eduFormData } : item
      );
    } else {
      updatedList = [...(cv.educations || []), { ...eduFormData }];
    }

    const updatedCv = { ...cv, educations: updatedList };
    await saveCv(updatedCv);
    setIsEduModalOpen(false);
    showToast(editingEduId ? 'Data pendidikan berhasil diperbarui' : 'Pendidikan baru berhasil ditambahkan');
  };

  const handleDeleteEdu = async (id: string, name: string) => {
    if (confirm(`Hapus riwayat pendidikan "${name}"?`)) {
      const updatedList = (cv.educations || []).filter((item) => item.id !== id);
      const updatedCv = { ...cv, educations: updatedList };
      await saveCv(updatedCv);
      showToast('Pendidikan berhasil dihapus');
    }
  };

  // --- Certification CRUD ---
  const openCreateCertModal = () => {
    setEditingCertId(null);
    setCertFormData({
      id: `cert-${Date.now()}`,
      title: '',
      subtitle: '',
      year: new Date().getFullYear().toString(),
    });
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (item: CertificationItem) => {
    setEditingCertId(item.id);
    setCertFormData({ ...item });
    setIsCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFormData.title.trim()) {
      showToast('Nama sertifikasi wajib diisi');
      return;
    }

    let updatedList: CertificationItem[];
    if (editingCertId) {
      updatedList = (cv.certifications || []).map((item) =>
        item.id === editingCertId ? { ...certFormData } : item
      );
    } else {
      updatedList = [...(cv.certifications || []), { ...certFormData }];
    }

    const updatedCv = { ...cv, certifications: updatedList };
    await saveCv(updatedCv);
    setIsCertModalOpen(false);
    showToast('Sertifikasi berhasil disimpan');
  };

  const handleDeleteCert = async (id: string, name: string) => {
    if (confirm(`Hapus sertifikasi "${name}"?`)) {
      const updatedList = (cv.certifications || []).filter((item) => item.id !== id);
      const updatedCv = { ...cv, certifications: updatedList };
      await saveCv(updatedCv);
      showToast('Sertifikasi berhasil dihapus');
    }
  };

  // --- Language CRUD ---
  const openCreateLangModal = () => {
    setEditingLangId(null);
    setLangFormData({
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Professional working proficiency',
    });
    setIsLangModalOpen(true);
  };

  const openEditLangModal = (item: LanguageItem) => {
    setEditingLangId(item.id);
    setLangFormData({ ...item });
    setIsLangModalOpen(true);
  };

  const handleSaveLang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langFormData.language.trim()) {
      showToast('Nama bahasa wajib diisi');
      return;
    }

    let updatedList: LanguageItem[];
    if (editingLangId) {
      updatedList = (cv.languages || []).map((item) =>
        item.id === editingLangId ? { ...langFormData } : item
      );
    } else {
      updatedList = [...(cv.languages || []), { ...langFormData }];
    }

    const updatedCv = { ...cv, languages: updatedList };
    await saveCv(updatedCv);
    setIsLangModalOpen(false);
    showToast('Kemampuan bahasa berhasil disimpan');
  };

  const handleDeleteLang = async (id: string, name: string) => {
    if (confirm(`Hapus bahasa "${name}"?`)) {
      const updatedList = (cv.languages || []).filter((item) => item.id !== id);
      const updatedCv = { ...cv, languages: updatedList };
      await saveCv(updatedCv);
      showToast('Bahasa berhasil dihapus');
    }
  };

  // --- Preferences Update ---
  const handlePreferenceChange = async (key: string, val: string) => {
    const updatedPrefs = (cv.preferences || []).map((p) =>
      p.key === key ? { ...p, value: val } : p
    );
    const updatedCv = { ...cv, preferences: updatedPrefs };
    await saveCv(updatedCv);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Curriculum Vitae</h1>
          <p>Kelola dokumen PDF asli, riwayat pendidikan, sertifikasi, bahasa, dan ringkasan CV portofolio.</p>
        </div>
        <div className="heading-actions" style={{ display: 'flex', gap: '10px' }}>
          <Link className="button button-secondary" href="/cv" target="_blank" rel="noopener">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M14 4h6v6M20 4l-9 9M18 13v7H4V6h7" />
            </svg>
            Buka Halaman CV Publik ↗
          </Link>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--line)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('document')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: activeTab === 'document' ? 700 : 500,
            color: activeTab === 'document' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'document' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          1. Dokumen PDF &amp; Versi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: activeTab === 'education' ? 700 : 500,
            color: activeTab === 'education' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'education' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          2. Riwayat Pendidikan (CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: activeTab === 'skills' ? 700 : 500,
            color: activeTab === 'skills' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'skills' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          3. Sertifikasi &amp; Bahasa (CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: activeTab === 'summary' ? 700 : 500,
            color: activeTab === 'summary' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'summary' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          4. Ringkasan &amp; Header CV
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: activeTab === 'preferences' ? 700 : 500,
            color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'preferences' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          5. Preferensi Kerja
        </button>
      </div>

      {/* TAB 1: DOKUMEN PDF & VERSI */}
      {activeTab === 'document' && (
        <div className="settings-layout">
          <div>
            <section className="form-card">
              <header className="form-card-header">
                <h2>CV Dokumen Aktif</h2>
                <p>File ini digunakan oleh seluruh tombol download CV di homepage dan halaman /cv.</p>
              </header>
              <div className="form-card-body">
                <div className="file-card">
                  <span className="file-icon" style={{ background: 'var(--primary)', color: '#ffffff', fontWeight: 800 }}>
                    PDF
                  </span>
                  <span style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{cv.name || 'Belum ada CV terpublikasi'}</strong>
                    <small style={{ color: 'var(--muted)' }}>
                      {formatBytes(cv.size)} · Versi {cv.version || 1} · Diperbarui {cv.updated || 'Baru saja'}
                    </small>
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a
                      href={cv.fileUrl || '/assets/syahrin-nanda-cv.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Buka Dokumen ↗
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="form-card" style={{ marginTop: '20px' }}>
              <header className="form-card-header">
                <h2>Unggah Dokumen PDF Baru</h2>
                <p>Pilih file PDF dari perangkat untuk memperbarui file CV aktif di server.</p>
              </header>
              <div className="form-card-body">
                <label
                  className={`upload-zone ${isDragging ? 'dragover' : ''}`}
                  id="cv-upload-zone"
                  htmlFor="cv-file-input"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    border: '2px dashed var(--line)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isDragging ? 'var(--surface-2)' : 'transparent',
                  }}
                >
                  <input
                    id="cv-file-input"
                    type="file"
                    accept="application/pdf,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                      e.target.value = '';
                    }}
                  />
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📄</div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                    {uploading ? 'Mengunggah file ke server...' : 'Tarik file PDF ke sini'}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 12px 0' }}>
                    atau klik untuk memilih dokumen PDF dari komputer Anda
                  </p>
                  <span className="button button-secondary" style={{ pointerEvents: 'none' }}>
                    {uploading ? 'Memproses...' : 'Pilih File PDF'}
                  </span>
                  <small style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '11px' }}>
                    Format PDF · Maksimal 10 MB · Tersimpan langsung di server publik
                  </small>
                </label>
              </div>
            </div>
          </div>

          <aside>
            <section className="form-card">
              <header className="form-card-header">
                <h3>Riwayat Versi Dokumen</h3>
                <p>Arsip file CV terdahulu.</p>
              </header>
              <div className="form-card-body" style={{ display: 'grid', gap: '10px' }}>
                {cv.history && cv.history.length > 0 ? (
                  cv.history.map((item, idx) => (
                    <div key={item.id || idx} className="file-card" style={{ padding: '10px', fontSize: '12px' }}>
                      <span className="file-icon">v{item.version}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </strong>
                        <small style={{ color: 'var(--muted)' }}>
                          {formatBytes(item.size)} · {item.updated}
                        </small>
                      </span>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          Unduh
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
                    Belum ada riwayat arsip file sebelumnya.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* TAB 2: RIWAYAT PENDIDIKAN (CRUD LENGKAP) */}
      {activeTab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0 }}>Riwayat Pendidikan</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0 0' }}>
                Seluruh data pendidikan yang tampil di bagian <strong>Pendidikan</strong> pada halaman <code>/cv</code>.
              </p>
            </div>
            <button type="button" className="button button-primary" onClick={openCreateEduModal}>
              + Tambah Pendidikan Baru
            </button>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {(cv.educations || []).map((edu) => (
              <div
                key={edu.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'monospace' }}>({edu.period})</span>
                  </div>
                  <strong style={{ color: 'var(--primary)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    {edu.institution}
                  </strong>
                  {edu.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: 0, lineHeight: 1.5 }}>
                      {edu.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => openEditEduModal(edu)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger, red)' }}
                    onClick={() => handleDeleteEdu(edu.id, edu.degree)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERTIFIKASI & BAHASA (CRUD LENGKAP) */}
      {activeTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 1. SERTIFIKASI & BOOTCAMP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: 0 }}>Sertifikasi &amp; Bootcamp</h2>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0 0' }}>
                  Tampil pada sidebar dokumen CV di halaman <code>/cv</code>.
                </p>
              </div>
              <button type="button" className="button button-primary" onClick={openCreateCertModal}>
                + Tambah Sertifikasi
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
              {(cv.certifications || []).map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{cert.title}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {cert.subtitle} {cert.year ? `(${cert.year})` : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => openEditCertModal(cert)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger, red)' }}
                      onClick={() => handleDeleteCert(cert.id, cert.title)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. KEMAMPUAN BAHASA */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '18px', margin: 0 }}>Kemampuan Bahasa</h2>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0 0' }}>
                  Daftar bahasa dan tingkat penguasaan untuk kebutuhan rekrutmen.
                </p>
              </div>
              <button type="button" className="button button-primary" onClick={openCreateLangModal}>
                + Tambah Bahasa
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '12px' }}>
              {(cv.languages || []).map((lang) => (
                <div
                  key={lang.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{lang.language}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>{lang.proficiency}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => openEditLangModal(lang)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger, red)' }}
                      onClick={() => handleDeleteLang(lang.id, lang.language)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RINGKASAN & HEADER CV */}
      {activeTab === 'summary' && (
        <form onSubmit={handleSaveSummary} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <section className="form-card">
            <header className="form-card-header">
              <h2>Header &amp; Ringkasan Profesional CV</h2>
              <p>Atur teks pembuka dan badge pengumuman pada lembar CV portofolio.</p>
            </header>
            <div className="form-card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="badge-text">Teks Badge Versi Dokumen</label>
                  <input
                    id="badge-text"
                    value={summaryForm.badgeText}
                    placeholder="CV versi resmi · September 2026"
                    onChange={(e) => setSummaryForm({ ...summaryForm, badgeText: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="summary-headline">Role / Judul Posisi di CV</label>
                  <input
                    id="summary-headline"
                    value={summaryForm.summaryHeadline}
                    placeholder="Software Engineer"
                    onChange={(e) => setSummaryForm({ ...summaryForm, summaryHeadline: e.target.value })}
                  />
                </div>

                <div className="form-group full">
                  <label htmlFor="note-text">Catatan Disclaimer Dokumen</label>
                  <input
                    id="note-text"
                    value={summaryForm.noteText}
                    placeholder="Konten identitas, pengalaman, dan metrik di CV ini diperbarui secara berkala."
                    onChange={(e) => setSummaryForm({ ...summaryForm, noteText: e.target.value })}
                  />
                </div>

                <div className="form-group full">
                  <label htmlFor="summary-text">Paragraf Ringkasan Profesional (CV Summary)</label>
                  <textarea
                    id="summary-text"
                    rows={4}
                    value={summaryForm.summaryText}
                    placeholder="Product-minded software engineer dengan 4+ tahun pengalaman..."
                    onChange={(e) => setSummaryForm({ ...summaryForm, summaryText: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <footer className="form-card-footer">
              <button className="button button-primary" type="submit">
                Simpan Ringkasan CV
              </button>
            </footer>
          </section>
        </form>
      )}

      {/* TAB 5: PREFERENSI KERJA */}
      {activeTab === 'preferences' && (
        <section className="form-card">
          <header className="form-card-header">
            <h2>Preferensi Kerja &amp; Relokasi</h2>
            <p>Atur preferensi format kerja dan fokus peran yang tercantum di CV.</p>
          </header>
          <div className="form-card-body">
            <div className="form-grid">
              {(cv.preferences || []).map((pref) => (
                <div key={pref.key} className="form-group full">
                  <label>{pref.label}</label>
                  <input
                    type="text"
                    value={pref.value}
                    onChange={(e) => handlePreferenceChange(pref.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODAL FORM: PENDIDIKAN */}
      {isEduModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingEduId ? 'Edit Riwayat Pendidikan' : 'Tambah Pendidikan Baru'}
                </p>
                <h2>{editingEduId ? 'Ubah Informasi Pendidikan' : 'Catat Jenjang Pendidikan'}</h2>
              </div>
              <button className="icon-button modal-close" type="button" onClick={() => setIsEduModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdu} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="required" htmlFor="edu-degree">
                      Gelar / Jurusan
                    </label>
                    <input
                      id="edu-degree"
                      value={eduFormData.degree}
                      placeholder="Contoh: S1 Teknik Informatika"
                      required
                      onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="required" htmlFor="edu-inst">
                      Institusi / Universitas
                    </label>
                    <input
                      id="edu-inst"
                      value={eduFormData.institution}
                      placeholder="Contoh: Universitas Muslim Indonesia"
                      required
                      onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edu-period">Periode / Tahun</label>
                    <input
                      id="edu-period"
                      value={eduFormData.period}
                      placeholder="Contoh: 2020 — 2024"
                      onChange={(e) => setEduFormData({ ...eduFormData, period: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label htmlFor="edu-desc">Keterangan / Prestasi</label>
                    <textarea
                      id="edu-desc"
                      rows={3}
                      value={eduFormData.description}
                      placeholder="Gelar Sarjana Komputer (S.Kom) dengan fokus pada rekayasa perangkat lunak..."
                      onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="button button-secondary" type="button" onClick={() => setIsEduModalOpen(false)}>
                  Batal
                </button>
                <button className="button button-primary" type="submit">
                  {editingEduId ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM: SERTIFIKASI */}
      {isCertModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '540px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingCertId ? 'Edit Sertifikasi' : 'Tambah Sertifikasi Baru'}
                </p>
                <h2>{editingCertId ? 'Ubah Sertifikasi' : 'Catat Sertifikasi / Bootcamp'}</h2>
              </div>
              <button className="icon-button modal-close" type="button" onClick={() => setIsCertModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="required" htmlFor="cert-title">
                      Nama Sertifikasi / Program
                    </label>
                    <input
                      id="cert-title"
                      value={certFormData.title}
                      placeholder="Contoh: Bangkit Academy 2023"
                      required
                      onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cert-sub">Penyelenggara / Keterangan</label>
                    <input
                      id="cert-sub"
                      value={certFormData.subtitle}
                      placeholder="Contoh: Cloud Computing Path · Google"
                      onChange={(e) => setCertFormData({ ...certFormData, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cert-year">Tahun Perolehan</label>
                    <input
                      id="cert-year"
                      value={certFormData.year}
                      placeholder="2023"
                      onChange={(e) => setCertFormData({ ...certFormData, year: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="button button-secondary" type="button" onClick={() => setIsCertModalOpen(false)}>
                  Batal
                </button>
                <button className="button button-primary" type="submit">
                  Simpan Sertifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM: BAHASA */}
      {isLangModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingLangId ? 'Edit Bahasa' : 'Tambah Kemampuan Bahasa'}
                </p>
                <h2>{editingLangId ? 'Ubah Bahasa' : 'Catat Bahasa Baru'}</h2>
              </div>
              <button className="icon-button modal-close" type="button" onClick={() => setIsLangModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveLang} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="required" htmlFor="lang-name">
                      Nama Bahasa
                    </label>
                    <input
                      id="lang-name"
                      value={langFormData.language}
                      placeholder="Contoh: Bahasa Indonesia, English, Japanese"
                      required
                      onChange={(e) => setLangFormData({ ...langFormData, language: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label htmlFor="lang-prof">Tingkat Kemahiran</label>
                    <input
                      id="lang-prof"
                      value={langFormData.proficiency}
                      placeholder="Contoh: Native, Professional working proficiency"
                      onChange={(e) => setLangFormData({ ...langFormData, proficiency: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="button button-secondary" type="button" onClick={() => setIsLangModalOpen(false)}>
                  Batal
                </button>
                <button className="button button-primary" type="submit">
                  Simpan Bahasa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
