import type { SubmissionPayload } from './types';

export const VALID_TARGET_SLUGS = [
  'wikipedia',
  'goodreads',
  'reddit',
  'stack-overflow',
  'pinterest',
  'imdb',
  'chess-com',
  'notion',
  'duolingo',
  'spotify',
  'figma',
  'linkedin',
  'tiktok',
  'twitter-x',
  'general',
];

export function sanitizeUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // Strictly check protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  // Block dangerous schemes or pseudo-schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('javascript:') ||
    lower.includes('data:') ||
    lower.includes('vbscript:') ||
    lower.includes('file:')
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 120;
}

export function validateSubmission(payload: Partial<SubmissionPayload>): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized?: SubmissionPayload;
} {
  const errors: Record<string, string> = {};

  // Honeypot check (must be completely empty)
  if (payload.website_hp && payload.website_hp.trim() !== '') {
    return {
      isValid: false,
      errors: { bot: 'Spam detected. Submission rejected.' },
    };
  }

  // Name
  const name = (payload.name || '').trim();
  if (!name) {
    errors.name = 'App name is required.';
  } else if (name.length > 60) {
    errors.name = 'App name cannot exceed 60 characters.';
  }

  // URL
  const rawUrl = (payload.url || '').trim();
  const sanitizedUrl = sanitizeUrl(rawUrl);
  if (!rawUrl) {
    errors.url = 'Website URL is required.';
  } else if (!sanitizedUrl) {
    errors.url = 'Please provide a valid web URL starting with https:// or http://';
  }

  // Description
  const description = (payload.description || '').trim();
  if (!description) {
    errors.description = 'Short description is required.';
  } else if (description.length < 5) {
    errors.description = 'Description must be at least 5 characters.';
  } else if (description.length > 160) {
    errors.description = 'Description cannot exceed 160 characters.';
  }

  // Creator Email
  const email = (payload.creator_email || '').trim();
  if (!email) {
    errors.creator_email = 'Contact email is required.';
  } else if (!validateEmail(email)) {
    errors.creator_email = 'Please provide a valid email address.';
  }

  // Target Slug
  let targetSlug = payload.target_slug ? payload.target_slug.trim().toLowerCase() : 'general';
  if (targetSlug === '' || targetSlug === 'none') {
    targetSlug = 'general';
  }
  if (!VALID_TARGET_SLUGS.includes(targetSlug)) {
    errors.target_slug = 'Selected incumbent app is invalid.';
  }

  // Icon (optional: emoji, http URL, or data:image base64)
  let icon = (payload.icon || '').trim();
  if (!icon) {
    icon = '⚡';
  } else if (icon.startsWith('data:image/')) {
    // Valid image data URL, cap size at 200KB
    if (icon.length > 200000) {
      errors.icon = 'Image file is too large. Please upload an image under 200KB.';
    }
  } else if (/^https?:\/\//i.test(icon)) {
    const sanitizedIconUrl = sanitizeUrl(icon);
    if (!sanitizedIconUrl) {
      errors.icon = 'Invalid icon URL.';
    } else {
      icon = sanitizedIconUrl;
    }
  } else if (icon.length > 30) {
    // If not a URL or data URL, it's an emoji/symbol string; cap at 30 chars
    icon = icon.slice(0, 30);
  }

  // Verification Tier
  let verificationTier: 'none' | 'verified' | 'priority' = 'none';
  if (payload.verification_tier === 'priority') {
    verificationTier = 'priority';
  } else if (payload.verification_tier === 'verified') {
    verificationTier = 'verified';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    sanitized: {
      name,
      url: sanitizedUrl!,
      description,
      creator_email: email,
      target_slug: targetSlug === 'general' ? null : targetSlug,
      icon,
      verification_tier: verificationTier,
    },
  };
}
