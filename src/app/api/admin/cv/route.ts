import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { DEFAULT_CV_PAYLOAD } from "@/app/api/cv/route";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();

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

    const profile = db.select().from(profiles).get();
    if (profile?.cvFileUrl) {
      cvData.fileUrl = profile.cvFileUrl;
    }

    return NextResponse.json({ data: cvData });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching admin CV:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const stringValue = JSON.stringify(body);

    const existing = db
      .select()
      .from(settings)
      .where(eq(settings.key, "portfolio_cv_data"))
      .get();

    if (existing) {
      db.update(settings)
        .set({ value: stringValue })
        .where(eq(settings.key, "portfolio_cv_data"))
        .run();
    } else {
      db.insert(settings)
        .values({
          id: nanoid(),
          key: "portfolio_cv_data",
          value: stringValue,
        })
        .run();
    }

    // Also sync cvFileUrl to profile if fileUrl is provided
    if (body.fileUrl) {
      const profile = db.select().from(profiles).get();
      if (profile) {
        db.update(profiles)
          .set({ cvFileUrl: body.fileUrl })
          .where(eq(profiles.id, profile.id))
          .run();
      }
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error saving admin CV:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

