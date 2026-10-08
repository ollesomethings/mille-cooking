import { ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'destructive'
  | 'elevated'

  // DEPRECATED
  | 'brand'
  | 'ghost-black'
  | 'ghost-gray';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonShape = 'rounded' | 'square' | 'pill';

export interface BaseButtonProps {
  /**
   * The content to be rendered inside the button
   */
  children?: ReactNode;

  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * The shape of the button
   * @default 'rounded'
   */
  shape?: ButtonShape;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to be displayed before the button content
   */
  leadingIcon?: ReactNode;

  /**
   * Icon to be displayed after the button content
   */
  trailingIcon?: ReactNode;

  /**
   * The function to call when the button is clicked
   */
  onPress?: (event?: any) => void;
}
