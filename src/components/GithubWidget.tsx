'use client';

import { useState, useEffect } from 'react';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const fallbackRepos: Repo[] = [
  {
    name: 'ledger-lab',
    description: 'Eksperimen idempotent ledger dan reconciliation rules. Repository demo.',
    html_url: 'https://github.com/syahrinnanda/ledger-lab',
    language: 'TypeScript',
    stargazers_count: 128,
    forks_count: 18,
    updated_at: '8 Agu 2026',
  },
  {
    name: 'route-playground',
    description: 'Visualisasi constraint untuk vehicle routing. Repository demo.',
    html_url: 'https://github.com/syahrinnanda/route-playground',
    language: 'Go',
    stargazers_count: 74,
    forks_count: 9,
    updated_at: '2 Agu 2026',
  },
  {
    name: 'rag-eval-kit',
    description: 'Dataset runner untuk evaluasi grounded answer. Repository demo.',
    html_url: 'https://github.com/syahrinnanda/rag-eval-kit',
    language: 'Python',
    stargazers_count: 93,
    forks_count: 12,
    updated_at: '27 Jul 2026',
  },
];

function formatRelativeDate(value: string | number | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'baru diperbarui';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function GithubWidget() {
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos);
  const [status, setStatus] = useState(
    'Data repository di bawah adalah demo tersimpan. Widget akan mencoba memuat akun contoh GitHub tanpa token.'
  );
  const user = 'syahrinnanda';

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    async function fetchRepos() {
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=6`, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`GitHub response ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Repo[] = data.slice(0, 3).map((r: any) => ({
            name: r.name,
            description: r.description || 'Repository publik tanpa deskripsi.',
            html_url: r.html_url,
            language: r.language || 'Other',
            stargazers_count: r.stargazers_count || 0,
            forks_count: r.forks_count || 0,
            updated_at: formatRelativeDate(r.updated_at),
          }));
          setRepos(mapped);
          setStatus(`GitHub terhubung · menampilkan ${mapped.length} repository terbaru dari akun contoh @${user}.`);
        }
      } catch (_error) {
        setStatus('GitHub sedang tidak dapat dijangkau. Data demo tersimpan tetap ditampilkan tanpa mengganggu halaman.');
      } finally {
        clearTimeout(timeout);
      }
    }

    fetchRepos();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [user]);

  return (
    <section className="public-section public-shell" aria-labelledby="github-title">
      <div className="github-panel panel reveal visible" data-github-widget data-github-user={user}>
        <div className="github-head">
          <div>
            <span className="overline">GitHub activity · akun placeholder</span>
            <h3 id="github-title">Open work, visible practice.</h3>
          </div>
          <p className="github-status" data-github-status role="status">
            {status}
          </p>
        </div>
        <div className="github-repos" data-github-repos>
          {repos.map((repo) => (
            <a key={repo.name} className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer">
              <h4>{repo.name}</h4>
              <p>{repo.description}</p>
              <div className="repo-meta">
                <span>
                  <i className="language-dot" aria-hidden="true"></i>
                  {repo.language}
                </span>
                <span>★ {repo.stargazers_count}</span>
                <span>⑂ {repo.forks_count}</span>
                <span>{repo.updated_at}</span>
              </div>
            </a>
          ))}
        </div>
        <div
          className="contribution-strip"
          aria-label="Visualisasi kontribusi GitHub contoh"
          aria-description="Aktivitas kontribusi demonstrasi, bukan data aktual"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <i key={i}></i>
          ))}
        </div>
        <p className="note">
          <strong>Graceful fallback:</strong> bila GitHub API lambat, rate-limited, kosong, atau gagal, halaman tetap
          mempertahankan konten demo dan memberi status yang jelas.
        </p>
      </div>
    </section>
  );
}

