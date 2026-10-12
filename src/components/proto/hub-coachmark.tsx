import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { mentor } from '@/data/mock';
import { useNavStore } from '@/stores/nav-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { type RefObject, useEffect, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

/**
 * One-time (per session) coach mark steering chat into the Hub: the screen
 * dims, the "Your space" header pill stays lit under a pulsing halo, a
 * hand-drawn arrow points at it, and a black bubble explains what's there.
 * Tapping the pill or the arrow button goes to the Hub; tapping anywhere
 * else dismisses. Skipped on /calm preset links (they have the chat footer
 * card) and offline sessions (the offline block has its own pointer) — one
 * nudge per session, never two.
 */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Pulsing ring around the spotlighted pill */
function Halo({ b }: { b: Box }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) }),
      -1,
    );
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.75 * (1 - t.value),
    transform: [{ scale: 1 + t.value * 0.22 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: b.x - 7,
          top: b.y - 7,
          width: b.w + 14,
          height: b.h + 14,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: '#FFFFFF',
        },
        style,
      ]}
    />
  );
}

export function HubCoachmark({
  chatActive,
  hubActive,
  rootRef,
  pillRef,
}: {
  chatActive: boolean;
  hubActive: boolean;
  rootRef: RefObject<View | null>;
  pillRef: RefObject<View | null>;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const seen = useScenarioStore(s => s.hubCoachSeen);
  const setSeen = useScenarioStore(s => s.setHubCoachSeen);
  const disclaimerSeen = useScenarioStore(s => s.disclaimerSeen);
  const hubHint = useScenarioStore(s => s.hubHint);
  const mentorOffline = useScenarioStore(s => s.mentorOffline);
  const requestHub = useNavStore(s => s.requestHub);
  const [box, setBox] = useState<Box | null>(null);
  const [visible, setVisible] = useState(false);

  // They found the Hub on their own — the nudge would be noise.
  useEffect(() => {
    if (hubActive && !seen) setSeen(true);
  }, [hubActive, seen, setSeen]);

  useEffect(() => {
    if (seen || visible || !chatActive || !disclaimerSeen) return;
    if (hubHint || mentorOffline) return; // those sessions have their own pointer
    const t = setTimeout(() => {
      const show = (b: Box | null) => {
        setBox(b);
        setVisible(true);
        buzz.light();
        track('hub_coachmark_shown');
      };
      const pill = pillRef.current;
      const root = rootRef.current;
      if (pill && root) {
        // Position relative to the pager root — same frame the overlay fills
        pill.measureLayout(
          root as unknown as number,
          (x, y, w, h) => show({ x, y, w, h }),
          () => show(null),
        );
      } else {
        show(null);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [seen, visible, chatActive, disclaimerSeen, hubHint, mentorOffline, pillRef, rootRef]);

  if (!visible) return null;

  const dismiss = () => {
    buzz.tick();
    track('hub_coachmark_dismissed');
    setSeen(true);
    setVisible(false);
  };
  const go = () => {
    buzz.medium();
    setSeen(true);
    setVisible(false);
    requestHub('coachmark');
  };

  // Fallback when measuring fails: where the pill lives by construction —
  // right side of the header, before the 44px settings button + 4px gap.
  const b = box ?? { x: width - 20 - 44 - 4 - 108, y: insets.top + 8, w: 108, h: 40 };
  const arrowW = 120;
  const arrowH = 56;

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0"
      style={{ zIndex: 60 }}
    >
      <Pressable
        onPress={dismiss}
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(31,30,29,0.62)' }}
      />

      <Halo b={b} />

      {/* Lit clone of the header pill, tappable, drawn over the dim */}
      <Pressable
        onPress={go}
        hitSlop={6}
        className="absolute flex-row items-center justify-center rounded-full border border-[#E5E0D8] bg-white active:opacity-85"
        style={{ left: b.x, top: b.y, width: b.w, height: b.h, gap: 6 }}
      >
        <Sparkles size={15} color="#1F1E1D" strokeWidth={1.8} />
        <Text className="font-avantt-bold text-primary" style={{ fontSize: 13 }}>
          Your space
        </Text>
      </Pressable>

      {/* Hand-drawn arrow from the bubble up to the pill */}
      <Animated.View
        entering={FadeIn.delay(260).duration(420)}
        pointerEvents="none"
        className="absolute"
        style={{
          left: b.x + b.w / 2 - (arrowW - 24),
          top: b.y + b.h + 6,
          width: arrowW,
          height: arrowH,
        }}
      >
        <Svg viewBox={`0 0 ${arrowW} ${arrowH}`} width="100%" height="100%">
          <Path
            d="M14 50 C32 48 64 40 94 14"
            stroke="#FFFFFF"
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M94 14 L81 15 M94 14 L90 26"
            stroke="#FFFFFF"
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* The explainer bubble */}
      <Animated.View
        entering={FadeInDown.delay(120).springify().damping(17)}
        className="absolute rounded-3xl px-5 pt-5 pb-4"
        style={{
          top: b.y + b.h + arrowH + 10,
          right: 16,
          left: Math.max(16, width - 356),
          backgroundColor: '#1F1E1D',
        }}
      >
        <Text
          style={{
            fontFamily: 'Caveat_600SemiBold',
            fontSize: 21,
            color: '#FFD84D',
            transform: [{ rotate: '-2deg' }],
          }}
        >
          psst — up there
        </Text>
        <Text
          className="font-avantt-bold text-white"
          style={{ fontSize: 21, lineHeight: 25, marginTop: 4 }}
        >
          Chat isn&apos;t all there is.
        </Text>
        <Text
          className="text-body-2"
          style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 21, marginTop: 6 }}
        >
          Your space holds the rest — tools for rough moments, and the things
          you and {mentor.name} make together.
        </Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Pressable
            onPress={dismiss}
            hitSlop={8}
            className="h-11 justify-center active:opacity-60"
          >
            <Text
              className="text-body-2 underline"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Got it
            </Text>
          </Pressable>
          <Pressable
            onPress={go}
            className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-85"
          >
            <ArrowRight size={19} color="#1F1E1D" strokeWidth={2.2} />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
