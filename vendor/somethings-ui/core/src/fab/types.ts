import { BaseIconButtonProps } from '../icon-button/types';

export interface FABOption extends Omit<BaseIconButtonProps, 'icon'> {
  id: string;
  label: string;
  subLabel?: string;
  icon?: BaseIconButtonProps['icon'];
  onPress?: (event: unknown) => void;
}

export interface BaseFABProps {
  options: FABOption[];
  position?: 'bottom-left' | 'bottom-right';
  bottomOffset?: number;
  horizontalOffset?: number;
  onOpenChange?: (isOpen: boolean) => void;
}
