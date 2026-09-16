import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { settingsUpdateSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();

    const allSettings = db.select().from(settings).all();

    // Convert array of {key, value} to object
    const settingsObj: Record<string, string> = {};
    for (const s of allSettings) {
      if (s.key) {
        settingsObj[s.key] = s.value || "";
      }
    }

    return NextResponse.json({ data: settingsObj });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
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
    const parsed = settingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Upsert each key-value pair
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value === undefined) continue;

      const stringValue =
        typeof value === "boolean"
          ? String(value)
          : typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value);

      const existing = db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .get();

      if (existing) {
        db.update(settings)
          .set({ value: stringValue })
          .where(eq(settings.key, key))
          .run();
      } else {
        db.insert(settings)
          .values({
            id: nanoid(),
            key,
            value: stringValue,
          })
          .run();
      }
    }

    // Return updated settings
    const allSettings = db.select().from(settings).all();
    const settingsObj: Record<string, string> = {};
    for (const s of allSettings) {
      if (s.key) {
        settingsObj[s.key] = s.value || "";
      }
    }

    return NextResponse.json({ data: settingsObj });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

