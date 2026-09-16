'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';

interface ProjectDialogData {
  type: string;
  title: string;
  summary: string;
  tags: string[];
  problem: string;
  solution: string;
  result: string;
  detail: string;
}

const projects: Record<string, ProjectDialogData> = {
  'rachita-apps': {
    type: 'ENTERPRISE · FULLSTACK',
    title: 'Rachita Apps',
    summary: 'Sistem aplikasi web untuk management PT Rachita setiap department.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    detail: '/projects/rachita-apps',
    problem: 'Setiap department menggunakan spreadsheet terpisah sehingga alur kerja, pengelolaan aset, dan laporan eksekutif lambat serta rawan redundansi.',
    solution: 'Membangun platform terpadu dengan sistem RBAC tersentralisasi, alur approval otomatis, dan dashboard operasional real-time.',
    result: 'Efisiensi alur kerja naik 65%, 8 department terintegrasi penuh, dan transparansi audit operasional 100%.',
  },
  'rachita-finance': {
    type: 'FINTECH · ENTERPRISE',
    title: 'Rachita Apps Finance',
    summary: 'Sistem aplikasi web keuangan untuk management PT Rachita khusus department keuangan.',
    tags: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
    detail: '/projects/rachita-finance',
    problem: 'Pencatatan keuangan dan rekonsiliasi tagihan vendor manual memakan waktu lama serta berisiko selisih angka saat penutupan buku bulanan.',
    solution: 'Mengembangkan ledger keuangan digital terenkripsi dengan double-entry bookkeeping, approval bertingkat, dan laporan keuangan otomatis.',
    result: 'Waktu closing bulanan turun 50%, tingkat kesalahan ledger 0%, dan visibilitas arus kas 100% real-time.',
  },
  'n8n-automation': {
    type: 'AUTOMATION · WORKFLOW',
    title: 'Automation Sistem N8N',
    summary: 'Membuat automatisasi berita di setiap jam 8 pagi akan dikirimkan ke Telegram, Email, dan Spreadsheet.',
    tags: ['N8N Workflow', 'Node.js', 'Telegram API', 'Google Sheets API'],
    detail: '/projects/n8n-automation',
    problem: 'Pencarian dan distribusi berita harian secara manual setiap pagi memuat waktu kerja staf hingga 1.5 jam setiap hari.',
    solution: 'Merancang workflow N8N otomatis dengan trigger cron jam 08:00 AM, ekstraksi berita, deduplikasi hash, dan pengiriman multi-channel.',
    result: 'Otomatisasi pengiriman berita pagi 100%, menghemat 1.5 jam kerja manual/hari, dan 0 insiden berita duplikat.',
  },
  'kpr-simulasi': {
    type: 'TOOLS · WEB APP',
    title: 'Simulasi Hitungan KPR Rachita',
    summary: 'Kalkulator untuk menghitung simulasi perhitungan angsuran cicilan rumah subsidi KPR.',
    tags: ['JavaScript', 'React', 'Chart.js', 'jsPDF'],
    detail: '/projects/kpr-simulasi',
    problem: 'Calon pembeli rumah kesulitan menghitung estimasi angsuran bulanan KPR subsidi, menyebabkan keraguan saat pengajuan hunian.',
    solution: 'Membangun kalkulator web interaktif dengan formula anuitas akurat, visualisasi grafik cicilan, dan fitur cetak/export PDF.',
    result: 'Peningkatan inquiry calon pembeli hingga 300%, waktu kalkulasi < 100ms, dan akurasi angsuran 100%.',
  },
  'rachita-3d': {
    type: '3D GRAPHICS · WEB APP',
    title: 'Web 3D Tour Rachita',
    summary: 'Web 3D tour untuk melihat lokasi dan room tour perumahan PT Rachita.',
    tags: ['Three.js', 'WebGL', 'Pannellum', 'JavaScript'],
    detail: '/projects/rachita-3d',
    problem: 'Calon pembeli dari luar kota tidak dapat meninjau fisik hunian secara langsung sebelum mengambil keputusan pembelian.',
    solution: 'Membuat platform virtual room tour 360° dan 3D siteplan interaktif berbasis WebGL dengan progressive asset loading.',
    result: 'Navigasi 60 FPS di smartphone mobile, peningkatan 45% kunjungan pembeli luar kota, dan muat awal < 2 detik.',
  },
  'mbg-gizi': {
    type: 'HEALTH · PUBLIC WEB APP',
    title: 'MBG Gizi Harian',
    summary: 'Web informasi menu makan beserta gizi harian dari MBG.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    detail: '/projects/mbg-gizi',
    problem: 'Kebutuhan akan transparansi informasi publik mengenai jadwal menu makanan dan kandungan gizi harian program MBG.',
    solution: 'Mengembangkan portal informasi publik yang cepat, accessible, ramah mobile, dengan breakdown nutrisi dan kalender menu mingguan.',
    result: 'Skor Lighthouse 98%, 50.000+ pengunjung harian, dan transparansi data gizi harian 100%.',
  },
  'chick-farm': {
    type: 'MOBILE APP · AI & E-COMMERCE',
    title: 'Chick Farm App Mobile',
    summary: 'Aplikasi mobile peternakan ayam dengan AI pendeteksi penyakit unggas lewat foto kotoran & toko pakan/alat ternak.',
    tags: ['React Native', 'Python', 'TensorFlow', 'Node.js', 'PostgreSQL'],
    detail: '/projects/chick-farm',
    problem: 'Peternak ayam sering terlambat mengidentifikasi penyakit unggas menular dan kesulitan memperoleh pasokan pakan/alat ternak berkualitas.',
    solution: 'Mengembangkan aplikasi mobile terintegrasi AI Computer Vision untuk mendeteksi penyakit via foto kotoran serta toko pakan dan alat peternakan.',
    result: 'Akurasi AI 92%, waktu diagnosa < 3 detik, dan 40% mempercepat pasokan pakan peternak.',
  },
};

interface ProjectDialogProps {
  projectId: string | null;
  onClose: () => void;
}

export function ProjectDialog({ projectId, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const project = projectId ? projects[projectId] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (projectId && project) {
      dialog.showModal();
      document.body.classList.add('modal-open');
    } else {
      dialog.close();
      document.body.classList.remove('modal-open');
    }
  }, [projectId, project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.body.classList.remove('modal-open');
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      id="project-dialog"
      aria-labelledby="dialog-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
    >
      <button
        className="dialog-close"
        type="button"
        aria-label="Tutup case study"
        onClick={() => dialogRef.current?.close()}
      >
        ×
      </button>

      <div className="dialog-hero">
        <div className="project-type mono" id="dialog-type">
          {project.type}
        </div>
        <h2 id="dialog-title">{project.title}</h2>
        <p id="dialog-summary">{project.summary}</p>
        <div className="tag-list" id="dialog-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="case-grid">
        <section>
          <span className="case-label mono">01 / PROBLEM</span>
          <h3>Masalah yang diselesaikan</h3>
          <p id="dialog-problem">{project.problem}</p>
        </section>

        <section>
          <span className="case-label mono">02 / SOLUTION</span>
          <h3>Pendekatan engineering</h3>
          <p id="dialog-solution">{project.solution}</p>
        </section>

        <section className="architecture">
          <span className="case-label mono">03 / ARCHITECTURE</span>
          <h3>Arsitektur sistem</h3>
          <div className="arch-flow">
            <span>Client</span>
            <i>→</i>
            <span>API Gateway</span>
            <i>→</i>
            <span>Services</span>
            <i>→</i>
            <span>Data</span>
          </div>
        </section>

        <section>
          <span className="case-label mono">04 / IMPACT</span>
          <h3>Hasil yang terukur</h3>
          <p id="dialog-result">{project.result}</p>
        </section>
      </div>

      <div className="dialog-actions">
        <Link className="button button-primary" id="dialog-detail-link" href={project.detail}>
          Buka case study lengkap →
        </Link>
        <span className="button button-disabled" aria-disabled="true">
          Repository private
        </span>
      </div>
    </dialog>
  );
}

interface OpenProjectButtonProps {
  projectId: string;
  onOpen: (id: string) => void;
}

export function OpenProjectButton({ projectId, onOpen }: OpenProjectButtonProps) {
  return (
    <button
      className="text-link open-project"
      type="button"
      onClick={() => onOpen(projectId)}
    >
      Ringkasan <span>↗</span>
    </button>
  );
}
