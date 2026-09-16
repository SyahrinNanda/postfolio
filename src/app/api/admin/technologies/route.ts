import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { technologies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { createTechnologySchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();

    const result = db
      .select()
      .from(technologies)
      .orderBy(asc(technologies.order))
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
    const parsed = createTechnologySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = nanoid();
    db.insert(technologies).values({ id, ...parsed.data }).run();

    const created = db
      .select()
      .from(technologies)
      .where(eq(technologies.id, id))
      .get();

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

