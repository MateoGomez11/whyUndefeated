export interface ButtonProps {
  /** Visual treatment: primary = solid violet, secondary = outlined, ghost = text-only */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
