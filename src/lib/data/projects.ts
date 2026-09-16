export interface ProjectData {
  title: string;
  type: string;
  summary: string;
  role: string;
  duration: string;
  status: string;
  year: string;
  mark: string;
  overview: string;
  problem: string;
  requirements: [string, string][];
  solution: string;
  architecture: string[];
  technologies: string[];
  tables: [string, string[]][];
  features: string[];
  challenges: string[];
  decisions: [string, string][];
  implementation: string;
  testing: string;
  results: [string, string][];
  lessons: string;
  repo: string;
  demo: string;
}

export const projectData: Record<string, ProjectData> = {
  'rachita-apps': {
    title: 'Rachita Apps',
    type: 'Enterprise · Fullstack',
    summary: 'Sistem aplikasi web terpadu untuk efisiensi operasional dan manajemen alur kerja lintas departemen PT Rachita.',
    role: 'Lead Software Engineer',
    duration: '10 bulan',
    status: 'Production',
    year: '2026',
    mark: 'RA',
    overview: 'Rachita Apps adalah platform ERP/HRM internal PT Rachita yang mengonsolidasikan aktivitas operasional seluruh departemen (HR, Logistik, Lapangan, dan Manajerial) ke dalam satu dashboard tersentralisasi.',
    problem: 'Setiap departemen sebelumnya menggunakan spreadsheet dan alat terpisah, menyebabkan redundansi data, hambatan komunikasi antardepartemen, dan lambatnya pembuatan laporan eksekutif.',
    requirements: [
      ['RBAC Terstruktur', 'Akses fitur dan data disesuaikan dengan hak akses serta hierarki departemen.'],
      ['Sentralisasi Workflow', 'Pengajuan izin, laporan kerja, dan pengelolaan aset dilakukan dalam satu sistem.'],
      ['Audit Log', 'Setiap aktivitas data dan persetujuan terdokumentasi dengan riwayat lengkap.'],
      ['Responsif & Cepat', 'Dapat diakses lancar melalui perangkat desktop maupun mobile staf lapangan.'],
    ],
    solution: 'Kami membangun arsitektur Web Modular berbasis React/Next.js dan Node.js/PostgreSQL dengan sistem Role-Based Access Control (RBAC) yang presisi serta antarmuka intuitif untuk seluruh staf.',
    architecture: ['Web Frontend', 'API Gateway', 'Department Services', 'Queue Worker', 'PostgreSQL'],
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
    tables: [
      ['departments', ['id · uuid PK', 'code · varchar', 'name · varchar', 'created_at · timestamp']],
      ['users_roles', ['user_id · uuid FK', 'department_id · uuid FK', 'role · enum', 'permissions · jsonb']],
      ['workflow_tasks', ['id · uuid PK', 'dept_id · uuid FK', 'status · varchar', 'payload · jsonb']],
    ],
    features: [
      'Dashboard Manajemen Departemen',
      'Sistem Presensi & SDM (HRIS)',
      'Pengelolaan Aset & Inventaris Lapangan',
      'Modul Approval & Laporan Eksekutif Multi-level',
    ],
    challenges: [
      'Menyelaraskan alur kerja dari 8 departemen yang berbeda',
      'Menjaga performa query pada data historis yang terus bertumbuh',
      'Mengamankan data sensitif antar-departemen sesuai kebijakan perusahaan',
    ],
    decisions: [
      ['PostgreSQL & RBAC Jsonb', 'Memberikan fleksibilitas struktur data departemen tanpa mengorbankan keamanan relasional.'],
      ['Event-Driven Notification', 'Memastikan pembaruan status workflow langsung diterima pihak terkait.'],
      ['Single Sign-On (SSO)', 'Memudahkan staf mengakses seluruh modul internal dengan satu kredensial akun.'],
    ],
    implementation: 'Pengembangan dilakukan bertahap per modul departemen (HR, Operasional, Inventaris, Laporan). Dilengkapi unit test, integration test, serta pelatihan pengguna bagi seluruh kepala departemen.',
    testing: 'Pengujian dilakukan dengan Jest & Supertest untuk API endpoints, Cypress untuk E2E flow workflow persetujuan, serta audit keamanan RBAC.',
    results: [
      ['65%', 'Peningkatan efisiensi workflow'],
      ['8 Departemen', 'Terintegrasi penuh dalam 1 platform'],
      ['100%', 'Transparansi audit operasional'],
    ],
    lessons: 'Merancang sistem enterprise membutuhkan pemahaman mendalam atas kebiasaan pengguna akhir di tiap departemen agar adopsi sistem berjalan mulus.',
    repo: 'https://github.com/syahrinnanda/rachita-apps-demo',
    demo: '',
  },
  'rachita-finance': {
    title: 'Rachita Apps Finance',
    type: 'Fintech · Enterprise',
    summary: 'Sistem aplikasi web keuangan khusus untuk manajemen arus kas, invoice, dan anggaran department keuangan PT Rachita.',
    role: 'Fullstack Engineer',
    duration: '8 bulan',
    status: 'Production',
    year: '2026',
    mark: 'RF',
    overview: 'Modul khusus keuangan terenkripsi yang menangani seluruh pencatatan transaksi masuk/keluar, penggajian, pembukuan bulanan, dan pelaporan keuangan internal PT Rachita.',
    problem: 'Proses rekonsiliasi pembayaran tagihan proyek dan pembukuan bulanan membutuhkan waktu lama serta rawan selisih angka akibat pencatatan manual.',
    requirements: [
      ['Presisi Finansial', 'Penanganan transaksi angka besar dengan presisi desimal tanpa rounding error.'],
      ['Multi-level Approval', 'Persetujuan pengeluaran dana berbasis batas nominal hak akses.'],
      ['Laporan Real-time', 'Visualisasi neraca keuangan, Laba-Rugi, dan Cash Flow real-time.'],
    ],
    solution: 'Membangun ledger keuangan immutable berbasis PostgreSQL dengan pipeline otomatisasi invoice dan verifikasi bertingkat untuk pencegahan kecurangan.',
    architecture: ['Finance UI', 'Secure API', 'Ledger Service', 'Export Engine', 'PostgreSQL Ledger'],
    technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Chart.js'],
    tables: [
      ['finance_ledger', ['id · uuid PK', 'transaction_type · enum', 'amount · decimal(15,2)', 'approved_by · uuid FK']],
      ['invoices', ['id · uuid PK', 'vendor_name · varchar', 'status · varchar', 'due_date · date']],
    ],
    features: [
      'Pencatatan & Rekonsiliasi Arus Kas',
      'Manajemen Tagihan & Invoice Vendor',
      'Sistem Persetujuan Dana (Disbursement Approval)',
      'Laporan Keuangan Otomatis (PDF & Excel)',
    ],
    challenges: [
      'Menjamin tingkat akurasi 100% pada pencatatan ledger keuangan',
      'Menyediakan audit trail yang tidak dapat diubah (immutable)',
      'Proses penutupan buku (monthly closing) yang cepat',
    ],
    decisions: [
      ['Double-Entry Bookkeeping', 'Menggunakan standar akuntansi berpasangan untuk mendeteksi selisih otomatis.'],
      ['PDF Auto-Generation', 'Export laporan keuangan terformat otomatis untuk audit eksternal.'],
    ],
    implementation: 'Dikembangkan menggunakan penanganan transaksi berbasis database ACID dan pengujian regresi ketat pada formula akuntansi.',
    testing: 'Property-based testing untuk perhitungan kalkulasi keuangan dan stress testing pada penutupan buku bulanan.',
    results: [
      ['50%', 'Closing bulanan lebih cepat'],
      ['0%', 'Tingkat kesalahan pencatatan ledger'],
      ['100%', 'Visibilitas arus kas secara real-time'],
    ],
    lessons: 'Integritas data keuangan adalah prioritas tertinggi; konsistensi ACID database tidak boleh dikompromikan oleh trik optimasi sementara.',
    repo: 'https://github.com/syahrinnanda/rachita-finance-demo',
    demo: '',
  },
  'n8n-automation': {
    title: 'Automation Sistem N8N',
    type: 'Automation · Workflow',
    summary: 'Sistem otomatisasi aggregator berita harian pukul 08:00 AM yang didistribusikan otomatis ke Telegram, Email, dan Google Spreadsheet.',
    role: 'Automation Engineer',
    duration: '3 bulan',
    status: 'Production',
    year: '2025',
    mark: 'N8',
    overview: 'Alur kerja otomatisasi N8N yang mengekstraksi berita terkini setiap hari tepat jam 8 pagi, memfilter artikel relevan, lalu mengirimkan rangkuman ke grup Telegram, newsletter Email, dan mencatat log ke Google Sheets.',
    problem: 'Pencarian berita manual dan distribusi laporan harian setiap pagi menguras waktu staf hingga 1.5 jam setiap harinya.',
    requirements: [
      ['Penjadwalan Tepat', 'Trigger berjalan tepat pukul 08:00 AM setiap harinya.'],
      ['Multi-channel Delivery', 'Kirim pesan terformat ke Telegram, Email via SMTP, dan Google Sheets API.'],
      ['Error Handling & Retry', 'Toleransi kegagalan API sumber berita dengan retry otomatis.'],
    ],
    solution: 'Merancang workflow N8N tersinkronisasi dengan node webhook, parser JSON, formatter HTML Telegram, dan integrasi Google Sheets API.',
    architecture: ['Cron Scheduler', 'N8N Engine', 'News API', 'Telegram Bot API', 'Google Sheets API'],
    technologies: ['N8N Workflow', 'Node.js', 'Telegram Bot API', 'Google Sheets API', 'NodeMailer / SMTP'],
    tables: [
      ['news_logs', ['id · uuid PK', 'source_url · text', 'sent_at · timestamp', 'status · varchar']],
    ],
    features: [
      'Otomatisasi Jadwal Pagi 08:00 AM',
      'Pengiriman Notifikasi Telegram Bot',
      'Broadcast Email Summary Harian',
      'Pencatatan Otomatis ke Google Spreadsheet',
    ],
    challenges: [
      'Menangani format RSS/API berita yang bervariasi',
      'Menjaga rate limit Telegram Bot dan Google Sheets API',
      'Mencegah berita duplikat terkirim ulang',
    ],
    decisions: [
      ['N8N Self-Hosted', 'Mengurangi biaya komputasi server dan fleksibel dalam menambah node integrasi baru.'],
      ['Deduplikasi Hash URL', 'Menyimpan hash berita di Redis/Database untuk menyaring artikel duplikat.'],
    ],
    implementation: 'Dikonfigurasi pada instance N8N mandiri dengan backup workflow JSON dan monitoring status via webhook alert.',
    testing: 'Pengujian jadwal otomatis, simulasi kegagalan koneksi Telegram, dan validasi output formatting pada berbagai ukuran pesan.',
    results: [
      ['100%', 'Otomatisasi pengiriman berita pagi'],
      ['1.5 jam', 'Waktu kerja manual terselamatkan / hari'],
      ['0', 'Insiden berita duplikat'],
    ],
    lessons: 'Otomatisasi tanpa monitoring adalah risiko; memasang alert status pada workflow menjamin penyampaian informasi tanpa terputus.',
    repo: 'https://github.com/syahrinnanda/n8n-news-automation',
    demo: '',
  },
  'kpr-simulasi': {
    title: 'Simulasi Hitungan KPR Rachita',
    type: 'Tools · Web Application',
    summary: 'Kalkulator interaktif untuk simulasi perhitungan angsuran cicilan rumah subsidi KPR PT Rachita secara akurat.',
    role: 'Frontend Engineer',
    duration: '2 bulan',
    status: 'Production',
    year: '2025',
    mark: 'KP',
    overview: 'Aplikasi web kalkulator KPR subsidi yang membantu calon pembeli perumahan PT Rachita menghitung estimasi uang muka, suku bunga fixed/floating, tenor, dan rincian tabel angsuran bulanan.',
    problem: 'Calon pembeli rumah kesulitan memperhitungkan estimasi cicilan bulanan dan biaya awal, sehingga proses pengajuan KPR sering tertunda.',
    requirements: [
      ['Kalkulasi Akurat', 'Menghitung bunga anuitas, efektif, dan flat sesuai standar bank penyedia KPR subsidi.'],
      ['Tabel Anuitas Interaktif', 'Menampilkan rincian pokok & bunga setiap bulan selama masa tenor.'],
      ['Export & Cetak PDF', 'Memungkinkan pengguna mengunduh atau mencetak hasil simulasi.'],
    ],
    solution: 'Membangun kalkulator web SPA yang cepat dengan visualisasi grafik komposisi angsuran serta fitur ekspor PDF rincian cicilan.',
    architecture: ['React UI', 'Math Engine', 'Chart Generator', 'PDF Export Module'],
    technologies: ['JavaScript', 'React', 'Chart.js', 'jsPDF', 'Tailwind CSS'],
    tables: [
      ['simulations', ['id · uuid PK', 'property_price · decimal', 'tenor_years · int', 'monthly_payment · decimal']],
    ],
    features: [
      'Simulasi KPR Rumah Subsidi & Komersial',
      'Pilihan Suku Bunga Fixed & Floating',
      'Visualisasi Grafik Breakdown Angsuran',
      'Fitur Export & Print Laporan PDF',
    ],
    challenges: [
      'Memastikan formula suku bunga anuitas presisi sampai ke digit rupiah',
      'Menjaga visualisasi UI tetap ringan di browser smartphone low-end',
      'Menyediakan fitur unduh PDF tanpa ketergantungan server backend',
    ],
    decisions: [
      ['Client-side Math Engine', 'Seluruh perhitungan dilakukan di browser untuk respon instan tanpa latency network.'],
      ['Pure Canvas Chart', 'Visualisasi komposisi cicilan menggunakan Canvas agar cepat dan efisien.'],
    ],
    implementation: 'Diimplementasikan sebagai modul web mandiri yang dapat diintegrasikan ke landing page perumahan PT Rachita.',
    testing: 'Validation test membandingkan hasil output kalkulator dengan tabel resmi angsuran bank pelaksana KPR.',
    results: [
      ['300%', 'Kenaikan inquiry calon pembeli'],
      ['< 100ms', 'Waktu kalkulasi instan'],
      ['100%', 'Akurasi perhitungan angsuran'],
    ],
    lessons: 'Alat bantu keputusan yang simpel dan transparan secara signifikan meningkatkan konversi calon pembeli.',
    repo: 'https://github.com/syahrinnanda/kpr-rachita-simulator',
    demo: '',
  },
  'rachita-3d': {
    title: 'Web 3D Tour Rachita',
    type: '3D Graphics · Web App',
    summary: 'Web 3D Virtual Tour interaktif untuk eksplorasi lokasi perumahan dan room tour unit rumah PT Rachita secara online.',
    role: 'Frontend & 3D Web Engineer',
    duration: '5 bulan',
    status: 'Production',
    year: '2026',
    mark: '3D',
    overview: 'Platform virtual room tour 360° dan 3D interaktif yang memungkinkan calon konsumen berjalan-jalan dan melihat tata ruang hunian perumahan PT Rachita secara imersif langsung dari browser.',
    problem: 'Calon pembeli luar kota atau yang sibuk kesulitan menyempatkan waktu untuk survei lokasi perumahan secara fisik.',
    requirements: [
      ['Tampilan 360° Imersif', 'Navigasi smooth antar-ruangan dengan foto panorama 360° High Definition.'],
      ['Interactive Hotspots', 'Informasi spesifikasi bahan bangunan dan ukuran ruangan saat titik diklik.'],
      ['Performa Mobile Ringan', 'Dapat diakses lancar di smartphone tanpa menguras RAM.'],
    ],
    solution: 'Mengembangkan viewer 3D/360 berbasis Three.js & Pannellum dengan pendekatan lazy-loading aset tekstur resolusi bertingkat.',
    architecture: ['3D Viewer UI', 'Three.js Engine', 'Texture Loader', 'Hotspot Manager', 'Asset CDN'],
    technologies: ['JavaScript', 'Three.js', 'WebGL', 'Pannellum', 'CSS3'],
    tables: [
      ['tour_locations', ['id · uuid PK', 'unit_name · varchar', 'panorama_url · text', 'hotspots · jsonb']],
    ],
    features: [
      'Virtual Room Tour 360° Interaktif',
      'Eksplorasi Siteplan & Lokasi Perumahan',
      'Titik Hotspot Detail Spesifikasi Ruangan',
      'Mode Fullscreen & Responsive Touch Navigation',
    ],
    challenges: [
      'Optimasi ukuran gambar 360° agar dapat dimuat cepat pada koneksi mobile 4G',
      'Menjaga kendali kontrol kamera 3D tetap responsif pada layar sentuh',
      'Mencegah kebocoran memori (memory leak) WebGL saat navigasi lama',
    ],
    decisions: [
      ['Progressive Panorama Loading', 'Memuat gambar resolusi rendah terlebih dahulu lalu meningkatkan ke HD setelah muat.'],
      ['WebGL Cleanup Lifecycle', 'Membersihkan texture buffer saat berpindah ruangan untuk menjaga stabilitas memori.'],
    ],
    implementation: 'Riset dan integrasi dilakukan dengan aset 3D render & fotografi panorama lokasi asli perumahan PT Rachita.',
    testing: 'Pengujian frame-rate (FPS) pada perangkat mobile Android/iOS menengah serta cross-browser compatibility.',
    results: [
      ['60 FPS', 'Navigasi smooth pada perangkat mobile'],
      ['45%', 'Peningkatan kunjungan pembeli luar kota'],
      ['< 2 detik', 'Waktu muat ruangan awal'],
    ],
    lessons: 'Teknologi 3D di web sangat efektif jika memperhatikan optimasi ukuran aset agar tidak membebani pengguna.',
    repo: 'https://github.com/syahrinnanda/web-3d-tour-rachita',
    demo: '',
  },
  'mbg-gizi': {
    title: 'MBG Gizi Harian',
    type: 'Health · Public Web App',
    summary: 'Platform informasi publik untuk pemantauan menu makanan harian dan kandungan gizi dari program MBG.',
    role: 'Fullstack Web Engineer',
    duration: '4 bulan',
    status: 'Production',
    year: '2026',
    mark: 'MB',
    overview: 'Web portal transparansi informasi menu makan harian beserta rincian analisis gizi program Makan Bergizi Gratis (MBG) untuk sekolah dan masyarakat.',
    problem: 'Masyarakat dan wali murid membutuhkan informasi yang transparan dan dapat diakses publik mengenai kandungan gizi makanan yang disajikan harian.',
    requirements: [
      ['Rincian Gizi Terstruktur', 'Menampilkan nilai kalori, makronutrisi, dan mikronutrisi per porsi menu.'],
      ['Jadwal Menu Mingguan', 'Pengarsipan dan tayangan jadwal menu makanan setiap hari dalam seminggu.'],
      ['Pencarian & Filter Pangan', 'Kemudahan memfilter menu berdasarkan bahan baku, kalori, atau kelompok usia.'],
    ],
    solution: 'Membuat portal web informasi publik yang cepat, accessible, ramah mobile, serta terhubung dengan sistem input data gizi.',
    architecture: ['Web Public UI', 'REST API Service', 'Nutrition Calculator Engine', 'PostgreSQL Database'],
    technologies: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
    tables: [
      ['daily_menus', ['id · uuid PK', 'serve_date · date', 'menu_name · varchar', 'target_age_group · varchar']],
      ['nutrition_facts', ['menu_id · uuid FK', 'calories · int', 'protein_g · decimal', 'carbs_g · decimal', 'fat_g · decimal']],
    ],
    features: [
      'Direktori Menu Makanan Harian MBG',
      'Rincian Breakdown Kalori & Nutrisi Per Porsi',
      'Jadwal Kalender Menu Mingguan',
      'Filter Berdasarkan Kelompok Usia & Alergen',
    ],
    challenges: [
      'Penyajian data tabel nutrisi yang mudah dipahami oleh masyarakat umum',
      'Menjamin kecepatan halaman di daerah dengan koneksi terbatas',
      'Aksesibilitas web (WCAG 2.1) untuk kenyamanan seluruh pengguna',
    ],
    decisions: [
      ['Static Site Generation (SSG)', 'Meng-generate halaman menu harian secara statis agar memuat instan.'],
      ['Visual Nutrisi Interaktif', 'Menggunakan bar indikator warna untuk persentase kecukupan gizi harian.'],
    ],
    implementation: 'Dikembangkan dengan metodologi mobile-first dan standar aksesibilitas tinggi untuk kemudahan pemantauan gizi.',
    testing: 'Lighthouse audit untuk performa & aksesibilitas (skor > 95) serta testing tampilan pada berbagai ukuran layar.',
    results: [
      ['98%', 'Skor Lighthouse Performa & Accessibility'],
      ['50.000+', 'Pengunjung harian portal MBG'],
      ['100%', 'Transparansi data gizi harian'],
    ],
    lessons: 'Informasi publik harus disajikan dengan mengutamakan aksesibilitas, kecepatan muat, dan kesederhanaan visual.',
    repo: 'https://github.com/syahrinnanda/mbg-gizi-harian',
    demo: '',
  },
  'chick-farm': {
    title: 'Chick Farm App Mobile',
    type: 'Mobile App · AI & E-commerce',
    summary: 'Aplikasi mobile peternakan ayam pintar dengan fitur AI pendeteksi penyakit unggas melalui foto kotoran serta toko pakan dan peralatan ternak.',
    role: 'Lead Mobile & AI Engineer',
    duration: '6 bulan',
    status: 'Production',
    year: '2026',
    mark: 'CF',
    overview: 'Chick Farm App Mobile adalah platform manajemen peternakan ayam berbasis mobile yang mengintegrasikan model Computer Vision (AI) untuk mendiagnosis penyakit ayam melalui foto kotoran, serta menyediakan marketplace internal untuk pembelian pakan dan peralatan peternakan.',
    problem: 'Peternak ayam sering terlambat mendiagnosis penyakit unggas menular sehingga angka kematian ternak tinggi, dan kesulitan mendapatkan pasokan pakan serta alat ternak yang berkualitas.',
    requirements: [
      ['Deteksi AI Akurat', 'Model klasifikasi citra foto kotoran ayam untuk mendeteksi indikasi penyakit unggas secara real-time.'],
      ['Marketplace Terintegrasi', 'Katalog pakan, obat, dan peralatan peternakan dengan checkout dan pembayaran terintegrasi.'],
      ['Rekomendasi Penanganan', 'Saran tindakan awal dan rekomendasi obat/pakan yang tepat pasca-diagnosa AI.'],
      ['Performa Mobile Ringan', 'Dapat memproses kompresi foto dan inferensi AI dengan lancar di perangkat mobile.'],
    ],
    solution: 'Mengembangkan aplikasi mobile (React Native) yang terhubung dengan API AI Inference berbasis Computer Vision (TensorFlow) serta sistem E-commerce pakan & peralatan ternak.',
    architecture: ['Mobile App UI', 'API Gateway', 'AI Inference API (TensorFlow)', 'E-commerce Engine', 'PostgreSQL / Cloud Storage'],
    technologies: ['React Native', 'Python', 'TensorFlow', 'Node.js', 'PostgreSQL', 'Cloud Storage'],
    tables: [
      ['diagnosis_logs', ['id · uuid PK', 'user_id · uuid FK', 'image_url · text', 'disease_detected · varchar', 'confidence · decimal']],
      ['products', ['id · uuid PK', 'name · varchar', 'category · varchar', 'price · decimal', 'stock · int']],
      ['orders', ['id · uuid PK', 'user_id · uuid FK', 'total_amount · decimal', 'status · varchar']],
    ],
    features: [
      'Deteksi Penyakit Ayam Berbasis AI (Foto Kotoran Ayam)',
      'Marketplace Pakan, Obat & Alat Peternakan',
      'Rekomendasi Penanganan & Obat Pasca-Diagnosa',
      'Tracking Riwayat Kesehatan Ternak & Pesanan',
    ],
    challenges: [
      'Memastikan akurasi AI dalam berbagai kondisi pencahayaan di kandang ayam',
      'Mengoptimalkan ukuran dan waktu unggah gambar dari daerah dengan sinyal terbatas',
      'Menghubungkan hasil diagnosa AI ke rekomendasi produk pakan/obat yang sesuai',
    ],
    decisions: [
      ['Transfer Learning (MobileNet/ResNet)', 'Menggunakan model ringan yang di-fine-tune untuk akurasi tinggi dengan waktu respons instan.'],
      ['Image Compression Client-Side', 'Mengompresi foto sebelum diunggah ke server untuk menghemat kuota dan mempercepat respon.'],
    ],
    implementation: 'Dataset foto kotoran ayam dilatih dengan klasifikasi multi-kelas, dan API e-commerce dibangun terpisah agar layanan transaksi tetap stabil saat lalu lintas AI tinggi.',
    testing: 'Evaluasi akurasi model AI (confusion matrix, precision/recall > 92%) dan pengujian E2E flow checkout transaksi marketplace.',
    results: [
      ['92%', 'Akurasi klasifikasi penyakit AI'],
      ['< 3 detik', 'Waktu diagnosa foto kotoran'],
      ['40%', 'Mempercepat pasokan pakan peternak'],
    ],
    lessons: 'Penerapan AI di bidang agritech & peternakan sangat membantu peternak tradisional mencegah kerugian finansial akibat kematian unggas secara masal.',
    repo: 'https://github.com/syahrinnanda/chick-farm-mobile',
    demo: 'https://chickfarm.app',
  },
};

export const projectList = [
  { id: 'rachita-apps', category: 'fullstack web internal', color: 'purple', symbol: 'RA', num: '01', label: 'Enterprise', year: '2026', featured: true },
  { id: 'rachita-finance', category: 'fullstack web', color: 'lime', symbol: 'RF', num: '02', label: 'Fintech', year: '2026', featured: false },
  { id: 'n8n-automation', category: 'automation backend', color: 'orange', symbol: 'N8', num: '03', label: 'Automation', year: '2025', featured: false },
  { id: 'kpr-simulasi', category: 'web other', color: 'blue', symbol: 'KP', num: '04', label: 'Tools', year: '2025', featured: false },
  { id: 'rachita-3d', category: 'web other', color: 'slate', symbol: '3D', num: '05', label: '3D Graphics', year: '2026', featured: false },
  { id: 'mbg-gizi', category: 'web other', color: 'purple', symbol: 'MB', num: '06', label: 'Health', year: '2026', featured: false },
  { id: 'chick-farm', category: 'mobile ai', color: 'orange', symbol: 'CF', num: '07', label: 'Mobile App & AI', year: '2026', featured: false },
];
