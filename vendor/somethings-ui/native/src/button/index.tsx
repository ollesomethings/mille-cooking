import * as React from 'react';
import {
  Pressable,
  Text,
  View,
  GestureResponderEvent,
  Animated,
} from 'react-native';

import type { BaseButtonProps } from '@somethings-ui/core';
import {
  buttonContainerStyles,
  buttonTextStyles,
  buttonIconStyles,
  getButtonTextColor,
  getButtonSpinnerColor,
} from '@somethings-ui/core';
import { cn } from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';

export interface ButtonProps
  extends
    Omit<React.ComponentProps<typeof Pressable>, keyof BaseButtonProps>,
    BaseButtonProps {
  className?: string;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  labelClassName?: string;
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  onPress?: (event: GestureResponderEvent) => void;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      disabled = false,
      loading,
      children,
      onPress,
      className,
      fullWidth,
      leadingIcon,
      trailingIcon,
      labelClassName,
      shape = 'pill',
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Medium,
      style,
      ...props
    },
    ref,
  ) => {
    const getIconVariant = () => {
      if ((loading || leadingIcon) && trailingIcon) return 'both';
      if (loading || leadingIcon) return 'leading';
      if (trailingIcon) return 'trailing';
      return 'none';
    };

    const spinValue = React.useRef(new Animated.Value(0)).current;
    const textRef = React.useRef<Text>(null);
    const [textWidth, setTextWidth] = React.useState<number>(0);

    React.useEffect(() => {
      if (loading) {
        const spinAnimation = Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        );
        spinAnimation.start();
      } else {
        spinValue.setValue(0);
      }
    }, [loading, spinValue]);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const handleTextLayout = React.useCallback((event: any) => {
      const { width } = event.nativeEvent.layout;
      setTextWidth(width);
    }, []);

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

    const spinnerColor = getButtonSpinnerColor(variant);
    const textColor = getButtonTextColor(variant);

    return (
      <Pressable
        ref={ref}
        className={cn(
          buttonContainerStyles({
            variant,
            size,
            fullWidth,
            withIcon: getIconVariant(),
            shape,
            className,
            disabled,
          }),
        )}
        disabled={disabled}
        onPress={handlePress}
        style={[
          typeof style === 'function' ? undefined : style,
          loading && textWidth > 0 ? { minWidth: textWidth + 48 } : undefined, // 48px for padding and icon spacing
        ]}
        {...props}
      >
        {loading ? (
          <View className={buttonIconStyles({ variant, size })}>
            <Animated.View
              style={{
                width: 16,
                height: 16,
                borderWidth: 2,
                borderTopColor: spinnerColor,
                borderRightColor: spinnerColor,
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRadius: 8,
                transform: [{ rotate: spin }],
              }}
            />
          </View>
        ) : (
          leadingIcon && (
            <View className={buttonIconStyles({ variant, size })}>
              {leadingIcon}
            </View>
          )
        )}
        {!loading && (
          <Text
            ref={textRef}
            onLayout={handleTextLayout}
            className={cn(
              buttonTextStyles({ variant, size, disabled: disabled }),
              labelClassName,
            )}
            style={{ color: textColor }}
          >
            {children}
          </Text>
        )}
        {trailingIcon && (
          <View className={buttonIconStyles({ variant, size })}>
            {trailingIcon}
          </View>
        )}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
