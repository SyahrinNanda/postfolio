import { db } from '@/db';
import { experiences } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, asc } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    const data = await db.query.experiences.findMany({
      where: eq(experiences.status, 'active'),
      with: {
        experienceTechnologies: {
          with: {
            technology: true
          }
        }
      },
      orderBy: [asc(experiences.order)]
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
