export interface CardProps {
  /** Adds violet border + glow on hover. Set false for static, non-clickable cards. */
  interactive?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
