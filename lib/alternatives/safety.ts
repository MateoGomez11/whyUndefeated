const BLOCKED_KEYWORDS = [
  'casino',
  'gambling',
  'viagra',
  'cialis',
  'free crypto',
  'airdrop token',
  'hack tool',
  'crack software',
  'telegram pump',
  'binance gift',
  'free robux',
  'free v-bucks',
  'adult webcam',
  'loan fast cash',
  'payday advance',
];

const SUSPICIOUS_EXTENSIONS = ['.exe', '.scr', '.bat', '.vbs', '.apk', '.dmg', '.sh', '.cmd', '.msi'];

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
}

export function evaluateSubmissionSafety(payload: {
  name: string;
  url: string;
  description: string;
  creator_email: string;
}): SafetyCheckResult {
  const name = payload.name.trim();
  const urlStr = payload.url.trim();
  const description = payload.description.trim();

  // 1. Text length and gibberish checks
  if (name.length < 2) {
    return { isSafe: false, reason: 'App name is too short.' };
  }
  if (description.length < 5) {
    return { isSafe: false, reason: 'Description is too brief.' };
  }

  // 2. Keyword check for spam / scams
  const combinedText = `${name} ${description}`.toLowerCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return {
        isSafe: false,
        reason: `Submission contains restricted or promotional keywords ("${keyword}").`,
      };
    }
  }

  // 3. URL safety check
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlStr);
  } catch {
    return { isSafe: false, reason: 'Invalid web URL format.' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { isSafe: false, reason: 'Only HTTP and HTTPS URLs are allowed.' };
  }

  // Check for suspicious file downloads in pathname
  const lowerPath = parsedUrl.pathname.toLowerCase();
  for (const ext of SUSPICIOUS_EXTENSIONS) {
    if (lowerPath.endsWith(ext)) {
      return { isSafe: false, reason: `Direct binary downloads (${ext}) are not permitted.` };
    }
  }

  // Check for metadata IP or localhost attacks (allow localhost only in local development)
  const host = parsedUrl.hostname.toLowerCase();
  if (host === '169.254.169.254' || host === '0.0.0.0') {
    return { isSafe: false, reason: 'Private IP addresses are not permitted.' };
  }

  return { isSafe: true };
}
