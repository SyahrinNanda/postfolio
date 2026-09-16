'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BodyStyler from '@/components/BodyStyler';

import { authClient } from '@/lib/auth-client';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error';
}

export default function AdminLoginPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4300);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleForgotPassword = () => {
    showToast(
      'Lupa Password',
      'Silakan hubungi administrator sistem atau periksa konfigurasi akun server.',
      'error'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    const passwordValid = password.length >= 6;

    setEmailError(emailValid ? '' : 'Masukkan format email yang valid.');
    setPasswordError(passwordValid ? '' : 'Password minimal 6 karakter.');

    if (!emailValid || !passwordValid) {
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      // Authenticate directly with Better Auth
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password: password,
      });

      if (result.error) {
        setFormError(result.error.message || 'Email atau password tidak sesuai.');
        setIsLoading(false);
        return;
      }

      const session = JSON.stringify({
        user: result.data?.user?.name || 'Admin',
        email: cleanEmail,
        id: result.data?.user?.id,
        createdAt: new Date().toISOString(),
      });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('portfolio_admin_session', session);

      showToast('Berhasil Masuk', 'Membuka dashboard...');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 350);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BodyStyler classes={['login-page']} />
      <a className="skip-link" href="#login-card">
        Lewati ke form masuk
      </a>

      <main className="login-layout">
        <section className="login-showcase" aria-labelledby="showcase-title">
          <Link
            className="brand brand-light"
            href="/"
            aria-label="Kembali ke portfolio Syahrin.dev"
          >
            <span className="brand-mark">AN</span>
            <span>
              <strong>Syahrin.dev</strong>
              <small>Engineering portfolio</small>
            </span>
          </Link>

          <div className="showcase-copy">
            <p className="eyebrow light">Content workspace</p>
            <h1 id="showcase-title">Kelola cerita di balik setiap baris kode.</h1>
            <p>
              Perbarui project, case study, pengalaman, artikel, dan pesan portfolio dari satu
              tempat yang rapi.
            </p>
            <div className="showcase-points" aria-label="Fitur admin">
              <span>
                <b>01</b> Project &amp; case study
              </span>
              <span>
                <b>02</b> Article publishing
              </span>
              <span>
                <b>03</b> Contact inbox
              </span>
            </div>
          </div>

          <div className="showcase-terminal" aria-hidden="true">
            <div>
              <i></i>
              <i></i>
              <i></i>
              <span>portfolio.deploy</span>
            </div>
            <pre>
              <em>$</em> content validate{'\n'}
              <strong>✓</strong> 8 projects ready{'\n'}
              <strong>✓</strong> profile synchronized{'\n'}
              <strong>✓</strong> portfolio is healthy
              <span className="terminal-cursor">_</span>
            </pre>
          </div>

          <p className="login-copyright">© {currentYear} As&apos;syahrin Nanda</p>
        </section>

        <section className="login-panel">
          <div className="login-card" id="login-card">
            <div className="mobile-login-brand">
              <span className="brand-mark">AN</span>
              <strong>Syahrin.dev</strong>
            </div>

            <p className="eyebrow">Admin portal</p>
            <h2>Selamat datang kembali</h2>
            <p className="login-intro">Masuk untuk mengelola konten portfolio.</p>

            <form id="login-form" noValidate onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <div className="input-with-icon">
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M3 5h18v14H3zM3 7l9 7 9-7" />
                  </svg>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="email-error"
                    aria-invalid={emailError ? 'true' : 'false'}
                    placeholder="Masukkan email Anda"
                  />
                </div>
                <span className="field-error" id="email-error">
                  {emailError}
                </span>
              </div>

              <div className="field">
                <div className="label-row">
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    className="text-button"
                    id="forgot-password"
                    onClick={handleForgotPassword}
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="input-with-icon">
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    aria-describedby="password-error"
                    aria-invalid={passwordError ? 'true' : 'false'}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    className="password-toggle"
                    id="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <span className="field-error" id="password-error">
                  {passwordError}
                </span>
              </div>

              <label className="check-field">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat sesi login di perangkat ini</span>
              </label>

              {formError && (
                <p className="login-form-error" id="login-form-error" role="alert">
                  {formError}
                </p>
              )}

              <button
                className={`button button-primary login-submit ${isLoading ? 'loading' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                <span>Masuk ke dashboard</span>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </form>

            <p className="back-to-site">
              <Link href="/">← Kembali ke portfolio</Link>
            </p>
          </div>
        </section>
      </main>

      <div className="toast-region" id="toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">{toast.type === 'error' ? '!' : '✓'}</span>
            <span>
              <strong>{toast.title}</strong>
              <small>{toast.message}</small>
            </span>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

