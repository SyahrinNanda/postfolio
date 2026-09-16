import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";
import { updateContactSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/contacts/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const contact = db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .get();

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: contact });
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
  ctx: RouteContext<"/api/admin/contacts/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    db.update(contacts)
      .set(parsed.data)
      .where(eq(contacts.id, id))
      .run();

    const updated = db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
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
  ctx: RouteContext<"/api/admin/contacts/[id]">
) {
  try {
    await requireAuth();
    const { id } = await ctx.params;

    const contact = db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .get();

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    db.delete(contacts).where(eq(contacts.id, id)).run();
    return NextResponse.json({ message: "Contact deleted" });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

