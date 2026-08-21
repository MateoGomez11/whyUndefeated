export type AlternativeStatus = 'pending' | 'approved' | 'rejected';
export type VerificationTier = 'none' | 'verified' | 'priority';

export interface CommunityAlternative {
  id: string;
  target_slug?: string | null;
  target_name?: string | null;
  name: string;
  url: string;
  icon?: string | null;
  description: string;
  verification_tier?: VerificationTier;
  is_verified: boolean;
  upvotes_count: number;
  created_at: string;
}

export interface SubmissionPayload {
  target_slug?: string | null;
  name: string;
  url: string;
  icon?: string | null;
  description: string;
  creator_email: string;
  verification_tier?: VerificationTier;
  website_hp?: string; // Honeypot anti-spam
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  id?: string;
  checkout_url?: string;
  errors?: Record<string, string>;
}

export interface AlternativeVoteResult {
  success: boolean;
  voted: boolean;
  upvotes: number;
  message?: string;
}
