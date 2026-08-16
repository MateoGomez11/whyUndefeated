export interface BadgeProps {
  /** neutral = category/metadata tag, brand = violet-highlighted tag */
  tone?: 'neutral' | 'brand';
  children?: React.ReactNode;
}
