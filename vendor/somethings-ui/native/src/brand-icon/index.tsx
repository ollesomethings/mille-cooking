import {
  BrandIconProps,
  getBrandIconSizeStyles,
  brandIconBaseStyles,
  cn,
} from '@somethings-ui/core';
import { View } from 'react-native';

export function BrandIcon(props: BrandIconProps) {
  const { size, icon, bgColor, className } = props;
  return (
    <View
      className={cn(
        brandIconBaseStyles,
        getBrandIconSizeStyles(size),
        bgColor,
        className,
      )}
    >
      {icon}
    </View>
  );
}
