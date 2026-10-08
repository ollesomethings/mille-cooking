import { WallBuilder } from '@/components/wall/wall-builder';
import { WallCompact } from '@/components/wall/wall-compact';
import { WallShare } from '@/components/wall/wall-share';
import { WallSheet } from '@/components/wall/wall-sheet';
import { useWallStore } from '@/stores/wall-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPEN_DURATION = 320;
const CLOSE_DURATION = 240;
const SNAP_DURATION = 260;
const FLICK_VELOCITY = 900;

export function WallOverlay() {
  const panelOpen = useWallStore(s => s.panelOpen);
  const wallComplete = useWallStore(s => s.wallComplete);
  const closePanel = useWallStore(s => s.closePanel);

  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const FULL_HEIGHT = windowHeight * 0.7;
  const COMPACT_HEIGHT = insets.top + 260;
  const THRESHOLD = (COMPACT_HEIGHT + FULL_HEIGHT) / 2;
  const DISMISS_HEIGHT = COMPACT_HEIGHT * 0.55;

  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const height = useSharedValue(0);
  const dragStartH = useSharedValue(0);

  useEffect(() => {
    if (panelOpen) {
      setMounted(true);
      setExpanded(true);
      height.set(0);
      requestAnimationFrame(() => {
        height.set(withTiming(FULL_HEIGHT, { duration: OPEN_DURATION, easing: Easing.out(Easing.cubic) }));
      });
    } else if (mounted) {
      height.set(
        withTiming(0, { duration: CLOSE_DURATION, easing: Easing.in(Easing.cubic) }, finished => {
          if (finished) runOnJS(setMounted)(false);
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  const collapse = () => {
    setExpanded(false);
    height.set(withTiming(COMPACT_HEIGHT, { duration: SNAP_DURATION, easing: Easing.out(Easing.cubic) }));
  };
  const expand = () => {
    setExpanded(true);
    height.set(withTiming(FULL_HEIGHT, { duration: SNAP_DURATION, easing: Easing.out(Easing.cubic) }));
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      dragStartH.set(height.get());
    })
    .onUpdate(e => {
      'worklet';
      const next = dragStartH.get() + e.translationY;
      height.set(Math.max(0, Math.min(FULL_HEIGHT, next)));
    })
    .onEnd(e => {
      'worklet';
      const h = height.get();
      const fastDown = e.velocityY > FLICK_VELOCITY;
      const fastUp = e.velocityY < -FLICK_VELOCITY;

      const shouldDismiss = h < DISMISS_HEIGHT || (fastDown && h <= COMPACT_HEIGHT);
      if (shouldDismiss) {
        runOnJS(closePanel)();
        return;
      }

      let goFull = h >= THRESHOLD;
      if (fastUp) goFull = true;
      else if (fastDown) goFull = false;
      height.set(withTiming(goFull ? FULL_HEIGHT : COMPACT_HEIGHT, { duration: SNAP_DURATION, easing: Easing.out(Easing.cubic) }));
      runOnJS(setExpanded)(goFull);
    });

  const panelStyle = useAnimatedStyle(() => ({ height: height.get() }));

  if (!mounted) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
      <StatusBar style="dark" />
      <Animated.View style={[{ overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }, panelStyle]}>
        <View style={{ flex: 1 }}>
          {wallComplete ? (
            <WallShare />
          ) : expanded ? (
            <Animated.View key="full" entering={FadeIn.duration(150)} style={{ flex: 1 }}>
              <WallBuilder onCollapse={collapse} />
            </Animated.View>
          ) : (
            <Animated.View key="compact" entering={FadeIn.duration(150)} style={{ flex: 1 }}>
              <WallCompact onClose={closePanel} onExpand={expand} />
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* The gap between the two "windows" — the wall panel above and the chat below — where the drag handle lives. Sits in normal flow right after the animated-height panel, so it tracks automatically. */}
      {!wallComplete && (
        <GestureDetector gesture={gesture}>
          <View
            style={{ height: 26, backgroundColor: '#ECE8E1', alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ width: 40, height: 5, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.22)' }} />
          </View>
        </GestureDetector>
      )}

      {/* Caps the visible chat below in a rounded "window" lip that tracks the panel automatically, since it sits in normal flow right after the gap. */}
      <View
        pointerEvents="none"
        style={{
          height: 22,
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        }}
      />

      <WallSheet />
    </View>
  );
}
