import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { technologies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";
import { updateTechnologySchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/technologies/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateTechnologySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    db.update(technologies)
      .set(parsed.data)
      .where(eq(technologies.id, id))
      .run();

    const updated = db
      .select()
      .from(technologies)
      .where(eq(technologies.id, id))
      .get();

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/technologies/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const tech = db
      .select()
      .from(technologies)
      .where(eq(technologies.id, id))
      .get();

    if (!tech) {
      return NextResponse.json(
        { error: "Technology not found" },
        { status: 404 }
      );
    }

    db.delete(technologies).where(eq(technologies.id, id)).run();
    return NextResponse.json({ message: "Technology deleted" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

