import type { ReactNode } from 'react';

export type SwitchLabelPosition = 'left' | 'right';
export type SwitchSize = 'sm' | 'default';

export interface BaseSwitchProps {
  /**
   * The size of the switch
   * @default 'sm' for web, 'default' for native
   */
  size?: SwitchSize;
  /**
   * The controlled state of the switch
   */
  value?: boolean;

  /**
   * The default state of the switch when uncontrolled
   * @default false
   */
  defaultValue?: boolean;

  /**
   * Whether the switch is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the switch is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * The label to display next to the switch
   */
  label?: ReactNode;

  /**
   * The position of the label relative to the switch
   * @default 'right'
   */
  labelPosition?: SwitchLabelPosition;

  /**
   * Whether haptic feedback is enabled
   * @default true
   */
  enableHaptics?: boolean;

  /**
   * Callback fired when the state changes
   */
  onValueChange?: (value: boolean) => void;
}
