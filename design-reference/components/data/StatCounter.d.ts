export interface StatCounterProps {
  value: number;
  label?: string;
  suffix?: string;
  /** Count-up animation duration in ms */
  duration?: number;
  /** lg bumps the digit size to 72px for hero-level emphasis (e.g. tier stat blocks) */
  size?: 'md' | 'lg';
  /** Digit color override — e.g. a threat tier color for a tinted stat block */
  numberColor?: string;
}
