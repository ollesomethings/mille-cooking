import * as React from 'react';
import {
  Pressable,
  PressableProps,
  View,
  GestureResponderEvent,
} from 'react-native';
import type { BaseIconButtonProps } from '@somethings-ui/core';
import { iconButtonStyles } from '@somethings-ui/core';
import { cn } from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';

export interface IconButtonProps
  extends Omit<PressableProps, keyof BaseIconButtonProps>, BaseIconButtonProps {
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  onPress?: (event: GestureResponderEvent) => void;
}

export const IconButton = React.forwardRef<View, IconButtonProps>(
  (
    {
      className,
      icon,
      variant,
      size,
      shape,
      disabled,
      onPress,
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Medium,
      ...props
    },
    ref,
  ) => {
    const handlePress = React.useCallback(
      async (event: GestureResponderEvent) => {
        if (enableHaptics && !disabled) {
          try {
            Haptics.impactAsync(hapticIntensity);
          } catch (error) {
            console.warn('Haptic feedback failed:', error);
          }
        }
        onPress?.(event);
      },
      [enableHaptics, hapticIntensity, disabled, onPress],
    );

    const shadowStyle =
      variant === 'secondary'
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }
        : undefined;

    return (
      <Pressable
        ref={ref}
        className={cn(iconButtonStyles({ variant, size, shape, className }))}
        style={shadowStyle}
        disabled={disabled}
        onPress={handlePress}
        accessibilityRole="button"
        {...props}
      >
        {icon}
      </Pressable>
    );
  },
);

IconButton.displayName = 'IconButton';
