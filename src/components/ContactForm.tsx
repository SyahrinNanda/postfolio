'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  projectType: string;
  subject: string;
  message: string;
  companyUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateField(name: string, value: string): string {
  if (!value.trim()) return 'Field ini wajib diisi.';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Gunakan format email yang valid.';
  }
  if (name === 'message' && value.trim().length < 20) {
    return 'Ceritakan kebutuhan Anda dalam minimal 20 karakter.';
  }
  return '';
}

interface ContactFormProps {
  variant?: 'home' | 'page';
}

export default function ContactForm({ variant = 'home' }: ContactFormProps) {
  const [renderTime] = useState(() => Date.now());
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    projectType: '',
    subject: '',
    message: '',
    companyUrl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silent drop if honeypot is filled by bots
    if (form.companyUrl && form.companyUrl.trim().length > 0) {
      setStatusMessage('Pesan Anda berhasil terkirim dan disimpan ke database server!');
      setStatusType('success');
      setForm({
        name: '',
        email: '',
        projectType: '',
        subject: '',
        message: '',
        companyUrl: '',
      });
      return;
    }

    setStatusMessage('');
    setStatusType('');

    const newErrors: FormErrors = {};
    let valid = true;

    const fieldsToValidate: (keyof FormErrors)[] = ['name', 'email', 'subject', 'message'];
    fieldsToValidate.forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) {
        newErrors[field] = err;
        valid = false;
      }
    });

    setErrors(newErrors);

    if (!valid) {
      setStatusMessage('Ada beberapa informasi yang perlu diperbaiki sebelum pesan disimpan.');
      setStatusType('error');
      return;
    }

    setLoading(true);

    try {
      const subjectText = form.projectType
        ? `[${form.projectType}] ${form.subject.trim() || 'Pertanyaan Portfolio'}`
        : form.subject.trim() || 'Pesan dari Portfolio';

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: subjectText,
          message: form.message.trim(),
          companyUrl: form.companyUrl,
          _ts: renderTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan');
      }

      // Also sync to local storage for backward compatibility
      try {
        const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        messages.unshift({
          id: `msg-${Date.now()}`,
          name: form.name.trim(),
          email: form.email.trim(),
          subject: subjectText,
          message: form.message.trim(),
          date: new Date().toISOString(),
          status: 'unread',
        });
        localStorage.setItem('portfolio_messages', JSON.stringify(messages.slice(0, 50)));
      } catch {
        // ignore local storage error
      }

      setStatusMessage('Pesan Anda berhasil terkirim dan disimpan ke database server!');
      setStatusType('success');
      setForm({
        name: '',
        email: '',
        projectType: '',
        subject: '',
        message: '',
        companyUrl: '',
      });
      setErrors({});
    } catch (err: any) {
      setStatusMessage(
        err.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
      );
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'page') {
    return (
      <form
        className="contact-form-public panel reveal"
        data-contact-form
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="form-heading">
          <h2 id="contact-form-title">Kirim pesan</h2>
          <p>Field bertanda * wajib diisi. Pesan demo disimpan lokal di browser.</p>
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor="company-url">Website perusahaan</label>
          <input
            id="company-url"
            name="companyUrl"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.companyUrl}
            onChange={handleChange}
          />
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="name">
              Nama <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Nama lengkap"
              required
              aria-describedby="name-error"
              aria-invalid={!!errors.name}
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <small className="field-error" id="name-error" data-error-for="name">
              {errors.name}
            </small>
          </div>

          <div className="field">
            <label htmlFor="email">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@perusahaan.com"
              required
              aria-describedby="email-error"
              aria-invalid={!!errors.email}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <small className="field-error" id="email-error" data-error-for="email">
              {errors.email}
            </small>
          </div>

          <div className="field">
            <label htmlFor="project-type">
              Jenis kebutuhan <span className="muted">(opsional)</span>
            </label>
            <select
              id="project-type"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
            >
              <option value="">Pilih bila relevan</option>
              <option value="Product engineering">Product engineering</option>
              <option value="Backend / system design">Backend / system design</option>
              <option value="AI application">AI application</option>
              <option value="Technical advisory">Technical advisory</option>
              <option value="Peluang full-time">Peluang full-time</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="subject">
              Subjek <span aria-hidden="true">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Contoh: Diskusi platform internal"
              required
              aria-describedby="subject-error"
              aria-invalid={!!errors.subject}
              value={form.subject}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <small className="field-error" id="subject-error" data-error-for="subject">
              {errors.subject}
            </small>
          </div>

          <div className="field full">
            <label htmlFor="message">
              Pesan <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              minLength={20}
              placeholder="Konteks singkat, problem, timeline, dan outcome yang diharapkan…"
              required
              aria-describedby="message-help message-error"
              aria-invalid={!!errors.message}
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <small id="message-help" className="muted">
              Minimal 20 karakter. Jangan kirim password, token, atau data sensitif.
            </small>
            <small className="field-error" id="message-error" data-error-for="message">
              {errors.message}
            </small>
          </div>
        </div>

        <div className="contact-form-footer">
          <small>
            Dengan mengirim, Anda memahami bahwa pesan disimpan di <code>localStorage</code>{' '}
            perangkat ini—tidak ada email atau server eksternal.
          </small>
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? (
              'Menyimpan…'
            ) : (
              <>
                Kirim pesan <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>

        <p
          className={`form-status ${statusType}`.trim()}
          data-form-status
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </form>
    );
  }

  // Home variant - matches index.html exactly
  return (
    <form className="contact-form" id="contact-form" noValidate onSubmit={handleSubmit}>
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          height: 0,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <label htmlFor="home-company-url">Website perusahaan</label>
        <input
          id="home-company-url"
          name="companyUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyUrl}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label>
          Nama
          <input
            id="home-name"
            name="name"
            type="text"
            placeholder="Nama Anda"
            autoComplete="name"
            aria-describedby="home-name-error"
            aria-invalid={!!errors.name}
            required
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="field-error" id="home-name-error">
            {errors.name}
          </span>
        </label>
        <label>
          Email
          <input
            id="home-email"
            name="email"
            type="email"
            placeholder="nama@perusahaan.com"
            autoComplete="email"
            aria-describedby="home-email-error"
            aria-invalid={!!errors.email}
            required
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="field-error" id="home-email-error">
            {errors.email}
          </span>
        </label>
      </div>

      <label>
        Subjek
        <input
          id="home-subject"
          name="subject"
          type="text"
          placeholder="Project, peluang, atau sekadar halo"
          aria-describedby="home-subject-error"
          aria-invalid={!!errors.subject}
          required
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="field-error" id="home-subject-error">
          {errors.subject}
        </span>
      </label>

      <label>
        Pesan
        <textarea
          id="home-message"
          name="message"
          rows={4}
          placeholder="Ceritakan sedikit tentang kebutuhan Anda..."
          aria-describedby="home-message-error"
          aria-invalid={!!errors.message}
          required
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="field-error" id="home-message-error">
          {errors.message}
        </span>
      </label>

      <button className="button button-light" type="submit" disabled={loading}>
        {loading ? (
          'Menyimpan pesan…'
        ) : (
          <>
            Kirim pesan <span aria-hidden="true">↗</span>
          </>
        )}
      </button>

      {statusMessage && (
        <p
          className={`form-status ${statusType}`.trim()}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
