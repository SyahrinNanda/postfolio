import { db } from '@/db';
import { projects } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, desc, asc, like, and, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const offset = (page - 1) * limit;
    
    const conditions = [];
    if (status) {
      conditions.push(
        eq(projects.status, status as "published" | "draft" | "archived")
      );
    }
    if (category) {
      conditions.push(eq(projects.category, category));
    }
    if (featured) {
      conditions.push(eq(projects.featured, true));
    }
    if (search) {
      conditions.push(or(
        like(projects.title, `%${search}%`),
        like(projects.shortDescription, `%${search}%`)
      ));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.projects.findMany({
      where: whereClause,
      with: {
        projectTechnologies: {
          with: {
            technology: true
          }
        }
      },
      orderBy: [asc(projects.order), desc(projects.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ data, pagination: { page, limit } });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
