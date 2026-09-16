import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { createSkillSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();

    const result = db
      .select()
      .from(skills)
      .orderBy(asc(skills.order))
      .all();

    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const parsed = createSkillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = nanoid();
    db.insert(skills).values({ id, ...parsed.data }).run();

    const created = db.select().from(skills).where(eq(skills.id, id)).get();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

