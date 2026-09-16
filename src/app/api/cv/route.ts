import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const DEFAULT_CV_PAYLOAD = {
  name: "Assyahrin-Nanda-Software-Engineer-CV.pdf",
  fileUrl: "/assets/syahrin-nanda-cv.pdf",
  size: 1284000,
  updated: "24 hari lalu",
  version: 4,
  status: "published",
  badgeText: "CV versi resmi · September 2026",
  noteText: "Konten identitas, pengalaman, dan metrik di CV ini diperbarui secara berkala.",
  summaryHeadline: "Software Engineer",
  summaryText:
    "Product-minded software engineer dengan 4+ tahun pengalaman membangun aplikasi web end-to-end, layanan event-driven, dan AI application. Berfokus pada sistem yang andal, dapat diamati, accessible, dan memberi outcome terukur.",
  educations: [
    {
      id: "edu-1",
      degree: "S1 Teknik Informatika",
      institution: "Universitas Muslim Indonesia",
      period: "2020 — 2024",
      description: "Gelar Sarjana Komputer (S.Kom) Teknik Informatika Universitas Muslim Indonesia.",
      status: "active",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Bangkit Academy 2023",
      subtitle: "Cloud Computing Path · Google, GoTo, Traveloka",
      year: "2023",
    },
    {
      id: "cert-2",
      title: "Ruangguru Bootcamp",
      subtitle: "Front-end Engineering (2023)",
      year: "2023",
    },
  ],
  languages: [
    {
      id: "lang-1",
      language: "Bahasa Indonesia",
      proficiency: "Native",
    },
    {
      id: "lang-2",
      language: "English",
      proficiency: "Professional working proficiency",
    },
  ],
  preferences: [
    {
      key: "location",
      label: "Remote / Hybrid / On-site",
      value: "Makassar, Indonesia · UTC+8",
    },
    {
      key: "focus",
      label: "Fokus peran",
      value: "Software Engineer · Fullstack & Mobile",
    },
  ],
  history: [
    {
      id: "h-3",
      name: "Assyahrin-Nanda-CV-v3.pdf",
      fileUrl: "/assets/syahrin-nanda-cv.pdf",
      size: 1190000,
      updated: "102 hari lalu",
      version: 3,
    },
    {
      id: "h-2",
      name: "Assyahrin-Nanda-CV-v2.pdf",
      fileUrl: "/assets/syahrin-nanda-cv.pdf",
      size: 1080000,
      updated: "210 hari lalu",
      version: 2,
    },
  ],
};

export async function GET() {
  try {
    const cvSetting = db
      .select()
      .from(settings)
      .where(eq(settings.key, "portfolio_cv_data"))
      .get();

    let cvData = DEFAULT_CV_PAYLOAD;

    if (cvSetting?.value) {
      try {
        const parsed = JSON.parse(cvSetting.value);
        cvData = { ...DEFAULT_CV_PAYLOAD, ...parsed };
      } catch {
        // fallback
      }
    }

    // Check if profile has cvFileUrl override
    const profile = db.select().from(profiles).get();
    if (profile?.cvFileUrl) {
      cvData.fileUrl = profile.cvFileUrl;
    }

    return NextResponse.json({ data: cvData });
  } catch (error) {
    console.error("Error fetching public CV:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

