import { NextResponse } from 'next/server';
import { toggleAlternativeVote } from '@/lib/alternatives/client';

export async function POST(request: Request) {
  try {
    const { alternative_id, voter_id } = await request.json();

    if (!alternative_id || !voter_id) {
      return NextResponse.json(
        { success: false, message: 'alternative_id and voter_id are required' },
        { status: 400 },
      );
    }

    const result = await toggleAlternativeVote(alternative_id, voter_id);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid vote request format' },
      { status: 400 },
    );
  }
}
