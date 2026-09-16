'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PrincipleItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessItem {
  title: string;
  description: string;
}

export interface HighlightItem {
  value: string;
  label: string;
}

export interface ProfileData {
  fullName: string;
  title: string;
  shortBio: string;
  detailedBio: string;
  careerFocus: string;
  location: string;
  email: string;
  phone: string;
  photo: string;
  github: string;
  linkedin: string;
  website: string;
  availability: string;
  aboutHeadline: string;
  aboutLead: string;
  principles: PrincipleItem[];
  processes: ProcessItem[];
  highlights: HighlightItem[];
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  role: string;
  duration: string;
  status: 'published' | 'draft' | 'archived';
  thumbnail: string;
  technologies: string[];
  featured: boolean;
  updated: string;
  problem?: string;
  solution?: string;
  year?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  overline?: string;
  period?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
  technologies: string[];
  status: 'active' | 'inactive';
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  years: number;
  status: 'active' | 'inactive';
}

export interface TechnologyData {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  website: string;
  status: 'active' | 'inactive';
}

export interface ArticleData {
  id: string;
  title: string;
  slug: string;
  cover: string;
  coverColor?: string;
  coverMark?: string;
  summary: string;
  content: string;
  lead?: string;
  category: string;
  categoryLabel?: string;
  tags: string[];
  readDuration?: string;
  publishedDate: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  hasFullPage?: boolean;
  updated: string;
}

export interface MessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface CertificationItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface PreferenceItem {
  key: string;
  label: string;
  value: string;
}

export interface CvHistoryItem {
  id?: string;
  name: string;
  fileUrl?: string;
  size: number;
  updated: string;
  version: number;
}

export interface CvData {
  name: string;
  fileUrl: string;
  size: number;
  updated: string;
  version: number;
  status: string;
  badgeText: string;
  noteText: string;
  summaryHeadline: string;
  summaryText: string;
  educations: EducationItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  preferences: PreferenceItem[];
  history: CvHistoryItem[];
}

export interface CapabilityItem {
  id: string;
  index: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface HeroMetricItem {
  value: string;
  label: string;
}

export interface SettingsData {
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  githubUsername: string;
  analyticsId: string;
  emailNotifications: boolean;
  showGithub: boolean;
  showArticles: boolean;
  maintenanceMode: boolean;

  // Homepage Hero & Ticker
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPrimaryStack: string[];
  heroMetrics: HeroMetricItem[];
  tickerText: string;

  // Capabilities (Section 02)
  capabilities: CapabilityItem[];
}

export interface DetailModalData {
  title: string;
  subtitle: string;
  body: string;
  type: string;
}

export interface DeleteConfirmData {
  id: string;
  module: string;
  name: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "As'syahrin Nanda",
  title: 'Software Engineer',
  shortBio: 'Saya merancang produk digital yang cepat, terukur, dan mudah dikembangkan.',
  detailedBio:
    'Software engineer yang berfokus pada pengembangan aplikasi web end-to-end, desain sistem, dan automasi. Saya menikmati proses menerjemahkan masalah bisnis menjadi solusi teknis yang sederhana dan berdampak.',
  careerFocus: 'Product engineering & system design',
  location: 'Makassar, Indonesia',
  email: 'syahrinnanda@gmail.com',
  phone: '+62 853 4895 7997',
  photo: '/assets/foto-profile.jpeg',
  github: 'https://github.com/syahrinnanda',
  linkedin: 'https://www.linkedin.com/in/syahrin-nanda',
  website: 'https://syahrin.dev',
  availability: 'Remote / hybrid · diskusi terbuka',
  aboutHeadline: 'Engineer yang peduli pada alasannya.',
  aboutLead: 'Saya menggabungkan product thinking, desain sistem, dan eksekusi teknis untuk membuat software yang berguna—bukan sekadar selesai.',
  principles: [
    {
      number: '01 / WHY',
      title: 'Pahami masalah dahulu',
      description: 'Saya mencari konteks pengguna, constraint bisnis, dan ukuran keberhasilan sebelum memilih teknologi.',
    },
    {
      number: '02 / HOW',
      title: 'Buat sistem dapat dijelaskan',
      description: 'Arsitektur, failure mode, dan keputusan penting perlu dipahami oleh orang lain—bukan hanya penciptanya.',
    },
    {
      number: '03 / WHAT',
      title: 'Kirim dalam irisan kecil',
      description: 'Vertical slice yang bisa divalidasi memberi feedback lebih awal dan menurunkan risiko integrasi besar.',
    },
  ],
  processes: [
    {
      title: 'Discover',
      description: 'Menyelaraskan masalah, pengguna, constraint, risiko, dan indikator hasil.',
    },
    {
      title: 'Design',
      description: 'Membuat alur, kontrak, model data, dan proof-of-concept untuk ketidakpastian terbesar.',
    },
    {
      title: 'Build',
      description: 'Mengirim slice kecil dengan test, observability, dokumentasi, dan review.',
    },
    {
      title: 'Learn',
      description: 'Mengukur outcome, membaca feedback, dan mengubah keputusan ketika bukti berkata lain.',
    },
  ],
  highlights: [
    { value: '24', label: 'Catatan teknis / tahun' },
    { value: '06', label: 'Kontribusi komunitas' },
    { value: '∞', label: 'Hal yang masih ingin dipelajari' },
  ],
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Rachita Apps',
    slug: 'rachita-apps',
    shortDescription: 'Sistem aplikasi web untuk management PT Rachita setiap department.',
    fullDescription: 'Rachita Apps adalah platform ERP/HRM internal PT Rachita yang mengonsolidasikan aktivitas operasional seluruh departemen ke dalam satu dashboard tersentralisasi.',
    category: 'Fullstack',
    role: 'Lead Software Engineer',
    duration: '10 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    featured: true,
    updated: '1 hari lalu',
  },
  {
    id: 'proj-2',
    title: 'Rachita Apps Finance',
    slug: 'rachita-finance',
    shortDescription: 'Sistem aplikasi web keuangan untuk management PT Rachita khusus department keuangan.',
    fullDescription: 'Modul khusus keuangan terenkripsi yang menangani seluruh pencatatan transaksi masuk/keluar, penggajian, pembukuan bulanan, dan pelaporan keuangan internal PT Rachita.',
    category: 'Backend',
    role: 'Fullstack Engineer',
    duration: '8 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
    featured: true,
    updated: '3 hari lalu',
  },
  {
    id: 'proj-3',
    title: 'Automation Sistem N8N',
    slug: 'n8n-automation',
    shortDescription: 'Membuat automatisasi berita di setiap jam 8 pagi akan dikirimkan ke Telegram, Email, dan Spreadsheet.',
    fullDescription: 'Alur kerja otomatisasi N8N yang mengekstraksi berita terkini setiap jam 8 pagi, memfilter berita relevan, lalu mendistribusikannya ke grup Telegram, Email newsletter, dan Google Spreadsheet.',
    category: 'Automation',
    role: 'Automation Engineer',
    duration: '3 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['N8N', 'Telegram API', 'Google Sheets API'],
    featured: true,
    updated: '5 hari lalu',
  },
  {
    id: 'proj-4',
    title: 'Chick Farm App Mobile',
    slug: 'chick-farm',
    shortDescription: 'Aplikasi mobile peternakan ayam dengan AI pendeteksi penyakit lewat foto kotoran & toko pakan/alat.',
    fullDescription: 'Platform mobile peternakan ayam pintar yang memadukan model AI Computer Vision untuk mengidentifikasi penyakit unggas dari foto kotoran serta marketplace pakan & alat ternak.',
    category: 'Mobile',
    role: 'Lead Mobile & AI Engineer',
    duration: '6 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['React Native', 'Python', 'TensorFlow', 'PostgreSQL'],
    featured: true,
    updated: '12 jam lalu',
  },
  {
    id: 'proj-5',
    title: 'Simulasi Hitungan KPR Rachita',
    slug: 'kpr-simulasi',
    shortDescription: 'Kalkulator untuk menghitung simulasi perhitungan angsuran cicilan rumah subsidi KPR.',
    fullDescription: 'Aplikasi web kalkulator KPR subsidi yang membantu calon pembeli perumahan PT Rachita menghitung estimasi uang muka, suku bunga, tenor, dan rincian angsuran bulanan.',
    category: 'Web',
    role: 'Frontend Engineer',
    duration: '2 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['JavaScript', 'React', 'Chart.js'],
    featured: false,
    updated: '8 hari lalu',
  },
  {
    id: 'proj-6',
    title: 'Web 3D Tour Rachita',
    slug: 'rachita-3d',
    shortDescription: 'Web 3D tour untuk melihat lokasi dan room tour perumahan PT Rachita.',
    fullDescription: 'Platform virtual room tour 360° dan 3D interaktif yang memungkinkan calon konsumen melihat tata ruang perumahan PT Rachita secara imersif dari browser.',
    category: 'Web',
    role: '3D Web Engineer',
    duration: '5 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['Three.js', 'WebGL', 'Pannellum'],
    featured: false,
    updated: '10 hari lalu',
  },
  {
    id: 'proj-7',
    title: 'MBG Gizi Harian',
    slug: 'mbg-gizi',
    shortDescription: 'Web informasi menu makan beserta gizi harian dari MBG.',
    fullDescription: 'Web portal transparansi informasi menu makan harian beserta rincian analisis gizi program Makan Bergizi Gratis (MBG) untuk sekolah dan masyarakat.',
    category: 'Web',
    role: 'Fullstack Web Engineer',
    duration: '4 bulan',
    status: 'published',
    thumbnail: '',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    featured: false,
    updated: '12 hari lalu',
  },
];

export const DEFAULT_EXPERIENCES: ExperienceData[] = [
  {
    id: 'exp-1',
    company: 'Freelance Job',
    position: 'Freelance Software Engineer',
    startDate: '2024-01-01',
    endDate: '',
    current: true,
    description: 'Merancang dan mengembangkan aplikasi web & mobile custom (termasuk Chick Farm AI Mobile & ERP PT Rachita) untuk berbagai klien.',
    responsibilities: 'Aplikasi Mobile & Web, Integrasi AI & E-commerce, Workflow Automation',
    achievements: 'Merilis aplikasi peternakan pintar Chick Farm AI & platform ERP PT Rachita',
    technologies: ['React Native', 'React', 'Node.js', 'Python', 'PostgreSQL', 'N8N'],
    status: 'active',
  },
  {
    id: 'exp-2',
    company: 'Universitas Muslim Indonesia',
    position: 'Asisten Laboratorium Teknik Informatika',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    current: false,
    description: 'Membimbing praktikum mahasiswa, membantu dosen dalam materi pemrograman & jaringan, serta mengelola sarana laboratorium.',
    responsibilities: 'Membimbing Praktikum, Mendampingi Mahasiswa, Pengelolaan Lab Komputer',
    achievements: 'Mendampingi 100+ mahasiswa dalam praktikum laboratorium',
    technologies: ['C++', 'Java', 'Python', 'Linux', 'Networking'],
    status: 'active',
  },
  {
    id: 'exp-3',
    company: 'Bangkit Academy by Google, GoTo, Traveloka',
    position: 'Cloud Computing Student',
    startDate: '2023-08-14',
    endDate: '2023-12-31',
    current: false,
    description: 'Program MSIB studi independen bersertifikat jalur Cloud Computing. Mempelajari GCP, REST API, & deployment microservices.',
    responsibilities: 'Cloud Architecture, REST API Backend, Capstone Project',
    achievements: 'Lulus Cloud Computing Learning Path bersertifikat resmi',
    technologies: ['Google Cloud Platform', 'Node.js', 'Docker', 'REST API'],
    status: 'active',
  },
  {
    id: 'exp-4',
    company: 'Ruangguru',
    position: 'Front-end Engineering Student',
    startDate: '2023-02-16',
    endDate: '2023-06-30',
    current: false,
    description: 'Bootcamp intensif Front-end Engineering yang berfokus pada JavaScript modern, React, responsive design, & web performance.',
    responsibilities: 'Frontend Development, React Component Design, Web Accessibility',
    achievements: 'Menyelesaikan 5+ proyek web interaktif berbasis React',
    technologies: ['React', 'JavaScript modern', 'HTML5', 'CSS3', 'Git'],
    status: 'active',
  },
];

export const DEFAULT_SKILLS: SkillData[] = [
  { id: 'sk-1', name: 'System Design', category: 'Engineering', level: 90, years: 6, status: 'active' },
  { id: 'sk-2', name: 'Frontend Development', category: 'Frontend', level: 92, years: 7, status: 'active' },
  { id: 'sk-3', name: 'Backend Development', category: 'Backend', level: 88, years: 6, status: 'active' },
  { id: 'sk-4', name: 'Database Design', category: 'Database', level: 84, years: 5, status: 'active' },
  { id: 'sk-5', name: 'DevOps & CI/CD', category: 'DevOps', level: 78, years: 4, status: 'active' },
  { id: 'sk-6', name: 'Technical Leadership', category: 'Engineering', level: 82, years: 3, status: 'active' },
];

export const DEFAULT_TECHNOLOGIES: TechnologyData[] = [
  { id: 'tech-1', name: 'TypeScript', category: 'Frontend', icon: 'TS', color: '#3178c6', website: 'https://www.typescriptlang.org', status: 'active' },
  { id: 'tech-2', name: 'React', category: 'Frontend', icon: 'Re', color: '#149eca', website: 'https://react.dev', status: 'active' },
  { id: 'tech-3', name: 'Next.js', category: 'Frontend', icon: 'N', color: '#111111', website: 'https://nextjs.org', status: 'active' },
  { id: 'tech-4', name: 'Node.js', category: 'Backend', icon: 'JS', color: '#43853d', website: 'https://nodejs.org', status: 'active' },
  { id: 'tech-5', name: 'Laravel', category: 'Backend', icon: 'L', color: '#ff2d20', website: 'https://laravel.com', status: 'active' },
  { id: 'tech-6', name: 'PostgreSQL', category: 'Database', icon: 'Pg', color: '#336791', website: 'https://postgresql.org', status: 'active' },
  { id: 'tech-7', name: 'Docker', category: 'DevOps', icon: 'D', color: '#2496ed', website: 'https://docker.com', status: 'active' },
  { id: 'tech-8', name: 'Python', category: 'AI', icon: 'Py', color: '#3776ab', website: 'https://python.org', status: 'active' },
];

export const DEFAULT_ARTICLES: ArticleData[] = [
  {
    id: 'art-1',
    title: 'Merancang Idempotent API untuk Sistem Pembayaran',
    slug: 'idempotent-api-sistem-pembayaran',
    cover: '',
    summary: 'Pola praktis mencegah transaksi ganda pada distributed system.',
    content: 'Idempotency memastikan request yang sama dapat diproses berulang tanpa menghasilkan efek samping tambahan. Artikel ini membahas idempotency key, state machine, locking, dan strategi retry.',
    category: 'Software Architecture',
    tags: ['API', 'Backend', 'System Design'],
    publishedDate: '2026-03-11',
    author: "As'syahrin Nanda",
    status: 'published',
    updated: '5 hari lalu',
  },
  {
    id: 'art-2',
    title: 'Observability yang Berguna, Bukan Sekadar Ramai',
    slug: 'observability-yang-berguna',
    cover: '',
    summary: 'Cara memilih signal dan alert yang benar-benar membantu tim engineering.',
    content: 'Observability yang baik dimulai dari pertanyaan operasional yang jelas. Kita akan merancang log, metric, trace, dan alert berdasarkan user impact.',
    category: 'DevOps',
    tags: ['Observability', 'SRE'],
    publishedDate: '2026-02-27',
    author: "As'syahrin Nanda",
    status: 'published',
    updated: '17 hari lalu',
  },
  {
    id: 'art-3',
    title: 'Evaluasi RAG untuk Knowledge Base Internal',
    slug: 'evaluasi-rag-knowledge-base',
    cover: '',
    summary: 'Catatan membangun evaluation set untuk aplikasi RAG.',
    content: 'Draft pembahasan mengenai retrieval metrics, groundedness, answer relevancy, dan human evaluation.',
    category: 'AI / Machine Learning',
    tags: ['RAG', 'LLM', 'Evaluation'],
    publishedDate: '',
    author: "As'syahrin Nanda",
    status: 'draft',
    updated: '2 hari lalu',
  },
];

export const DEFAULT_MESSAGES: MessageData[] = [
  {
    id: 'msg-1',
    name: 'Dian Larasati',
    email: 'dian@talent.co',
    subject: 'Diskusi posisi Senior Software Engineer',
    message: 'Halo Syahrin, kami tertarik dengan pengalamanmu membangun platform commerce. Apakah kamu tersedia untuk berdiskusi minggu ini?',
    date: 'Baru saja',
    status: 'unread',
  },
  {
    id: 'msg-2',
    name: 'Bayu Santosa',
    email: 'bayu@karya.id',
    subject: 'Kolaborasi platform internal',
    message: 'Kami sedang merencanakan internal operations platform dan ingin berkonsultasi mengenai arsitekturnya.',
    date: '1 hari lalu',
    status: 'read',
  },
  {
    id: 'msg-3',
    name: 'Maya Putri',
    email: 'maya@startup.asia',
    subject: 'Pertanyaan tentang DocuMind',
    message: 'Apakah ada kesempatan untuk melihat demo atau berdiskusi tentang pendekatan evaluasi RAG yang digunakan?',
    date: '3 hari lalu',
    status: 'replied',
  },
  {
    id: 'msg-4',
    name: 'Kevin Wijaya',
    email: 'kevin@example.com',
    subject: 'Hello from your portfolio',
    message: 'Great work! I enjoyed reading the observability case study.',
    date: '8 hari lalu',
    status: 'archived',
  },
];

export const DEFAULT_CV: CvData = {
  name: 'Assyahrin-Nanda-Software-Engineer-CV.pdf',
  fileUrl: '/assets/syahrin-nanda-cv.pdf',
  size: 1284000,
  updated: '24 hari lalu',
  version: 4,
  status: 'published',
  badgeText: 'CV Terbaru · September 2026',
  noteText: 'Konten identitas, pengalaman, dan metrik di CV ini diperbarui secara berkala.',
  summaryHeadline: 'Software Engineer',
  summaryText:
    'Product-minded software engineer dengan 4+ tahun pengalaman membangun aplikasi web end-to-end, layanan event-driven, dan AI application. Berfokus pada sistem yang andal, dapat diamati, accessible, dan memberi outcome terukur.',
  educations: [
    {
      id: 'edu-1',
      degree: 'S1 Teknik Informatika',
      institution: 'Universitas Muslim Indonesia',
      period: '2020 — 2024',
      description: 'Gelar Sarjana Komputer (S.Kom) Teknik Informatika Universitas Muslim Indonesia.',
      status: 'active',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Bangkit Academy 2023',
      subtitle: 'Cloud Computing Path · Google, GoTo, Traveloka',
      year: '2023',
    },
    {
      id: 'cert-2',
      title: 'Ruangguru Bootcamp',
      subtitle: 'Front-end Engineering (2023)',
      year: '2023',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'Bahasa Indonesia',
      proficiency: 'Native',
    },
    {
      id: 'lang-2',
      language: 'English',
      proficiency: 'Professional working proficiency',
    },
  ],
  preferences: [
    {
      key: 'location',
      label: 'Remote / Hybrid / On-site',
      value: 'Makassar, Indonesia · UTC+8',
    },
    {
      key: 'focus',
      label: 'Fokus peran',
      value: 'Software Engineer · Fullstack & Mobile',
    },
  ],
  history: [
    {
      id: 'h-3',
      name: 'Assyahrin-Nanda-CV-v3.pdf',
      fileUrl: '/assets/syahrin-nanda-cv.pdf',
      size: 1190000,
      updated: '102 hari lalu',
      version: 3,
    },
    {
      id: 'h-2',
      name: 'Assyahrin-Nanda-CV-v2.pdf',
      fileUrl: '/assets/syahrin-nanda-cv.pdf',
      size: 1080000,
      updated: '210 hari lalu',
      version: 2,
    },
  ],
};

export const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'syahrin.dev',
  siteUrl: 'https://syahrin.dev',
  metaTitle: "As'syahrin Nanda — Software Engineer",
  metaDescription: 'Portfolio software engineer yang menampilkan project, case study, pengalaman, dan technical articles.',
  githubUsername: 'syahrinnanda',
  analyticsId: '',
  emailNotifications: true,
  showGithub: true,
  showArticles: true,
  maintenanceMode: false,

  // Homepage Hero & Ticker
  heroEyebrow: "As'syahrin Nanda · Software Engineer",
  heroTitle: 'Membangun produk digital yang berarti.',
  heroLead: 'Saya syahrin, software engineer yang mengubah masalah kompleks menjadi sistem yang sederhana, andal, dan menyenangkan untuk digunakan.',
  heroPrimaryStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  heroMetrics: [
    { value: '4+', label: 'Tahun\npengalaman' },
    { value: '18', label: 'Produk\ndiluncurkan' },
    { value: '99.9%', label: 'Best system\nuptime' },
  ],
  tickerText: 'PRODUCT ENGINEERING ✦ SYSTEM DESIGN ✦ FRONTEND ✦ BACKEND ✦ CLOUD ✦',

  // Capabilities (Section 02)
  capabilities: [
    {
      id: 'cap-1',
      index: '01',
      icon: '◫',
      title: 'Frontend Engineering',
      description: 'Interface responsif, accessible, dan terasa cepat di setiap perangkat.',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    },
    {
      id: 'cap-2',
      index: '02',
      icon: '⌘',
      title: 'Backend & API',
      description: 'Layanan terukur dengan struktur data yang solid dan observability sejak awal.',
      tags: ['Node.js', 'Laravel', 'PostgreSQL', 'Redis'],
    },
    {
      id: 'cap-3',
      index: '03',
      icon: '△',
      title: 'System & Cloud',
      description: 'Deployment repeatable, infrastruktur tangguh, dan performa yang terukur.',
      tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
    },
  ],
};

interface AdminContextType {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  saveProfile: (p: ProfileData) => void;

  projects: ProjectData[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
  saveProjects: (p: ProjectData[]) => void;
  addProject: (p: Partial<ProjectData> & { title: string; slug: string }) => Promise<boolean>;
  updateProject: (id: string, p: Partial<ProjectData>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;

  experiences: ExperienceData[];
  setExperiences: React.Dispatch<React.SetStateAction<ExperienceData[]>>;
  saveExperiences: (e: ExperienceData[]) => void;
  addExperience: (e: Partial<ExperienceData> & { company: string; position: string }) => Promise<boolean>;
  updateExperience: (id: string, e: Partial<ExperienceData>) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;

  skills: SkillData[];
  setSkills: React.Dispatch<React.SetStateAction<SkillData[]>>;
  saveSkills: (s: SkillData[]) => void;
  addSkill: (s: Partial<SkillData> & { name: string }) => Promise<boolean>;
  updateSkill: (id: string, s: Partial<SkillData>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  technologies: TechnologyData[];
  setTechnologies: React.Dispatch<React.SetStateAction<TechnologyData[]>>;
  saveTechnologies: (t: TechnologyData[]) => void;
  addTechnology: (t: Partial<TechnologyData> & { name: string }) => Promise<boolean>;
  updateTechnology: (id: string, t: Partial<TechnologyData>) => Promise<boolean>;
  deleteTechnology: (id: string) => Promise<boolean>;

  articles: ArticleData[];
  setArticles: React.Dispatch<React.SetStateAction<ArticleData[]>>;
  saveArticles: (a: ArticleData[]) => void;
  addArticle: (a: Partial<ArticleData> & { title: string; slug: string }) => Promise<boolean>;
  updateArticle: (id: string, a: Partial<ArticleData>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;

  messages: MessageData[];
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
  saveMessages: (m: MessageData[]) => void;
  addMessage: (m: { name: string; email: string; subject: string; message: string; status?: 'unread' | 'read' | 'replied' | 'archived' }) => Promise<boolean>;
  updateMessage: (id: string, m: Partial<MessageData>) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  markAllMessagesRead: () => void;
  toggleMessageStatus: (id: string) => void;

  cv: CvData;
  setCv: React.Dispatch<React.SetStateAction<CvData>>;
  saveCv: (c: CvData) => void;

  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
  saveSettings: (s: SettingsData) => void;

  isSaving: boolean;
  triggerSaveIndicator: () => void;
  showToast: (msg: string) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;

  detailItem: DetailModalData | null;
  setDetailItem: (item: DetailModalData | null) => void;

  deleteConfirm: DeleteConfirmData | null;
  setDeleteConfirm: (item: DeleteConfirmData | null) => void;
  executeDelete: () => void;
  resetAllDemoData: () => void;

  isDarkMode: boolean;
  toggleTheme: () => void;
  unreadCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<ExperienceData[]>(DEFAULT_EXPERIENCES);
  const [skills, setSkills] = useState<SkillData[]>(DEFAULT_SKILLS);
  const [technologies, setTechnologies] = useState<TechnologyData[]>(DEFAULT_TECHNOLOGIES);
  const [articles, setArticles] = useState<ArticleData[]>(DEFAULT_ARTICLES);
  const [messages, setMessages] = useState<MessageData[]>(DEFAULT_MESSAGES);
  const [cv, setCv] = useState<CvData>(DEFAULT_CV);
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<DetailModalData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadState = (key: string, defaultVal: any, setter: (val: any) => void) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          setter(JSON.parse(stored));
        } else {
          localStorage.setItem(key, JSON.stringify(defaultVal));
        }
      } catch {
        // fallback
      }
    };

    loadState('portfolio_profile', DEFAULT_PROFILE, setProfile);
    loadState('portfolio_projects', DEFAULT_PROJECTS, setProjects);
    loadState('portfolio_experiences', DEFAULT_EXPERIENCES, setExperiences);
    loadState('portfolio_skills', DEFAULT_SKILLS, setSkills);
    loadState('portfolio_technologies', DEFAULT_TECHNOLOGIES, setTechnologies);
    loadState('portfolio_articles', DEFAULT_ARTICLES, setArticles);
    loadState('portfolio_messages', DEFAULT_MESSAGES, setMessages);
    loadState('portfolio_cv', DEFAULT_CV, setCv);
    loadState('portfolio_settings', DEFAULT_SETTINGS, setSettings);

    const savedTheme = localStorage.getItem('portfolio_admin_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.setAttribute('data-theme', 'dark');
    }

    // Fetch live data from backend APIs
    const syncFromBackend = async () => {
      try {
        // 1. Profile
        fetch('/api/admin/profile')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (res?.data) {
              const p = res.data;
              const mapped: ProfileData = {
                fullName: p.fullName || DEFAULT_PROFILE.fullName,
                title: p.professionalTitle || p.title || DEFAULT_PROFILE.title,
                shortBio: p.shortBio || DEFAULT_PROFILE.shortBio,
                detailedBio: p.detailedBio || DEFAULT_PROFILE.detailedBio,
                careerFocus: p.careerFocus || DEFAULT_PROFILE.careerFocus,
                location: p.location || DEFAULT_PROFILE.location,
                email: p.email || DEFAULT_PROFILE.email,
                phone: p.phone || DEFAULT_PROFILE.phone || '',
                photo: p.profilePhoto || p.photo || DEFAULT_PROFILE.photo,
                github: p.socialLinks?.github || p.github || DEFAULT_PROFILE.github,
                linkedin: p.socialLinks?.linkedin || p.linkedin || DEFAULT_PROFILE.linkedin,
                website: p.socialLinks?.website || p.website || DEFAULT_PROFILE.website,
                availability: p.availability || DEFAULT_PROFILE.availability,
                aboutHeadline: p.aboutHeadline || DEFAULT_PROFILE.aboutHeadline,
                aboutLead: p.aboutLead || DEFAULT_PROFILE.aboutLead,
                principles: Array.isArray(p.principles) && p.principles.length > 0 ? p.principles : DEFAULT_PROFILE.principles,
                processes: Array.isArray(p.processes) && p.processes.length > 0 ? p.processes : DEFAULT_PROFILE.processes,
                highlights: Array.isArray(p.highlights) && p.highlights.length > 0 ? p.highlights : DEFAULT_PROFILE.highlights,
              };
              setProfile(mapped);
              localStorage.setItem('portfolio_profile', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 2. Projects
        fetch('/api/admin/projects')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: ProjectData[] = res.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                shortDescription: item.shortDescription || '',
                fullDescription: item.fullDescription || '',
                category: item.category || 'Fullstack',
                role: item.role || 'Software Engineer',
                duration: item.duration || '',
                status: item.status || 'published',
                thumbnail: item.thumbnail || '',
                technologies: Array.isArray(item.technologies)
                  ? item.technologies.map((t: any) => (typeof t === 'string' ? t : t.name))
                  : [],
                featured: Boolean(item.featured),
                updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID') : 'Baru saja',
                problem: item.problem || '',
                solution: item.solution || '',
                year: item.year || '2026',
                githubUrl: item.githubUrl || '',
                liveDemoUrl: item.liveDemoUrl || '',
              }));
              setProjects(mapped);
              localStorage.setItem('portfolio_projects', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 3. Experiences
        fetch('/api/admin/experiences')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: ExperienceData[] = res.data.map((item: any) => ({
                id: item.id,
                company: item.company,
                position: item.position,
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                current: Boolean(item.isCurrent),
                description: item.description || '',
                responsibilities: Array.isArray(item.responsibilities)
                  ? item.responsibilities.join('\n')
                  : item.responsibilities || '',
                achievements: Array.isArray(item.achievements)
                  ? item.achievements.join('\n')
                  : item.achievements || '',
                technologies: Array.isArray(item.technologies)
                  ? item.technologies.map((t: any) => (typeof t === 'string' ? t : t.name))
                  : [],
                status: item.status || 'active',
                overline: item.overline || '',
                period: item.period || '',
              }));
              setExperiences(mapped);
              localStorage.setItem('portfolio_experiences', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 4. Skills
        fetch('/api/admin/skills')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: SkillData[] = res.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category || 'Engineering',
                level: item.proficiency || 80,
                years: item.years || 2,
                status: item.status || 'active',
              }));
              setSkills(mapped);
              localStorage.setItem('portfolio_skills', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 5. Technologies
        fetch('/api/admin/technologies')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: TechnologyData[] = res.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category || 'General',
                icon: item.icon || 'code',
                color: item.color || '#3b82f6',
                website: item.website || '',
                status: item.status || 'active',
              }));
              setTechnologies(mapped);
              localStorage.setItem('portfolio_technologies', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 6. Messages (Contacts)
        fetch('/api/admin/contacts')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: MessageData[] = res.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                email: item.email,
                subject: item.subject || 'Pesan Baru',
                message: item.message,
                date: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
                status: item.status || 'unread',
              }));
              setMessages(mapped);
              localStorage.setItem('portfolio_messages', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 6. Articles
        fetch('/api/admin/articles?limit=100')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (Array.isArray(res?.data) && res.data.length > 0) {
              const mapped: ArticleData[] = res.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                cover: item.coverImage || '',
                coverColor: item.coverColor || '#2563eb',
                coverMark: item.coverMark || 'ARTICLE',
                summary: item.summary || '',
                content: item.content || '',
                lead: item.lead || '',
                category: item.category || 'Software Architecture',
                categoryLabel: item.categoryLabel || item.category || 'Software Architecture',
                tags: Array.isArray(item.tags)
                  ? item.tags
                  : typeof item.tags === 'string'
                  ? JSON.parse(item.tags || '[]')
                  : [],
                readDuration: item.readDuration || '5 min baca',
                publishedDate: item.publishedDate || '',
                author: item.author || "As'syahrin Nanda",
                status: item.status || 'published',
                hasFullPage: Boolean(item.hasFullPage),
                updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID') : 'Baru saja',
              }));
              setArticles(mapped);
              localStorage.setItem('portfolio_articles', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 7. Settings
        fetch('/api/admin/settings')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (res?.data && Object.keys(res.data).length > 0) {
              const s = res.data;

              let heroPrimaryStack = DEFAULT_SETTINGS.heroPrimaryStack;
              if (s.heroPrimaryStack) {
                try {
                  heroPrimaryStack = typeof s.heroPrimaryStack === 'string' ? JSON.parse(s.heroPrimaryStack) : s.heroPrimaryStack;
                } catch {}
              }

              let heroMetrics = DEFAULT_SETTINGS.heroMetrics;
              if (s.heroMetrics) {
                try {
                  heroMetrics = typeof s.heroMetrics === 'string' ? JSON.parse(s.heroMetrics) : s.heroMetrics;
                } catch {}
              }

              let capabilities = DEFAULT_SETTINGS.capabilities;
              if (s.capabilities) {
                try {
                  capabilities = typeof s.capabilities === 'string' ? JSON.parse(s.capabilities) : s.capabilities;
                } catch {}
              }

              const mapped: SettingsData = {
                siteName: s.siteName || DEFAULT_SETTINGS.siteName,
                siteUrl: s.siteUrl || DEFAULT_SETTINGS.siteUrl,
                metaTitle: s.metaTitle || DEFAULT_SETTINGS.metaTitle,
                metaDescription: s.metaDescription || DEFAULT_SETTINGS.metaDescription,
                githubUsername: s.githubUsername || DEFAULT_SETTINGS.githubUsername,
                analyticsId: s.analyticsId || '',
                emailNotifications: s.emailNotifications === 'true' || s.emailNotifications === true,
                showGithub: s.showGithub === 'true' || s.showGithub === true,
                showArticles: s.showArticles === 'true' || s.showArticles === true,
                maintenanceMode: s.maintenanceMode === 'true' || s.maintenanceMode === true,

                heroEyebrow: s.heroEyebrow || DEFAULT_SETTINGS.heroEyebrow,
                heroTitle: s.heroTitle || DEFAULT_SETTINGS.heroTitle,
                heroLead: s.heroLead || DEFAULT_SETTINGS.heroLead,
                heroPrimaryStack: Array.isArray(heroPrimaryStack) ? heroPrimaryStack : DEFAULT_SETTINGS.heroPrimaryStack,
                heroMetrics: Array.isArray(heroMetrics) ? heroMetrics : DEFAULT_SETTINGS.heroMetrics,
                tickerText: s.tickerText || DEFAULT_SETTINGS.tickerText,
                capabilities: Array.isArray(capabilities) && capabilities.length > 0 ? capabilities : DEFAULT_SETTINGS.capabilities,
              };
              setSettings(mapped);
              localStorage.setItem('portfolio_settings', JSON.stringify(mapped));
            }
          })
          .catch(() => {});

        // 8. CV Data
        fetch('/api/admin/cv')
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => {
            if (res?.data) {
              setCv(res.data);
              localStorage.setItem('portfolio_cv', JSON.stringify(res.data));
            }
          })
          .catch(() => {});
      } catch {
        // ignore background sync error
      }
    };

    syncFromBackend();
  }, []);

  const triggerSaveIndicator = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 450);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio_admin_theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('portfolio_admin_theme', 'light');
    }
    showToast(next ? 'Mode gelap aktif' : 'Mode terang aktif');
  };

  const saveProfile = async (p: ProfileData) => {
    setProfile(p);
    localStorage.setItem('portfolio_profile', JSON.stringify(p));
    triggerSaveIndicator();
    showToast('Profil berhasil diperbarui');

    // Sync to backend
    try {
      await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: p.fullName,
          professionalTitle: p.title,
          shortBio: p.shortBio,
          detailedBio: p.detailedBio,
          careerFocus: p.careerFocus,
          location: p.location,
          email: p.email,
          phone: p.phone,
          profilePhoto: p.photo,
          availability: p.availability,
          aboutHeadline: p.aboutHeadline,
          aboutLead: p.aboutLead,
          principles: p.principles,
          processes: p.processes,
          highlights: p.highlights,
          socialLinks: {
            github: p.github,
            linkedin: p.linkedin,
            website: p.website,
          },
        }),
      });
    } catch {
      // ignore
    }
  };

  const saveProjects = async (p: ProjectData[]) => {
    setProjects(p);
    localStorage.setItem('portfolio_projects', JSON.stringify(p));
    triggerSaveIndicator();
  };

  const addProject = async (p: Partial<ProjectData> & { title: string; slug: string }) => {
    try {
      const techIds = (p.technologies || [])
        .map((tName) => technologies.find((tech) => tech.name.toLowerCase() === tName.toLowerCase())?.id)
        .filter(Boolean) as string[];

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          slug: p.slug,
          category: p.category || 'Fullstack',
          role: p.role || 'Software Engineer',
          duration: p.duration || '3 bulan',
          year: p.year || '2026',
          status: p.status || 'published',
          featured: Boolean(p.featured),
          shortDescription: p.shortDescription || '',
          fullDescription: p.fullDescription || '',
          problem: p.problem || '',
          solution: p.solution || '',
          githubUrl: p.githubUrl || '',
          liveDemoUrl: p.liveDemoUrl || '',
          technologies: techIds,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan project');
      }

      const json = await res.json();
      const createdItem = json.data;

      const newProj: ProjectData = {
        id: createdItem.id,
        title: createdItem.title,
        slug: createdItem.slug,
        shortDescription: createdItem.shortDescription || '',
        fullDescription: createdItem.fullDescription || '',
        category: createdItem.category || 'Fullstack',
        role: createdItem.role || 'Software Engineer',
        duration: createdItem.duration || '',
        status: createdItem.status || 'published',
        thumbnail: createdItem.thumbnail || '',
        technologies: p.technologies || [],
        featured: Boolean(createdItem.featured),
        updated: 'Baru saja',
        problem: createdItem.problem || '',
        solution: createdItem.solution || '',
        year: createdItem.year || '2026',
        githubUrl: createdItem.githubUrl || '',
        liveDemoUrl: createdItem.liveDemoUrl || '',
      };

      const updatedList = [newProj, ...projects];
      setProjects(updatedList);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Project berhasil ditambahkan');
      return true;
    } catch (e: any) {
      showToast(`Error: ${e.message || 'Gagal menambahkan project'}`);
      return false;
    }
  };

  const updateProject = async (id: string, p: Partial<ProjectData>) => {
    try {
      const techIds = (p.technologies || [])
        .map((tName) => technologies.find((tech) => tech.name.toLowerCase() === tName.toLowerCase())?.id)
        .filter(Boolean) as string[];

      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          slug: p.slug,
          category: p.category,
          role: p.role,
          duration: p.duration,
          year: p.year,
          status: p.status,
          featured: p.featured,
          shortDescription: p.shortDescription,
          fullDescription: p.fullDescription,
          problem: p.problem,
          solution: p.solution,
          githubUrl: p.githubUrl,
          liveDemoUrl: p.liveDemoUrl,
          technologies: techIds.length > 0 ? techIds : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui project');
      }

      const updatedList = projects.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...p,
            updated: 'Baru saja',
          };
        }
        return item;
      });

      setProjects(updatedList);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Project berhasil diperbarui');
      return true;
    } catch (e: any) {
      showToast(`Error: ${e.message || 'Gagal memperbarui project'}`);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      const updatedList = projects.filter((p) => p.id !== id);
      setProjects(updatedList);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Project berhasil dihapus');
      return true;
    } catch (e: any) {
      showToast(`Error: ${e.message || 'Gagal menghapus project'}`);
      return false;
    }
  };

  const saveExperiences = async (e: ExperienceData[]) => {
    setExperiences(e);
    localStorage.setItem('portfolio_experiences', JSON.stringify(e));
    triggerSaveIndicator();
  };

  const addExperience = async (e: Partial<ExperienceData> & { company: string; position: string }) => {
    try {
      const techIds = (e.technologies || [])
        .map((tName) => technologies.find((tech) => tech.name.toLowerCase() === tName.toLowerCase())?.id)
        .filter(Boolean) as string[];

      const respList = typeof e.responsibilities === 'string'
        ? e.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)
        : (e.responsibilities || []);
      const achList = typeof e.achievements === 'string'
        ? e.achievements.split('\n').map((s) => s.trim()).filter(Boolean)
        : (e.achievements || []);

      const periodVal = e.period || (e.startDate ? `${e.startDate} — ${e.current ? 'Sekarang' : (e.endDate || 'Selesai')}` : '');

      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: e.company,
          position: e.position,
          overline: e.overline || '',
          startDate: e.startDate || new Date().toISOString().slice(0, 7),
          endDate: e.current ? null : (e.endDate || null),
          period: periodVal,
          description: e.description || '',
          responsibilities: respList,
          achievements: achList,
          isCurrent: Boolean(e.current),
          isActive: e.status !== 'inactive',
          status: e.status || 'active',
          technologies: techIds,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan pengalaman');
      }

      const json = await res.json();
      const createdItem = json.data;

      const newExp: ExperienceData = {
        id: createdItem.id,
        company: createdItem.company,
        position: createdItem.position,
        overline: createdItem.overline || e.overline || '',
        period: createdItem.period || periodVal,
        startDate: createdItem.startDate || e.startDate || '',
        endDate: createdItem.endDate || e.endDate || '',
        current: Boolean(createdItem.isCurrent),
        description: createdItem.description || '',
        responsibilities: Array.isArray(createdItem.responsibilities)
          ? createdItem.responsibilities.join('\n')
          : (typeof e.responsibilities === 'string' ? e.responsibilities : ''),
        achievements: Array.isArray(createdItem.achievements)
          ? createdItem.achievements.join('\n')
          : (typeof e.achievements === 'string' ? e.achievements : ''),
        technologies: e.technologies || [],
        status: createdItem.status || 'active',
      };

      const updatedList = [newExp, ...experiences];
      setExperiences(updatedList);
      localStorage.setItem('portfolio_experiences', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pengalaman berhasil ditambahkan');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menambahkan pengalaman'}`);
      return false;
    }
  };

  const updateExperience = async (id: string, e: Partial<ExperienceData>) => {
    try {
      const techIds = (e.technologies || [])
        .map((tName) => technologies.find((tech) => tech.name.toLowerCase() === tName.toLowerCase())?.id)
        .filter(Boolean) as string[];

      const respList = typeof e.responsibilities === 'string'
        ? e.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)
        : (e.responsibilities || []);
      const achList = typeof e.achievements === 'string'
        ? e.achievements.split('\n').map((s) => s.trim()).filter(Boolean)
        : (e.achievements || []);

      const periodVal = e.period || (e.startDate ? `${e.startDate} — ${e.current ? 'Sekarang' : (e.endDate || 'Selesai')}` : undefined);

      const res = await fetch(`/api/admin/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: e.company,
          position: e.position,
          overline: e.overline,
          startDate: e.startDate,
          endDate: e.current ? null : e.endDate,
          period: periodVal,
          description: e.description,
          responsibilities: respList,
          achievements: achList,
          isCurrent: e.current,
          isActive: e.status !== 'inactive',
          status: e.status,
          technologies: techIds.length > 0 ? techIds : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui pengalaman');
      }

      const updatedList = experiences.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...e,
            period: periodVal || item.period,
          };
        }
        return item;
      });

      setExperiences(updatedList);
      localStorage.setItem('portfolio_experiences', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pengalaman berhasil diperbarui');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal memperbarui pengalaman'}`);
      return false;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
      const updatedList = experiences.filter((e) => e.id !== id);
      setExperiences(updatedList);
      localStorage.setItem('portfolio_experiences', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pengalaman berhasil dihapus');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menghapus pengalaman'}`);
      return false;
    }
  };

  const saveSkills = async (s: SkillData[]) => {
    setSkills(s);
    localStorage.setItem('portfolio_skills', JSON.stringify(s));
    triggerSaveIndicator();
  };

  const addSkill = async (s: Partial<SkillData> & { name: string }) => {
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: s.name,
          category: s.category || 'Engineering',
          proficiency: Number(s.level ?? 80),
          years: Number(s.years ?? 1),
          status: s.status || 'active',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan skill');
      }

      const json = await res.json();
      const createdItem = json.data;

      const newSkill: SkillData = {
        id: createdItem.id,
        name: createdItem.name,
        category: createdItem.category || 'Engineering',
        level: createdItem.proficiency ?? 80,
        years: createdItem.years ?? 1,
        status: createdItem.status || 'active',
      };

      const updatedList = [...skills, newSkill];
      setSkills(updatedList);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Skill berhasil ditambahkan');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menambahkan skill'}`);
      return false;
    }
  };

  const updateSkill = async (id: string, s: Partial<SkillData>) => {
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: s.name,
          category: s.category,
          proficiency: s.level !== undefined ? Number(s.level) : undefined,
          years: s.years !== undefined ? Number(s.years) : undefined,
          status: s.status,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui skill');
      }

      const updatedList = skills.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...s,
          };
        }
        return item;
      });

      setSkills(updatedList);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Skill berhasil diperbarui');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal memperbarui skill'}`);
      return false;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      const updatedList = skills.filter((s) => s.id !== id);
      setSkills(updatedList);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Skill berhasil dihapus');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menghapus skill'}`);
      return false;
    }
  };

  const saveTechnologies = async (t: TechnologyData[]) => {
    setTechnologies(t);
    localStorage.setItem('portfolio_technologies', JSON.stringify(t));
    triggerSaveIndicator();
  };

  const addTechnology = async (t: Partial<TechnologyData> & { name: string }) => {
    try {
      const res = await fetch('/api/admin/technologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          category: t.category || 'Frontend',
          icon: t.icon || t.name.slice(0, 2).toUpperCase(),
          color: t.color || '#3b82f6',
          website: t.website ? t.website : null,
          status: t.status || 'active',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan teknologi');
      }

      const json = await res.json();
      const created = json.data;

      const newTech: TechnologyData = {
        id: created.id,
        name: created.name,
        category: created.category || 'Frontend',
        icon: created.icon || created.name.slice(0, 2).toUpperCase(),
        color: created.color || '#3b82f6',
        website: created.website || '',
        status: created.status || 'active',
      };

      const updatedList = [...technologies, newTech];
      setTechnologies(updatedList);
      localStorage.setItem('portfolio_technologies', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Teknologi berhasil ditambahkan');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menambahkan teknologi'}`);
      return false;
    }
  };

  const updateTechnology = async (id: string, t: Partial<TechnologyData>) => {
    try {
      const payload: any = {};
      if (t.name !== undefined) payload.name = t.name;
      if (t.category !== undefined) payload.category = t.category;
      if (t.icon !== undefined) payload.icon = t.icon;
      if (t.color !== undefined) payload.color = t.color;
      if (t.website !== undefined) payload.website = t.website ? t.website : null;
      if (t.status !== undefined) payload.status = t.status;

      const res = await fetch(`/api/admin/technologies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui teknologi');
      }

      const updatedList = technologies.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...t,
          };
        }
        return item;
      });

      setTechnologies(updatedList);
      localStorage.setItem('portfolio_technologies', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Teknologi berhasil diperbarui');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal memperbarui teknologi'}`);
      return false;
    }
  };

  const deleteTechnology = async (id: string) => {
    try {
      await fetch(`/api/admin/technologies/${id}`, { method: 'DELETE' });
      const updatedList = technologies.filter((t) => t.id !== id);
      setTechnologies(updatedList);
      localStorage.setItem('portfolio_technologies', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Teknologi berhasil dihapus');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menghapus teknologi'}`);
      return false;
    }
  };

  const saveArticles = async (a: ArticleData[]) => {
    setArticles(a);
    localStorage.setItem('portfolio_articles', JSON.stringify(a));
    triggerSaveIndicator();
  };

  const addArticle = async (a: Partial<ArticleData> & { title: string; slug: string }) => {
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: a.title,
          slug: a.slug,
          coverImage: a.cover || null,
          coverColor: a.coverColor || '#2563eb',
          coverMark: a.coverMark || 'ARTICLE',
          summary: a.summary || '',
          content: a.content || '',
          lead: a.lead || '',
          category: a.category || 'Software Architecture',
          categoryLabel: a.categoryLabel || a.category || 'Software Architecture',
          tags: a.tags || [],
          readDuration: a.readDuration || '5 min baca',
          publishedDate: a.publishedDate || new Date().toISOString().split('T')[0],
          author: a.author || "As'syahrin Nanda",
          status: a.status || 'published',
          hasFullPage: a.hasFullPage ?? true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan artikel');
      }

      const json = await res.json();
      const created = json.data;

      const newArt: ArticleData = {
        id: created.id,
        title: created.title,
        slug: created.slug,
        cover: created.coverImage || '',
        coverColor: created.coverColor || '#2563eb',
        coverMark: created.coverMark || 'ARTICLE',
        summary: created.summary || '',
        content: created.content || '',
        lead: created.lead || '',
        category: created.category || 'Software Architecture',
        categoryLabel: created.categoryLabel || created.category || 'Software Architecture',
        tags: Array.isArray(created.tags) ? created.tags : (a.tags || []),
        readDuration: created.readDuration || '5 min baca',
        publishedDate: created.publishedDate || '',
        author: created.author || "As'syahrin Nanda",
        status: created.status || 'published',
        hasFullPage: Boolean(created.hasFullPage),
        updated: 'Baru saja',
      };

      const updatedList = [newArt, ...articles];
      setArticles(updatedList);
      localStorage.setItem('portfolio_articles', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Artikel berhasil ditambahkan');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menambahkan artikel'}`);
      return false;
    }
  };

  const updateArticle = async (id: string, a: Partial<ArticleData>) => {
    try {
      const payload: any = {};
      if (a.title !== undefined) payload.title = a.title;
      if (a.slug !== undefined) payload.slug = a.slug;
      if (a.cover !== undefined) payload.coverImage = a.cover;
      if (a.coverColor !== undefined) payload.coverColor = a.coverColor;
      if (a.coverMark !== undefined) payload.coverMark = a.coverMark;
      if (a.summary !== undefined) payload.summary = a.summary;
      if (a.content !== undefined) payload.content = a.content;
      if (a.lead !== undefined) payload.lead = a.lead;
      if (a.category !== undefined) payload.category = a.category;
      if (a.categoryLabel !== undefined) payload.categoryLabel = a.categoryLabel;
      if (a.tags !== undefined) payload.tags = a.tags;
      if (a.readDuration !== undefined) payload.readDuration = a.readDuration;
      if (a.publishedDate !== undefined) payload.publishedDate = a.publishedDate;
      if (a.author !== undefined) payload.author = a.author;
      if (a.status !== undefined) payload.status = a.status;
      if (a.hasFullPage !== undefined) payload.hasFullPage = a.hasFullPage;

      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui artikel');
      }

      const updatedList = articles.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...a,
          };
        }
        return item;
      });

      setArticles(updatedList);
      localStorage.setItem('portfolio_articles', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Artikel berhasil diperbarui');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal memperbarui artikel'}`);
      return false;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const updatedList = articles.filter((a) => a.id !== id);
      setArticles(updatedList);
      localStorage.setItem('portfolio_articles', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Artikel berhasil dihapus');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menghapus artikel'}`);
      return false;
    }
  };

  const saveMessages = (m: MessageData[]) => {
    setMessages(m);
    localStorage.setItem('portfolio_messages', JSON.stringify(m));
    triggerSaveIndicator();
  };

  const addMessage = async (m: {
    name: string;
    email: string;
    subject: string;
    message: string;
    status?: 'unread' | 'read' | 'replied' | 'archived';
  }) => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: m.status || 'unread',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mencatat pesan');
      }

      const json = await res.json();
      const created = json.data;

      const newMsg: MessageData = {
        id: created.id,
        name: created.name,
        email: created.email,
        subject: created.subject,
        message: created.message,
        date: created.createdAt ? new Date(created.createdAt).toISOString() : new Date().toISOString(),
        status: created.status || 'unread',
      };

      const updatedList = [newMsg, ...messages];
      setMessages(updatedList);
      localStorage.setItem('portfolio_messages', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pesan berhasil dicatat');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal mencatat pesan'}`);
      return false;
    }
  };

  const updateMessage = async (id: string, m: Partial<MessageData>) => {
    try {
      const payload: any = {};
      if (m.name !== undefined) payload.name = m.name;
      if (m.email !== undefined) payload.email = m.email;
      if (m.subject !== undefined) payload.subject = m.subject;
      if (m.message !== undefined) payload.message = m.message;
      if (m.status !== undefined) payload.status = m.status;

      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui pesan');
      }

      const updatedList = messages.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...m,
          };
        }
        return item;
      });

      setMessages(updatedList);
      localStorage.setItem('portfolio_messages', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pesan berhasil diperbarui');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal memperbarui pesan'}`);
      return false;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      const updatedList = messages.filter((m) => m.id !== id);
      setMessages(updatedList);
      localStorage.setItem('portfolio_messages', JSON.stringify(updatedList));
      triggerSaveIndicator();
      showToast('Pesan berhasil dihapus');
      return true;
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Gagal menghapus pesan'}`);
      return false;
    }
  };

  const markAllMessagesRead = async () => {
    const updated = messages.map((m) => ({ ...m, status: 'read' as const }));
    saveMessages(updated);
    showToast('Semua pesan ditandai telah dibaca');

    // Sync each to backend
    for (const msg of messages) {
      if (msg.status === 'unread') {
        fetch(`/api/admin/contacts/${msg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' }),
        }).catch(() => {});
      }
    }
  };

  const toggleMessageStatus = async (id: string) => {
    let nextStatus: 'unread' | 'read' | 'replied' = 'read';
    const updated = messages.map((m) => {
      if (m.id === id) {
        nextStatus = m.status === 'unread' ? 'read' : m.status === 'read' ? 'replied' : 'read';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    saveMessages(updated);

    // Sync to backend
    fetch(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    }).catch(() => {});
  };

  const saveCv = async (c: CvData) => {
    setCv(c);
    localStorage.setItem('portfolio_cv', JSON.stringify(c));
    triggerSaveIndicator();
    showToast('Perubahan CV berhasil disimpan');

    try {
      await fetch('/api/admin/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
    } catch {
      // ignore
    }
  };

  const saveSettings = async (s: SettingsData) => {
    setSettings(s);
    localStorage.setItem('portfolio_settings', JSON.stringify(s));
    triggerSaveIndicator();
    showToast('Pengaturan situs berhasil disimpan');

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      });
    } catch {
      // ignore
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { id, module } = deleteConfirm;
    if (module === 'projects') {
      saveProjects(projects.filter((p) => p.id !== id));
      fetch(`/api/admin/projects/${id}`, { method: 'DELETE' }).catch(() => {});
    } else if (module === 'experiences') {
      deleteExperience(id);
    } else if (module === 'skills') {
      deleteSkill(id);
    } else if (module === 'technologies') {
      deleteTechnology(id);
    } else if (module === 'articles') {
      deleteArticle(id);
    } else if (module === 'messages') {
      deleteMessage(id);
    }
    setDeleteConfirm(null);
  };

  const resetAllDemoData = () => {
    localStorage.setItem('portfolio_profile', JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem('portfolio_projects', JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem('portfolio_experiences', JSON.stringify(DEFAULT_EXPERIENCES));
    localStorage.setItem('portfolio_skills', JSON.stringify(DEFAULT_SKILLS));
    localStorage.setItem('portfolio_technologies', JSON.stringify(DEFAULT_TECHNOLOGIES));
    localStorage.setItem('portfolio_articles', JSON.stringify(DEFAULT_ARTICLES));
    localStorage.setItem('portfolio_messages', JSON.stringify(DEFAULT_MESSAGES));
    localStorage.setItem('portfolio_cv', JSON.stringify(DEFAULT_CV));
    localStorage.setItem('portfolio_settings', JSON.stringify(DEFAULT_SETTINGS));

    setProfile(DEFAULT_PROFILE);
    setProjects(DEFAULT_PROJECTS);
    setExperiences(DEFAULT_EXPERIENCES);
    setSkills(DEFAULT_SKILLS);
    setTechnologies(DEFAULT_TECHNOLOGIES);
    setArticles(DEFAULT_ARTICLES);
    setMessages(DEFAULT_MESSAGES);
    setCv(DEFAULT_CV);
    setSettings(DEFAULT_SETTINGS);
    setDeleteConfirm(null);
    showToast('Seluruh data demo CMS berhasil direset');
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <AdminContext.Provider
      value={{
        profile,
        setProfile,
        saveProfile,
        projects,
        setProjects,
        saveProjects,
        addProject,
        updateProject,
        deleteProject,
        experiences,
        setExperiences,
        saveExperiences,
        addExperience,
        updateExperience,
        deleteExperience,
        skills,
        setSkills,
        saveSkills,
        addSkill,
        updateSkill,
        deleteSkill,
        technologies,
        setTechnologies,
        saveTechnologies,
        addTechnology,
        updateTechnology,
        deleteTechnology,
        articles,
        setArticles,
        saveArticles,
        addArticle,
        updateArticle,
        deleteArticle,
        messages,
        setMessages,
        saveMessages,
        addMessage,
        updateMessage,
        deleteMessage,
        markAllMessagesRead,
        toggleMessageStatus,
        cv,
        setCv,
        saveCv,
        settings,
        setSettings,
        saveSettings,
        isSaving,
        triggerSaveIndicator,
        showToast,
        toastMessage,
        setToastMessage,
        detailItem,
        setDetailItem,
        deleteConfirm,
        setDeleteConfirm,
        executeDelete,
        resetAllDemoData,
        isDarkMode,
        toggleTheme,
        unreadCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

