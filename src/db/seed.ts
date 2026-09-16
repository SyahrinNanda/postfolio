/**
 * Database seed script
 * Run with: npm run db:seed
 *
 * Seeds the database with:
 * - Admin user (via Better Auth)
 * - Profile data
 * - Technologies
 * - Skills
 * - Sample projects (from existing static data)
 * - Sample experiences (from existing static data)
 * - Settings defaults
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle({ client: sqlite, schema });

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ========================================================================
  // 1. Admin User (direct insert - Better Auth will hash password on login)
  // ========================================================================
  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.com";
  const adminId = nanoid();

  const existingUser = db
    .select()
    .from(schema.user)
    .where(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (schema.user.email as any).equals
        ? undefined
        : undefined
    )
    .all();

  // Check if admin already exists
  const existing = sqlite
    .prepare("SELECT id FROM user WHERE email = ?")
    .get(adminEmail) as { id: string } | undefined;

  if (!existing) {
    try {
      const { auth } = await import("../lib/auth");
      await auth.api.signUpEmail({
        body: {
          name: "Syahri Nanda",
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || "admin123",
        },
      });
      console.log(`✅ Admin user & account created via Better Auth: ${adminEmail}`);
    } catch (e: any) {
      console.log(`ℹ️  Better Auth sign-up notice: ${e?.message || e}`);
    }
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // ========================================================================
  // 2. Profile
  // ========================================================================
  const existingProfile = sqlite
    .prepare("SELECT id FROM profiles LIMIT 1")
    .get() as { id: string } | undefined;

  if (!existingProfile) {
    db.insert(schema.profiles)
      .values({
        id: nanoid(),
        fullName: "Syahri Nanda",
        professionalTitle: "Software Engineer",
        shortBio:
          "Software Engineer yang fokus pada pengembangan web fullstack, AI, dan otomasi.",
        detailedBio:
          "Seorang software engineer dengan pengalaman 4+ tahun dalam membangun aplikasi web fullstack, sistem AI, dan otomasi. Berpengalaman dalam React, Next.js, Node.js, Python, dan berbagai teknologi modern lainnya.",
        careerFocus: "Fullstack Development, AI/ML, System Architecture",
        location: "Makassar, Indonesia",
        email: "syahrinnanda@gmail.com",
        phone: "+62 853 4895 7997",
        availability: "Remote / hybrid · diskusi terbuka",
        aboutHeadline: "Engineer yang peduli pada alasannya.",
        aboutLead:
          "Saya menggabungkan product thinking, desain sistem, dan eksekusi teknis untuk membuat software yang berguna—bukan sekadar selesai.",
        principles: [
          {
            number: "01 / WHY",
            title: "Pahami masalah dahulu",
            description:
              "Saya mencari konteks pengguna, constraint bisnis, dan ukuran keberhasilan sebelum memilih teknologi.",
          },
          {
            number: "02 / HOW",
            title: "Buat sistem dapat dijelaskan",
            description:
              "Arsitektur, failure mode, dan keputusan penting perlu dipahami oleh orang lain—bukan hanya penciptanya.",
          },
          {
            number: "03 / WHAT",
            title: "Kirim dalam irisan kecil",
            description:
              "Vertical slice yang bisa divalidasi memberi feedback lebih awal dan menurunkan risiko integrasi besar.",
          },
        ],
        processes: [
          {
            title: "Discover",
            description:
              "Menyelaraskan masalah, pengguna, constraint, risiko, dan indikator hasil.",
          },
          {
            title: "Design",
            description:
              "Membuat alur, kontrak, model data, dan proof-of-concept untuk ketidakpastian terbesar.",
          },
          {
            title: "Build",
            description:
              "Mengirim slice kecil dengan test, observability, dokumentasi, dan review.",
          },
          {
            title: "Learn",
            description:
              "Mengukur outcome, membaca feedback, dan mengubah keputusan ketika bukti berkata lain.",
          },
        ],
        highlights: [
          { value: "24", label: "Catatan teknis / tahun" },
          { value: "06", label: "Kontribusi komunitas" },
          { value: "∞", label: "Hal yang masih ingin dipelajari" },
        ],
        socialLinks: {
          github: "https://github.com/syahrinnanda",
          linkedin: "https://linkedin.com/in/syahrinnanda",
          website: "https://syahrinnanda.dev",
        },
        userId: existing?.id || adminId,
      })
      .run();
    console.log("✅ Profile seeded");
  } else {
    console.log("ℹ️  Profile already exists");
  }

  // ========================================================================
  // 3. Technologies
  // ========================================================================
  const existingTech = sqlite
    .prepare("SELECT COUNT(*) as count FROM technologies")
    .get() as { count: number };

  if (existingTech.count === 0) {
    const techs = [
      // Frontend
      { name: "HTML", category: "Frontend", icon: "html5", color: "#E34F26" },
      { name: "CSS", category: "Frontend", icon: "css3", color: "#1572B6" },
      {
        name: "JavaScript",
        category: "Frontend",
        icon: "javascript",
        color: "#F7DF1E",
      },
      {
        name: "TypeScript",
        category: "Frontend",
        icon: "typescript",
        color: "#3178C6",
      },
      { name: "React", category: "Frontend", icon: "react", color: "#61DAFB" },
      {
        name: "Next.js",
        category: "Frontend",
        icon: "nextjs",
        color: "#000000",
      },
      {
        name: "React Native",
        category: "Frontend",
        icon: "react",
        color: "#61DAFB",
      },
      {
        name: "Tailwind CSS",
        category: "Frontend",
        icon: "tailwindcss",
        color: "#06B6D4",
      },
      // Backend
      { name: "Node.js", category: "Backend", icon: "nodejs", color: "#339933" },
      {
        name: "Express",
        category: "Backend",
        icon: "express",
        color: "#000000",
      },
      { name: "Python", category: "Backend", icon: "python", color: "#3776AB" },
      { name: "PHP", category: "Backend", icon: "php", color: "#777BB4" },
      {
        name: "Laravel",
        category: "Backend",
        icon: "laravel",
        color: "#FF2D20",
      },
      // Database
      {
        name: "PostgreSQL",
        category: "Database",
        icon: "postgresql",
        color: "#4169E1",
      },
      { name: "MySQL", category: "Database", icon: "mysql", color: "#4479A1" },
      {
        name: "MongoDB",
        category: "Database",
        icon: "mongodb",
        color: "#47A248",
      },
      { name: "Redis", category: "Database", icon: "redis", color: "#DC382D" },
      // AI
      {
        name: "TensorFlow",
        category: "AI",
        icon: "tensorflow",
        color: "#FF6F00",
      },
      {
        name: "Machine Learning",
        category: "AI",
        icon: "brain",
        color: "#7C3AED",
      },
      // DevOps
      { name: "Git", category: "DevOps", icon: "git", color: "#F05032" },
      {
        name: "Docker",
        category: "DevOps",
        icon: "docker",
        color: "#2496ED",
      },
      { name: "Linux", category: "DevOps", icon: "linux", color: "#FCC624" },
      { name: "N8N", category: "DevOps", icon: "n8n", color: "#EA4B71" },
      {
        name: "Cloud Storage",
        category: "DevOps",
        icon: "cloud",
        color: "#4285F4",
      },
    ];

    for (let i = 0; i < techs.length; i++) {
      db.insert(schema.technologies)
        .values({
          id: nanoid(),
          ...techs[i],
          status: "active",
          order: i,
        })
        .run();
    }
    console.log(`✅ ${techs.length} technologies seeded`);
  } else {
    console.log(`ℹ️  Technologies already exist (${existingTech.count})`);
  }

  // ========================================================================
  // 4. Skills
  // ========================================================================
  const existingSkills = sqlite
    .prepare("SELECT COUNT(*) as count FROM skills")
    .get() as { count: number };

  if (existingSkills.count === 0) {
    const skillsList = [
      { name: "JavaScript/TypeScript", category: "Engineering", proficiency: 90, years: 4 },
      { name: "React & Next.js", category: "Frontend", proficiency: 88, years: 3 },
      { name: "Node.js", category: "Backend", proficiency: 85, years: 3 },
      { name: "Python", category: "Backend", proficiency: 80, years: 2 },
      { name: "PHP/Laravel", category: "Backend", proficiency: 75, years: 3 },
      { name: "PostgreSQL", category: "Database", proficiency: 82, years: 3 },
      { name: "MySQL", category: "Database", proficiency: 78, years: 3 },
      { name: "MongoDB", category: "Database", proficiency: 70, years: 2 },
      { name: "Docker", category: "DevOps", proficiency: 65, years: 2 },
      { name: "Git", category: "DevOps", proficiency: 88, years: 4 },
      { name: "Linux", category: "DevOps", proficiency: 72, years: 3 },
      { name: "System Architecture", category: "Engineering", proficiency: 78, years: 3 },
      { name: "REST API Design", category: "Engineering", proficiency: 85, years: 3 },
      { name: "Machine Learning", category: "AI", proficiency: 60, years: 1 },
      { name: "React Native", category: "Frontend", proficiency: 70, years: 1 },
    ];

    for (let i = 0; i < skillsList.length; i++) {
      db.insert(schema.skills)
        .values({
          id: nanoid(),
          ...skillsList[i],
          status: "active",
          order: i,
        })
        .run();
    }
    console.log(`✅ ${skillsList.length} skills seeded`);
  } else {
    console.log(`ℹ️  Skills already exist (${existingSkills.count})`);
  }

  // ========================================================================
  // 5. Projects (from existing static data)
  // ========================================================================
  const existingProjects = sqlite
    .prepare("SELECT COUNT(*) as count FROM projects")
    .get() as { count: number };

  if (existingProjects.count === 0) {
    const projectEntries = [
      {
        slug: "rachita-apps",
        title: "Rachita Apps",
        shortDescription:
          "Sistem aplikasi web terpadu untuk efisiensi operasional dan manajemen alur kerja lintas departemen PT Rachita.",
        projectType: "Enterprise · Fullstack",
        role: "Lead Software Engineer",
        duration: "10 bulan",
        status: "published" as const,
        year: "2026",
        category: "fullstack web internal",
        color: "purple",
        symbol: "RA",
        num: "01",
        label: "Enterprise",
        featured: true,
        problem:
          "Setiap departemen sebelumnya menggunakan spreadsheet dan alat terpisah.",
        solution:
          "Arsitektur Web Modular berbasis React/Next.js dan Node.js/PostgreSQL.",
        architecture: [
          "Web Frontend",
          "API Gateway",
          "Department Services",
          "Queue Worker",
          "PostgreSQL",
        ],
        challenges: [
          "Menyelaraskan alur kerja dari 8 departemen",
          "Menjaga performa query pada data historis",
          "Mengamankan data sensitif antar-departemen",
        ],
        result: [
          ["65%", "Peningkatan efisiensi workflow"],
          ["8 Departemen", "Terintegrasi penuh dalam 1 platform"],
          ["100%", "Transparansi audit operasional"],
        ] as [string, string][],
        githubUrl: "https://github.com/syahrinnanda/rachita-apps-demo",
        technologies: [
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "PostgreSQL",
          "Redis",
          "Tailwind CSS",
        ],
      },
      {
        slug: "rachita-finance",
        title: "Rachita Finance",
        shortDescription:
          "Platform fintech internal untuk pengelolaan keuangan perusahaan.",
        projectType: "Fullstack · Web",
        role: "Software Engineer",
        duration: "6 bulan",
        status: "published" as const,
        year: "2026",
        category: "fullstack web",
        color: "lime",
        symbol: "RF",
        num: "02",
        label: "Fintech",
        featured: false,
        technologies: ["React", "Next.js", "Node.js", "PostgreSQL"],
      },
      {
        slug: "n8n-automation",
        title: "N8N Automation",
        shortDescription:
          "Otomatisasi distribusi berita harian via workflow N8N.",
        projectType: "Automation · Backend",
        role: "Software Engineer",
        duration: "2 bulan",
        status: "published" as const,
        year: "2025",
        category: "automation backend",
        color: "orange",
        symbol: "N8",
        num: "03",
        label: "Automation",
        featured: false,
        technologies: ["N8N", "Node.js", "PostgreSQL"],
      },
      {
        slug: "kpr-simulasi",
        title: "KPR Simulasi",
        shortDescription: "Tools simulasi kredit pemilikan rumah berbasis web.",
        projectType: "Web · Tools",
        role: "Software Engineer",
        duration: "1 bulan",
        status: "published" as const,
        year: "2025",
        category: "web other",
        color: "blue",
        symbol: "KP",
        num: "04",
        label: "Tools",
        featured: false,
        technologies: ["React", "Next.js", "Tailwind CSS"],
      },
      {
        slug: "chick-farm",
        title: "Chick Farm AI Mobile",
        shortDescription:
          "Platform manajemen peternakan ayam berbasis mobile dengan AI Computer Vision.",
        projectType: "Mobile · AI",
        role: "Lead Software Engineer",
        duration: "8 bulan",
        status: "published" as const,
        year: "2026",
        category: "mobile ai",
        color: "orange",
        symbol: "CF",
        num: "07",
        label: "Mobile App & AI",
        featured: false,
        technologies: [
          "React Native",
          "Python",
          "TensorFlow",
          "Node.js",
          "PostgreSQL",
          "Cloud Storage",
        ],
      },
    ];

    // Get all technologies for mapping
    const allTechs = db.select().from(schema.technologies).all();
    const techMap = new Map(allTechs.map((t) => [t.name, t.id]));

    for (let i = 0; i < projectEntries.length; i++) {
      const { technologies: techNames, ...projectData } = projectEntries[i];
      const projectId = nanoid();

      db.insert(schema.projects)
        .values({
          id: projectId,
          ...projectData,
          order: i,
        })
        .run();

      // Link technologies
      if (techNames) {
        for (const techName of techNames) {
          const techId = techMap.get(techName);
          if (techId) {
            db.insert(schema.projectTechnologies)
              .values({
                id: nanoid(),
                projectId,
                technologyId: techId,
              })
              .run();
          }
        }
      }
    }
    console.log(`✅ ${projectEntries.length} projects seeded`);
  } else {
    console.log(`ℹ️  Projects already exist (${existingProjects.count})`);
  }

  // ========================================================================
  // 6. Experiences
  // ========================================================================
  const existingExp = sqlite
    .prepare("SELECT COUNT(*) as count FROM experiences")
    .get() as { count: number };

  if (existingExp.count === 0) {
    const experienceEntries = [
      {
        company: "Custom Software & Client Projects",
        position: "Freelance Software Engineer",
        overline: "Freelance Job · Remote / Project-based",
        startDate: "2024-01",
        period: "2024 — Sekarang",
        isCurrent: true,
        description:
          "Merancang dan mengembangkan aplikasi web & mobile custom untuk berbagai bisnis dan klien.",
        responsibilities: [
          "Arsitektur aplikasi mobile & web end-to-end.",
          "Integrasi AI Computer Vision & E-commerce.",
          "Pengembangan backend REST API & workflow automation.",
        ],
        achievements: [
          "Merilis aplikasi peternakan pintar Chick Farm AI Mobile.",
          "Mengonsolidasikan 8 departemen PT Rachita dalam 1 ERP.",
          "Otomatisasi 100% distribusi berita harian via N8N.",
        ],
        technologies: [
          "React Native",
          "React",
          "Node.js",
          "Python",
          "PostgreSQL",
          "N8N",
        ],
      },
      {
        company: "Laboratorium Komputer UMI",
        position: "Asisten Laboratorium Teknik Informatika",
        overline: "Universitas Muslim Indonesia · Makassar",
        startDate: "2023-01",
        endDate: "2024-12",
        period: "Jan 2023 — Des 2024",
        isCurrent: false,
        description:
          "Membimbing praktikum mahasiswa, membantu dosen dalam penyampaian materi pemrograman & jaringan.",
        responsibilities: [
          "Mendampingi mahasiswa dalam sesi praktikum lab.",
          "Membantu koreksi tugas & pemahaman modul praktikum.",
          "Pemeliharaan perangkat keras & jaringan laboratorium.",
        ],
        achievements: [
          "Membimbing 3 angkatan mahasiswa.",
          "Mereorganisasi sistem inventaris perangkat lab.",
        ],
        technologies: ["Python", "PHP", "MySQL", "Linux"],
      },
    ];

    const allTechs = db.select().from(schema.technologies).all();
    const techMap = new Map(allTechs.map((t) => [t.name, t.id]));

    for (let i = 0; i < experienceEntries.length; i++) {
      const { technologies: techNames, ...expData } = experienceEntries[i];
      const expId = nanoid();

      db.insert(schema.experiences)
        .values({
          id: expId,
          ...expData,
          status: "active",
          order: i,
        })
        .run();

      // Link technologies
      if (techNames) {
        for (const techName of techNames) {
          const techId = techMap.get(techName);
          if (techId) {
            db.insert(schema.experienceTechnologies)
              .values({
                id: nanoid(),
                experienceId: expId,
                technologyId: techId,
              })
              .run();
          }
        }
      }
    }
    console.log(`✅ ${experienceEntries.length} experiences seeded`);
  } else {
    console.log(`ℹ️  Experiences already exist (${existingExp.count})`);
  }

  // ========================================================================
  // 7. Settings
  // ========================================================================
  const existingSettings = sqlite
    .prepare("SELECT COUNT(*) as count FROM settings")
    .get() as { count: number };

  if (existingSettings.count === 0) {
    const defaultSettings = {
      siteName: "Software Engineer Portfolio",
      siteUrl: "https://syahrinnanda.dev",
      metaTitle: "Syahri Nanda — Software Engineer",
      metaDescription:
        "Portfolio profesional software engineer dengan pengalaman fullstack, AI, dan otomasi.",
      githubUsername: "syahrinnanda",
      analyticsId: "",
      emailNotifications: "false",
      showGithub: "true",
      showArticles: "true",
      maintenanceMode: "false",
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      db.insert(schema.settings)
        .values({
          id: nanoid(),
          key,
          value,
        })
        .run();
    }
    console.log("✅ Default settings seeded");
  } else {
    console.log(`ℹ️  Settings already exist (${existingSettings.count})`);
  }

  // ========================================================================
  // 8. Articles
  // ========================================================================
  const existingArticles = sqlite
    .prepare("SELECT COUNT(*) as count FROM articles")
    .get() as { count: number };

  if (existingArticles.count === 0) {
    try {
      const { articleList, articleData } = await import("../lib/data/articles");
      for (const item of articleList) {
        const fullDetail = articleData[item.id];
        const artId = nanoid();

        db.insert(schema.articles)
          .values({
            id: artId,
            title: item.title,
            slug: item.id,
            coverImage: null,
            coverColor: item.coverColor || "dark",
            coverMark: item.coverMark || "ART",
            summary: item.summary,
            content: fullDetail
              ? fullDetail.sections
                  ?.map((s) => `## ${s.title}\n\n${s.paragraphs.join("\n\n")}`)
                  .join("\n\n")
              : item.summary,
            sections: fullDetail ? fullDetail.sections : null,
            lead: fullDetail ? fullDetail.lead : item.summary,
            category: item.category,
            categoryLabel: item.categoryLabel,
            tags: fullDetail ? fullDetail.tags : [item.categoryLabel],
            searchKeywords: item.searchKeywords,
            readDuration: item.duration,
            publishedDate: item.datetime,
            author: "As'syahrin Nanda",
            status: "published",
            hasFullPage: item.hasFullPage,
          })
          .run();
      }
      console.log(`✅ ${articleList.length} articles seeded`);
    } catch (e: any) {
      console.log(`ℹ️  Articles seed notice: ${e?.message || e}`);
    }
  } else {
    console.log(`ℹ️  Articles already exist (${existingArticles.count})`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Next steps:");
  console.log("   1. Start the dev server: npm run dev");
  console.log(
    `   2. Create admin account via: POST http://localhost:3000/api/auth/sign-up/email`
  );
  console.log(
    `      Body: {"name":"Admin","email":"${adminEmail}","password":"admin123"}`
  );
  console.log("   3. Open Drizzle Studio: npm run db:studio");
}

seed().catch(console.error);

