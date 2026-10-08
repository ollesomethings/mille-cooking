import { Scribbles } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { forwardRef, useImperativeHandle } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FLING_DISTANCE = 90;
const FLING_VELOCITY = 800;

export interface GoalDeckCardHandle {
  flyOut: (direction: 1 | -1) => void;
}

/**
 * One candidate card in the deck — drag left/right, or use the buttons below.
 * Skip and claim are equally easy and equally legitimate; nothing here
 * commits a goal, it just decides which flow-screen comes next.
 */
export const GoalDeckCard = forwardRef<
  GoalDeckCardHandle,
  { text: string; label: string; onClaim: () => void; onSkip: () => void }
>(({ text, label, onClaim, onSkip }, ref) => {
  const translateX = useSharedValue(0);

  const flyOut = (direction: 1 | -1) => {
    translateX.value = withTiming(direction * 580, { duration: 260 }, finished => {
      if (finished) runOnJS(direction > 0 ? onClaim : onSkip)();
    });
  };

  useImperativeHandle(ref, () => ({ flyOut }));

  const pan = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(e => {
      const dx = translateX.value;
      const vx = e.velocityX;
      if (dx > FLING_DISTANCE || vx > FLING_VELOCITY) {
        runOnJS(flyOut)(1);
      } else if (dx < -FLING_DISTANCE || vx < -FLING_VELOCITY) {
        runOnJS(flyOut)(-1);
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 180 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 16}deg` },
    ],
  }));
  const claimBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, FLING_DISTANCE], [0, 1], Extrapolation.CLAMP),
  }));
  const skipBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-FLING_DISTANCE, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            width: '100%',
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            padding: 28,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 2 },
          },
          cardStyle,
        ]}
      >
        <Text
          className="text-geist text-tertiary mb-3"
          style={{ fontSize: 10, letterSpacing: 1.4 }}
        >
          {label}
        </Text>
        <Text className="text-header-4 text-primary" style={{ lineHeight: 30 }}>
          {text}
        </Text>
        <Image
          source={Scribbles.orangeStarburst}
          style={{ position: 'absolute', right: -14, bottom: -22, width: 80, height: 80 }}
          contentFit="contain"
          pointerEvents="none"
        />
        <Animated.View
          style={[
            { position: 'absolute', top: 16, right: 16, borderRadius: 6, borderWidth: 1.5, borderColor: '#7178FF', paddingHorizontal: 10, paddingVertical: 5, transform: [{ rotate: '8deg' }] },
            claimBadgeStyle,
          ]}
        >
          <Text className="text-geist" style={{ fontSize: 11, letterSpacing: 1.2, color: '#7178FF' }}>
            CLAIM IT
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            { position: 'absolute', top: 16, left: 16, borderRadius: 6, borderWidth: 1.5, borderColor: '#B8B2A9', paddingHorizontal: 10, paddingVertical: 5, transform: [{ rotate: '-8deg' }] },
            skipBadgeStyle,
          ]}
        >
          <Text className="text-geist" style={{ fontSize: 11, letterSpacing: 1.2, color: '#B8B2A9' }}>
            NOT NOW
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
});

GoalDeckCard.displayName = 'GoalDeckCard';
