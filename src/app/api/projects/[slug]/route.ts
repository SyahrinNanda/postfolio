import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/projects/[slug]">
) {
  try {
    const { slug } = await ctx.params;

    const project = await db.query.projects.findFirst({
      where: and(eq(projects.slug, slug), eq(projects.status, "published")),
      with: {
        images: true,
        features: true,
        projectTechnologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
