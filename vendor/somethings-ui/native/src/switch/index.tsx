import type { BaseSwitchProps } from '@somethings-ui/core';
import {
  cn,
  switchContainerStyles,
  switchThumbStyles,
  switchWrapperStyles,
} from '@somethings-ui/core';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

export interface SwitchProps
  extends
    Omit<React.ComponentProps<typeof Pressable>, keyof BaseSwitchProps>,
    BaseSwitchProps {
  className?: string;
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
}

export const Switch = React.forwardRef<View, SwitchProps>(
  (
    {
      value,
      defaultValue = false,
      disabled = false,
      loading = false,
      size = 'default',
      label,
      labelPosition = 'right',
      className,
      enableHaptics = true,
      hapticIntensity = Haptics.ImpactFeedbackStyle.Light,
      onValueChange,
      style,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const checked = isControlled ? value : internalValue;

    const spinValue = useSharedValue(0);

    React.useEffect(() => {
      scheduleOnUI(() => {
        'worklet';
        if (loading) {
          spinValue.set(
            withRepeat(withTiming(1, { duration: 1000 }), -1, true),
          );
        } else {
          spinValue.set(0);
        }
      });
    }, [loading, spinValue]);

    const spinStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${spinValue.value * 360}deg` }],
    }));

    const translateDistance = size === 'default' ? 26 : 20;
    const thumbStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: checked ? translateDistance : 0,
        },
      ],
    }));

    const handlePress = React.useCallback(() => {
      if (disabled || loading) return;

      const newValue = !checked;

      if (enableHaptics) {
        try {
          Haptics.impactAsync(hapticIntensity);
        } catch (error) {
          console.warn('Haptic feedback failed:', error);
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    }, [
      checked,
      disabled,
      loading,
      enableHaptics,
      hapticIntensity,
      isControlled,
      onValueChange,
    ]);

    const switchElement = (
      <Pressable
        ref={ref}
        className={cn(
          switchContainerStyles({
            checked,
            disabled,
            size,
            className,
          }),
        )}
        disabled={disabled || loading}
        onPress={handlePress}
        style={[typeof style === 'function' ? undefined : style]}
        {...props}
      >
        <Animated.View
          className={cn(switchThumbStyles({ checked, size }))}
          style={thumbStyle}
        >
          {loading && (
            <View className="absolute inset-0 flex items-center justify-center">
              <Animated.View
                className="w-2 h-2 border border-transparent rounded-full border-t-gray-400"
                style={spinStyle}
              />
            </View>
          )}
        </Animated.View>
      </Pressable>
    );

    if (!label) {
      return switchElement;
    }

    return (
      <View className={cn(switchWrapperStyles())}>
        {labelPosition === 'left' && <View className="flex-1">{label}</View>}
        {switchElement}
        {labelPosition === 'right' && <View className="flex-1">{label}</View>}
      </View>
    );
  },
);

Switch.displayName = 'Switch';
