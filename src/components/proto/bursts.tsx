import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Tiny fire-and-forget particle bursts, transform-only (no layout anim).
 * Mount one with a fresh `key` to play it; the parent unmounts it after
 * `duration`. Positions are relative to the parent (usually an absolutely
 * positioned, pointerEvents="none" wrapper).
 */

const BRAND = ['#71E0FF', '#B164FF', '#C2DF4F', '#FF9812', '#E85C82'];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function Shard({
  angle,
  distance,
  size,
  color,
  duration,
}: {
  angle: number;
  distance: number;
  size: number;
  color: string;
  duration: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
  }, [t, duration]);
  const spin = useMemo(() => rand(-540, 540), []);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - t.value * t.value,
    transform: [
      { translateX: Math.cos(angle) * distance * t.value },
      { translateY: Math.sin(angle) * distance * t.value + 30 * t.value * t.value },
      { rotate: `${spin * t.value}deg` },
      { scale: 1 - 0.4 * t.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size * 0.6,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/** Confetti shards exploding out of the mount point. */
export function ConfettiBurst({
  count = 14,
  spread = 150,
  duration = 800,
}: {
  count?: number;
  spread?: number;
  duration?: number;
}) {
  const shards = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * Math.PI * 2 + rand(-0.3, 0.3),
        distance: rand(spread * 0.5, spread),
        size: rand(8, 16),
        color: BRAND[i % BRAND.length],
      })),
    [count, spread],
  );
  return (
    <View pointerEvents="none" style={{ position: 'absolute', width: 1, height: 1 }}>
      {shards.map(s => (
        <Shard key={s.id} {...s} duration={duration} />
      ))}
    </View>
  );
}

function FloatingWord({
  text,
  color,
  delay,
  drift,
  rise,
  tilt,
  duration,
}: {
  text: string;
  color: string;
  delay: number;
  drift: number;
  rise: number;
  tilt: number;
  duration: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    const id = setTimeout(() => {
      t.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
    }, delay);
    return () => clearTimeout(id);
  }, [t, delay, duration]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.15 ? t.value / 0.15 : 1 - (t.value - 0.15) / 0.85,
    transform: [
      { translateY: -rise * t.value },
      { translateX: drift * Math.sin(t.value * Math.PI * 1.6) },
      { rotate: `${tilt}deg` },
      { scale: 0.75 + 0.4 * t.value },
    ],
  }));
  return (
    <Animated.Text
      style={[{ position: 'absolute', fontFamily: 'Caveat_600SemiBold', fontSize: 24, color }, style]}
    >
      {text}
    </Animated.Text>
  );
}

function FloatingDot({
  color,
  delay,
  drift,
  rise,
  size,
  duration,
}: {
  color: string;
  delay: number;
  drift: number;
  rise: number;
  size: number;
  duration: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    const id = setTimeout(() => {
      t.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
    }, delay);
    return () => clearTimeout(id);
  }, [t, delay, duration]);
  const style = useAnimatedStyle(() => ({
    opacity: (1 - t.value) * 0.7,
    transform: [
      { translateY: -rise * t.value },
      { translateX: drift * t.value },
      { scale: 0.5 + t.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

/**
 * Handwritten words drifting up from the mount point — other voices
 * quietly agreeing — with a few spray dots mixed in. Replaces the
 * default-emoji reaction burst.
 */
export function WordBurst({
  words = ['same', 'fr', 'this', 'felt'],
  color = '#FFFFFF',
  count = 5,
  rise = 150,
  duration = 1300,
}: {
  words?: string[];
  color?: string;
  count?: number;
  rise?: number;
  duration?: number;
}) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        text: words[i % words.length],
        color: i % 2 === 0 ? color : 'rgba(255,255,255,0.85)',
        delay: i * 110,
        drift: rand(-34, 34),
        rise: rand(rise * 0.65, rise),
        tilt: rand(-14, 14),
      })),
    [count, words, color, rise],
  );
  const dots = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        color,
        delay: i * 60,
        drift: rand(-50, 50),
        rise: rand(40, rise * 0.8),
        size: rand(4, 9),
      })),
    [color, rise],
  );
  return (
    <View pointerEvents="none" style={{ position: 'absolute', width: 1, height: 1 }}>
      {dots.map(d => (
        <FloatingDot key={`d${d.id}`} {...d} duration={duration * 0.8} />
      ))}
      {items.map(it => (
        <FloatingWord key={it.id} {...it} duration={duration} />
      ))}
    </View>
  );
}
