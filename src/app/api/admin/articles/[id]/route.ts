import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";
import { updateArticleSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/articles/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const article = db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .get();

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: article });
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
  ctx: RouteContext<"/api/admin/articles/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    db.update(articles).set(parsed.data).where(eq(articles.id, id)).run();

    const updated = db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
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
  ctx: RouteContext<"/api/admin/articles/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const article = db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .get();

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    db.delete(articles).where(eq(articles.id, id)).run();
    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

