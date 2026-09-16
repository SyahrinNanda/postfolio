import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { profileUpdateSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();
    const result = db.select().from(profiles).limit(1).all();
    return NextResponse.json({ data: result[0] || null });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching profile:", error);
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
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = db.select().from(profiles).limit(1).all();

    if (existing.length > 0) {
      db.update(profiles)
        .set(parsed.data)
        .where(eq(profiles.id, existing[0].id))
        .run();
    } else {
      db.insert(profiles)
        .values({
          id: nanoid(),
          ...parsed.data,
          fullName: parsed.data.fullName,
          professionalTitle: parsed.data.professionalTitle,
        })
        .run();
    }

    const updated = db.select().from(profiles).limit(1).all();
    return NextResponse.json({ data: updated[0] || null });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
