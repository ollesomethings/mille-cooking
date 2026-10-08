import { ReactNode } from 'react';

export type BrandIconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type BrandIconProps = {
  className?: string;
  size?: BrandIconSize;
  bgColor: string;
  icon: ReactNode;
};
