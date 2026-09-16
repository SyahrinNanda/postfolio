import { db } from '@/db';
import { technologies } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, asc } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const data = await db.query.technologies.findMany({
      where: eq(technologies.status, 'active'),
      orderBy: [asc(technologies.category), asc(technologies.order)]
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
