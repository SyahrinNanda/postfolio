import { db } from '@/db';
import { skills } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, asc } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const data = await db.query.skills.findMany({
      where: eq(skills.status, 'active'),
      orderBy: [asc(skills.category), asc(skills.order)]
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
