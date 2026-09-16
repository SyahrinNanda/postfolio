'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/AdminContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, projects, articles, experiences, messages, unreadCount, showToast } = useAdmin();

  const chart = [42, 57, 46, 78, 63, 88, 72];
  const chartDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const publishedProjectsCount = projects.filter((p) => p.status === 'published').length;
  const publishedArticlesCount = articles.filter((a) => a.status === 'published').length;
  const draftArticlesCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <>
      <section className="welcome-banner">
        <div>
          <h1>Selamat datang, {profile.fullName.split(' ')[0]} 👋</h1>
          <p>
            Portfolio-mu memiliki {publishedProjectsCount} project dan {publishedArticlesCount} artikel yang sudah tayang.{' '}
            {unreadCount > 0
              ? `Ada ${unreadCount} pesan baru untuk ditinjau.`
              : 'Semua pesan sudah ditinjau.'}
          </p>
        </div>
        <time className="welcome-date">
          {new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date())}
        </time>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="14" rx="2" />
                <path d="M8 6V4h8v2M3 11h18" />
              </svg>
            </span>
            <span className="stat-change">+2 bulan ini</span>
          </div>
          <strong>{projects.length}</strong>
          <span>Total project</span>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5" />
              </svg>
            </span>
            <span className="stat-change">{draftArticlesCount} draft</span>
          </div>
          <strong>{articles.length}</strong>
          <span>Total artikel</span>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4" />
              </svg>
            </span>
            <span className="stat-change">Timeline</span>
          </div>
          <strong>{experiences.length}</strong>
          <span>Pengalaman</span>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 5h18v14H3zM3 7l9 7 9-7" />
              </svg>
            </span>
            <span className="stat-change">{unreadCount} belum dibaca</span>
          </div>
          <strong>{messages.length}</strong>
          <span>Total pesan</span>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Aktivitas portfolio</h2>
              <p>Interaksi konten dalam 7 hari terakhir · data ilustratif</p>
            </div>
            <Link className="panel-link" href="/admin/projects">
              Lihat konten →
            </Link>
          </header>
          <div className="panel-body">
            <div className="activity-chart" aria-label="Grafik aktivitas tujuh hari">
              {chart.map((height, index) => (
                <div key={index} className="chart-column">
                  <div className="chart-bar-wrap">
                    <span
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${height} interaksi`}
                    ></span>
                  </div>
                  <small>{chartDays[index]}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Aksi cepat</h2>
              <p>Mulai pembaruan konten</p>
            </div>
          </header>
          <div className="panel-body">
            <div className="quick-actions">
              <button
                className="quick-action"
                type="button"
                onClick={() => router.push('/admin/projects')}
              >
                <span>+</span>
                <span>
                  <strong>Project baru</strong>
                  <small>Dokumentasikan case study</small>
                </span>
                <b>→</b>
              </button>
              <button
                className="quick-action"
                type="button"
                onClick={() => router.push('/admin/articles')}
              >
                <span>✎</span>
                <span>
                  <strong>Tulis artikel</strong>
                  <small>Mulai sebagai draft</small>
                </span>
                <b>→</b>
              </button>
              <button
                className="quick-action"
                type="button"
                onClick={() => router.push('/admin/profile')}
              >
                <span>◎</span>
                <span>
                  <strong>Perbarui profil</strong>
                  <small>Edit bio dan social link</small>
                </span>
                <b>→</b>
              </button>
              <button
                className="quick-action"
                type="button"
                onClick={() => router.push('/admin/cv')}
              >
                <span>⇧</span>
                <span>
                  <strong>Ganti CV</strong>
                  <small>Unggah versi terbaru</small>
                </span>
                <b>→</b>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-bottom">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Pesan terbaru</h2>
              <p>Dari contact form portfolio</p>
            </div>
            <Link className="panel-link" href="/admin/messages">
              Lihat semua →
            </Link>
          </header>
          <ul className="mini-list">
            {messages.slice(0, 4).map((item) => (
              <li
                key={item.id}
                className={`mini-list-item ${item.status === 'unread' ? 'unread' : ''}`}
              >
                <span className="mini-icon">{item.name.slice(0, 2).toUpperCase()}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.subject}</small>
                </span>
                <time>{item.date}</time>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>Project terbaru</h2>
              <p>Terakhir diperbarui</p>
            </div>
            <Link className="panel-link" href="/admin/projects">
              Kelola →
            </Link>
          </header>
          <ul className="mini-list">
            {projects.slice(0, 4).map((item) => (
              <li key={item.id} className="mini-list-item">
                <span className="mini-icon">{item.title.slice(0, 2).toUpperCase()}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.category} · {item.status}
                  </small>
                </span>
                <time>{item.updated}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

