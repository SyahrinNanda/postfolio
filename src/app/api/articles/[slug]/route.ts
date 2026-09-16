import { db } from '@/db';
import { articles } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';

type RouteContext<T extends string> = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/articles/[slug]'>) {
  try {
    const { slug } = await ctx.params;
    
    const article = await db.query.articles.findFirst({
      where: and(
        eq(articles.slug, slug),
        eq(articles.status, 'published')
      )
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
