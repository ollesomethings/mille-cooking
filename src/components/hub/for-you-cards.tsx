import { PressableScale } from '@/components/ui/pressable-scale';
import { useHorizontalDragScroll } from '@/web/use-drag-scroll';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function Dot({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active, progress]);
  const style = useAnimatedStyle(() => ({
    width: 6 + progress.value * 10,
    opacity: 0.35 + progress.value * 0.65,
  }));
  return (
    <Animated.View
      style={[
        {
          height: 6,
          borderRadius: 3,
          backgroundColor: '#1F1E1D',
          marginHorizontal: 2,
        },
        style,
      ]}
    />
  );
}

interface ForYouCard {
  id: string;
  smallTitle: string;
  mainTitle: string;
  ctaText: string;
  background: string;
  onPress: (router: ReturnType<typeof useRouter>) => void;
}

// Copy verbatim from mono/link-v2 for-you-cards. Only cards whose
// destination exists in the prototype are shown; add more (Share a moment,
// notifications, widget…) as those flows get built.
const CARDS: ForYouCard[] = [
  {
    id: 'welcome',
    smallTitle: 'Welcome to Somethings',
    mainTitle:
      'Your hub is a space for you and your mentor to connect outside of chat.',
    ctaText: 'Jump in →',
    background: '#FFE81F',
    onPress: router => router.push('/hub/note/entity-note-welcome'),
  },
  {
    id: 'share-moment',
    smallTitle: 'Share a moment',
    mainTitle: 'Capture and share multiple photos with your mentor.',
    ctaText: 'Get started →',
    background: '#71E0FF',
    onPress: router => router.push('/hub/share-moment'),
  },
  {
    id: 'try-swap',
    smallTitle: 'Try a swap',
    mainTitle: 'Exchange photos with your mentor and reveal them together.',
    ctaText: 'Start a swap →',
    background: '#B164FF',
    onPress: router => router.push('/hub/start-swap?mode=carousel'),
  },
];

export function ForYouCards() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const cardWidth = width - 40;
  const scrollRef = useRef<ScrollView>(null);
  useHorizontalDragScroll(
    scrollRef,
    useCallback(() => cardWidth + 12, [cardWidth]),
  );

  // onScroll, not onMomentumScrollEnd — react-native-web never fires the latter
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.min(
      CARDS.length - 1,
      Math.max(0, Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 12))),
    );
    if (p !== page) setPage(p);
  };

  return (
    <View className="mt-6">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {CARDS.map(card => (
          <PressableScale
            key={card.id}
            scaleTo={0.97}
            onPress={() => card.onPress(router)}
            className="active:opacity-90"
            style={{
              width: cardWidth,
              marginRight: 12,
              borderRadius: 24,
              backgroundColor: card.background,
              padding: 24,
              minHeight: 190,
              justifyContent: 'space-between',
            }}
          >
            <Text
              className="text-geist text-primary"
              style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' }}
            >
              {card.smallTitle}
            </Text>
            <View>
              <Text
                className="font-avantt-bold text-primary"
                style={{ fontSize: 22, lineHeight: 27 }}
              >
                {card.mainTitle}
              </Text>
              <Text className="text-body-2 text-primary mt-4">{card.ctaText}</Text>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
      <View className="flex-row justify-center mt-3">
        {CARDS.map((c, i) => (
          <Dot key={c.id} active={i === page} />
        ))}
      </View>
    </View>
  );
}
