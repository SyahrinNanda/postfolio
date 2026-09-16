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
