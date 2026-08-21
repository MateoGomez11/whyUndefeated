import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'whyundefeated_admin_auth';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Juanita0612florez.';

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return token === 'authenticated_admin_session';
  } catch {
    return false;
  }
}

export function isValidAdminPassword(pass: string): boolean {
  return pass === ADMIN_PASSWORD;
}

export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;
