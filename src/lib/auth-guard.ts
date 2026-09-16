import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Verifies the current request has an authenticated session.
 * Use this in admin API route handlers.
 *
 * @returns The session object if authenticated
 * @throws NextResponse with 401 if not authenticated
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Wrapper for admin API route handlers that automatically
 * checks authentication before running the handler.
 */
export function withAuth<T>(
  handler: (
    request: Request,
    session: Awaited<ReturnType<typeof requireAuth>>,
    context?: T
  ) => Promise<Response>
) {
  return async (request: Request, context?: T) => {
    try {
      const session = await requireAuth();
      return handler(request, session, context);
    } catch (error) {
      if (error instanceof NextResponse) {
        return error;
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

