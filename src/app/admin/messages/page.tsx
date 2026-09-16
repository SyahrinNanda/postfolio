'use client';

import { useState } from 'react';
import { useAdmin, MessageData } from '@/components/admin/AdminContext';

export default function AdminMessagesPage() {
  const {
    messages,
    unreadCount,
    markAllMessagesRead,
    toggleMessageStatus,
    setDeleteConfirm,
    addMessage,
    updateMessage,
    showToast,
  } = useAdmin();

  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal Form State (Create & Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail Modal State (Read & Direct Reply)
  const [activeMessage, setActiveMessage] = useState<MessageData | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
  }>({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'unread',
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      status: 'unread',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: MessageData) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      status: item.status,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      showToast('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const ok = await updateMessage(editingId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: formData.status,
        });
        if (ok) setIsFormOpen(false);
      } else {
        const ok = await addMessage({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: formData.status,
        });
        if (ok) setIsFormOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (id: string, nextStatus: 'unread' | 'read' | 'replied' | 'archived') => {
    await updateMessage(id, { status: nextStatus });
    if (activeMessage && activeMessage.id === id) {
      setActiveMessage({ ...activeMessage, status: nextStatus });
    }
  };

  const filtered = messages.filter((m) => {
    const q = filterQuery.toLowerCase();
    const matchQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    const matchStat = statusFilter === 'all' || m.status === statusFilter;
    return matchQuery && matchStat;
  });

  const getStatusBadge = (status: MessageData['status']) => {
    switch (status) {
      case 'unread':
        return <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>Belum dibaca</span>;
      case 'read':
        return <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>Sudah dibaca</span>;
      case 'replied':
        return <span className="badge" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>Dibalas</span>;
      case 'archived':
        return <span className="badge" style={{ background: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' }}>Diarsipkan</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Pesan</h1>
          <p>Tinjau, balas, atau catat pesan masuk dari pengunjung & calon klien portfolio.</p>
        </div>
        <div className="heading-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="button button-secondary"
            type="button"
            onClick={markAllMessagesRead}
          >
            Tandai semua dibaca
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={openCreateModal}
          >
            + Catat pesan baru
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
              placeholder="Cari pengirim, email, subjek, atau isi pesan…"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="unread">Belum Dibaca (Unread)</option>
            <option value="read">Sudah Dibaca (Read)</option>
            <option value="replied">Sudah Dibalas (Replied)</option>
            <option value="archived">Diarsipkan (Archived)</option>
          </select>
        </div>

        <div className="toolbar-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>
            {unreadCount > 0 ? (
              <span style={{ color: '#d97706', fontWeight: 700 }}>● {unreadCount} pesan belum dibaca</span>
            ) : (
              'Semua pesan telah dibaca'
            )}
          </span>

          <div className="view-toggle" style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              type="button"
              className={`button ${viewMode === 'table' ? 'button-primary' : 'button-secondary'}`}
              style={{ padding: '6px 10px', borderRadius: 0, fontSize: '11px', border: 'none' }}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              Tabel
            </button>
            <button
              type="button"
              className={`button ${viewMode === 'cards' ? 'button-primary' : 'button-secondary'}`}
              style={{ padding: '6px 10px', borderRadius: 0, fontSize: '11px', border: 'none' }}
              onClick={() => setViewMode('cards')}
              title="Cards view"
            >
              Kartu
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--surface)',
            borderRadius: '12px',
            border: '1px dashed var(--line)',
            marginTop: '16px',
          }}
        >
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '12px' }}>
            Tidak ada pesan yang sesuai kriteria pencarian.
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setFilterQuery('');
              setStatusFilter('all');
            }}
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengirim</th>
                  <th>Subjek & Pesan</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th>
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={item.status === 'unread' ? 'is-unread' : ''}
                    style={item.status === 'unread' ? { backgroundColor: 'var(--surface-2)' } : undefined}
                  >
                    <td style={{ minWidth: '180px' }}>
                      <div className="row-main">
                        <span
                          className="row-thumbnail"
                          style={{
                            background: item.status === 'unread' ? 'var(--primary)' : 'var(--line-strong)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          {item.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="row-title" style={{ fontWeight: item.status === 'unread' ? 700 : 500 }}>
                            {item.name}
                          </span>
                          <span className="row-subtitle">{item.email}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="panel-link"
                        type="button"
                        style={{ textAlign: 'left', fontWeight: item.status === 'unread' ? 700 : 600 }}
                        onClick={() => {
                          setActiveMessage(item);
                          if (item.status === 'unread') {
                            updateMessage(item.id, { status: 'read' });
                          }
                        }}
                      >
                        {item.subject}
                      </button>
                      <span className="row-subtitle" style={{ display: 'block', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.message}
                      </span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--muted)' }}>
                      <time>
                        {item.date && !isNaN(Date.parse(item.date))
                          ? new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : item.date || 'Baru saja'}
                      </time>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action"
                          type="button"
                          title="Baca Detail"
                          onClick={() => {
                            setActiveMessage(item);
                            if (item.status === 'unread') {
                              updateMessage(item.id, { status: 'read' });
                            }
                          }}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          className="row-action"
                          type="button"
                          title="Edit Pesan"
                          onClick={() => openEditModal(item)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="row-action"
                          type="button"
                          title="Ganti Status Cepat"
                          onClick={() => toggleMessageStatus(item.id)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="6" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
                          </svg>
                        </button>
                        <button
                          className="row-action danger"
                          type="button"
                          title="Hapus Pesan"
                          onClick={() =>
                            setDeleteConfirm({
                              id: item.id,
                              module: 'messages',
                              name: `${item.subject} (${item.name})`,
                            })
                          }
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="none" stroke="currentColor" strokeWidth="2" d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
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
            <span>Menampilkan {filtered.length} dari {messages.length} pesan</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px', marginTop: '16px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--surface)',
                border: item.status === 'unread' ? '1.5px solid var(--primary)' : '1px solid var(--line)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: item.status === 'unread' ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  {getStatusBadge(item.status)}
                  <time style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {item.date && !isNaN(Date.parse(item.date))
                      ? new Date(item.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : item.date}
                  </time>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  {item.subject}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                  <strong>{item.name}</strong> · <span style={{ textDecoration: 'underline' }}>{item.email}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                <a
                  href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}
                  style={{
                    fontSize: '12px',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Balas Email ↗
                </a>
                <div className="row-actions">
                  <button
                    className="row-action"
                    type="button"
                    title="Baca Detail"
                    onClick={() => {
                      setActiveMessage(item);
                      if (item.status === 'unread') {
                        updateMessage(item.id, { status: 'read' });
                      }
                    }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15">
                      <path fill="none" stroke="currentColor" strokeWidth="2" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  <button
                    className="row-action"
                    type="button"
                    title="Edit"
                    onClick={() => openEditModal(item)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15">
                      <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    className="row-action danger"
                    type="button"
                    title="Hapus"
                    onClick={() =>
                      setDeleteConfirm({
                        id: item.id,
                        module: 'messages',
                        name: `${item.subject} (${item.name})`,
                      })
                    }
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15">
                      <path fill="none" stroke="currentColor" strokeWidth="2" d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM (CATAT / EDIT PESAN) */}
      {isFormOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '640px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {editingId ? 'Edit Pesan' : 'Catat Pesan Masuk'}
                </p>
                <h2>{editingId ? 'Ubah Informasi Pesan' : 'Tambah Pesan Baru Secara Manual'}</h2>
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

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-section-title">INFORMASI PENGIRIM & PESAN</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required" htmlFor="msg-name">
                      Nama Pengirim
                    </label>
                    <input
                      id="msg-name"
                      type="text"
                      required
                      placeholder="Nama lengkap pengirim"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="required" htmlFor="msg-email">
                      Email Pengirim
                    </label>
                    <input
                      id="msg-email"
                      type="email"
                      required
                      placeholder="contoh@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="required" htmlFor="msg-subject">
                      Subjek Pesan
                    </label>
                    <input
                      id="msg-subject"
                      type="text"
                      required
                      placeholder="Contoh: Tawaran Kolaborasi Proyek"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label htmlFor="msg-status">Status Pesan</label>
                    <select
                      id="msg-status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as MessageData['status'],
                        })
                      }
                    >
                      <option value="unread">Belum Dibaca (Unread)</option>
                      <option value="read">Sudah Dibaca (Read)</option>
                      <option value="replied">Sudah Dibalas (Replied)</option>
                      <option value="archived">Diarsipkan (Archived)</option>
                    </select>
                  </div>

                  <div className="form-group full">
                    <label className="required" htmlFor="msg-content">
                      Isi Pesan
                    </label>
                    <textarea
                      id="msg-content"
                      required
                      rows={6}
                      placeholder="Tuliskan isi pesan atau catatan pesan..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
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
                  {isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Catat Pesan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL BACA PESAN */}
      {activeMessage && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: '640px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Detail Pesan Masuk
                </p>
                <h2 style={{ fontSize: '18px', margin: '4px 0 0 0' }}>{activeMessage.subject}</h2>
              </div>
              <button
                className="icon-button modal-close"
                type="button"
                onClick={() => setActiveMessage(null)}
                aria-label="Tutup detail"
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  background: 'var(--surface-2)',
                  padding: '16px',
                  borderRadius: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  fontSize: '13px',
                }}
              >
                <div>
                  <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Pengirim
                  </span>
                  <strong style={{ color: 'var(--ink)' }}>{activeMessage.name}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email
                  </span>
                  <a href={`mailto:${activeMessage.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {activeMessage.email}
                  </a>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Diterima Pada
                  </span>
                  <span style={{ color: 'var(--ink)' }}>
                    {activeMessage.date && !isNaN(Date.parse(activeMessage.date))
                      ? new Date(activeMessage.date).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : activeMessage.date}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Status
                  </span>
                  {getStatusBadge(activeMessage.status)}
                </div>
              </div>

              <div>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                  ISI PESAN
                </span>
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    padding: '18px',
                    borderRadius: '8px',
                    lineHeight: 1.6,
                    fontSize: '14px',
                    color: 'var(--ink)',
                    whiteSpace: 'pre-wrap',
                    minHeight: '120px',
                  }}
                >
                  {activeMessage.message}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', marginRight: '4px' }}>Ubah status cepat:</span>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => handleQuickStatusChange(activeMessage.id, 'unread')}
                >
                  Tandai Belum Dibaca
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => handleQuickStatusChange(activeMessage.id, 'read')}
                >
                  Tandai Sudah Dibaca
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => handleQuickStatusChange(activeMessage.id, 'replied')}
                >
                  Tandai Telah Dibalas
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => handleQuickStatusChange(activeMessage.id, 'archived')}
                >
                  Arsipkan
                </button>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <a
                href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(`Re: ${activeMessage.subject}`)}`}
                className="button button-primary"
                onClick={() => {
                  handleQuickStatusChange(activeMessage.id, 'replied');
                }}
              >
                Balas via Email ↗
              </a>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setActiveMessage(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
