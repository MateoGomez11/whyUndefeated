import { NextResponse } from 'next/server';
import { isValidAdminPassword, ADMIN_COOKIE } from '@/lib/admin/auth';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`admin_login_${ip}`, 5, 5 * 60 * 1000); // 5 attempts per 5 mins

  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many login attempts. Please wait ${rate.resetInSec} seconds before trying again.`,
      },
      { status: 429 },
    );
  }

  try {
    const { password } = await request.json();

    if (!password || !isValidAdminPassword(password)) {
      return NextResponse.json({ success: false, message: 'Invalid admin password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: 'Logged in' }, { status: 200 });
    response.cookies.set(ADMIN_COOKIE, 'authenticated_admin_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
  }
}
