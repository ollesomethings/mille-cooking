import { PressableScale } from '@/components/ui/pressable-scale';
import { DayMark } from '@/data/goals';
import { ChevronDown } from 'lucide-react-native';
import { ReactNode, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * The shared shape every tracked-goal card uses: an always-visible header
 * row (icon + title + a small trailing chip/label + chevron) and an
 * animated expand body underneath. What lives in the body is entirely up to
 * the caller — each tracking pattern renders something different there.
 */
export function GoalCardShell({
  icon,
  title,
  trailing,
  children,
  tone = 'default',
}: {
  icon: ReactNode;
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'success';
}) {
  const [expanded, setExpanded] = useState(false);
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withTiming(expanded ? 1 : 0, { duration: 200 });
  }, [expanded, rotate]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 180}deg` }],
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: tone === 'success' ? '#E6F6EE' : '#F7F5F1',
        borderWidth: 1,
        borderColor: tone === 'success' ? 'rgba(20,179,99,0.18)' : '#E5E0D6',
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <PressableScale onPress={() => setExpanded(e => !e)} scaleTo={0.99} className="px-4 py-3">
        <View className="flex-row items-center">
          <View className="mr-3">{icon}</View>
          <Text className="flex-1 text-body-2 text-primary" numberOfLines={2}>
            {title}
          </Text>
          <Animated.View style={[{ marginLeft: 8 }, chevronStyle]}>
            <ChevronDown size={16} color="#999388" strokeWidth={2} />
          </Animated.View>
        </View>
        {trailing ? <View className="flex-row mt-1.5" style={{ marginLeft: 42 }}>{trailing}</View> : null}
      </PressableScale>
      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(140)}
          className="px-4 pb-4"
          style={{ gap: 12 }}
        >
          {children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

/** The metadata badge shown under a card's title — plain and muted normally,
 * emphasized when the goal needs attention today (day-30 review due, or a
 * daily-cadence check-in still outstanding). */
export function MetaBadge({ text, urgent }: { text: string; urgent?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: urgent ? 8 : 0,
        paddingVertical: urgent ? 3 : 0,
        borderRadius: 6,
        backgroundColor: urgent ? 'rgba(77,85,253,0.12)' : 'transparent',
      }}
    >
      <Text
        className="text-geist"
        style={{ fontSize: 9, letterSpacing: 0.6, color: urgent ? '#4D55FD' : '#999388' }}
      >
        {text}
      </Text>
    </View>
  );
}

function markColor(mark: DayMark, tone: 'default' | 'muted'): string {
  switch (mark) {
    case 'good':
      // Recurring-habit goals (journal-style, "no finish line") get the
      // milestone treatment — a resting warm tone instead of celebratory
      // emerald, since a good day here is routine, not an achievement.
      return tone === 'muted' ? '#A08F6B' : '#14B36A';
    case 'neutral':
      return '#B8B2A9';
    case 'rough':
      return '#E46865';
    default:
      return '#E7E2D6'; // hasn't happened yet — a quiet, empty dash
  }
}

/**
 * The segmented mark track — the same one used in a card's expanded
 * check-in body, just smaller when it sits under the title in the
 * collapsed row. One component, two sizes, reused everywhere a goal has a
 * day-by-day (or night-by-night) history to show.
 */
export function MarkTrack({
  marks,
  total,
  size = 'compact',
  tone = 'default',
}: {
  marks: DayMark[];
  total: number;
  size?: 'compact' | 'full';
  tone?: 'default' | 'muted';
}) {
  // Longer tracks (e.g. a 30-day cycle) get thinner segments so the whole
  // thing still fits on one line at "full" size, same as short ones (a
  // 7-day week) get room to breathe.
  const dense = total > 14;
  const width = size === 'compact' ? 3 : dense ? 4 : 7;
  const height = size === 'compact' ? 10 : 14;
  const gap = size === 'compact' ? 1.5 : dense ? 2 : 3.5;
  const slots = Array.from({ length: total }, (_, i) => marks[i] ?? null);

  return (
    <View className="flex-row items-center" style={{ gap }}>
      {slots.map((m, i) => (
        <View
          key={i}
          style={{
            width,
            height,
            borderRadius: size === 'compact' ? 1 : 2,
            backgroundColor: markColor(m, tone),
          }}
        />
      ))}
    </View>
  );
}

export function ChipRow({ chips }: { chips: string[] }) {
  if (chips.length === 0) return null;
  return (
    <View className="flex-row flex-wrap" style={{ gap: 6 }}>
      {chips.map(c => (
        <View key={c} className="rounded-md bg-surfaces-z3 px-2 py-1">
          <Text className="text-geist text-secondary" style={{ fontSize: 9, letterSpacing: 0.6 }}>
            {c}
          </Text>
        </View>
      ))}
    </View>
  );
}
