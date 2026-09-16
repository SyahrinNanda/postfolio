import { db } from '@/db';
import { profiles } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const profile = await db.query.profiles.findFirst();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
