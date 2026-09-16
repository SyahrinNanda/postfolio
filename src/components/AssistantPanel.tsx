'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function assistantAnswer(question: string): string {
  const normalized = question.toLowerCase();
  if (normalized.includes('ai') || normalized.includes('sora') || normalized.includes('chick')) {
    return 'Project AI utama adalah Chick Farm App Mobile (deteksi penyakit unggas berbasis citra AI) & Sora Intelligence (copilot analytics dengan RAG). Buka case study untuk detailnya.';
  }
  if (normalized.includes('backend') || normalized.includes('api')) {
    return 'Fokus backend Syahrin mencakup Node.js, Go, Laravel, PostgreSQL, Redis, Kafka, desain API, dan observability. Rachita Apps Finance & Atlas Route Engine adalah contoh paling relevan.';
  }
  if (normalized.includes('cocok') || normalized.includes('project') || normalized.includes('proyek')) {
    return 'Syahrin paling cocok untuk produk web end-to-end, platform enterprise, modernisasi backend, dan fitur AI berbasis data. Kirim konteks kebutuhan lewat halaman Contact untuk pembahasan lebih spesifik.';
  }
  if (normalized.includes('pengalaman')) {
    return 'Syahrin memiliki 4+ tahun pengalaman dari frontend engineering hingga memimpin platform enterprise lintas departemen.';
  }
  return 'Saya belum punya jawaban spesifik untuk itu. Coba tanyakan tentang project AI, skill backend, pengalaman, atau kecocokan project.';
}

export default function AssistantPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; user: boolean }[]>([
    {
      text: 'Halo! Saya bisa membantu menemukan project, skill, dan pengalaman yang relevan.',
      user: false,
    },
  ]);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      launchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const addMessage = (text: string, user: boolean) => {
    setMessages((prev) => [...prev, { text, user }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    addMessage(q, true);
    setInput('');
    setTimeout(() => addMessage(assistantAnswer(q), false), 280);
  };

  const handlePrompt = (promptText: string) => {
    addMessage(promptText, true);
    setTimeout(() => addMessage(assistantAnswer(promptText), false), 280);
  };

  return (
    <>
      <button
        ref={launchRef}
        className="assistant-launch"
        id="assistant-launch"
        type="button"
        aria-controls="assistant-panel"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">✦</span> Tanya portfolio
      </button>

      <aside
        className="assistant-panel"
        id="assistant-panel"
        aria-labelledby="assistant-title"
        hidden={!open}
      >
        <header>
          <div>
            <span className="mono">AI PORTFOLIO ASSISTANT · DEMO</span>
            <h2 id="assistant-title">Tanya tentang syahrin</h2>
          </div>
          <button
            id="assistant-close"
            type="button"
            aria-label="Tutup assistant"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </header>

        <div
          className="assistant-messages"
          id="assistant-messages"
          aria-live="polite"
          ref={messagesRef}
        >
          {messages.map((msg, i) => (
            <p key={i} className={`assistant-bubble${msg.user ? ' user' : ''}`}>
              {msg.text}
            </p>
          ))}
        </div>

        <div className="assistant-prompts" aria-label="Pertanyaan cepat">
          {['Apa project AI-nya?', 'Apa skill backend-nya?', 'Apakah cocok untuk project saya?'].map(
            (prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePrompt(prompt)}
              >
                {prompt}
              </button>
            )
          )}
        </div>

        <form id="assistant-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="assistant-input">
            Pertanyaan
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            type="text"
            placeholder="Tulis pertanyaan…"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit" aria-label="Kirim pertanyaan">
            ↑
          </button>
        </form>
      </aside>
    </>
  );
}
