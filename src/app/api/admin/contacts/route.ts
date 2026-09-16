import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq, desc, like, and, or, count } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";
import { createContactSchema } from "@/lib/validations";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status) {
      conditions.push(
        eq(
          contacts.status,
          status as "unread" | "read" | "replied" | "archived"
        )
      );
    }
    if (search) {
      conditions.push(
        or(
          like(contacts.name, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.subject, `%${search}%`),
          like(contacts.message, `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      db
        .select()
        .from(contacts)
        .where(where)
        .orderBy(desc(contacts.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(contacts).where(where),
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
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = nanoid();
    db.insert(contacts)
      .values({
        id,
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || "Pesan Langsung",
        message: parsed.data.message,
        status: parsed.data.status || "unread",
      })
      .run();

    const created = db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
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


