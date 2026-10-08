import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppStore } from '@/stores/app-store';
import { useHorizontalDragScroll } from '@/web/use-drag-scroll';
import { useCallback } from 'react';
import { SWAP_PROMPTS } from '@somethings-ui/core/swap-prompts';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Images, Pencil, Shuffle, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CARD_RATIO = 1.35;

// Type selector rows, mirroring mono/link-v2 app/hub/start-swap.tsx.
const SWAP_TYPES = [
  {
    id: 'pick',
    label: 'Pick a prompt',
    Icon: Images,
    color: '#F59E0B',
  },
  {
    id: 'random',
    label: 'Random prompt',
    Icon: Shuffle,
    color: '#F59E0B',
  },
  {
    id: 'custom',
    label: 'Create your own',
    Icon: Pencil,
    color: '#65A30D',
  },
] as const;

function SwapTypeSelector({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (id: (typeof SWAP_TYPES)[number]['id']) => void;
}) {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">Start a swap</Text>
        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 justify-center px-5">
        {SWAP_TYPES.map((t, i) => (
          <Animated.View
            key={t.id}
            entering={FadeInDown.delay(i * 60).duration(220)}
          >
            <PressableScale
              scaleTo={0.97}
              onPress={() => onSelect(t.id)}
              className="flex-row items-center rounded-2xl bg-surfaces-z2 border border-surfaces-divider px-5 py-5 mb-3 active:opacity-70"
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${t.color}22` }}
              >
                <t.Icon size={20} color={t.color} strokeWidth={1.8} />
              </View>
              <Text className="text-body-1 text-primary ml-4">{t.label}</Text>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

export default function StartSwap() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const startTeenSwap = useAppStore(s => s.startTeenSwap);
  const [carousel, setCarousel] = useState(mode === 'carousel');
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const cardWidth = Math.min(width - 80, 320);
  useHorizontalDragScroll(
    scrollRef,
    // `carousel` in the deps re-attaches the drag handlers once the
    // conditionally-rendered carousel actually mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => cardWidth + 16, [cardWidth, carousel]),
  );
  const sidePadding = (width - cardWidth) / 2;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 16));
    setIndex(Math.max(0, Math.min(SWAP_PROMPTS.length - 1, i)));
  };

  const prompt = SWAP_PROMPTS[index];

  const handleChoose = () => {
    startTeenSwap(prompt.title, prompt.subtitle);
    router.replace('/hub/swap/active');
  };

  if (!carousel) {
    return (
      <SwapTypeSelector
        onClose={() => router.back()}
        onSelect={id => {
          if (id === 'pick') setCarousel(true);
          else if (id === 'random') router.replace('/hub/surprise-swap');
          else router.replace('/hub/custom-swap');
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-safe-or-4 pb-2">
        <View className="w-11" />
        <Text className="text-body-3 text-primary">New Swap</Text>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          hitSlop={8}
        >
          <X size={22} color="#1F1E1D" strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 justify-center">
        <ScrollView
          ref={scrollRef}
          style={{ flexGrow: 0, height: cardWidth * CARD_RATIO }}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 16}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
        >
          {SWAP_PROMPTS.map(p => (
            <View
              key={p.id}
              className="mr-4 items-center justify-center rounded-3xl overflow-hidden"
              style={{
                width: cardWidth,
                height: cardWidth * CARD_RATIO,
                backgroundColor: p.backgroundColor,
              }}
            >
              <Image
                source={p.scribble}
                style={{ width: cardWidth * 0.7, height: cardWidth * 0.7 }}
                contentFit="contain"
              />
              <Text
                className="absolute bottom-6 left-5 right-5 text-header-4 text-white"
                style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowRadius: 6 }}
              >
                {p.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="items-center mt-6 px-10">
          <Text className="text-body-2 text-secondary text-center">
            {prompt.subtitle}
          </Text>
          <View className="flex-row mt-4">
            {SWAP_PROMPTS.map((p, i) => (
              <View
                key={p.id}
                className={`mx-0.5 h-1.5 w-1.5 rounded-full ${
                  i === index ? 'bg-text-primary' : 'bg-surfaces-z5'
                }`}
              />
            ))}
          </View>
        </View>
      </View>

      <View className="px-5 pb-safe-or-6">
        <Pressable
          onPress={handleChoose}
          className="h-14 items-center justify-center rounded-full bg-brand-trueBlack active:opacity-85"
        >
          <Text className="text-body-2 text-white">Swap this prompt</Text>
        </Pressable>
      </View>
    </View>
  );
}
