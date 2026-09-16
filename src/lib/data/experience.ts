export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  overline: string;
  period: string;
  dateDisplay?: {
    start: string;
    end: string;
  };
  datetime: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface EducationEntry {
  period: string;
  title: string;
  institution: string;
  description: string;
}

export interface CareerStat {
  value: string;
  label: string;
}

export const careerStats: CareerStat[] = [
  { value: '4+', label: 'Tahun pengalaman profesional' },
  { value: '18', label: 'Produk dan major feature dirilis' },
  { value: '5', label: 'Engineer pernah dibimbing' },
  { value: '99.9%', label: 'Uptime terbaik · data demo' },
];

export const experienceList: ExperienceEntry[] = [
  {
    id: 'freelance',
    title: 'Freelance Software Engineer',
    company: 'Custom Software & Client Projects',
    overline: 'Freelance Job · Remote / Project-based',
    period: '2024 — Sekarang',
    dateDisplay: {
      start: '2024',
      end: '— Sekarang',
    },
    datetime: '2024-01',
    isCurrent: true,
    description: 'Merancang dan mengembangkan aplikasi web & mobile custom (termasuk Chick Farm AI Mobile, platform ERP PT Rachita, & otomatisasi N8N) untuk berbagai bisnis dan klien.',
    responsibilities: [
      'Arsitektur aplikasi mobile & web end-to-end.',
      'Integrasi AI Computer Vision & E-commerce.',
      'Pengembangan backend REST API & workflow automation.',
    ],
    achievements: [
      'Merilis aplikasi peternakan pintar Chick Farm AI Mobile.',
      'Mengonsolidasikan 8 departemen PT Rachita dalam 1 ERP.',
      'Otomatisasi 100% distribusi berita harian via N8N.',
    ],
    technologies: ['React Native', 'React', 'Node.js', 'Python', 'PostgreSQL', 'N8N'],
  },
  {
    id: 'lab-assistant',
    title: 'Asisten Laboratorium Teknik Informatika',
    company: 'Laboratorium Komputer UMI',
    overline: 'Universitas Muslim Indonesia · Makassar',
    period: 'Jan 2023 — Des 2024',
    dateDisplay: {
      start: 'Jan 2023',
      end: '— Des 2024',
    },
    datetime: '2023-01',
    isCurrent: false,
    description: 'Membimbing praktikum mahasiswa, membantu dosen dalam penyampaian materi pemrograman & jaringan, serta mengelola sarana laboratorium komputer.',
    responsibilities: [
      'Mendampingi mahasiswa dalam sesi praktikum lab.',
      'Membantu koreksi tugas & pemahaman modul praktikum.',
      'Pemeliharaan perangkat keras & jaringan laboratorium.',
    ],
    achievements: [
      'Membimbing 100+ mahasiswa Teknik Informatika UMI.',
      'Mengisi modul praktikum pemrograman dasar & lanjut.',
      'Kelancaran operasional lab komputer selama 4 semester.',
    ],
    technologies: ['C++', 'Java', 'Python', 'Linux', 'Networking'],
  },
  {
    id: 'bangkit',
    title: 'Cloud Computing Student',
    company: 'MSIB Certified Program',
    overline: 'Bangkit Academy by Google, GoTo, Traveloka · Remote',
    period: '14 Agu 2023 — 31 Des 2023',
    dateDisplay: {
      start: '14 Agu 2023',
      end: '— 31 Des 2023',
    },
    datetime: '2023-08',
    isCurrent: false,
    description: 'Mengikuti program studi independen bersertifikat jalur Cloud Computing, mempelajari arsitektur cloud, backend REST API, & deployment GCP.',
    responsibilities: [
      'Mengembangkan REST API & microservices.',
      'Deployment aplikasi ke Google Cloud Platform (GCP).',
      'Kolaborasi lintas disiplin dalam Capstone Project.',
    ],
    achievements: [
      'Lulus Cloud Computing Learning Path bersertifikat resmi.',
      'Berhasil mendepoy backend capstone project ke Cloud Run.',
      'Skor pemahaman materi & soft skills memuaskan.',
    ],
    technologies: ['GCP', 'Node.js', 'Docker', 'REST API', 'Cloud Run'],
  },
  {
    id: 'ruangguru',
    title: 'Front-end Engineering Student',
    company: 'Ruangguru Bootcamp',
    overline: 'Ruangguru · Remote',
    period: '16 Feb 2023 — 30 Jun 2023',
    dateDisplay: {
      start: '16 Feb 2023',
      end: '— 30 Jun 2023',
    },
    datetime: '2023-02',
    isCurrent: false,
    description: 'Bootcamp intensif Front-end Engineering yang berfokus pada JavaScript modern, React.js, responsive web design, & web performance optimization.',
    responsibilities: [
      'Membangun SPA responsif dengan React.js.',
      'Penerapan clean code, state management, & Git workflow.',
      'Web accessibility (WCAG) & performance tuning.',
    ],
    achievements: [
      'Menyelesaikan 5+ proyek web interaktif berbasis React.',
      'Predikat kelulusan dengan proyek akhir bernilai tinggi.',
    ],
    technologies: ['React', 'JavaScriptModern', 'HTML5', 'CSS3', 'Git'],
  },
];

export const educationList: EducationEntry[] = [
  {
    period: '2020—2024',
    title: 'S1 Teknik Informatika',
    institution: 'Universitas Muslim Indonesia',
    description: 'Universitas Muslim Indonesia · Gelar Sarjana Komputer (S.Kom) Teknik Informatika.',
  },
  {
    period: '2023',
    title: 'Bangkit Academy (Google, GoTo, Traveloka)',
    institution: 'Cloud Computing Learning Path',
    description: 'Cloud Computing Learning Path · Google Cloud Platform, Node.js, & Cloud Architecture.',
  },
  {
    period: '2023',
    title: 'Ruangguru Bootcamp',
    institution: 'Front-end Engineering Bootcamp',
    description: 'Front-end Engineering Bootcamp (16 Feb - 30 Jun 2023) · Modern React, Web Performance, & Accessibility.',
  },
];
