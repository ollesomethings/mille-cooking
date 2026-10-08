import { ReactNode } from 'react';

export interface BaseModalProps {
  /**
   * Whether the modal is visible
   */
  visible?: boolean;

  /**
   * The content to be rendered inside the modal
   */
  children?: ReactNode;

  /**
   * The title of the modal
   */
  title?: string;

  /**
   * Whether the modal can be dismissed by tapping outside or swiping down
   * @default true
   */
  dismissible?: boolean;

  /**
   * The description of the modal
   */
  description?: string;

  /**
   * Callback fired when the modal is dismissed
   */
  onDismiss?: () => void;

  /**
   * Callback fired when the close button is pressed
   */
  onClose?: () => void;
}
