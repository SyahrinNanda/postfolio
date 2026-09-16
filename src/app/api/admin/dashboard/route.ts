import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, articles, experiences, contacts } from '@/db/schema';
import { desc, sql, count } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const [
      totalProjects,
      totalArticlesResult,
      totalExperiences,
      totalContactsResult,
      recentMessages,
      recentProjects
    ] = await Promise.all([
      db.select({ count: count() }).from(projects),
      db.select({ 
        total: count(), 
        drafts: count(sql`CASE WHEN ${articles.status} = 'draft' THEN 1 END`) 
      }).from(articles),
      db.select({ count: count() }).from(experiences),
      db.select({
        total: count(),
        unread: count(sql`CASE WHEN ${contacts.status} = 'unread' THEN 1 END`)
      }).from(contacts),
      db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(5),
      db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(5)
    ]);

    return NextResponse.json({
      data: {
        projects: {
          total: totalProjects[0]?.count || 0
        },
        articles: {
          total: totalArticlesResult[0]?.total || 0,
          drafts: totalArticlesResult[0]?.drafts || 0
        },
        experiences: {
          total: totalExperiences[0]?.count || 0
        },
        contacts: {
          total: totalContactsResult[0]?.total || 0,
          unread: totalContactsResult[0]?.unread || 0
        },
        recentMessages,
        recentProjects
      }
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
