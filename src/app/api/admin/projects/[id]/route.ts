import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  projects,
  projectTechnologies,
  projectFeatures,
  technologies,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { updateProjectSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/projects/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const techs = await db
      .select({ technology: technologies })
      .from(projectTechnologies)
      .innerJoin(
        technologies,
        eq(projectTechnologies.technologyId, technologies.id)
      )
      .where(eq(projectTechnologies.projectId, id));

    const features = db
      .select()
      .from(projectFeatures)
      .where(eq(projectFeatures.projectId, id))
      .all();

    return NextResponse.json({
      data: {
        ...project,
        technologies: techs.map((t) => t.technology),
        features,
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/projects/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      technologies: techIds,
      features: featuresList,
      ...projectData
    } = parsed.data;

    const existing = db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    db.update(projects)
      .set({
        ...projectData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .run();

    if (techIds !== undefined) {
      db.delete(projectTechnologies)
        .where(eq(projectTechnologies.projectId, id))
        .run();

      if (techIds.length > 0) {
        for (const techId of techIds) {
          db.insert(projectTechnologies)
            .values({
              id: nanoid(),
              projectId: id,
              technologyId: techId,
            })
            .run();
        }
      }
    }

    if (featuresList !== undefined) {
      db.delete(projectFeatures)
        .where(eq(projectFeatures.projectId, id))
        .run();

      if (featuresList.length > 0) {
        for (const feature of featuresList) {
          db.insert(projectFeatures)
            .values({
              id: nanoid(),
              projectId: id,
              title: feature.title,
              description: feature.description,
              order: feature.order,
            })
            .run();
        }
      }
    }

    const updated = db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/projects/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    db.delete(projectTechnologies)
      .where(eq(projectTechnologies.projectId, id))
      .run();
    db.delete(projectFeatures)
      .where(eq(projectFeatures.projectId, id))
      .run();
    db.delete(projects).where(eq(projects.id, id)).run();

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
