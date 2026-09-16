import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";
import { updateSkillSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/skills/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateSkillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    db.update(skills).set(parsed.data).where(eq(skills.id, id)).run();

    const updated = db.select().from(skills).where(eq(skills.id, id)).get();
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
  ctx: RouteContext<"/api/admin/skills/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const skill = db.select().from(skills).where(eq(skills.id, id)).get();
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    db.delete(skills).where(eq(skills.id, id)).run();
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

