export interface ThreatBadgeProps {
  /** The verdict tier. Colors are an INDEPENDENT semantic system — never reused decoratively elsewhere. */
  tier?: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
}
