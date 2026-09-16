import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { experiences, experienceTechnologies, technologies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { updateExperienceSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/experiences/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const exp = db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .get();

    if (!exp) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    const techs = await db
      .select({ technology: technologies })
      .from(experienceTechnologies)
      .innerJoin(
        technologies,
        eq(experienceTechnologies.technologyId, technologies.id)
      )
      .where(eq(experienceTechnologies.experienceId, id));

    return NextResponse.json({
      data: { ...exp, technologies: techs.map((t) => t.technology) },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/experiences/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateExperienceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { technologies: techIds, ...data } = parsed.data;

    db.update(experiences).set(data).where(eq(experiences.id, id)).run();

    if (techIds !== undefined) {
      db.delete(experienceTechnologies)
        .where(eq(experienceTechnologies.experienceId, id))
        .run();
      if (techIds.length) {
        for (const techId of techIds) {
          db.insert(experienceTechnologies)
            .values({ id: nanoid(), experienceId: id, technologyId: techId })
            .run();
        }
      }
    }

    const updated = db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
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
  ctx: RouteContext<"/api/admin/experiences/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const exp = db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .get();

    if (!exp) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    db.delete(experienceTechnologies)
      .where(eq(experienceTechnologies.experienceId, id))
      .run();
    db.delete(experiences).where(eq(experiences.id, id)).run();
    return NextResponse.json({ message: "Experience deleted" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

