import { ReactNode } from 'react';

export interface SelectGroupOption {
  label: string;
  value: string;
  icon?: ReactNode;
  description?: string;
}

export type SelectGroupValue = string | string[];

interface CommonSelectGroupProps {
  variant?: SelectGroupVariant;
  className?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  selectedTextClassName?: string;
  checkmarkClassName?: string;
  textAlign?: SelectGroupTextAlign;
}

export interface BaseSelectGroupProps extends CommonSelectGroupProps {
  options: SelectGroupOption[];
  value?: SelectGroupValue;
  onChange: (value: SelectGroupValue) => void;
  multiple?: boolean;
  maxSelected?: number;
  hideBorders?: boolean;
}

export interface SelectGroupItemProps extends CommonSelectGroupProps {
  option: SelectGroupOption;
  isSelected: boolean;
  onClick: () => void;
  count?: number;
  disabled?: boolean;
  hideBorders?: boolean;
  height?: string;
  description?: string;
}

export type SelectGroupVariant = 'stacked' | 'inline' | 'detailed';
export type SelectGroupTextAlign = 'left' | 'center' | 'right';
