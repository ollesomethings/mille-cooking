import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { EASE_STANDARD } from '@/lib/motion';

const TRACK_W = 48;
const TRACK_H = 28;
const THUMB = 22;
const PAD = 3;

/** Brand-styled iOS-like switch (RN's own Switch looks foreign on web). */
export function ToggleSwitch({ value, onColor = '#1F1E1D' }: { value: boolean; onColor?: string }) {
  const t = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    t.value = withTiming(value ? 1 : 0, { duration: 180, easing: EASE_STANDARD });
  }, [value, t]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], ['#E5E0D8', onColor]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: PAD + t.value * (TRACK_W - THUMB - PAD * 2) }],
  }));

  return (
    <Animated.View
      style={[
        { width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, justifyContent: 'center' },
        trackStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
          },
          thumbStyle,
        ]}
      />
    </Animated.View>
  );
}

/** A labeled switch row for settings-style option groups. */
export function ToggleRow({
  label,
  sub,
  value,
  onToggle,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      className="flex-row items-center px-4 active:opacity-70"
      style={{ minHeight: 56, gap: 12 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      aria-checked={value}
    >
      <View className="flex-1">
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 15 }}>
          {label}
        </Text>
        {sub ? (
          <Text className="text-secondary" style={{ fontSize: 13, lineHeight: 18, marginTop: 1 }}>
            {sub}
          </Text>
        ) : null}
      </View>
      <ToggleSwitch value={value} />
    </Pressable>
  );
}
