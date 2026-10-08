import { Moodies } from '@/lib/scribbles';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Port of mono/link-v2 src/components/shared/loading-indicator.tsx —
// bouncing Moodie face over three pulsing dots.
const MOODIE_IMAGES = [
  Moodies.happy,
  Moodies.excited,
  Moodies.pleased,
  Moodies.yellowSmile,
  Moodies.heartEyes,
  Moodies.love,
  Moodies.surprised,
] as const;

export const LoadingIndicator = () => {
  const progress = useSharedValue(0);
  const [currentMoodieIndex, setCurrentMoodieIndex] = useState(
    Math.floor(Math.random() * MOODIE_IMAGES.length),
  );

  useEffect(() => {
    progress.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
    const moodieInterval = setInterval(() => {
      setCurrentMoodieIndex(prev => (prev + 1) % MOODIE_IMAGES.length);
    }, 3000);
    return () => clearInterval(moodieInterval);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const bounce = interpolate(progress.get(), [0, 0.5, 1], [0, -8, 0]);
    const rotation = interpolate(progress.get(), [0, 0.25, 0.75, 1], [0, -5, 5, 0]);
    const scale = interpolate(progress.get(), [0, 0.5, 1], [1, 1.08, 1]);
    return {
      transform: [{ translateY: bounce }, { rotate: `${rotation}deg` }, { scale }],
    };
  });

  const dotStyle1 = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: interpolate(progress.get(), [0, 0.5, 1], [0.8, 1.2, 0.8]) }] };
  });
  const dotStyle2 = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: interpolate(progress.get(), [0, 0.5, 1], [1.2, 0.8, 1.2]) }] };
  });
  const dotStyle3 = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: interpolate(progress.get(), [0, 0.5, 1], [0.8, 1.2, 0.8]) }] };
  });

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={animatedStyle}>
        <Image
          source={MOODIE_IMAGES[currentMoodieIndex]}
          style={{ width: 80, height: 80 }}
          contentFit="contain"
          transition={300}
        />
      </Animated.View>
      <View className="mt-4 flex-row gap-2">
        <Animated.View style={dotStyle1} className="h-2 w-2 rounded-full bg-gray-400" />
        <Animated.View style={dotStyle2} className="h-2 w-2 rounded-full bg-gray-400" />
        <Animated.View style={dotStyle3} className="h-2 w-2 rounded-full bg-gray-400" />
      </View>
    </View>
  );
};
