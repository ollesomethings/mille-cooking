import { ReactNode } from 'react';

export interface BaseTextInputProps {
  variant?: 'default' | 'outlined' | 'standard';
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}
