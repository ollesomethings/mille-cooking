import { ReactNode } from 'react';

export interface BaseLinkProps {
  /**
   * The content of the link
   */
  children: ReactNode;
  /**
   * The variant of the link
   */
  variant?: 'primary' | 'brand';
  /**
   * Optional leading icon
   */
  leadingIcon?: ReactNode;
  /**
   * Optional trailing icon
   */
  trailingIcon?: ReactNode;
  /**
   * Whether the link is disabled
   */
  disabled?: boolean;
  /**
   * Optional className for custom styling
   */
  className?: string;
}
