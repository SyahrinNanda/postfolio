# 🌐 Portfolio & Content Management System (CMS)

Aplikasi Web Portofolio Software Engineer modern yang dilengkapi dengan panel **Admin CMS (Content Management System)** terintegrasi untuk mengelola seluruh konten secara dinamis tanpa perlu mengubah source code secara langsung.

Dibangun dengan teknologi terkini: **Next.js 16 (App Router & Turbopack)**, **React 19**, **TypeScript**, **Drizzle ORM**, **SQLite**, dan **Better-Auth**.

---

## 📑 Daftar Isi
- [Fitur Utama](#-fitur-utama)
  - [Halaman Portofolio (Frontend)](#1-halaman-portofolio-frontend)
  - [Panel Admin CMS (Backend)](#2-panel-admin-cms-backend)
- [Teknologi yang Digunakan (Tech Stack)](#-teknologi-yang-digunakan-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
  - [Rute Publik & Admin](#rute-publik--admin)
  - [Struktur Direktori](#struktur-direktori)
- [Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
  - [1. Prasyarat](#1-prasyarat)
  - [2. Clone & Instalasi Dependensi](#2-clone--instalasi-dependensi)
  - [3. Konfigurasi Environment Variables](#3-konfigurasi-environment-variables)
  - [4. Setup Database & Seeding](#4-setup-database--seeding)
  - [5. Menjalankan Aplikasi](#5-menjalankan-aplikasi)
- [Skrip yang Tersedia (NPM Scripts)](#-skrip-yang-tersedia-npm-scripts)
- [Konfigurasi Lingkungan (.env)](#-konfigurasi-lingkungan-env)
- [Panduan Akun Admin & Keamanan](#-panduan-akun-admin--keamanan)

---

## 🚀 Fitur Utama

### 1. Halaman Portofolio (Frontend)
- **Desain Modern & Responsif**: Tema gelap (dark-mode) futuristik dengan efek glassmorphism, ambient lighting, dan adaptif di perangkat Mobile, Tablet, maupun Desktop.
- **Dynamic Favicon**: Favicon berlogo **AN** berwarna kuning khas untuk halaman publik portofolio.
- **Beranda (Home)**:
  - Hero section interaktif dengan deskripsi keahlian dan status ketersediaan kerja.
  - Ringkasan metrik statistik (tahun pengalaman, proyek selesai, kontribusi GitHub, dll).
  - Proyek unggulan dengan dialog detail modal (interactive case preview).
- **Tentang Saya (/about)**:
  - Profil profesional, latar belakang pendidikan, nilai-nilai engineering, dan foto profil dinamis.
- **Proyek & Studi Kasus (/projects & /projects/[id])**:
  - Filter proyek berdasarkan kategori teknis (Web, Mobile, Backend, AI/Automation).
  - Halaman detail studi kasus lengkap: latar belakang masalah, arsitektur teknis, diagram alur, keputusan teknis (engineering decisions), tantangan, serta tautan repositori GitHub dan live demo.
- **Pengalaman Kerja (/experience)**:
  - Timeline interaktif riwayat karir dan pendidikan beserta pencapaian terukur.
- **Kemampuan & Teknologi (/skills)**:
  - Matriks skill teknis (Languages, Frameworks, Cloud, Databases, Tools) lengkap dengan level keahlian.
- **Artikel / Blog Teknis (/articles & /articles/[id])**:
  - Publikasi artikel teknis dengan estimasi waktu baca, filter topik, pencarian kata kunci, serta interaksi like dan copy link artikel.
- **Kontak (/contact)**:
  - Formulir pengiriman pesan langsung terhubung ke database admin dengan validasi input.
- **Curriculum Vitae (/cv)**:
  - Tampilan ringkasan CV profesional dan tombol unduh file CV format PDF.

### 2. Panel Admin CMS (Backend)
- **Autentikasi Real Admin**: Sistem autentikasi aman berbasis sesi menggunakan **Better-Auth** dengan login email dan kata sandi manual (tanpa mode demo/bypass).
- **Dynamic Favicon Admin**: Otomatis berganti ke favicon berlogo **AN** berwarna hijau saat berada di area admin.
- **Full CRUD Management**:
  - **Manajemen Proyek** (`/admin/projects` / `/admin/project`): Tambah, ubah, hapus proyek, atur tautan demo/repo, teknologi, dan arsitektur.
  - **Manajemen Pengalaman** (`/admin/experiences` / `/admin/pengalaman`): Kelola riwayat pekerjaan, posisi, tanggal, dan deskripsi pencapaian.
  - **Manajemen Keterampilan** (`/admin/skills`): Kelola level skill dan kategori keahlian.
  - **Manajemen Teknologi** (`/admin/technologies` / `/admin/teknologi`): Kelola daftar teknologi stack dan icon.
  - **Manajemen Artikel** (`/admin/articles` / `/admin/artikel`): Publikasi, sunting isi artikel, status draf/terbit, dan tags.
  - **Manajemen Pesan** (`/admin/messages` / `/admin/pesan`): Lihat pesan masuk dari formulir kontak, status dibaca, dan penghapusan pesan.
  - **Manajemen Profil & Pengaturan Web** (`/admin/profile`, `/admin/settings` / `/admin/pengaturan`): Atur bio, judul hero, kontak sosial (GitHub, LinkedIn, Email), status ketersediaan kerja, dan pengaturan SEO.
  - **Manajemen CV** (`/admin/cv`): Kelola konten data CV dan unggah dokumen PDF baru.
- **Responsif & User-Friendly**:
  - Dilengkapi navigasi mobile drawer yang mudah diakses di smartphone dan tablet.
  - Modal form terintegrasi menggunakan sistem Portal khusus anti-clipping layar dan anti-tumpang tindih dengan navbar.

---

## 🛠 Teknologi yang Digunakan (Tech Stack)

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) dengan Turbopack |
| **Library UI** | [React 19](https://react.dev/) & [React DOM 19](https://react.dev/) |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | Modern Vanilla CSS, Glassmorphism, CSS Variables, Flexbox & Grid |
| **Database** | [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| **ORM & Migrations** | [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit |
| **Autentikasi** | [Better-Auth](https://better-auth.com/) |
| **Validasi Skema** | [Zod](https://zod.dev/) |
| **Runtime Script** | [tsx](https://github.com/privatenumber/tsx) |

---

## 📁 Struktur Proyek

### Rute Publik & Admin

| Rute Publik | Rute Admin (Bahasa Inggris & Alias Indonesia) | Deskripsi |
| :--- | :--- | :--- |
| `/` | `/admin` atau `/admin/dashboard` | Beranda / Dashboard Admin |
| `/about` | `/admin/profile` atau `/admin/profil` | Halaman Profil Pengembang |
| `/projects` | `/admin/projects` atau `/admin/project` | Kelola Proyek & Case Study |
| `/experience` | `/admin/experiences` atau `/admin/pengalaman` | Kelola Riwayat Pekerjaan |
| `/skills` | `/admin/skills` & `/admin/teknologi` | Kelola Skill & Teknologi |
| `/articles` | `/admin/articles` atau `/admin/artikel` | Kelola Publikasi Artikel |
| `/contact` | `/admin/messages` atau `/admin/pesan` | Kotak Masuk Pesan Kontak |
| `/cv` | `/admin/cv` | Kelola Data & File CV |
| — | `/admin/settings` atau `/admin/pengaturan` | Pengaturan Situs Global |
| — | `/admin/login` | Halaman Masuk Autentikasi Admin |

### Struktur Direktori

```plaintext
portofolio-nextjs/
├── public/                     # Aset publik statis
│   ├── assets/                 # Foto profil, dokumen CV PDF, asset SVG
│   ├── favicon.svg             # Favicon portofolio utama (kuning AN)
│   ├── favicon-admin.svg       # Favicon admin panel (hijau AN)
│   ├── manifest.webmanifest    # Web manifest PWA
│   ├── robots.txt              # Konfigurasi perayap search engine
│   └── sitemap.xml             # Peta situs SEO
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Rute publik (about, projects, contact, dll.)
│   │   ├── admin/              # Rute panel admin & dashboard
│   │   ├── api/                # Endpoint REST API (admin, auth, publik)
│   │   ├── globals-styles.css  # Variabel CSS dan styling dasar
│   │   ├── globals-public.css  # Styling khusus halaman publik portofolio
│   │   ├── responsive-fixes.css# Penyesuaian responsif mobile & tablet
│   │   └── layout.tsx          # Root layout aplikasi
│   ├── components/             # Komponen reusable
│   │   ├── admin/              # Komponen panel admin (AdminShell, AdminModalPortal, dll)
│   │   ├── Header.tsx          # Navbar publik portofolio
│   │   ├── Footer.tsx          # Footer publik
│   │   ├── ContactForm.tsx     # Form kirim pesan
│   │   └── ProjectDialog.tsx   # Dialog modal preview proyek
│   ├── db/                     # Konfigurasi basis data
│   │   ├── index.ts            # Inisialisasi koneksi Better-SQLite3
│   │   ├── schema.ts           # Skema tabel Drizzle ORM
│   │   ├── relations.ts        # Relasi antar tabel
│   │   └── seed.ts             # Skrip inisialisasi data & akun admin
│   └── lib/                    # Library & utility helpers
│       ├── auth.ts             # Konfigurasi server Better-Auth
│       ├── auth-client.ts      # Konfigurasi client Better-Auth
│       ├── auth-guard.ts       # Middleware pengaman rute admin
│       ├── validations.ts      # Skema validasi Zod
│       └── data/               # Data fallback & tipe data statis
├── drizzle.config.ts           # Konfigurasi Drizzle Kit
├── next.config.ts              # Konfigurasi Next.js
├── package.json                # Dependensi & script proyek
├── tsconfig.json               # Konfigurasi TypeScript
└── .env                        # Variabel konfigurasi lingkungan
```

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan sistem Anda telah terpasang:
- **Node.js** versi `20.x` atau lebih baru
- **npm** (atau `pnpm` / `yarn`)

### 2. Clone & Instalasi Dependensi
Buka terminal Anda di direktori proyek, lalu jalankan:

```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Pastikan nilai di dalam berkas `.env` sudah sesuai (lihat penjelasan detail di bagian [Konfigurasi Lingkungan](#-konfigurasi-lingkungan-env)).

### 4. Setup Database & Seeding
Sinkronkan skema database SQLite dan isi data awal (termasuk pembuatan akun administrator default):

```bash
# Push skema database ke sqlite.db
npm run db:push

# Jalankan seeder untuk mengisi data awal dan akun admin
npm run db:seed
```

### 5. Menjalankan Aplikasi

#### Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

#### Mode Produksi (Production Build)
```bash
npm run build
npm run start
```

---

## 📜 Skrip yang Tersedia (NPM Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan dengan Next.js Turbopack |
| `npm run build` | Melakukan kompilasi dan membangun aplikasi untuk production |
| `npm run start` | Menjalankan aplikasi yang telah dibuild dalam mode production |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas kode |
| `npm run db:push` | Mengaplikasikan skema Drizzle langsung ke file SQLite |
| `npm run db:generate` | Membuat berkas migrasi SQL berdasarkan perubahan skema |
| `npm run db:migrate` | Menjalankan migrasi database yang tersimpan |
| `npm run db:studio` | Membuka Drizzle Studio di browser untuk melihat isi database secara visual |
| `npm run db:seed` | Menjalankan skrip seeding data dan inisialisasi akun admin |

---

## 🔐 Konfigurasi Lingkungan (.env)

Berikut penjelasan variabel yang terdapat pada berkas `.env`:

```env
# URL / Path ke file database SQLite lokal
DATABASE_URL=file:./sqlite.db

# Kunci rahasia untuk enkripsi sesi Better-Auth (gunakan string acak yang aman)
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production

# URL domain aplikasi untuk Better-Auth
BETTER_AUTH_URL=http://localhost:3000

# URL publik aplikasi Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email default administrator untuk seeding awal
ADMIN_EMAIL=admin@example.com

# Password default administrator untuk seeding awal
ADMIN_PASSWORD=changeme123
```

---

## 🛡 Panduan Akun Admin & Keamanan

1. **Login ke Admin Panel**:
   - Buka halaman `/admin/login`.
   - Masukkan **Email** dan **Password** yang telah didaftarkan saat seeding atau melalui berkas `.env`.
2. **Keamanan Autentikasi**:
   - Sistem menggunakan autentikasi sesi berbasis cookie yang aman (`better-auth`).
   - Setiap halaman admin dan rute API internal dilindungi oleh pengecekan sesi aktif di server (`auth-guard.ts`).
   - Mode demo telah dinonaktifkan sehingga formulir login mengharuskan pengisian kredensial yang valid.
3. **Mengubah Kredensial Admin**:
   - Anda dapat memperbarui informasi login dan data profil langsung dari menu **Pengaturan** (`/admin/pengaturan`) atau menjalankan ulang `npm run db:seed` dengan nilai `.env` yang baru.

---

## 📄 Lisensi
Proyek ini dibuat untuk kebutuhan personal branding dan manajemen portofolio software engineer. Bebas digunakan dan disesuaikan untuk keperluan profesional Anda.
