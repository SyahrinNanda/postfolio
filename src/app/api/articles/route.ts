import { db } from '@/db';
import { articles } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, desc, like, and, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const offset = (page - 1) * limit;
    
    const conditions = [];
    if (status) {
      conditions.push(
        eq(articles.status, status as "published" | "draft" | "archived")
      );
    }
    if (category) {
      conditions.push(eq(articles.category, category));
    }
    if (tag) {
      conditions.push(like(articles.tags, `%${tag}%`));
    }
    if (search) {
      conditions.push(or(
        like(articles.title, `%${search}%`),
        like(articles.summary, `%${search}%`)
      ));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.articles.findMany({
      where: whereClause,
      orderBy: [desc(articles.publishedDate)],
      limit,
      offset,
    });

    return NextResponse.json({ data, pagination: { page, limit } });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
