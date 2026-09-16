import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  projects,
  projectTechnologies,
  projectFeatures,
  technologies,
} from "@/db/schema";
import { eq, desc, asc, like, and, or, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { createProjectSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(projects.title, `%${search}%`),
          like(projects.shortDescription, `%${search}%`)
        )!
      );
    }
    if (category) {
      conditions.push(eq(projects.category, category));
    }
    if (status) {
      conditions.push(
        eq(
          projects.status,
          status as "published" | "draft" | "archived"
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = db
      .select()
      .from(projects)
      .where(where)
      .orderBy(asc(projects.order), desc(projects.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    // Get technologies for each project
    const projectsWithTech = await Promise.all(
      result.map(async (project) => {
        const techs = await db
          .select({ technology: technologies })
          .from(projectTechnologies)
          .innerJoin(
            technologies,
            eq(projectTechnologies.technologyId, technologies.id)
          )
          .where(eq(projectTechnologies.projectId, project.id));

        const features = db
          .select()
          .from(projectFeatures)
          .where(eq(projectFeatures.projectId, project.id))
          .all();

        return {
          ...project,
          technologies: techs.map((t) => t.technology),
          features,
        };
      })
    );

    const totalResult = db
      .select({ count: count() })
      .from(projects)
      .where(where)
      .all();

    return NextResponse.json({
      data: projectsWithTech,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.count || 0,
        totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error fetching projects:", error);
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
    const parsed = createProjectSchema.safeParse(body);

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
    const projectId = nanoid();

    db.insert(projects).values({ id: projectId, ...projectData }).run();

    // Link technologies
    if (techIds?.length) {
      for (const techId of techIds) {
        db.insert(projectTechnologies)
          .values({
            id: nanoid(),
            projectId,
            technologyId: techId,
          })
          .run();
      }
    }

    // Add features
    if (featuresList?.length) {
      for (const feature of featuresList) {
        db.insert(projectFeatures)
          .values({
            id: nanoid(),
            projectId,
            title: feature.title,
            description: feature.description,
            order: feature.order,
          })
          .run();
      }
    }

    const created = db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
