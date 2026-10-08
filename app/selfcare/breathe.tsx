import { assetUri } from '@/lib/scribbles';
import { TalkNowLink } from '@/components/proto/talk-now-link';
import { track } from '@/lib/analytics';
import { buzz } from '@/lib/buzz';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPRAY = assetUri(require('@assets/illustrations/spray.png'));

/**
 * Paced-breathing visualizer: box breathing (4-4-4-4), now a graffiti
 * piece. Each phase has its own paint color — the circle re-tints, spray
 * splats burst around the ring, and twin spray halos drift in opposite
 * directions. Second-by-second count in the circle with a tick haptic;
 * bigger buzz on phase change. ~2 minutes by default, never locked in.
 */
const PHASES = [
  { label: 'Breathe in', scale: 1.35, color: '#71E0FF' },
  { label: 'Hold', scale: 1.35, color: '#B164FF' },
  { label: 'Breathe out', scale: 1, color: '#C2DF4F' },
  { label: 'Hold', scale: 1, color: '#FF9812' },
] as const;
const PHASE_MS = 4000;
const DEFAULT_TOTAL_MS = 120000;
// Soft background tints per phase, matched to the paint colors above
const BG = ['#EAF9FF', '#F4F1FF', '#F4FBE8', '#FFF6F1'] as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** One spray splat: flies out from the ring, blooms, and settles. */
function Splat({ color, ringRadius }: { color: string; ringRadius: number }) {
  const t = useSharedValue(0);
  const cfg = useMemo(
    () => ({
      angle: rand(0, Math.PI * 2),
      fly: rand(30, 110),
      size: rand(10, 30),
      delay: rand(0, 500),
    }),
    [],
  );
  useEffect(() => {
    const id = setTimeout(() => {
      t.value = withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) });
    }, cfg.delay);
    return () => clearTimeout(id);
  }, [t, cfg.delay]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.2 ? (t.value / 0.2) * 0.8 : 0.8 - (t.value - 0.2) * 0.9,
    transform: [
      { translateX: Math.cos(cfg.angle) * (ringRadius + cfg.fly * t.value) },
      { translateY: Math.sin(cfg.angle) * (ringRadius + cfg.fly * t.value) },
      { scale: 0.3 + t.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: cfg.size,
          height: cfg.size,
          borderRadius: cfg.size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/** A burst of splats in the phase color — remounted (keyed) every phase. */
function SprayBurst({ color, ringRadius }: { color: string; ringRadius: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', width: 1, height: 1 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Splat key={i} color={color} ringRadius={ringRadius} />
      ))}
    </View>
  );
}

export default function Breathe() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState(0);
  const [second, setSecond] = useState(4);
  const [twoMinutes, setTwoMinutes] = useState(false);
  const startedAt = useRef(Date.now());
  const scale = useSharedValue(1);
  const colorT = useSharedValue(0); // continuous phase index for tinting

  // Twin spray halos drifting in opposite directions
  const sprayAngle = useSharedValue(0);
  useEffect(() => {
    sprayAngle.value = withRepeat(
      withTiming(360, { duration: 90000, easing: Easing.linear }),
      -1,
    );
  }, [sprayAngle]);
  const sprayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sprayAngle.value}deg` }],
  }));
  const spray2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-sprayAngle.value * 1.4}deg` }, { scale: 0.72 }],
  }));

  useEffect(() => {
    scale.value = withTiming(PHASES[phase].scale, {
      duration: PHASE_MS,
      easing: Easing.inOut(Easing.quad),
    });
    colorT.value = withTiming(phase, { duration: 900, easing: Easing.out(Easing.quad) });
    buzz.medium();
    setSecond(4);
    const tick = setInterval(() => {
      buzz.tick();
      setSecond(s => Math.max(1, s - 1));
    }, 1000);
    const t = setTimeout(() => setPhase(p => (p + 1) % PHASES.length), PHASE_MS);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, [phase, scale, colorT]);

  useEffect(() => {
    const t = setTimeout(() => {
      buzz.success();
      setTwoMinutes(true);
    }, DEFAULT_TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      colorT.value,
      [0, 1, 2, 3],
      [PHASES[0].color, PHASES[1].color, PHASES[2].color, PHASES[3].color],
    ),
  }));
  const haloTint = useAnimatedStyle(() => ({
    // paint the big halo toward the current phase color, softly
    opacity: 0.3,
  }));
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorT.value, [0, 1, 2, 3], [...BG]),
  }));

  const finish = () => {
    track('offline_tool_completed', {
      tool: 'breathe',
      duration_s: Math.round((Date.now() - startedAt.current) / 1000),
    });
    router.replace('/selfcare/done?tool=breathe');
  };

  const phaseColor = PHASES[phase].color;

  return (
    <Animated.View className="flex-1" style={bgStyle}>
      <View className="flex-1 items-center justify-center" style={{ overflow: 'hidden' }}>
        <Animated.View
          entering={FadeIn.duration(900)}
          style={[{ position: 'absolute', width: 380, height: 380 }, sprayStyle]}
        >
          <Animated.View style={[{ width: '100%', height: '100%' }, haloTint]}>
            <Image
              source={SPRAY}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              tintColor={phaseColor}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(900)}
          style={[{ position: 'absolute', width: 380, height: 380, opacity: 0.18 }, spray2Style]}
        >
          <Image
            source={SPRAY}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            tintColor={PHASES[(phase + 2) % 4].color}
          />
        </Animated.View>

        {/* graffiti splats, resprayed in a fresh color every phase */}
        <SprayBurst key={`burst-${phase}`} color={phaseColor} ringRadius={95} />

        <Animated.View
          entering={ZoomIn.springify().damping(16)}
          style={[
            { width: 190, height: 190, borderRadius: 95, opacity: 0.92 },
            circleStyle,
          ]}
        />
        <View pointerEvents="none" className="absolute items-center">
          <Animated.Text
            key={PHASES[phase].label + phase}
            entering={FadeIn.duration(400)}
            className="font-avantt-bold text-primary"
            style={{ fontSize: 26 }}
          >
            {PHASES[phase].label}
          </Animated.Text>
          <Animated.Text
            key={`sec-${phase}-${second}`}
            entering={ZoomIn.springify().damping(12)}
            className="font-avantt-bold text-primary"
            style={{ fontSize: 20, opacity: 0.55, marginTop: 2 }}
          >
            {second}
          </Animated.Text>
        </View>
      </View>

      {/* box progress — which side of the square you're on */}
      <View className="flex-row justify-center" style={{ gap: 8, marginBottom: 18 }}>
        {PHASES.map((p, i) => (
          <View
            key={i}
            style={{
              width: i === phase ? 22 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === phase ? p.color : 'rgba(31,30,29,0.18)',
            }}
          />
        ))}
      </View>

      <View className="px-6" style={{ paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
        {twoMinutes ? (
          <Animated.View entering={FadeIn.duration(300)} style={{ gap: 12 }}>
            <Text className="text-body-2 text-primary text-center">
              That was 2 minutes. Nice.
            </Text>
            <Pressable
              onPress={finish}
              className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
            >
              <Text className="text-body-2 text-white">I&apos;m done</Text>
            </Pressable>
            <Pressable
              onPress={() => setTwoMinutes(false)}
              className="h-12 items-center justify-center active:opacity-60"
            >
              <Text className="text-body-2 text-primary underline">Keep going</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            onPress={finish}
            className="h-12 items-center justify-center active:opacity-60"
          >
            <Text className="text-body-2 text-secondary underline">Stop early</Text>
          </Pressable>
        )}
        <TalkNowLink screen="selfcare_breathe" />
      </View>
    </Animated.View>
  );
}
