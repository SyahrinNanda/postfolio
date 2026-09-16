import { db } from '@/db';
import { contacts } from '@/db/schema';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { contactFormSchema } from '@/lib/validations';

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 4; // Max 4 messages per 10 minutes

// Helper to get client IP
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ------------------------------------------------------------------------
    // LAYER 1: Honeypot Protection
    // ------------------------------------------------------------------------
    // Spambots populate hidden fields. If companyUrl is filled, silently succeed
    // without storing the message into SQLite so bots don't adapt.
    if (body.companyUrl && typeof body.companyUrl === 'string' && body.companyUrl.trim().length > 0) {
      console.warn('🤖 Spam blocked: honeypot field filled');
      return NextResponse.json(
        { success: true, message: 'Pesan Anda berhasil terkirim.' },
        { status: 200 }
      );
    }

    // ------------------------------------------------------------------------
    // LAYER 2: Timestamp / Timing Protection
    // ------------------------------------------------------------------------
    // Humans take at least 2.5s to read, type, and submit the contact form.
    // Automated bots submit within milliseconds.
    if (body._ts) {
      const formRenderedAt = Number(body._ts);
      const now = Date.now();
      const elapsed = now - formRenderedAt;

      // Submitted under 2 seconds or timestamp generated in the future
      if (elapsed < 2000 || formRenderedAt > now + 10000) {
        console.warn(`🤖 Spam blocked: submission too fast (${elapsed}ms)`);
        return NextResponse.json(
          { success: true, message: 'Pesan Anda berhasil terkirim.' },
          { status: 200 }
        );
      }
    }

    // ------------------------------------------------------------------------
    // LAYER 3: In-Memory IP Rate Limiting
    // ------------------------------------------------------------------------
    const clientIp = getClientIp(req);
    const now = Date.now();
    const timestamps = (rateLimitMap.get(clientIp) || []).filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`⚠️ Rate limit exceeded for IP ${clientIp}`);
      return NextResponse.json(
        {
          error:
            'Terlalu banyak pesan yang dikirim dari perangkat ini. Silakan tunggu beberapa menit sebelum mencoba kembali.',
        },
        { status: 429 }
      );
    }

    // ------------------------------------------------------------------------
    // Schema Validation
    // ------------------------------------------------------------------------
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Data formulir tidak valid', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------------
    // LAYER 4: Link Frequency & Heuristic Spam Check
    // ------------------------------------------------------------------------
    const messageText = result.data.message;
    const urlPattern = /(https?:\/\/|www\.)/gi;
    const urlMatches = messageText.match(urlPattern) || [];

    // Spambots usually insert multiple promotional or malicious URLs
    if (urlMatches.length > 2) {
      return NextResponse.json(
        {
          error:
            'Pesan tidak boleh mengandung lebih dari 2 tautan URL untuk mematuhi kebijakan anti-spam.',
        },
        { status: 400 }
      );
    }

    // Common automated spam phrases
    const spamKeywords = [
      'casino',
      'viagra',
      'seo backlink',
      'crypto giveaway',
      'free bitcoin',
      'telegram bot',
      'whatsapp spam',
    ];
    const lowerMessage = messageText.toLowerCase();
    const containsSpamKeyword = spamKeywords.some((kw) => lowerMessage.includes(kw));
    if (containsSpamKeyword) {
      console.warn('🤖 Spam blocked: spam keyword matched');
      return NextResponse.json(
        { success: true, message: 'Pesan Anda berhasil terkirim.' },
        { status: 200 }
      );
    }

    // Update rate limit tracking
    timestamps.push(now);
    rateLimitMap.set(clientIp, timestamps);

    // Save to database
    const newContact = {
      id: nanoid(),
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject || 'Pesan dari Portofolio',
      message: result.data.message,
      status: 'unread' as const,
    };

    await db.insert(contacts).values(newContact);

    return NextResponse.json(
      { success: true, message: 'Pesan berhasil dikirim dan tersimpan.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
