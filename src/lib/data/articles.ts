export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  callout?: string;
  bullets?: string[];
  code?: string;
  quote?: string;
}

export interface ArticleData {
  title: string;
  category: string;
  date: string;
  datetime: string;
  read: string;
  summary: string;
  mark: string;
  tags: string[];
  lead: string;
  sections: ArticleSection[];
}

export interface ArticleListItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  categoryLabel: string;
  searchKeywords: string;
  date: string;
  datetime: string;
  duration: string;
  coverColor: 'dark' | 'violet' | 'lime' | 'coral' | 'blue';
  coverMark: string;
  hasFullPage: boolean;
}

export const articleData: Record<string, ArticleData> = {
  scale: {
    title: 'Merancang sistem yang tetap tenang saat traffic naik 10×',
    category: 'Software Architecture',
    date: '12 Agustus 2026',
    datetime: '2026-08-12',
    read: '9 menit baca',
    summary: 'Catatan praktis tentang bottleneck, backpressure, observability, dan keputusan yang sebaiknya dibuat sebelum menambah server.',
    mark: '10×',
    tags: ['Architecture', 'Scalability', 'Backend', 'Observability'],
    lead: 'Scaling bukan lomba menambah server. Ia adalah proses memahami di mana waktu, memori, koneksi, dan perhatian manusia habis—lalu membuat batas sistem terlihat sebelum pengguna merasakannya.',
    sections: [
      {
        id: 'mulai-dari-bukti',
        title: 'Mulai dari bukti, bukan asumsi',
        paragraphs: [
          'Ketika latency naik, insting pertama sering mengarah ke database atau jumlah instance. Padahal bottleneck dapat berada di connection pool, dependency eksternal, serialization, atau satu query yang hanya buruk pada distribusi data tertentu.',
          'Tetapkan service-level indicator yang dekat dengan pengalaman pengguna. P95 latency, error rate, queue age, dan saturation memberi cerita yang jauh lebih berguna daripada rata-rata CPU.',
        ],
        callout: 'Contoh dan angka dalam artikel ini adalah data demonstrasi untuk menunjukkan bentuk konten portofolio.',
      },
      {
        id: 'batas-dan-backpressure',
        title: 'Batas yang sehat dan backpressure',
        paragraphs: [
          'Sistem tanpa batas hanya memindahkan kegagalan ke tempat yang lebih sulit dilihat. Timeout, bounded queue, concurrency limit, dan circuit breaker membuat sistem memilih cara gagal yang dapat diprediksi.',
        ],
        bullets: [
          'Berikan deadline dari edge hingga dependency.',
          'Tolak pekerjaan lebih awal ketika antrean melewati ambang aman.',
          'Pisahkan workload interaktif dari batch.',
          'Sediakan jalur degradasi untuk fitur non-kritis.',
        ],
        code: "const result = await withDeadline(\n  () => inventory.reserve(order),\n  { timeoutMs: 800, fallback: 'queue' }\n);",
      },
      {
        id: 'state-dan-data',
        title: 'State adalah bagian yang mahal',
        paragraphs: [
          'Compute stateless relatif mudah diduplikasi. State membutuhkan strategi konsistensi, partitioning, backup, dan recovery yang eksplisit. Karena itu optimasi paling bernilai sering berupa pengurangan perjalanan ke database atau pengubahan pola akses.',
          'Cache hanya membantu ketika invalidation dan failure mode dipahami. Catat hit ratio, usia data, dan perilaku saat cache kosong; jangan menjadikannya sumber kebenaran kedua secara tidak sengaja.',
        ],
      },
      {
        id: 'operasi',
        title: 'Desain untuk orang yang akan mengoperasikan',
        paragraphs: [
          'Arsitektur selesai bukan saat diagramnya rapi, tetapi saat tim dapat mengenali, membatasi, dan memulihkan kegagalan. Runbook singkat, dashboard berbasis gejala, serta rollback yang diuji adalah bagian dari desain produk.',
        ],
        quote: 'Sistem yang scalable memberi tim waktu untuk berpikir ketika sesuatu berjalan salah.',
      },
    ],
  },
  'design-system': {
    title: 'Design system bukan sekadar kumpulan komponen',
    category: 'Web Development',
    date: '29 Juli 2026',
    datetime: '2026-07-29',
    read: '7 menit baca',
    summary: 'Bagaimana token, kontrak komponen, dokumentasi, dan governance mengurangi keputusan berulang tanpa membatasi kreativitas tim.',
    mark: 'DS',
    tags: ['Frontend', 'Design System', 'Accessibility', 'React'],
    lead: 'Design system yang matang bukan galeri button. Ia adalah bahasa bersama yang menghubungkan keputusan desain, implementasi, aksesibilitas, dan cara tim mengubah produk dengan aman.',
    sections: [
      {
        id: 'masalah-keputusan',
        title: 'Masalahnya adalah keputusan berulang',
        paragraphs: [
          'Ketidakkonsistenan biasanya bukan karena tim tidak peduli. Konteks tersebar, kebutuhan mendesak, dan pilihan yang sama harus dibuat berulang kali. Sistem yang baik membuat jalur benar menjadi jalur termudah.',
        ],
        callout: 'Semua nama produk dan metrik di halaman ini merupakan contoh demonstrasi.',
      },
      {
        id: 'token-kontrak',
        title: 'Token adalah kontrak',
        paragraphs: [
          'Token mengubah nilai visual menjadi keputusan bernama: surface, content, action, danger, dan focus. Nama semantik memungkinkan tema berubah tanpa membuat komponen memahami palet mentah.',
        ],
        bullets: [
          'Pisahkan primitive token dari semantic token.',
          'Dokumentasikan state, bukan hanya tampilan default.',
          'Jadikan focus indicator sebagai bagian kontrak.',
          'Uji kontras pada kombinasi yang benar-benar dipakai.',
        ],
        code: ":root {\n  --color-action: var(--lime-500);\n  --color-focus-ring: var(--violet-400);\n  --space-control-inline: 1rem;\n}",
      },
      {
        id: 'api-komponen',
        title: 'API komponen yang sengaja sempit',
        paragraphs: [
          'Komponen dengan puluhan prop boolean sulit dipahami dan menghasilkan kombinasi tak teruji. Composition, slot yang jelas, dan variant terbatas menjaga fleksibilitas tanpa membocorkan detail internal.',
          'Breaking change perlu diperlakukan seperti perubahan API produk: ada alasan, migration guide, codemod bila layak, serta periode deprecation.',
        ],
      },
      {
        id: 'governance',
        title: 'Governance adalah fitur',
        paragraphs: [
          'Sistem akan stagnan bila kontribusi hanya dapat dilakukan satu tim. RFC ringan, kriteria penerimaan, owner yang jelas, dan release note membuat perubahan dapat mengalir tanpa kehilangan kualitas.',
        ],
        quote: 'Konsistensi bukan tujuan akhir; konsistensi membebaskan tim untuk fokus pada masalah yang unik.',
      },
    ],
  },
  rag: {
    title: 'RAG yang dapat dipercaya: dari retrieval sampai evaluasi',
    category: 'AI / Machine Learning',
    date: '15 Juli 2026',
    datetime: '2026-07-15',
    read: '11 menit baca',
    summary: 'Membuat jawaban AI yang grounded membutuhkan metadata, permission, evaluasi, dan UX penolakan—bukan prompt panjang saja.',
    mark: 'RAG',
    tags: ['AI', 'RAG', 'LLM', 'Evaluation'],
    lead: 'RAG menghubungkan model dengan pengetahuan organisasi, tetapi retrieval bukan jaminan kebenaran. Kepercayaan muncul ketika sumber, akses, evaluasi, dan perilaku saat ragu dirancang sebagai satu sistem.',
    sections: [
      {
        id: 'korpus',
        title: 'Kualitas dimulai dari korpus',
        paragraphs: [
          'Dokumen yang duplikat, usang, atau tanpa owner akan menghasilkan jawaban dengan masalah yang sama. Tambahkan metadata versi, waktu berlaku, domain, dan access scope sebelum memikirkan teknik retrieval yang lebih rumit.',
        ],
        callout: 'Arsitektur dan hasil dalam artikel ini adalah sampel portofolio, bukan klaim terhadap sistem produksi tertentu.',
      },
      {
        id: 'retrieval',
        title: 'Retrieval adalah pipeline',
        paragraphs: [
          'Hybrid search, filtering metadata, reranking, dan query rewriting sebaiknya dievaluasi terpisah. Dengan begitu tim tahu apakah kegagalan berasal dari dokumen yang tidak ditemukan atau model yang salah menggunakan konteks.',
        ],
        bullets: [
          'Ukur recall pada dokumen relevan.',
          'Simpan alasan dan skor hasil retrieval.',
          'Batasi konteks berdasarkan permission sebelum model melihatnya.',
          'Pertahankan tautan ke sumber asli.',
        ],
        code: "answer = compose(\n  question,\n  context=rerank(filter_scope(retrieve(question))),\n  require_citations=True\n)",
      },
      {
        id: 'evaluasi',
        title: 'Evaluasi sebagai bagian delivery',
        paragraphs: [
          'Golden set kecil yang ditinjau domain expert lebih berguna daripada demo acak. Ukur groundedness, correctness, citation accuracy, refusal, latency, dan biaya per jenis pertanyaan.',
          'Jalankan evaluasi ketika model, prompt, chunking, atau korpus berubah. Skor agregat perlu disertai contoh kegagalan agar dapat ditindaklanjuti.',
        ],
      },
      {
        id: 'menolak',
        title: 'Ajarkan sistem untuk menolak',
        paragraphs: [
          'Jawaban yang terdengar yakin tetapi tanpa bukti merusak kepercayaan. Sistem perlu menyatakan ketika sumber kurang, pertanyaan ambigu, atau pengguna tidak memiliki akses—lalu menawarkan langkah selanjutnya.',
        ],
        quote: 'Jawaban yang aman kadang bukan jawaban; ia adalah batas yang dijelaskan dengan baik.',
      },
    ],
  },
};

export const articleList: ArticleListItem[] = [
  {
    id: 'scale',
    title: 'Merancang sistem yang tetap tenang saat traffic naik 10×',
    summary: 'Bottleneck, backpressure, observability, dan keputusan sebelum menambah server.',
    category: 'architecture backend',
    categoryLabel: 'SOFTWARE ARCHITECTURE',
    searchKeywords: 'merancang sistem traffic scale scalability backend architecture observability 10x',
    date: '12 AGU 2026',
    datetime: '2026-08-12',
    duration: '9 MENIT',
    coverColor: 'dark',
    coverMark: '10×',
    hasFullPage: true,
  },
  {
    id: 'design-system',
    title: 'Design system bukan sekadar kumpulan komponen',
    summary: 'Token, API komponen, dokumentasi, dan governance sebagai satu sistem.',
    category: 'web programming',
    categoryLabel: 'WEB DEVELOPMENT',
    searchKeywords: 'design system component React accessibility token governance frontend web',
    date: '29 JUL 2026',
    datetime: '2026-07-29',
    duration: '7 MENIT',
    coverColor: 'violet',
    coverMark: 'DS',
    hasFullPage: true,
  },
  {
    id: 'rag',
    title: 'RAG yang dapat dipercaya: dari retrieval sampai evaluasi',
    summary: 'Metadata, permission, evaluasi, dan UX penolakan untuk jawaban yang grounded.',
    category: 'ai backend',
    categoryLabel: 'AI / MACHINE LEARNING',
    searchKeywords: 'RAG retrieval AI LLM evaluation grounded guardrails machine learning',
    date: '15 JUL 2026',
    datetime: '2026-07-15',
    duration: '11 MENIT',
    coverColor: 'lime',
    coverMark: 'RAG',
    hasFullPage: true,
  },
  {
    id: 'explain',
    title: 'EXPLAIN bukan ramalan: membaca query plan di production',
    summary: 'Cara menghubungkan plan, cardinality, buffer, dan distribusi data sebelum mengubah index.',
    category: 'database backend',
    categoryLabel: 'DATABASE',
    searchKeywords: 'PostgreSQL index query database execution plan production',
    date: '28 JUN 2026',
    datetime: '2026-06-28',
    duration: 'RINGKASAN',
    coverColor: 'coral',
    coverMark: 'EX',
    hasFullPage: false,
  },
  {
    id: 'alert',
    title: 'Alert yang membangunkan manusia harus bisa ditindaklanjuti',
    summary: 'Mengubah alert berbasis komponen menjadi sinyal gejala dengan owner dan runbook yang jelas.',
    category: 'devops architecture',
    categoryLabel: 'DEVOPS',
    searchKeywords: 'incident observability alert runbook postmortem devops reliability',
    date: '10 JUN 2026',
    datetime: '2026-06-10',
    duration: 'RINGKASAN',
    coverColor: 'blue',
    coverMark: 'SLO',
    hasFullPage: false,
  },
  {
    id: 'error-contract',
    title: 'Error message adalah bagian dari kontrak API',
    summary: 'Struktur error yang membantu client menentukan retry, koreksi input, dan eskalasi.',
    category: 'programming backend',
    categoryLabel: 'PROGRAMMING',
    searchKeywords: 'API error contract programming retry idempotency distributed systems',
    date: '22 MEI 2026',
    datetime: '2026-05-22',
    duration: 'RINGKASAN',
    coverColor: 'dark',
    coverMark: '4xx',
    hasFullPage: false,
  },
  {
    id: 'offline-first',
    title: 'Offline-first: sinkronisasi adalah fitur produk',
    summary: 'Mendesain status, konflik, antrean lokal, dan recovery agar pengguna memahami apa yang terjadi.',
    category: 'web database',
    categoryLabel: 'WEB + DATABASE',
    searchKeywords: 'offline first sync web database conflict local storage progressive web app',
    date: '4 MEI 2026',
    datetime: '2026-05-04',
    duration: 'RINGKASAN',
    coverColor: 'violet',
    coverMark: '↻',
    hasFullPage: false,
  },
];
