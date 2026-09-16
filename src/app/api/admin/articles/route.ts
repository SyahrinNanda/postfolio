import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc, like, and, or, sql, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth-guard";
import { createArticleSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status) {
      conditions.push(eq(articles.status, status as "published" | "draft" | "archived"));
    }
    if (category) {
      conditions.push(eq(articles.category, category));
    }
    if (search) {
      conditions.push(
        or(
          like(articles.title, `%${search}%`),
          like(articles.summary, `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      db
        .select()
        .from(articles)
        .where(where)
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(articles).where(where),
    ]);

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.count || 0,
        totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
      },
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

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = nanoid();
    db.insert(articles).values({ id, ...parsed.data }).run();

    const created = db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
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

