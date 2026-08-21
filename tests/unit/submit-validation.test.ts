import { validateSubmission, sanitizeUrl, validateEmail } from '@/lib/alternatives/validation';

describe('Submit Form Validation & Anti-Spam (US1)', () => {
  test('validates URL protocol strictly (only https/http allowed)', () => {
    expect(sanitizeUrl('https://kagi.com')).toBe('https://kagi.com/');
    expect(sanitizeUrl('http://sub.domain.org/path')).toBe('http://sub.domain.org/path');

    // Malicious schemes must return null
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBeNull();
    expect(sanitizeUrl('file:///etc/passwd')).toBeNull();
    expect(sanitizeUrl('not-a-url')).toBeNull();
  });

  test('validates email addresses properly', () => {
    expect(validateEmail('founder@example.com')).toBe(true);
    expect(validateEmail('dev+tools@startup.io')).toBe(true);

    expect(validateEmail('')).toBe(false);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@no-user.com')).toBe(false);
  });

  test('accepts valid submission payload with correct sanitization', () => {
    const payload = {
      name: 'Kagi Assistant',
      url: 'https://kagi.com',
      description: 'Privacy search with AI summarization.',
      creator_email: 'founder@kagi.com',
      target_slug: 'wikipedia',
      icon: '⚡',
      verification_tier: 'verified' as const,
      website_hp: '',
    };

    const res = validateSubmission(payload);
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual({});
    expect(res.sanitized?.name).toBe('Kagi Assistant');
    expect(res.sanitized?.target_slug).toBe('wikipedia');
    expect(res.sanitized?.verification_tier).toBe('verified');
  });

  test('rejects spam when honeypot field is filled by bots', () => {
    const botPayload = {
      name: 'Spam Bot Tool',
      url: 'https://spam.com',
      description: 'Buy cheap watches online now.',
      creator_email: 'bot@spam.com',
      website_hp: 'http://spam-link.ru',
    };

    const res = validateSubmission(botPayload);
    expect(res.isValid).toBe(false);
    expect(res.errors.bot).toContain('Spam detected');
  });

  test('validates missing required fields and character limits', () => {
    const invalidPayload = {
      name: '',
      url: 'ftp://invalid-proto.com',
      description: 'abc', // too short (<5 chars)
      creator_email: 'bad-email',
    };

    const res = validateSubmission(invalidPayload);
    expect(res.isValid).toBe(false);
    expect(res.errors.name).toBeTruthy();
    expect(res.errors.url).toBeTruthy();
    expect(res.errors.description).toBeTruthy();
    expect(res.errors.creator_email).toBeTruthy();
  });
});
