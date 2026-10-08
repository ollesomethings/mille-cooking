import { ReactNode } from 'react';

export type ContentBlockAlignment = 'left' | 'center' | 'right';

export type ContentBlockSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export interface BaseContentBlockProps {
  /**
   * The header content to be rendered
   */
  header?: ReactNode;

  /**
   * The body content to be rendered below the header
   */
  body?: ReactNode;

  /**
   * The alignment of the content block
   * @default 'left'
   */
  alignment?: ContentBlockAlignment;

  /**
   * The size of the content block
   * @default 'm'
   */
  size?: ContentBlockSize;

  /**
   * Whether the content block should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Additional CSS class names for the container
   */
  className?: string;

  /**
   * Additional CSS class names for the header
   */
  headerClassName?: string;

  /**
   * Additional CSS class names for the body
   */
  bodyClassName?: string;
}
