import { NextResponse } from 'next/server';
import { submitAlternative } from '@/lib/alternatives/client';
import type { SubmissionPayload } from '@/lib/alternatives/types';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`submit_alt_${ip}`, 15, 60 * 60 * 1000); // 15 submissions per hour

  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Submission limit reached. Please wait ${Math.ceil(rate.resetInSec / 60)} minutes before submitting another app.`,
      },
      { status: 429 },
    );
  }

  try {
    const body: Partial<SubmissionPayload> = await request.json();
    const result = await submitAlternative(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request payload format.',
      },
      { status: 400 },
    );
  }
}
