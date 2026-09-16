import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { experiences, experienceTechnologies, technologies } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { createExperienceSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    await requireAuth();

    const result = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.order), desc(experiences.createdAt));

    // Get technologies for each experience
    const experiencesWithTech = await Promise.all(
      result.map(async (exp) => {
        const techs = await db
          .select({ technology: technologies })
          .from(experienceTechnologies)
          .innerJoin(
            technologies,
            eq(experienceTechnologies.technologyId, technologies.id)
          )
          .where(eq(experienceTechnologies.experienceId, exp.id));

        return {
          ...exp,
          technologies: techs.map((t) => t.technology),
        };
      })
    );

    return NextResponse.json({ data: experiencesWithTech });
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
    const parsed = createExperienceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { technologies: techIds, ...data } = parsed.data;
    const id = nanoid();

    db.insert(experiences).values({ id, ...data }).run();

    if (techIds?.length) {
      for (const techId of techIds) {
        db.insert(experienceTechnologies)
          .values({ id: nanoid(), experienceId: id, technologyId: techId })
          .run();
      }
    }

    const created = db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
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

