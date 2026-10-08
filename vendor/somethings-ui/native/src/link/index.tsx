import * as React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import type { BaseLinkProps } from '@somethings-ui/core';
import { linkStyles } from '@somethings-ui/core';
import { cn } from '@somethings-ui/core';

export interface LinkProps
  extends Omit<PressableProps, keyof BaseLinkProps>, BaseLinkProps {}

export const Link = React.forwardRef<View, LinkProps>(
  (
    {
      className,
      children,
      variant,
      leadingIcon,
      trailingIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <Pressable
        ref={ref}
        className={cn(
          linkStyles({ variant, disabled, className }),
          'active:opacity-80',
        )}
        disabled={disabled}
        accessibilityRole="link"
        {...props}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </Pressable>
    );
  },
);

Link.displayName = 'Link';
