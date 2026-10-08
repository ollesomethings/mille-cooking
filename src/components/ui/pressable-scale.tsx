import { cssInterop } from 'nativewind';
import { forwardRef } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);
// Custom/animated components aren't auto-interop'd by NativeWind — without
// this, className silently no-ops (on web it drops rounding/padding).
cssInterop(AnimatedPressableBase, { className: 'style' });

export interface PressableScaleProps extends PressableProps {
  /** How far the scale dips on press-in. Default 0.98 — barely-there, just enough to read as a press. */
  scaleTo?: number;
}

/**
 * A Pressable that scales down on press-in and settles back on release —
 * no bounce, no overshoot. The one bit of tactile feedback every icon
 * button / card / chip in this pass should share, so interactivity reads
 * before release, not after.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(
  ({ scaleTo = 0.98, style, onPressIn, onPressOut, children, ...props }, ref) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressableBase
        ref={ref}
        style={[animatedStyle, style]}
        onPressIn={e => {
          scale.value = withTiming(scaleTo, { duration: 80 });
          onPressIn?.(e);
        }}
        onPressOut={e => {
          scale.value = withTiming(1, { duration: 120 });
          onPressOut?.(e);
        }}
        {...props}
      >
        {children}
      </AnimatedPressableBase>
    );
  },
);

PressableScale.displayName = 'PressableScale';
