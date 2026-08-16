export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** md = table filter bar, lg = prominent hero search with violet glow border */
  size?: 'md' | 'lg';
  /** Leading glyph — '/' for compact filter bars, '>' for the terminal-style hero search */
  prefix?: string;
}
