'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BodyStyler from '@/components/BodyStyler';
import { useAdmin } from './AdminContext';
import { authClient } from '@/lib/auth-client';

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    profile,
    projects,
    articles,
    messages,
    unreadCount,
    isSaving,
    isDarkMode,
    toggleTheme,
    toastMessage,
    setToastMessage,
    detailItem,
    setDetailItem,
    deleteConfirm,
    setDeleteConfirm,
    executeDelete,
  } = useAdmin();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const session =
      localStorage.getItem('portfolio_admin_session') ||
      sessionStorage.getItem('portfolio_admin_session');

    if (!session) {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Handle Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search') as HTMLInputElement | null;
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Always reset scroll to top on route change to prevent sticky topbar overlap
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // ignore error
    }
    localStorage.removeItem('portfolio_admin_session');
    sessionStorage.removeItem('portfolio_admin_session');
    router.replace('/admin/login');
  };

  // Global search filtering
  const globalSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const projs = projects
      .filter((p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q))
      .map((p) => ({ id: p.id, title: p.title, subtitle: p.category, route: '/admin/projects', type: 'Project' }));
    const arts = articles
      .filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q))
      .map((a) => ({ id: a.id, title: a.title, subtitle: a.category, route: '/admin/articles', type: 'Artikel' }));
    const msgs = messages
      .filter((m) => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
      .map((m) => ({ id: m.id, title: m.name, subtitle: m.subject, route: '/admin/messages', type: 'Pesan' }));
    return [...projs, ...arts, ...msgs].slice(0, 7);
  }, [globalSearch, projects, articles, messages]);

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0c181d', color: '#7ed3c7' }}>
        <p>Memeriksa autentikasi…</p>
      </div>
    );
  }

  // Active check helper
  const isRouteActive = (routes: string[]) => {
    return routes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  };

  return (
    <>
      <BodyStyler classes={['admin-body']} attributes={isDarkMode ? { 'data-theme': 'dark' } : {}} />
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>

      <div className="app-shell">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar" aria-label="Navigasi admin">
          <div className="brand-row">
            <Link className="brand" href="/admin/dashboard" aria-label="Syahrin.dev Admin, ke dashboard">
              <span className="brand-mark">AN</span>
              <span>
                <strong>Syahrin.dev</strong>
                <small>Content studio</small>
              </span>
            </Link>
            <button
              className="icon-button sidebar-close"
              id="sidebar-close"
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup menu"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav className="primary-nav" aria-label="Menu utama">
            <p className="nav-label">Workspace</p>
            <Link
              className={`nav-item ${isRouteActive(['/admin', '/admin/dashboard']) && pathname !== '/admin/login' && !isRouteActive(['/admin/profile', '/admin/profil', '/admin/projects', '/admin/project', '/admin/experiences', '/admin/pengalaman', '/admin/skills', '/admin/technologies', '/admin/teknologi', '/admin/articles', '/admin/artikel', '/admin/messages', '/admin/pesan', '/admin/cv', '/admin/settings', '/admin/pengaturan']) ? 'active' : ''}`}
              href="/admin/dashboard"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/profile', '/admin/profil']) ? 'active' : ''}`}
              href="/admin/profile"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
              <span>Profil</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/projects', '/admin/project']) ? 'active' : ''}`}
              href="/admin/projects"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="14" rx="2" />
                <path d="M8 6V4h8v2M3 11h18M10 14h4" />
              </svg>
              <span>Project</span>
              <span className="nav-count" id="projects-nav-count">
                {projects.length}
              </span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/experiences', '/admin/pengalaman']) ? 'active' : ''}`}
              href="/admin/experiences"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4" />
              </svg>
              <span>Pengalaman</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/skills']) ? 'active' : ''}`}
              href="/admin/skills"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7z" />
              </svg>
              <span>Skills</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/technologies', '/admin/teknologi']) ? 'active' : ''}`}
              href="/admin/technologies"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
              </svg>
              <span>Teknologi</span>
            </Link>

            <p className="nav-label">Publish &amp; inbox</p>
            <Link
              className={`nav-item ${isRouteActive(['/admin/articles', '/admin/artikel']) ? 'active' : ''}`}
              href="/admin/articles"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5" />
              </svg>
              <span>Artikel</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/messages', '/admin/pesan']) ? 'active' : ''}`}
              href="/admin/messages"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 5h18v14H3zM3 7l9 7 9-7" />
              </svg>
              <span>Pesan</span>
              {unreadCount > 0 && <span className="nav-count accent" id="messages-nav-count">{unreadCount}</span>}
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/cv']) ? 'active' : ''}`}
              href="/admin/cv"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" />
              </svg>
              <span>CV</span>
            </Link>

            <Link
              className={`nav-item ${isRouteActive(['/admin/settings', '/admin/pengaturan']) ? 'active' : ''}`}
              href="/admin/settings"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z" />
              </svg>
              <span>Pengaturan</span>
            </Link>
          </nav>

          <div className="sidebar-card">
            <div className="sidebar-card-icon">↗</div>
            <div>
              <strong>Lihat portfolio</strong>
              <small>Periksa hasil perubahanmu</small>
            </div>
            <Link href="/" target="_blank" rel="noopener" aria-label="Buka portfolio di tab baru">
              Buka
            </Link>
          </div>

          <div className="sidebar-user">
            <span className="avatar avatar-sm" aria-hidden="true">
              AN
            </span>
            <span>
              <strong id="sidebar-user-name">{profile.fullName}</strong>
              <small>Administrator</small>
            </span>
            <button
              className="icon-button"
              id="logout-button"
              type="button"
              aria-label="Keluar dari admin"
              title="Keluar"
              onClick={handleLogout}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" />
              </svg>
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="sidebar-scrim" id="sidebar-scrim" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Workspace */}
        <div className="workspace">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="icon-button menu-button"
                id="menu-button"
                type="button"
                aria-label="Buka menu"
                aria-controls="sidebar"
                aria-expanded={isSidebarOpen}
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <div className="global-search-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <label className="sr-only" htmlFor="global-search">
                  Cari seluruh konten
                </label>
                <input
                  id="global-search"
                  type="search"
                  autoComplete="off"
                  placeholder="Cari project, artikel, pesan…"
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setIsSearchOpen(Boolean(e.target.value.trim()));
                  }}
                  onFocus={() => {
                    if (globalSearch.trim()) setIsSearchOpen(true);
                  }}
                />
                <kbd>⌘ K</kbd>

                {isSearchOpen && (
                  <div className="search-results" id="global-search-results" role="listbox">
                    {globalSearchResults.length > 0 ? (
                      globalSearchResults.map((res) => (
                        <button
                          key={`${res.type}-${res.id}`}
                          className="search-result"
                          type="button"
                          onClick={() => {
                            router.push(res.route);
                            setIsSearchOpen(false);
                            setGlobalSearch('');
                          }}
                        >
                          <span className="search-result-icon">
                            {res.type === 'Project' ? 'P' : res.type === 'Artikel' ? 'A' : 'M'}
                          </span>
                          <span>
                            <strong>{res.title}</strong>
                            <small>{res.subtitle}</small>
                          </span>
                          <small>{res.type}</small>
                        </button>
                      ))
                    ) : (
                      <p className="search-empty">Tidak ada hasil ditemukan</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="topbar-actions">
              <span className={`save-state ${isSaving ? 'saving' : ''}`} id="save-state" aria-live="polite">
                <span></span> {isSaving ? 'Menyimpan…' : 'Semua perubahan tersimpan'}
              </span>

              <button
                className="icon-button"
                id="theme-toggle"
                type="button"
                aria-label="Ganti tema"
                title="Ganti tema"
                onClick={toggleTheme}
              >
                <svg className="sun-icon" aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              </button>

              <button
                className="icon-button notification-button"
                id="notification-button"
                type="button"
                aria-label="Buka pesan baru"
                title="Pesan baru"
                onClick={() => router.push('/admin/messages')}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                </svg>
                {unreadCount > 0 && <span id="notification-dot" aria-hidden="true"></span>}
              </button>

              <div className="topbar-avatar avatar" aria-hidden="true">
                AN
              </div>
            </div>
          </header>

          <main id="main-content" tabIndex={-1}>
            <section id="page-content" className="page-enter" aria-live="polite">
              {children}
            </section>
          </main>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detailItem && (
        <div
          className="modal-overlay"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="modal detail-modal"
            style={{ width: 'min(720px, calc(100vw - 30px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow" id="detail-dialog-eyebrow">{detailItem.type}</p>
                <h2 id="detail-dialog-title">{detailItem.title}</h2>
              </div>
              <button
                className="icon-button modal-close"
                type="button"
                onClick={() => setDetailItem(null)}
                aria-label="Tutup dialog"
              >
                ×
              </button>
            </div>
            <div className="modal-body" id="detail-dialog-body" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px', marginBottom: '16px' }}>
                {detailItem.subtitle}
              </p>
              <div className="message-content">{detailItem.body}</div>
            </div>
            <div className="modal-footer" id="detail-dialog-footer" style={{ flexShrink: 0 }}>
              <button
                className="button button-ghost"
                type="button"
                onClick={() => setDetailItem(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="modal confirm-modal"
            id="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon" aria-hidden="true">!</div>
            <h2 id="confirm-dialog-title">Hapus data?</h2>
            <p id="confirm-dialog-message">
              Apakah Anda yakin ingin menghapus {deleteConfirm.name}? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-footer">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => setDeleteConfirm(null)}
              >
                Batal
              </button>
              <button
                className="button button-danger"
                id="confirm-delete-button"
                type="button"
                onClick={() => executeDelete()}
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST REGION */}
      {toastMessage && (
        <div className="toast-region" id="toast-region" aria-live="polite" aria-atomic="true">
          <div className="toast">
            <span className="toast-icon">✓</span>
            <span>
              <strong>Notifikasi</strong>
              <small>{toastMessage}</small>
            </span>
            <button type="button" aria-label="Tutup notifikasi" onClick={() => setToastMessage(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

