import {
  ChatScreenArt,
  WelcomeScreenArt,
} from '@/components/proto/phone-mockups';
import type { ScenarioMode } from '@/stores/scenario-store';
import { Logo } from '@somethings-ui/native';
import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * The picked flow's phone rises out of the splash fan, morphs into the
 * phone frame's exact spot, then the real app takes over underneath.
 *
 * Rendered at its FINAL size and animated purely with composited
 * transforms (translate/scale/rotate) — width/height/border animations
 * would re-layout every frame and stutter on web.
 *
 * Timeline: flight (750ms) → onLand (frame flips on, scenario applies) →
 * white cover fades (300ms) → onDone unmounts the overlay.
 */
export function FlightOverlay({
  mode,
  onLand,
  onDone,
}: {
  mode: ScenarioMode;
  onLand: () => void;
  onDone: () => void;
}) {
  const { width, height } = useWindowDimensions(); // real viewport: frame is off
  const [landed, setLanded] = useState(false);
  const progress = useSharedValue(0);

  const desktop = width >= 500;
  const phoneW = Math.min(width * 0.5, 205);
  const phoneH = phoneW * 2.05;

  // Land exactly where the CSS phone frame will render (bezel drawn as an
  // 11px ring outside the 390-wide content box). On phones: full screen.
  const frameH = Math.min(844, height - 48);
  const target = desktop
    ? {
        x: (width - 390) / 2 - 11,
        y: (height - frameH) / 2 - 11,
        w: 390 + 22,
        h: frameH + 22,
        r: 55,
      }
    : { x: 0, y: 0, w: width, h: height, r: 0 };

  // Start where the corresponding fan phone floats (welcome = left,
  // chat = center), matching src/components/proto/scenario-picker.tsx.
  const startScale = phoneW / target.w;
  const start =
    mode === 'new'
      ? { cx: width / 2 - phoneW * 1.26 + phoneW / 2, cy: height - phoneH * 0.7 + phoneH / 2, rotate: -10 }
      : { cx: width / 2, cy: height - phoneH * 0.84 + phoneH / 2, rotate: 0 };
  const dx = start.cx - (target.x + target.w / 2);
  const dy = start.cy - (target.y + target.h / 2);
  // Element-space radius that LOOKS like the fan's 40px at the start scale
  const startRadius = 40 / startScale;

  useEffect(() => {
    progress.value = withDelay(
      40,
      withTiming(1, { duration: 750, easing: Easing.bezier(0.22, 1, 0.36, 1) }, f => {
        if (f) runOnJS(setLanded)(true);
      }),
    );
    // Animation frames stall in backgrounded tabs — never strand the user
    // mid-flight.
    const fallback = setTimeout(() => setLanded(true), 1400);
    return () => clearTimeout(fallback);
  }, [progress]);

  useEffect(() => {
    if (!landed) return;
    onLand();
    const t = setTimeout(onDone, 340);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landed]);

  const phoneStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: interpolate(p, [0, 1], [dx, 0]) },
        { translateY: interpolate(p, [0, 1], [dy, 0]) },
        { rotate: `${interpolate(p, [0, 1], [start.rotate, 0])}deg` },
        { scale: interpolate(p, [0, 1], [startScale, 1]) },
      ],
      borderRadius: interpolate(p, [0, 1], [startRadius, target.r]),
    };
  });

  // The bezel is a paint-only overlay ring (border animations re-layout)
  const bezelStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [startRadius, target.r]),
    // Real phones have no frame — the ring dissolves as it lands
    opacity: desktop ? 1 : interpolate(progress.value, [0.6, 1], [1, 0]),
  }));

  // Mockup art gives way to a clean boot screen mid-flight
  const artStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 0.75], [1, 1, 0]),
  }));
  const bootStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 0.85], [0, 1]),
  }));

  if (landed) {
    // The real frame is on and the app is mounting beneath — cover the
    // (now 390-wide) root and fade away.
    return (
      <Animated.View
        exiting={FadeOut.duration(300)}
        className="absolute inset-0 items-center justify-center bg-white"
        style={{ zIndex: 1000 }}
      >
        <Logo color="#1F1E1D" width={150} height={(150 / 161) * 21} viewBox="0 0 161 21" />
      </Animated.View>
    );
  }

  return (
    <View className="absolute inset-0" style={{ zIndex: 1000 }} pointerEvents="none">
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: target.x,
            top: target.y,
            width: target.w,
            height: target.h,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.28,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 14 },
            elevation: 12,
          },
          phoneStyle,
        ]}
      >
        <Animated.View style={[{ flex: 1 }, artStyle]}>
          {mode === 'new' ? (
            <WelcomeScreenArt />
          ) : (
            <ChatScreenArt width={target.w} />
          )}
        </Animated.View>
        <Animated.View
          className="absolute inset-0 items-center justify-center bg-white"
          style={bootStyle}
        >
          <Logo color="#1F1E1D" width={140} height={(140 / 161) * 21} viewBox="0 0 161 21" />
        </Animated.View>
        {/* Notch that lands where the Dynamic Island lives */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 22,
            alignSelf: 'center',
            width: 125,
            height: 37,
            borderRadius: 19,
            backgroundColor: '#000',
          }}
        />
        {/* Bezel ring, painted over the content edges */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderWidth: 11,
              borderColor: '#17171a',
            },
            bezelStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}
