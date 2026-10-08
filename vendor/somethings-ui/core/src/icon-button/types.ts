import { ReactNode } from 'react';

export interface BaseIconButtonProps {
  /**
   * The icon to be displayed
   */
  icon: ReactNode;
  /**
   * The size of the button
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * The variant of the button
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'glass'
    | 'ghost-black'
    | 'ghost-gray'
    | 'destructive'
    | 'header-ghost'
    | 'header-glass'
    | 'header-elevated';
  /**
   * The shape of the button
   */
  shape?: 'circle' | 'round-rectangle';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Optional aria-label for accessibility
   */
  'aria-label'?: string;
}
