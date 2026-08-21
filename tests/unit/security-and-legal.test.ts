import { isValidAdminPassword } from '@/lib/admin/auth';
import { checkRateLimit } from '@/lib/security/rateLimit';

describe('Admin Authentication & Security Rate Limiting', () => {
  test('authenticates valid admin password Juanita0612florez.', () => {
    expect(isValidAdminPassword('Juanita0612florez.')).toBe(true);
    expect(isValidAdminPassword('wrongpassword')).toBe(false);
    expect(isValidAdminPassword('')).toBe(false);
  });

  test('rate limiter tracks and blocks requests exceeding threshold', () => {
    const key = 'test_ip_rate_limit';
    // Allow up to 3 requests
    const res1 = checkRateLimit(key, 3, 1000);
    expect(res1.allowed).toBe(true);

    const res2 = checkRateLimit(key, 3, 1000);
    expect(res2.allowed).toBe(true);

    const res3 = checkRateLimit(key, 3, 1000);
    expect(res3.allowed).toBe(true);

    const res4 = checkRateLimit(key, 3, 1000);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);
  });
});
